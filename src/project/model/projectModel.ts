import { computed, effect } from "alien-signals";
import type { Content } from "@/fs/types";
import { ContentUtils } from "@/fs/ContentUtils";
import type { ReadonlySignal } from "@/fs/interfaces";
import { waitUntil } from "@/utils/base/signal";
import { projectData } from "@/project/data/projectData";
import type { BlockInfo, MapsBlocksData } from "@/services/mapBlock";
import type { EnemysData } from "@/services/enemy";
import type { ItemsData } from "@/services/item";
import type { IconsData } from "@/services/icons";
import type { MetaFileKey } from "@/services/tableMeta";
import type { CommentObject } from "@/components/Table";

export interface ProjectDiagnostic {
  source: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface FloorListItem {
  id: string;
  exists: boolean;
}

export interface RegistryBlockInfo extends BlockInfo {
  idnum: number;
  kind: "terrain" | "item" | "enemy" | "mapBlock" | "autotile" | "tileset";
  images?: string;
  x?: number;
  y?: number;
  isTile?: boolean;
  materialPath?: string;
}

export type BlockRegistry = Map<number, RegistryBlockInfo>;

export interface RegistrySpriteInfo {
  key: string;
  id: string;
  images: string;
  path: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isTile?: boolean;
  idnum?: number;
}

export type SpriteRegistry = Map<string, RegistrySpriteInfo>;

export interface ModelResource<T> {
  readonly id: string;
  readonly content: ReadonlySignal<Content<T>>;
  snapshot(): Content<T>;
  value(): T;
  reload(): Promise<void>;
  waitForSettled(): Promise<void>;
  subscribe(listener: (content: Content<T>) => void): () => void;
}

class ComputedModelResource<T> implements ModelResource<T> {
  readonly content: ReadonlySignal<Content<T>>;
  readonly id: string;
  private readonly reloadDependencies: () => Promise<void>;

  constructor(
    id: string,
    computeValue: () => Content<T>,
    reloadDependencies: () => Promise<void> = async () => undefined,
  ) {
    this.id = id;
    this.content = computed(computeValue);
    this.reloadDependencies = reloadDependencies;
  }

  snapshot(): Content<T> {
    return this.content();
  }

  value(): T {
    return ContentUtils.unwrap(this.content(), this.id);
  }

  async reload(): Promise<void> {
    await this.reloadDependencies();
  }

  async waitForSettled(): Promise<void> {
    await waitUntil(() => {
      const status = this.content().status;
      return status !== "loading" && status !== "idle";
    });
  }

  subscribe(listener: (content: Content<T>) => void): () => void {
    return effect(() => {
      listener(this.content());
    });
  }
}

function contentOrEmpty<T extends object>(content: Content<T>, fallback: T): Content<T> {
  if (content.status === "not-found") {
    return { status: "loaded", value: fallback };
  }
  return content;
}

function combineFourObjectContents<A extends object, B extends object, C extends object, D extends object, R>(
  a: Content<A>,
  b: Content<B>,
  c: Content<C>,
  d: Content<D>,
  project: (a: A, b: B, c: C, d: D) => R,
  fallbacks: [A, B, C, D],
): Content<R> {
  const normalized = [
    contentOrEmpty(a, fallbacks[0]),
    contentOrEmpty(b, fallbacks[1]),
    contentOrEmpty(c, fallbacks[2]),
    contentOrEmpty(d, fallbacks[3]),
  ] as const;

  const error = normalized.find((content) => content.status === "error");
  if (error?.status === "error") return { status: "error", error: error.error };

  if (normalized.some((content) => content.status === "loading")) return { status: "loading" };
  if (normalized.some((content) => content.status === "idle")) return { status: "idle" };

  const [loadedA, loadedB, loadedC, loadedD] = normalized;
  return {
    status: "loaded",
    value: project(
      (loadedA as { status: "loaded"; value: A }).value,
      (loadedB as { status: "loaded"; value: B }).value,
      (loadedC as { status: "loaded"; value: C }).value,
      (loadedD as { status: "loaded"; value: D }).value,
    ),
  };
}

function spriteKey(images: string, id: string): string {
  return `${images}:${id}`;
}

function materialPath(images: string, id: string): string {
  if (images === "autotile") return `project/autotiles/${id}.png`;
  return `project/materials/${images}.png`;
}

function spriteHeight(images: string): number {
  return images.endsWith("48") ? 48 : 32;
}

function blockKind(cls: string | undefined): RegistryBlockInfo["kind"] {
  if (cls === "items") return "item";
  if (cls === "enemys" || cls === "enemy48") return "enemy";
  if (cls === "terrains" || cls === "animates" || cls === "npcs" || cls === "npc48") return "terrain";
  if (cls === "autotile") return "autotile";
  if (cls === "tileset") return "tileset";
  return "mapBlock";
}

function readIconY(icons: IconsData, images: string | undefined, id: string | undefined): number | undefined {
  if (!images || !id) return undefined;
  const value = icons[images]?.[id];
  return typeof value === "number" ? value : undefined;
}

function buildSpriteRegistry(icons: IconsData): SpriteRegistry {
  const registry: SpriteRegistry = new Map();

  for (const [images, values] of Object.entries(icons)) {
    for (const [id, index] of Object.entries(values)) {
      if (typeof index !== "number") continue;
      registry.set(spriteKey(images, id), {
        key: spriteKey(images, id),
        id,
        images,
        path: materialPath(images, id),
        x: 0,
        y: index,
        width: 32,
        height: spriteHeight(images),
      });
    }
  }

  return registry;
}

function mergeSpriteMetadata(
  sprite: RegistrySpriteInfo | undefined,
  idnum: number,
): Partial<RegistryBlockInfo> {
  if (!sprite) return {};
  return {
    images: sprite.images,
    x: sprite.x,
    y: sprite.y,
    isTile: sprite.isTile,
    materialPath: sprite.path,
    idnum,
  };
}

function addMapBlocks(
  registry: BlockRegistry,
  spriteRegistry: SpriteRegistry,
  blocks: MapsBlocksData,
  icons: IconsData,
  items: ItemsData,
  enemys: EnemysData,
): void {
  for (const [idnum, info] of Object.entries(blocks)) {
    const numericId = Number(idnum);
    if (!Number.isFinite(numericId)) continue;
    const images = info.cls;
    const id = info.id;
    const y = readIconY(icons, images, id);
    const sprite = images && id
      ? spriteRegistry.get(spriteKey(images === "autotile" ? "autotile" : images, id))
      : undefined;
    const itemInfo = id && images === "items" ? items[id] : undefined;
    const enemyInfo = id && (images === "enemys" || images === "enemy48") ? enemys[id] : undefined;
    registry.set(numericId, {
      ...itemInfo,
      ...enemyInfo,
      ...info,
      ...mergeSpriteMetadata(sprite, numericId),
      idnum: numericId,
      images,
      y,
      kind: blockKind(info.cls),
    });
  }
}

function addItems(registry: BlockRegistry, items: ItemsData): void {
  for (const [id, item] of Object.entries(items)) {
    const idnum = Number(item.idnum);
    if (!Number.isFinite(idnum)) continue;
    registry.set(idnum, {
      id,
      idnum,
      images: "items",
      cls: item.cls,
      name: item.name,
      kind: "item",
    });
  }
}

function addEnemies(registry: BlockRegistry, enemys: EnemysData): void {
  for (const [id, enemy] of Object.entries(enemys)) {
    const idnum = Number(enemy.idnum);
    if (!Number.isFinite(idnum)) continue;
    registry.set(idnum, {
      id,
      idnum,
      images: "enemys",
      name: enemy.name,
      kind: "enemy",
    });
  }
}

function buildBlockRegistry(
  blocks: MapsBlocksData,
  items: ItemsData,
  enemys: EnemysData,
  icons: IconsData,
): BlockRegistry {
  const registry: BlockRegistry = new Map();
  const spriteRegistry = buildSpriteRegistry(icons);
  addMapBlocks(registry, spriteRegistry, blocks, icons, items, enemys);
  addItems(registry, items);
  addEnemies(registry, enemys);
  const ground = spriteRegistry.get(spriteKey("terrains", "ground"));
  registry.set(0, {
    idnum: 0,
    id: "empty",
    images: ground?.images ?? "terrains",
    y: ground?.y,
    materialPath: ground?.path,
    kind: "terrain",
  });
  return registry;
}

class ProjectModelImpl {
  floorList(): ModelResource<FloorListItem[]> {
    return new ComputedModelResource(
      "floorList",
      () =>
        ContentUtils.map(projectData.tower().content(), (tower) =>
          tower.main.floorIds.map((id) => ({
            id,
            exists: projectData.floor(id).content().status === "loaded",
          })),
        ),
      async () => {
        await projectData.tower().reload();
      },
    );
  }

  blockRegistry(): ModelResource<BlockRegistry> {
    return new ComputedModelResource(
      "blockRegistry",
      () =>
        combineFourObjectContents(
          projectData.mapBlocks().content(),
          projectData.items().content(),
          projectData.enemys().content(),
          projectData.icons().content(),
          buildBlockRegistry,
          [{}, {}, {}, {}],
        ),
      async () => {
        await Promise.all([
          projectData.mapBlocks().reload(),
          projectData.items().reload(),
          projectData.enemys().reload(),
          projectData.icons().reload(),
        ]);
      },
    );
  }

  spriteRegistry(): ModelResource<SpriteRegistry> {
    return new ComputedModelResource(
      "spriteRegistry",
      () => ContentUtils.map(projectData.icons().content(), buildSpriteRegistry),
      async () => {
        await projectData.icons().reload();
      },
    );
  }

  materialRegistry(): ModelResource<BlockRegistry> {
    return this.blockRegistry();
  }

  tableSchema(key: MetaFileKey): Content<CommentObject> {
    return projectData.tableMetaSource(key).content();
  }

  ternDefinitionInputs(): {
    dataComment: Content<CommentObject>;
    functions: Content<unknown>;
  } {
    return {
      dataComment: projectData.tableMetaSource("dataComment").content(),
      functions: projectData.functions().content(),
    };
  }

  diagnostics(): ProjectDiagnostic[] {
    const diagnostics: ProjectDiagnostic[] = [];
    const resources = [
      projectData.tower(),
      projectData.items(),
      projectData.enemys(),
      projectData.mapBlocks(),
      projectData.icons(),
      projectData.functions(),
      projectData.commonEvents(),
      projectData.plugins(),
    ];

    for (const resource of resources) {
      const content = resource.content();
      if (content.status === "error") {
        diagnostics.push({
          source: resource.id,
          severity: "error",
          message: content.error.message,
        });
      } else if (content.status === "not-found") {
        diagnostics.push({
          source: resource.id,
          severity: "warning",
          message: `${resource.path} not found`,
        });
      }
    }
    return diagnostics;
  }
}

export const projectModel = new ProjectModelImpl();

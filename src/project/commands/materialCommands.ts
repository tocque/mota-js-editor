import { cloneDeep } from "es-toolkit";
import { projectData } from "@/project/data/projectData";
import type { DataResource } from "@/project/data/DataResource";
import { fs } from "@/services/fs";
import type { PrefabInfo } from "@/services/prefab";
import type { IconsData } from "@/services/icons";
import type { MapsBlocksData } from "@/services/mapBlock";
import { commandError, commandOk, type CommandResult } from "./types";

interface RuntimeMaterialEditor {
  file?: {
    removeMaterial?: (info: PrefabInfo, callback: (err: string | null) => void) => void;
  };
}

export interface MaterialTemplates {
  item?: Record<string, unknown>;
  enemy?: Record<string, unknown>;
}

export interface MaterialRegisterOptions {
  rowCount?: number;
  bindFaceIds?: boolean;
  templates?: MaterialTemplates;
}

export type AppendAutotileResult =
  | { ok: true; filename: string }
  | { ok: false; stage: string; error: Error };

function getRuntimeEditor(): RuntimeMaterialEditor | undefined {
  return typeof window === "undefined"
    ? undefined
    : (window as unknown as { editor?: RuntimeMaterialEditor }).editor;
}

function callbackCommand(
  stage: string,
  invoke: (callback: (err: string | null) => void) => void,
): Promise<CommandResult> {
  return new Promise((resolve) => {
    try {
      invoke((err) => {
        resolve(err ? commandError(stage, err) : commandOk());
      });
    } catch (error) {
      resolve(commandError(stage, error));
    }
  });
}

async function ensureValue<T>(resource: DataResource<T>): Promise<T> {
  const snapshot = resource.snapshot();
  if (snapshot.status !== "loaded") {
    await resource.reload();
    await resource.waitForSettled();
  }
  return resource.value();
}

function isEnemyImages(images: string | undefined): boolean {
  return images === "enemys" || images === "enemy48";
}

function isItemImages(images: string | undefined): boolean {
  return images === "items";
}

function materialGridHeight(images: string): number {
  return images.endsWith("48") ? 48 : 32;
}

function idPrefix(images: string): string {
  return images.toUpperCase().charAt(0);
}

function normalizePath(path: string): string {
  return path.replace(/^\.\//, "");
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function nextIdnum(blocks: MapsBlocksData, start: number): number {
  let idnum = start;
  while (blocks[String(idnum)] != null) idnum += 1;
  return idnum;
}

function nextReservedIdnum(reserved: Set<string>, start: number): number {
  let idnum = start;
  while (reserved.has(String(idnum))) idnum += 1;
  reserved.add(String(idnum));
  return idnum;
}

function assertUniqueIdnum(blocks: MapsBlocksData, idnum: number): void {
  if (blocks[String(idnum)] != null) throw new Error("idnum重复了");
}

function assertUniqueId(blocks: MapsBlocksData, id: string, currentIdnum?: number): void {
  for (const [idnum, block] of Object.entries(blocks)) {
    if (Number(idnum) === currentIdnum) continue;
    if (block.id === id) throw new Error("id重复了");
  }
}

function iconRowsForImage(icons: IconsData, images: string): Map<number, string> {
  const rows = new Map<number, string>();
  const iconGroup = icons[images] ?? {};
  for (const [id, row] of Object.entries(iconGroup)) {
    if (typeof row === "number") rows.set(row, id);
  }
  return rows;
}

async function imageRowCount(images: string): Promise<number> {
  const buffer = await fs.promises.readFileBinary(`project/materials/${images}.png`);
  if (typeof Image === "undefined") {
    throw new Error("Cannot detect material image size outside browser; pass rowCount explicitly");
  }
  const blob = new Blob([buffer], { type: "image/png" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load material image: ${images}`));
      img.src = url;
    });
    return Math.floor(img.height / materialGridHeight(images));
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function readTemplates(options?: MaterialRegisterOptions): Promise<Required<MaterialTemplates>> {
  if (options?.templates) {
    return {
      item: cloneDeep(options.templates.item ?? {}),
      enemy: cloneDeep(options.templates.enemy ?? {}),
    };
  }

  try {
    const meta = await ensureValue(projectData.tableMetaSource("comment"));
    const data = (meta as { _data?: Record<string, unknown> })._data;
    return {
      item: cloneDeep(data?.items_template as Record<string, unknown> | undefined ?? {}),
      enemy: cloneDeep(data?.enemys_template as Record<string, unknown> | undefined ?? {}),
    };
  } catch {
    return { item: {}, enemy: {} };
  }
}

function renameKey(record: Record<string, unknown>, from: string, to: string): void {
  if (!Object.prototype.hasOwnProperty.call(record, from)) return;
  record[to] = record[from];
  delete record[from];
}

class MaterialCommands {
  hasStatusBarIcon(id: string): boolean {
    if (typeof window === "undefined") return false;
    const core = (window as unknown as { core?: { statusBar?: { icons?: Record<string, unknown> } } }).core;
    return core?.statusBar?.icons?.[id] != null;
  }

  async changeIdAndIdnum(
    id: string,
    idnum: number | null,
    info: PrefabInfo,
    options?: MaterialRegisterOptions,
  ): Promise<CommandResult> {
    let stage = "material-change-id";
    try {
      const images = info.images;
      if (!images) throw new Error("Missing material images");
      const blocks = await ensureValue(projectData.mapBlocks());
      await ensureValue(projectData.icons());
      const templates = await readTemplates(options);

      if (!info.id) {
        if (idnum == null || !Number.isInteger(idnum)) throw new Error("不合法的idnum");
        if (typeof info.y !== "number") throw new Error("Missing material row");
        assertUniqueIdnum(blocks, idnum);
        assertUniqueId(blocks, id);

        stage = "material-change-id:maps";
        await projectData.mapBlocks().patch([
          ["add", `['${idnum}']`, { cls: images, id }],
        ]);

        stage = "material-change-id:icons";
        await projectData.icons().patch([
          ["add", `['${images}']['${id}']`, info.y],
        ]);

        if (isItemImages(images)) {
          stage = "material-change-id:items";
          await projectData.items().patch([["add", `['${id}']`, cloneDeep(templates.item)]]);
        } else if (isEnemyImages(images)) {
          stage = "material-change-id:enemys";
          await projectData.enemys().patch([["add", `['${id}']`, cloneDeep(templates.enemy)]]);
        }
        return commandOk();
      }

      if (typeof info.idnum !== "number") throw new Error("Missing material idnum");
      assertUniqueId(blocks, id, info.idnum);
      const oldId = info.id;

      stage = "material-change-id:maps";
      await projectData.mapBlocks().mutate((draft) => {
        const block = (draft as MapsBlocksData)[String(info.idnum)];
        if (!block) throw new Error(`Missing map block ${info.idnum}`);
        block.id = id;
      });

      stage = "material-change-id:icons";
      await projectData.icons().mutate((draft) => {
        for (const group of Object.values(draft as IconsData)) {
          if (group && typeof group === "object") renameKey(group as Record<string, unknown>, oldId, id);
        }
      });

      stage = "material-change-id:items";
      await projectData.items().mutate((draft) => {
        renameKey(draft as Record<string, unknown>, oldId, id);
      });

      stage = "material-change-id:enemys";
      await projectData.enemys().mutate((draft) => {
        renameKey(draft as Record<string, unknown>, oldId, id);
      });

      return commandOk();
    } catch (error) {
      return commandError(stage, error);
    }
  }

  async register(info: PrefabInfo, options?: MaterialRegisterOptions): Promise<CommandResult> {
    let stage = "material-register";
    try {
      const images = info.images;
      if (!images) throw new Error("Missing material images");
      if (images === "autotile") throw new Error("不能对自动元件进行自动注册！");

      const rowCount = options?.rowCount ?? await imageRowCount(images);
      const blocks = await ensureValue(projectData.mapBlocks());
      const icons = await ensureValue(projectData.icons());
      const templates = await readTemplates(options);
      const iconRows = iconRowsForImage(icons, images);
      const prefix = idPrefix(images);
      let idnum = 300;
      const iconActions: Array<["add", string, unknown]> = [];
      const mapActions: Array<["add", string, unknown]> = [];
      const itemActions: Array<["add", string, unknown]> = [];
      const enemyActions: Array<["add", string, unknown]> = [];
      const faceIds: Array<{ idnum: number; id: string } | string> = [];
      const reservedIdnums = new Set(Object.keys(blocks));

      for (let y = 0; y < rowCount; y += 1) {
        const existingId = iconRows.get(y);
        if (existingId != null) {
          faceIds.push(existingId);
          continue;
        }

        idnum = nextReservedIdnum(reservedIdnums, idnum);
        const id = `${prefix}${idnum}`;
        iconActions.push(["add", `['${images}']['${id}']`, y]);
        mapActions.push(["add", `['${idnum}']`, { cls: images, id }]);
        faceIds.push({ idnum, id });

        if (isItemImages(images)) {
          itemActions.push(["add", `['${id}']`, cloneDeep(templates.item)]);
        } else if (isEnemyImages(images)) {
          enemyActions.push(["add", `['${id}']`, cloneDeep(templates.enemy)]);
        }
        idnum += 1;
      }

      if (options?.bindFaceIds && faceIds.length >= 4) {
        const lastFour = faceIds.slice(-4);
        if (lastFour.every((item): item is { idnum: number; id: string } => typeof item === "object")) {
          const [down, left, right, up] = lastFour;
          const faceObj = { down: down.id, left: left.id, right: right.id, up: up.id };
          if (isEnemyImages(images)) {
            for (const one of lastFour) {
              enemyActions.push(["add", `['${one.id}']['faceIds']`, faceObj]);
            }
          } else {
            for (const one of lastFour) {
              mapActions.push(["add", `['${one.idnum}']['faceIds']`, faceObj]);
            }
          }
        }
      }

      if (mapActions.length === 0) throw new Error("没有要注册的项！");

      stage = "material-register:icons";
      if (iconActions.length > 0) await projectData.icons().patch(iconActions);

      stage = "material-register:maps";
      await projectData.mapBlocks().patch(mapActions);

      if (itemActions.length > 0) {
        stage = "material-register:items";
        await projectData.items().patch(itemActions);
      }
      if (enemyActions.length > 0) {
        stage = "material-register:enemys";
        await projectData.enemys().patch(enemyActions);
      }

      return commandOk();
    } catch (error) {
      return commandError(stage, error);
    }
  }

  async registerAutotile(filename: string): Promise<CommandResult> {
    let stage = "material-register-autotile";
    try {
      const blocks = await ensureValue(projectData.mapBlocks());
      const idnum = nextIdnum(blocks, 140);
      stage = "material-register-autotile:icons";
      await projectData.icons().patch([
        ["add", `['autotile']['${filename}']`, 0],
      ]);
      stage = "material-register-autotile:maps";
      await projectData.mapBlocks().patch([
        ["add", `['${idnum}']`, { cls: "autotile", id: filename }],
      ]);
      return commandOk();
    } catch (error) {
      return commandError(stage, error);
    }
  }

  async appendMaterialImage(
    images: string,
    pngBase64: string,
    options?: MaterialRegisterOptions & { autoRegister?: boolean },
  ): Promise<CommandResult> {
    let stage = "material-append-image";
    try {
      stage = "material-append-image:write";
      await fs.promises.writeFile(`project/materials/${images}.png`, pngBase64, "base64");
      if (options?.autoRegister) {
        const result = await this.register({ images }, options);
        if (!result.ok) return result;
      }
      return commandOk();
    } catch (error) {
      return commandError(stage, error);
    }
  }

  async appendAutotileImage(
    pngBase64: string,
    options?: { filename?: string; autoRegister?: boolean },
  ): Promise<AppendAutotileResult> {
    let stage = "material-append-autotile";
    try {
      const filename = options?.filename ?? await this.nextAutotileFilename();
      stage = "material-append-autotile:write";
      await fs.promises.writeFile(`project/autotiles/${filename}.png`, pngBase64, "base64");
      if (options?.autoRegister !== false) {
        const result = await this.registerAutotile(filename);
        if (!result.ok) return result;
      }
      return { ok: true, filename };
    } catch (error) {
      return {
        ok: false,
        stage,
        error: toError(error),
      };
    }
  }

  async nextAutotileFilename(): Promise<string> {
    const files = await fs.promises.readdir(normalizePath("project/autotiles"));
    for (let i = 1; ; i += 1) {
      const filename = `autotile${i}`;
      if (!files.includes(`${filename}.png`)) return filename;
    }
  }

  async remove(info: PrefabInfo): Promise<CommandResult> {
    const editor = getRuntimeEditor();
    if (!editor?.file?.removeMaterial) {
      return commandError("material-runtime-remove", "Runtime material removal unavailable");
    }
    return callbackCommand("material-runtime-remove", (callback) => {
      editor.file?.removeMaterial?.(info, callback);
    });
  }
}

export const materialCommands = new MaterialCommands();

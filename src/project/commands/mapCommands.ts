import { projectData } from "@/project/data/projectData";
import type { Action } from "@/utils/action";
import { cloneDeep } from "es-toolkit";
import { commandError, commandOk, type CommandResult } from "./types";
import { assertMapMatrixSize, type MapMatrix } from "./mapMatrix";

export type MapLayer = "map" | "bgmap" | "fgmap";

export interface MapPosition {
  x: number;
  y: number;
}

export type PaintBlock =
  | 0
  | number
  | {
      id?: string;
      idnum?: number;
    };

export interface PaintOptions {
  floorId: string;
  layer?: MapLayer;
  pos?: MapPosition;
  positions?: MapPosition[];
  idnum?: number;
  block?: PaintBlock;
}

export interface CopiedMapCell {
  map: unknown;
  events: Record<string, unknown>;
}

export interface CopiedMapInfo {
  w?: number;
  h?: number;
  layer?: MapLayer;
  data?: CopiedMapCell[];
}

export interface PasteMapInfoOptions {
  floorId: string;
  layer?: MapLayer;
  pos: MapPosition;
  info: CopiedMapInfo;
}

export interface MoveLocOptions {
  floorId: string;
  layer?: MapLayer;
  from: MapPosition;
  to: MapPosition;
}

export interface ChangeFloorTarget {
  floorId: string;
  pos?: MapPosition;
}

export type ResolveChangeFloorTargetResult =
  | { ok: true; target: ChangeFloorTarget }
  | { ok: false; stage: string; error: Error };

export const MAP_EVENT_FIELDS = [
  "events",
  "beforeBattle",
  "afterBattle",
  "afterGetItem",
  "afterOpenDoor",
  "changeFloor",
  "autoEvent",
  "cannotMove",
] as const;

function layerPath(layer: MapLayer, pos: MapPosition): string {
  return `['${layer}']['${pos.y}']['${pos.x}']`;
}

function locKey(pos: MapPosition): string {
  return `${pos.x},${pos.y}`;
}

function normalizePositions(options: PaintOptions): MapPosition[] {
  const positions = options.positions ?? (options.pos ? [options.pos] : []);
  const unique = new Map<string, MapPosition>();

  for (const pos of positions) {
    if (!Number.isInteger(pos.x) || !Number.isInteger(pos.y)) {
      throw new Error(`Invalid map position: ${pos.x},${pos.y}`);
    }
    unique.set(locKey(pos), pos);
  }

  if (unique.size === 0) {
    throw new Error("No map positions to paint");
  }

  return [...unique.values()];
}

function resolvePaintValue(options: PaintOptions): number {
  if (typeof options.idnum === "number") return options.idnum;
  if (options.block === 0) return 0;
  if (typeof options.block === "number") return options.block;
  if (options.block?.idnum != null) return options.block.idnum;
  throw new Error("Paint block is missing idnum");
}

function stairActions(layer: MapLayer, pos: MapPosition, block: PaintBlock | undefined): Action[] {
  if (layer !== "map" || !block || typeof block !== "object") return [];

  const changeFloor = changeFloorForStairBlock(block.id);
  if (!changeFloor) return [];

  const key = locKey(pos);
  return [["change", `['changeFloor']['${key}']`, changeFloor]];
}

function changeFloorForStairBlock(blockId: string | undefined): Record<string, unknown> | null {
  switch (blockId) {
    case "upFloor":
      return { floorId: ":next", stair: "downFloor" };
    case "downFloor":
      return { floorId: ":before", stair: "upFloor" };
    case "leftPortal":
    case "rightPortal":
      return { floorId: ":next", stair: ":symmetry_x" };
    case "upPortal":
    case "downPortal":
      return { floorId: ":next", stair: ":symmetry_y" };
    default:
      return null;
  }
}

function clearEventActions(pos: MapPosition): Action[] {
  const key = locKey(pos);
  return MAP_EVENT_FIELDS.map((field) => [
    "delete",
    `['${field}']['${key}']`,
    undefined,
  ]);
}

function isInsideLayer(layerMap: unknown, pos: MapPosition): boolean {
  if (!Array.isArray(layerMap)) return false;
  const row = layerMap[pos.y];
  return Array.isArray(row) && pos.x >= 0 && pos.x < row.length;
}

function getMatrixSize(floor: Record<string, unknown>): { width: number; height: number } {
  const map = Array.isArray(floor.map) ? floor.map : [];
  const width = typeof floor.width === "number" ? floor.width : (Array.isArray(map[0]) ? map[0].length : 0);
  const height = typeof floor.height === "number" ? floor.height : map.length;
  return { width, height };
}

function createZeroMatrix(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
}

function readLayerCell(floor: Record<string, unknown>, layer: MapLayer, pos: MapPosition): unknown {
  const layerMap = floor[layer];
  if (!Array.isArray(layerMap)) return 0;
  const row = layerMap[pos.y];
  return Array.isArray(row) ? row[pos.x] ?? 0 : 0;
}

function writeLayerCell(
  floor: Record<string, unknown>,
  layer: MapLayer,
  pos: MapPosition,
  value: unknown,
): void {
  if (!Array.isArray(floor[layer])) floor[layer] = [];
  const layerMap = floor[layer] as unknown[][];
  if (!Array.isArray(layerMap[pos.y])) layerMap[pos.y] = [];
  layerMap[pos.y][pos.x] = value;
}

function readLocEvents(floor: Record<string, unknown>, pos: MapPosition): Record<string, unknown> {
  const key = locKey(pos);
  const result: Record<string, unknown> = {};
  for (const field of MAP_EVENT_FIELDS) {
    const record = floor[field] as Record<string, unknown> | undefined;
    if (record?.[key] != null) result[field] = cloneDeep(record[key]);
  }
  return result;
}

function writeLocEvents(
  floor: Record<string, unknown>,
  pos: MapPosition,
  events: Record<string, unknown>,
): void {
  const key = locKey(pos);
  for (const field of MAP_EVENT_FIELDS) {
    if (!floor[field] || typeof floor[field] !== "object") floor[field] = {};
    const record = floor[field] as Record<string, unknown>;
    if (events[field] == null) {
      delete record[key];
    } else {
      record[key] = cloneDeep(events[field]);
    }
  }
}

function clearLocEvents(floor: Record<string, unknown>, pos: MapPosition): void {
  writeLocEvents(floor, pos, {});
}

function resolveRelativeFloorId(currentFloorId: string, targetFloorId: unknown, floorIds: string[]): string {
  if (typeof targetFloorId !== "string" || targetFloorId.length === 0) {
    throw new Error("changeFloor target is missing floorId");
  }

  if (targetFloorId === ":next" || targetFloorId === ":before") {
    const index = floorIds.indexOf(currentFloorId);
    if (index < 0) throw new Error(`Current floor ${currentFloorId} is not in floorIds`);
    const offset = targetFloorId === ":next" ? 1 : -1;
    const resolved = floorIds[index + offset];
    if (!resolved) throw new Error(`Cannot resolve ${targetFloorId} from ${currentFloorId}`);
    return resolved;
  }

  if (targetFloorId.startsWith(":")) {
    throw new Error(`Unsupported dynamic floor target: ${targetFloorId}`);
  }

  if (floorIds.length > 0 && !floorIds.includes(targetFloorId)) {
    throw new Error(`Target floor ${targetFloorId} is not in floorIds`);
  }

  return targetFloorId;
}

function readExplicitTargetPos(changeFloor: Record<string, unknown>): MapPosition | undefined {
  const loc = changeFloor.loc;
  if (!Array.isArray(loc)) return undefined;

  const [x, y] = loc;
  if (Number.isInteger(x) && Number.isInteger(y)) return { x, y };
  throw new Error(`Invalid changeFloor loc: ${JSON.stringify(loc)}`);
}

class MapCommands {
  async patchFloor(floorId: string, actions: Action[]): Promise<CommandResult> {
    try {
      await projectData.floor(floorId).patch(actions);
      return commandOk();
    } catch (error) {
      return commandError("patch-map-floor", error);
    }
  }

  async paint(options: PaintOptions): Promise<CommandResult> {
    try {
      const layer = options.layer ?? "map";
      const positions = normalizePositions(options);
      const value = resolvePaintValue(options);
      const actions: Action[] = [];

      for (const pos of positions) {
        actions.push(["change", layerPath(layer, pos), value]);
        actions.push(...stairActions(layer, pos, options.block));
      }

      return this.patchFloor(options.floorId, actions);
    } catch (error) {
      return commandError("paint-map", error);
    }
  }

  async clearEvents(floorId: string, pos: MapPosition): Promise<CommandResult> {
    try {
      await projectData.floor(floorId).patch(clearEventActions(pos));
      return commandOk();
    } catch (error) {
      return commandError("clear-map-events", error);
    }
  }

  async clearBlock(floorId: string, layer: MapLayer, pos: MapPosition): Promise<CommandResult> {
    try {
      await projectData.floor(floorId).patch([
        ["change", layerPath(layer, pos), 0],
      ]);
      return commandOk();
    } catch (error) {
      return commandError("clear-map-block", error);
    }
  }

  async clearLoc(floorId: string, layer: MapLayer, pos: MapPosition): Promise<CommandResult> {
    const actions: Action[] = [["change", layerPath(layer, pos), 0]];
    if (layer === "map") actions.push(...clearEventActions(pos));

    try {
      await projectData.floor(floorId).patch(actions);
      return commandOk();
    } catch (error) {
      return commandError("clear-map-loc", error);
    }
  }

  async pasteInfo(options: PasteMapInfoOptions): Promise<CommandResult> {
    const targetLayer = options.layer ?? "map";
    const sourceLayer = options.info.layer ?? "map";
    const width = options.info.w ?? 1;
    const height = options.info.h ?? 1;
    const data = options.info.data ?? [];

    try {
      if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
        throw new Error("Copied map info has invalid size");
      }

      const floor = projectData.floor(options.floorId).value() as Record<string, unknown>;
      const layerMap = floor[targetLayer];
      const actions: Action[] = [];
      let index = 0;

      for (let y = options.pos.y; y < options.pos.y + height; y++) {
        for (let x = options.pos.x; x < options.pos.x + width; x++) {
          const one = data[index++];
          if (!one || !isInsideLayer(layerMap, { x, y })) continue;

          const targetPos = { x, y };
          actions.push(["change", layerPath(targetLayer, targetPos), one.map]);

          if (sourceLayer === "map" && targetLayer === "map") {
            const key = locKey(targetPos);
            for (const field of MAP_EVENT_FIELDS) {
              actions.push([
                one.events[field] == null ? "delete" : "change",
                `['${field}']['${key}']`,
                structuredClone(one.events[field]),
              ]);
            }
          }
        }
      }

      await projectData.floor(options.floorId).patch(actions);
      return commandOk();
    } catch (error) {
      return commandError("paste-map-info", error);
    }
  }

  async replaceLayer(
    floorId: string,
    layer: MapLayer,
    matrix: MapMatrix,
  ): Promise<CommandResult> {
    try {
      const floor = projectData.floor(floorId).value() as Record<string, unknown>;
      const { width, height } = getMatrixSize(floor);
      assertMapMatrixSize(matrix, { width, height });
      await projectData.floor(floorId).patch([
        ["change", `['${layer}']`, matrix],
      ]);
      return commandOk();
    } catch (error) {
      return commandError("replace-map-layer", error);
    }
  }

  async clearFloorMap(floorId: string): Promise<CommandResult> {
    try {
      await projectData.floor(floorId).mutate((draft) => {
        const record = draft as unknown as Record<string, unknown>;
        const { width, height } = getMatrixSize(record);
        const zero = createZeroMatrix(width, height);
        record.map = structuredClone(zero);
        record.bgmap = structuredClone(zero);
        record.fgmap = structuredClone(zero);
        record.firstArrive = [];
        record.eachArrive = [];
        for (const field of MAP_EVENT_FIELDS) {
          record[field] = {};
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("clear-floor-map", error);
    }
  }

  async moveLoc(options: MoveLocOptions): Promise<CommandResult> {
    const layer = options.layer ?? "map";
    try {
      await projectData.floor(options.floorId).mutate((draft) => {
        const record = draft as unknown as Record<string, unknown>;
        const value = cloneDeep(readLayerCell(record, layer, options.from));
        const events = layer === "map" ? readLocEvents(record, options.from) : {};

        writeLayerCell(record, layer, options.from, 0);
        writeLayerCell(record, layer, options.to, value);
        if (layer === "map") {
          clearLocEvents(record, options.from);
          writeLocEvents(record, options.to, events);
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("move-map-loc", error);
    }
  }

  async exchangeLoc(options: MoveLocOptions): Promise<CommandResult> {
    const layer = options.layer ?? "map";
    try {
      await projectData.floor(options.floorId).mutate((draft) => {
        const record = draft as unknown as Record<string, unknown>;
        const fromValue = cloneDeep(readLayerCell(record, layer, options.from));
        const toValue = cloneDeep(readLayerCell(record, layer, options.to));
        const fromEvents = layer === "map" ? readLocEvents(record, options.from) : {};
        const toEvents = layer === "map" ? readLocEvents(record, options.to) : {};

        writeLayerCell(record, layer, options.from, toValue);
        writeLayerCell(record, layer, options.to, fromValue);
        if (layer === "map") {
          writeLocEvents(record, options.from, toEvents);
          writeLocEvents(record, options.to, fromEvents);
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("exchange-map-loc", error);
    }
  }

  async bindStartPoint(floorId: string, pos: MapPosition): Promise<CommandResult> {
    try {
      await projectData.tower().mutate((draft) => {
        const tower = draft as unknown as Record<string, unknown>;
        const firstData = typeof tower.firstData === "object" && tower.firstData
          ? tower.firstData as Record<string, unknown>
          : {};
        const hero = typeof firstData.hero === "object" && firstData.hero
          ? firstData.hero as Record<string, unknown>
          : {};
        const loc = typeof hero.loc === "object" && hero.loc
          ? hero.loc as Record<string, unknown>
          : {};

        loc.x = pos.x;
        loc.y = pos.y;
        hero.loc = loc;
        firstData.hero = hero;
        firstData.floorId = floorId;
        tower.firstData = firstData;
      });
      return commandOk();
    } catch (error) {
      return commandError("bind-start-point", error);
    }
  }

  async bindStair(floorId: string, pos: MapPosition, blockId: string): Promise<CommandResult> {
    try {
      const changeFloor = changeFloorForStairBlock(blockId);
      if (!changeFloor) throw new Error(`Unsupported stair block: ${blockId}`);
      await projectData.floor(floorId).patch([
        ["change", `['changeFloor']['${locKey(pos)}']`, changeFloor],
      ]);
      return commandOk();
    } catch (error) {
      return commandError("bind-stair", error);
    }
  }

  async bindSpecialDoor(
    floorId: string,
    doorPos: MapPosition,
    enemyPositions: MapPosition[],
  ): Promise<CommandResult> {
    try {
      if (enemyPositions.length === 0) {
        throw new Error("Special door binding requires at least one enemy");
      }

      const doorKey = locKey(doorPos);
      const doorFlag = `flag:door_${floorId}_${doorKey.replace(",", "_")}`;
      await projectData.floor(floorId).mutate((draft) => {
        const floor = draft as unknown as Record<string, unknown>;
        if (!floor.autoEvent || typeof floor.autoEvent !== "object") floor.autoEvent = {};
        if (!floor.afterBattle || typeof floor.afterBattle !== "object") floor.afterBattle = {};

        const autoEvent = floor.autoEvent as Record<string, unknown>;
        const afterBattle = floor.afterBattle as Record<string, unknown>;

        autoEvent[doorKey] = {
          "0": {
            condition: `${doorFlag}==${enemyPositions.length}`,
            currentFloor: true,
            priority: 0,
            delayExecute: false,
            multiExecute: false,
            data: [
              { type: "openDoor" },
              { type: "setValue", name: doorFlag, operator: "=", value: "null" },
            ],
          },
        };

        for (const enemyPos of enemyPositions) {
          const enemyKey = locKey(enemyPos);
          const events = Array.isArray(afterBattle[enemyKey])
            ? afterBattle[enemyKey] as unknown[]
            : [];
          events.push({ type: "setValue", name: doorFlag, operator: "+=", value: "1" });
          afterBattle[enemyKey] = events;
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("bind-special-door", error);
    }
  }

  resolveChangeFloorTarget(
    floorId: string,
    pos: MapPosition,
    floorIds: string[],
  ): ResolveChangeFloorTargetResult {
    try {
      const floor = projectData.floor(floorId).value() as Record<string, unknown>;
      const changeFloorRecord = floor.changeFloor as Record<string, unknown> | undefined;
      const changeFloor = changeFloorRecord?.[locKey(pos)];
      if (!changeFloor || typeof changeFloor !== "object") {
        throw new Error(`No changeFloor event at ${locKey(pos)}`);
      }

      const changeFloorData = changeFloor as Record<string, unknown>;
      return {
        ok: true,
        target: {
          floorId: resolveRelativeFloorId(floorId, changeFloorData.floorId, floorIds),
          pos: readExplicitTargetPos(changeFloorData),
        },
      };
    } catch (error) {
      return {
        ok: false,
        stage: "resolve-change-floor-target",
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }
}

export const mapCommands = new MapCommands();

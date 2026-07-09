import { produce } from "immer";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { projectData } from "@/project/data/projectData";
import type { FloorData } from "@/types";
import { serializeToJsMapFile } from "@/utils/serialize";
import type { Action } from "@/utils/action";
import { isValidFloorId } from "@/utils/string";
import { commandError, commandOk, type CommandResult } from "./types";

export interface CreateFloorOptions {
  title?: string;
  name?: string;
  width?: number;
  height?: number;
  canFlyTo?: boolean;
  canFlyFrom?: boolean;
}

export interface BatchCreateFloorOptions extends CreateFloorOptions {
  floorId: string;
}

export interface BatchFloorPatch {
  floorId: string;
  actions: Action[];
}

export interface ResizeFloorOptions {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

const MAP_FIELDS = ["map", "bgmap", "fgmap"] as const;
const COORD_FIELDS = [
  "events",
  "beforeBattle",
  "afterBattle",
  "afterGetItem",
  "afterOpenDoor",
  "changeFloor",
  "autoEvent",
  "cannotMove",
] as const;

function floorPath(floorId: string): string {
  return `project/floors/${floorId}.js`;
}

function createInitialFloorData(
  floorId: string,
  options: CreateFloorOptions = {},
): FloorData {
  const width = options.width ?? 13;
  const height = options.height ?? 13;
  const emptyMap = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 0)
  );

  return {
    floorId,
    title: options.title ?? floorId,
    name: options.name ?? floorId,
    width,
    height,
    canFlyTo: options.canFlyTo ?? true,
    canFlyFrom: options.canFlyFrom ?? true,
    map: emptyMap,
    bgmap: [],
    fgmap: [],
    events: {},
    beforeBattle: {},
    afterBattle: {},
    afterGetItem: {},
    afterOpenDoor: {},
    changeFloor: {},
    autoEvent: {},
    cannotMove: {},
  };
}

function validateFloorSize(width: number, height: number): void {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0 || width > 128 || height > 128) {
    throw new Error("Floor width and height must be integers between 1 and 128");
  }
}

function resizeMap(
  currentMap: unknown,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
): unknown[][] {
  const map = Array.isArray(currentMap) ? currentMap : [];
  const result: unknown[][] = [];

  for (let y = 0; y < height; y++) {
    const row: unknown[] = [];
    for (let x = 0; x < width; x++) {
      const oldX = x - offsetX;
      const oldY = y - offsetY;
      const oldRow = map[oldY];
      row.push(Array.isArray(oldRow) ? oldRow[oldX] ?? 0 : 0);
    }
    result.push(row);
  }

  return result;
}

function shiftCoordRecord(
  current: unknown,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!current || typeof current !== "object") return result;

  for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
    const [oldXRaw, oldYRaw] = key.split(",");
    const oldX = Number(oldXRaw);
    const oldY = Number(oldYRaw);
    if (!Number.isInteger(oldX) || !Number.isInteger(oldY)) continue;

    const x = oldX + offsetX;
    const y = oldY + offsetY;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      result[`${x},${y}`] = value;
    }
  }

  return result;
}

function shiftPoint(value: unknown, width: number, height: number, offsetX: number, offsetY: number): unknown {
  if (!Array.isArray(value) || value.length !== 2) return value;
  const x = Number(value[0]) + offsetX;
  const y = Number(value[1]) + offsetY;
  if (!Number.isInteger(x) || !Number.isInteger(y)) return value;
  if (x < 0 || x >= width || y < 0 || y >= height) return value;
  return [x, y];
}

class FloorCommands {
  async patch(floorId: string, actions: Action[]): Promise<CommandResult> {
    try {
      await projectData.floor(floorId).patch(actions);
      return commandOk();
    } catch (error) {
      return commandError("patch-floor", error);
    }
  }

  async batchPatch(changes: BatchFloorPatch[]): Promise<CommandResult> {
    for (const change of changes) {
      const result = await this.patch(change.floorId, change.actions);
      if (!result.ok) return result;
    }
    return commandOk();
  }

  async create(floorId: string, options: CreateFloorOptions = {}): Promise<CommandResult> {
    const path = floorPath(floorId);
    try {
      if (await FileHandlerManager.exists(path)) {
        throw new Error(`Floor ${floorId} already exists`);
      }
    } catch (error) {
      return commandError("check-new-floor", error);
    }

    try {
      const floorData = createInitialFloorData(floorId, options);
      const handler = projectData.floor(floorId).raw();
      handler.update(serializeToJsMapFile(floorId, floorData));
      await handler.waitForIdle();
    } catch (error) {
      return commandError("write-new-floor", error);
    }

    try {
      await projectData.tower().mutate((draft) => {
        if (!draft.main.floorIds.includes(floorId)) {
          draft.main.floorIds.push(floorId);
        }
        if (!draft.firstData.floorId) {
          draft.firstData.floorId = floorId;
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("update-floorIds", error);
    }
  }

  async batchCreate(floors: BatchCreateFloorOptions[]): Promise<CommandResult> {
    try {
      if (floors.length === 0) {
        throw new Error("No floors to create");
      }
      const tower = projectData.tower().value();
      const seen = new Set<string>();
      const existing = new Set(tower.main.floorIds.map((id) => id.toLowerCase()));

      for (const floor of floors) {
        const normalized = floor.floorId.toLowerCase();
        if (!isValidFloorId(floor.floorId)) {
          throw new Error(`Invalid floorId: ${floor.floorId}`);
        }
        if (seen.has(normalized)) {
          throw new Error(`Duplicate floorId: ${floor.floorId}`);
        }
        if (existing.has(normalized) || await FileHandlerManager.exists(floorPath(floor.floorId))) {
          throw new Error(`Floor ${floor.floorId} already exists`);
        }
        validateFloorSize(floor.width ?? 13, floor.height ?? 13);
        seen.add(normalized);
      }
    } catch (error) {
      return commandError("precheck-batch-create-floors", error);
    }

    for (const floor of floors) {
      const result = await this.create(floor.floorId, floor);
      if (!result.ok) return result;
    }

    return commandOk();
  }

  async rename(oldFloorId: string, newFloorId: string): Promise<CommandResult> {
    const newPath = floorPath(newFloorId);
    try {
      if (await FileHandlerManager.exists(newPath)) {
        throw new Error(`Floor ${newFloorId} already exists`);
      }
    } catch (error) {
      return commandError("check-new-floor", error);
    }

    try {
      const oldData = projectData.floor(oldFloorId).value();
      const newData = produce(oldData, (draft) => {
        draft.floorId = newFloorId;
      });
      const newRaw = projectData.floor(newFloorId).raw();
      newRaw.update(serializeToJsMapFile(newFloorId, newData));
      await newRaw.waitForIdle();
    } catch (error) {
      return commandError("write-renamed-floor", error);
    }

    try {
      await FileHandlerManager.delete(floorPath(oldFloorId));
      projectData.clearFloorCache(oldFloorId);
    } catch (error) {
      return commandError("delete-old-floor", error);
    }

    try {
      await projectData.tower().mutate((draft) => {
        const index = draft.main.floorIds.indexOf(oldFloorId);
        if (index !== -1) draft.main.floorIds[index] = newFloorId;
        if (draft.firstData.floorId === oldFloorId) draft.firstData.floorId = newFloorId;
      });
      return commandOk();
    } catch (error) {
      return commandError("update-floorIds", error);
    }
  }

  async delete(floorId: string): Promise<CommandResult> {
    try {
      await FileHandlerManager.delete(floorPath(floorId));
      projectData.clearFloorCache(floorId);
    } catch (error) {
      return commandError("delete-floor-file", error);
    }

    try {
      await projectData.tower().mutate((draft) => {
        const index = draft.main.floorIds.indexOf(floorId);
        if (index !== -1) draft.main.floorIds.splice(index, 1);
        if (draft.firstData.floorId === floorId) {
          draft.firstData.floorId = draft.main.floorIds[0] ?? "";
        }
      });
      return commandOk();
    } catch (error) {
      return commandError("update-floorIds", error);
    }
  }

  async resize(floorId: string, options: ResizeFloorOptions): Promise<CommandResult> {
    const { width, height, offsetX, offsetY } = options;

    try {
      validateFloorSize(width, height);
    } catch (error) {
      return commandError("validate-floor-size", error);
    }
    if (!Number.isInteger(offsetX) || !Number.isInteger(offsetY)) {
      return commandError("validate-floor-offset", new Error("Floor resize offsets must be integers"));
    }

    try {
      await projectData.floor(floorId).mutate((draft) => {
        const record = draft as unknown as Record<string, unknown>;
        record.width = width;
        record.height = height;

        for (const field of MAP_FIELDS) {
          record[field] = resizeMap(record[field], width, height, offsetX, offsetY);
        }

        for (const field of COORD_FIELDS) {
          record[field] = shiftCoordRecord(record[field], width, height, offsetX, offsetY);
        }

        record.upFloor = shiftPoint(record.upFloor, width, height, offsetX, offsetY);
        record.downFloor = shiftPoint(record.downFloor, width, height, offsetX, offsetY);
      });
      return commandOk();
    } catch (error) {
      return commandError("resize-floor", error);
    }
  }
}

export const floorCommands = new FloorCommands();

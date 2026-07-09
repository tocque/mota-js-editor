import { projectData } from "@/project/data/projectData";
import type { PrefabInfo } from "@/services/prefab";
import type { Action } from "@/utils/action";
import { commandError, commandOk, type CommandResult } from "./types";

export type PrefabType = "enemy" | "item" | "mapBlock";
export interface PrefabClipboardData {
  type: Exclude<PrefabType, "mapBlock">;
  data: unknown;
}

export interface ClearPrefabTemplates {
  enemy?: Record<string, unknown>;
}

function prefabType(info: PrefabInfo | null | undefined): PrefabType | null {
  if (!info?.images) return null;
  if (info.images === "enemys" || info.images === "enemy48") return "enemy";
  if (info.images === "items") return "item";
  return "mapBlock";
}

function prefixActions(prefix: string, actions: Action[]): Action[] {
  return actions.map(([type, path, value]) => [type, `${prefix}${path}`, value]);
}

class PrefabCommands {
  getType(info: PrefabInfo | null | undefined): PrefabType | null {
    return prefabType(info);
  }

  async patch(info: PrefabInfo, actions: Action[]): Promise<CommandResult> {
    try {
      const type = prefabType(info);
      if (type === "enemy") {
        if (!info.id) throw new Error("Enemy prefab is missing id");
        await projectData.enemys().patch(prefixActions(`['${info.id}']`, actions));
      } else if (type === "item") {
        if (!info.id) throw new Error("Item prefab is missing id");
        await projectData.items().patch(prefixActions(`['${info.id}']`, actions));
      } else if (type === "mapBlock") {
        if (info.idnum == null) throw new Error("Map block prefab is missing idnum");
        await projectData.mapBlocks().patch(prefixActions(`['${info.idnum}']`, actions));
      } else {
        throw new Error("Unknown prefab type");
      }
      return commandOk();
    } catch (error) {
      return commandError("patch-prefab", error);
    }
  }

  getClipboardData(info: PrefabInfo, allData: Record<string, unknown>): CommandResult & { data?: PrefabClipboardData } {
    try {
      const type = prefabType(info);
      if (type !== "enemy" && type !== "item") {
        throw new Error("Only enemy and item prefabs can be copied");
      }
      if (!info.id) throw new Error("Prefab is missing id");
      return {
        ...commandOk(),
        data: {
          type,
          data: allData[info.id] ?? null,
        },
      };
    } catch (error) {
      return commandError("copy-prefab", error);
    }
  }

  async replaceFromClipboard(
    info: PrefabInfo,
    clipboard: PrefabClipboardData,
    allData: Record<string, unknown>,
  ): Promise<CommandResult> {
    try {
      const type = prefabType(info);
      if (type !== "enemy" && type !== "item") {
        throw new Error("Only enemy and item prefabs can be pasted");
      }
      if (clipboard.type !== type) {
        throw new Error(`Clipboard prefab type mismatch: expected ${type}, got ${clipboard.type}`);
      }
      if (!info.id) throw new Error("Prefab is missing id");
      const current = (allData[info.id] ?? {}) as Record<string, unknown>;
      const next = {
        ...(cloneRecord(clipboard.data)),
        id: info.id,
        name: current.name,
        ...(type === "enemy" ? { displayIdInBook: current.displayIdInBook } : {}),
      };
      await (type === "enemy" ? projectData.enemys() : projectData.items()).patch([
        ["change", `['${info.id}']`, next],
      ]);
      return commandOk();
    } catch (error) {
      return commandError("paste-prefab", error);
    }
  }

  async clear(info: PrefabInfo, templates: ClearPrefabTemplates, allData: Record<string, unknown>): Promise<CommandResult> {
    try {
      const type = prefabType(info);
      if (type !== "enemy" && type !== "item") {
        throw new Error("Only enemy and item prefabs can be cleared");
      }
      if (!info.id) throw new Error("Prefab is missing id");
      const current = (allData[info.id] ?? {}) as Record<string, unknown>;
      const next = type === "enemy"
        ? {
            ...(templates.enemy ?? {}),
            id: info.id,
            name: current.name,
            displayIdInBook: current.displayIdInBook,
          }
        : {
            id: current.id,
            cls: current.cls,
            name: current.name,
          };
      await (type === "enemy" ? projectData.enemys() : projectData.items()).patch([
        ["change", `['${info.id}']`, next],
      ]);
      return commandOk();
    } catch (error) {
      return commandError("clear-prefab", error);
    }
  }

  async clearAll(info: PrefabInfo, templates: ClearPrefabTemplates, allData: Record<string, unknown>): Promise<CommandResult> {
    try {
      const type = prefabType(info);
      if (type === "enemy") {
        const actions: Action[] = Object.keys(allData).map((id) => {
          const current = (allData[id] ?? {}) as Record<string, unknown>;
          return ["change", `['${id}']`, {
            ...(templates.enemy ?? {}),
            id,
            name: current.name,
            displayIdInBook: current.displayIdInBook,
          }];
        });
        await projectData.enemys().patch(actions);
      } else if (type === "item") {
        const actions: Action[] = Object.keys(allData)
          .filter((id) => /^I\d+$/.test(id))
          .map((id) => {
            const current = (allData[id] ?? {}) as Record<string, unknown>;
            return ["change", `['${id}']`, {
              id: current.id,
              cls: current.cls,
              name: current.name,
            }];
          });
        await projectData.items().patch(actions);
      } else {
        throw new Error("Only enemy and item prefabs can be cleared");
      }
      return commandOk();
    } catch (error) {
      return commandError("clear-all-prefabs", error);
    }
  }
}

function cloneRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

export const prefabCommands = new PrefabCommands();

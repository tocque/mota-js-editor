import type { DataResource } from "@/project/data/DataResource";
import { projectData } from "@/project/data/projectData";
import type { LocPos } from "@/stores/locState";
import type { Action } from "@/utils/action";
import { floorCommands } from "./floorCommands";
import { locCommands } from "./locCommands";
import { prefabCommands } from "./prefabCommands";
import type { PrefabInfo } from "@/services/prefab";
import { commandError, commandOk, type CommandResult } from "./types";

class TableCommands {
  async patchResource<T>(resource: DataResource<T>, actions: Action[]): Promise<CommandResult> {
    try {
      await resource.patch(actions);
      return commandOk();
    } catch (error) {
      return commandError(`patch:${resource.id}`, error);
    }
  }

  patchFunctions(actions: Action[]): Promise<CommandResult> {
    return this.patchResource(projectData.functions(), actions);
  }

  patchCommonEvents(actions: Action[]): Promise<CommandResult> {
    return this.patchResource(projectData.commonEvents(), actions);
  }

  patchPlugins(actions: Action[]): Promise<CommandResult> {
    return this.patchResource(projectData.plugins(), actions);
  }

  patchFloor(floorId: string, actions: Action[]): Promise<CommandResult> {
    return floorCommands.patch(floorId, actions);
  }

  patchLoc(floorId: string, pos: LocPos, actions: Action[]): Promise<CommandResult> {
    return locCommands.patch(floorId, pos, actions);
  }

  patchPrefab(info: PrefabInfo, actions: Action[]): Promise<CommandResult> {
    return prefabCommands.patch(info, actions);
  }
}

export const tableCommands = new TableCommands();

import { Json2xDataHandler } from "@/fs/Json2xDataHandler";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { TowerDataHandler } from "@/services/tower/TowerDataHandler";
import type { TowerData } from "@/services/tower";
import { FloorDataHandler } from "@/services/floor/FloorDataHandler";
import type { FloorData } from "@/types";
import { ItemsDataHandler, type ItemsData } from "@/services/item";
import { EnemysDataHandler, type EnemysData } from "@/services/enemy";
import { MapsBlocksDataHandler, type MapsBlocksData } from "@/services/mapBlock";
import { IconsDataHandler, type IconsData } from "@/services/icons";
import { FunctionsDataHandler, type FunctionsData } from "@/services/functions/FunctionsDataHandler";
import { PluginsDataHandler, type PluginsData } from "@/services/plugins/PluginsDataHandler";
import { TableMetaDataHandler } from "@/services/tableMeta/TableMetaDataHandler";
import {
  META_FILE_CONFIG,
  type MetaFileKey,
} from "@/services/tableMeta/tableMetaService";
import type { CommentObject } from "@/components/Table";
import type { CommonEventData } from "@/services/commonEvent";
import { HandlerDataResource, MappedDataResource, type DataResource } from "./DataResource";
import type { Action } from "@/utils/action";

const TOWER_DATA_PATH = "project/data.js";
const ITEMS_DATA_PATH = "project/items.js";
const ENEMYS_DATA_PATH = "project/enemys.js";
const MAPS_BLOCKS_DATA_PATH = "project/maps.js";
const ICONS_DATA_PATH = "project/icons.js";
const FUNCTIONS_DATA_PATH = "project/functions.js";
const PLUGINS_DATA_PATH = "project/plugins.js";
const EVENTS_DATA_PATH = "project/events.js";
const EVENTS_VAR_NAME = "events_c12a15a8_c380_4b28_8144_256cba95f760";

interface EventsData {
  commonEvent: CommonEventData;
  [key: string]: unknown;
}

function floorPath(floorId: string): string {
  return `project/floors/${floorId}.js`;
}

function prefixActions(prefix: string, actions: Action[]): Action[] {
  return actions.map(([type, path, value]) => [type, `${prefix}${path}`, value]);
}

class ProjectDataImpl {
  private towerResource: DataResource<TowerData> | null = null;
  private itemResource: DataResource<ItemsData> | null = null;
  private enemyResource: DataResource<EnemysData> | null = null;
  private mapBlockResource: DataResource<MapsBlocksData> | null = null;
  private iconsResource: DataResource<IconsData> | null = null;
  private functionsResource: DataResource<FunctionsData> | null = null;
  private pluginsResource: DataResource<PluginsData> | null = null;
  private eventsResource: DataResource<EventsData> | null = null;
  private commonEventsResource: DataResource<CommonEventData> | null = null;
  private readonly floorResources = new Map<string, DataResource<FloorData>>();
  private readonly tableMetaResources = new Map<MetaFileKey, DataResource<CommentObject>>();

  tower(): DataResource<TowerData> {
    if (!this.towerResource) {
      this.towerResource = new HandlerDataResource(
        "tower",
        TOWER_DATA_PATH,
        new TowerDataHandler(FileHandlerManager.get(TOWER_DATA_PATH)),
      );
    }
    return this.towerResource;
  }

  floor(floorId: string): DataResource<FloorData> {
    let resource = this.floorResources.get(floorId);
    if (!resource) {
      const path = floorPath(floorId);
      resource = new HandlerDataResource(
        `floor:${floorId}`,
        path,
        new FloorDataHandler(FileHandlerManager.get(path), floorId),
      );
      this.floorResources.set(floorId, resource);
    }
    return resource;
  }

  items(): DataResource<ItemsData> {
    if (!this.itemResource) {
      this.itemResource = new HandlerDataResource(
        "items",
        ITEMS_DATA_PATH,
        new ItemsDataHandler(FileHandlerManager.get(ITEMS_DATA_PATH)),
      );
    }
    return this.itemResource;
  }

  enemys(): DataResource<EnemysData> {
    if (!this.enemyResource) {
      this.enemyResource = new HandlerDataResource(
        "enemys",
        ENEMYS_DATA_PATH,
        new EnemysDataHandler(FileHandlerManager.get(ENEMYS_DATA_PATH)),
      );
    }
    return this.enemyResource;
  }

  mapBlocks(): DataResource<MapsBlocksData> {
    if (!this.mapBlockResource) {
      this.mapBlockResource = new HandlerDataResource(
        "mapBlocks",
        MAPS_BLOCKS_DATA_PATH,
        new MapsBlocksDataHandler(FileHandlerManager.get(MAPS_BLOCKS_DATA_PATH)),
      );
    }
    return this.mapBlockResource;
  }

  icons(): DataResource<IconsData> {
    if (!this.iconsResource) {
      this.iconsResource = new HandlerDataResource(
        "icons",
        ICONS_DATA_PATH,
        new IconsDataHandler(FileHandlerManager.get(ICONS_DATA_PATH)),
      );
    }
    return this.iconsResource;
  }

  functions(): DataResource<FunctionsData> {
    if (!this.functionsResource) {
      this.functionsResource = new HandlerDataResource(
        "functions",
        FUNCTIONS_DATA_PATH,
        new FunctionsDataHandler(FileHandlerManager.get(FUNCTIONS_DATA_PATH)),
      );
    }
    return this.functionsResource;
  }

  plugins(): DataResource<PluginsData> {
    if (!this.pluginsResource) {
      this.pluginsResource = new HandlerDataResource(
        "plugins",
        PLUGINS_DATA_PATH,
        new PluginsDataHandler(FileHandlerManager.get(PLUGINS_DATA_PATH)),
      );
    }
    return this.pluginsResource;
  }

  events(): DataResource<EventsData> {
    if (!this.eventsResource) {
      this.eventsResource = new HandlerDataResource(
        "events",
        EVENTS_DATA_PATH,
        new Json2xDataHandler<EventsData>(
          FileHandlerManager.get(EVENTS_DATA_PATH),
          EVENTS_VAR_NAME,
          "Events Data",
        ),
      );
    }
    return this.eventsResource;
  }

  commonEvents(): DataResource<CommonEventData> {
    if (!this.commonEventsResource) {
      this.commonEventsResource = new MappedDataResource(
        "commonEvents",
        EVENTS_DATA_PATH,
        this.events(),
        (events) => events.commonEvent,
        (events, commonEvent) => ({ ...events, commonEvent }),
        (actions) => prefixActions("['commonEvent']", actions),
      );
    }
    return this.commonEventsResource;
  }

  tableMetaSource(key: MetaFileKey): DataResource<CommentObject> {
    let resource = this.tableMetaResources.get(key);
    if (!resource) {
      const config = META_FILE_CONFIG[key];
      resource = new HandlerDataResource(
        `tableMeta:${key}`,
        config.filePath,
        new TableMetaDataHandler(
          FileHandlerManager.get(config.filePath),
          config.varName,
          config.resourceName,
        ),
      );
      this.tableMetaResources.set(key, resource);
    }
    return resource;
  }

  clearFloorCache(floorId: string): void {
    this.floorResources.delete(floorId);
  }

  resetForTests(): void {
    this.towerResource = null;
    this.itemResource = null;
    this.enemyResource = null;
    this.mapBlockResource = null;
    this.iconsResource = null;
    this.functionsResource = null;
    this.pluginsResource = null;
    this.eventsResource = null;
    this.commonEventsResource = null;
    this.floorResources.clear();
    this.tableMetaResources.clear();
  }
}

export const projectData = new ProjectDataImpl();

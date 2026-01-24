/**
 * prefabService - 图块数据聚合服务
 *
 * 聚合调用 enemy/item/mapBlock 三个独立服务
 * 根据 PrefabInfo.images 类型路由到对应的服务
 *
 * 职责：
 * - 统一的图块数据访问入口
 * - 根据 images 类型分发到正确的服务
 * - 提供类型判断工具方法
 */

import type { Action } from "@/utils/action";
import type { IDataHandler } from "@/fs/interfaces";
import { enemyService, type EnemysData } from "@/services/enemy";
import { itemService, type ItemsData } from "@/services/item";
import { mapBlockService, type MapsBlocksData } from "@/services/mapBlock";

/**
 * 图块信息类型
 */
export interface PrefabInfo {
  id?: string;
  idnum?: number;
  images?: string; // 'enemys' | 'enemy48' | 'items' | 其他
  isTile?: boolean;
  y?: number;
  [key: string]: unknown;
}

/**
 * Prefab 类型
 */
export type PrefabType = "enemy" | "item" | "mapBlock";

/**
 * prefabService - 图块数据聚合服务
 */
class PrefabServiceImpl {
  /**
   * 根据 PrefabInfo 获取 Prefab 类型
   */
  getPrefabType(info: PrefabInfo | null | undefined): PrefabType | null {
    if (!info?.images) {
      return null;
    }

    const images = info.images;
    if (images === "enemys" || images === "enemy48") {
      return "enemy";
    } else if (images === "items") {
      return "item";
    } else {
      return "mapBlock";
    }
  }

  /**
   * 根据 PrefabInfo 获取对应的数据
   */
  getPrefabData(
    info: PrefabInfo | null | undefined
  ): EnemysData | ItemsData | MapsBlocksData | null {
    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
        return enemyService.getEnemysData();
      case "item":
        return itemService.getItemsData();
      case "mapBlock":
        return mapBlockService.getMapsBlocksData();
      default:
        return null;
    }
  }

  /**
   * 根据 PrefabInfo 获取对应的 DataHandler
   *
   * 用于 Suspense 模式
   */
  getHandler(
    info: PrefabInfo | null | undefined
  ): IDataHandler<EnemysData | ItemsData | MapsBlocksData> | null {
    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
        return enemyService.getHandler();
      case "item":
        return itemService.getHandler();
      case "mapBlock":
        return mapBlockService.getHandler();
      default:
        return null;
    }
  }

  /**
   * 根据 PrefabInfo 保存数据
   *
   * 委托给对应的独立 service
   */
  savePrefabData(info: PrefabInfo, actions: Action[]): void {
    if (actions.length === 0) {
      return;
    }

    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
        if (info.id) {
          enemyService.saveEnemy(info.id, actions);
        }
        break;
      case "item":
        if (info.id) {
          itemService.saveItem(info.id, actions);
        }
        break;
      case "mapBlock":
        if (info.idnum !== undefined) {
          mapBlockService.saveBlock(info.idnum, actions);
        }
        break;
    }
  }

  /**
   * 获取单个图块的数据
   */
  getPrefabItemData(info: PrefabInfo | null | undefined): unknown {
    if (!info) {
      return null;
    }

    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
        return info.id ? enemyService.getEnemy(info.id) : null;
      case "item":
        return info.id ? itemService.getItem(info.id) : null;
      case "mapBlock":
        return info.idnum !== undefined
          ? mapBlockService.getBlock(info.idnum)
          : null;
      default:
        return null;
    }
  }

  /**
   * 检查 PrefabInfo 是否有有效的 ID
   */
  hasValidId(info: PrefabInfo | null | undefined): boolean {
    if (!info) {
      return false;
    }

    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
      case "item":
        return !!info.id;
      case "mapBlock":
        return info.idnum !== undefined;
      default:
        return false;
    }
  }

  /**
   * 获取 PrefabInfo 的显示 ID（用于 UI 显示）
   */
  getDisplayId(info: PrefabInfo | null | undefined): string {
    if (!info) {
      return "";
    }

    const type = this.getPrefabType(info);

    switch (type) {
      case "enemy":
      case "item":
        return info.id || "";
      case "mapBlock":
        return info.idnum !== undefined ? String(info.idnum) : "";
      default:
        return "";
    }
  }
}

// 导出单例
export const prefabService = new PrefabServiceImpl();

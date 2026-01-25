/**
 * locService - 地图选点业务逻辑
 *
 * 基于 floorService 处理特定位置的数据
 * loc 数据是楼层文件的一部分，包括：
 * - events: 事件
 * - autoEvent: 自动事件
 * - changeFloor: 楼层切换
 * - beforeBattle: 战前事件
 * - afterBattle: 战后事件
 * - afterGetItem: 获取道具后事件
 * - afterOpenDoor: 开门后事件
 * - cannotMove: 不可移动点
 */

import { floorService } from "@/services/floor";
import type { Action } from "@/utils/action";
import type { LocPos } from "@/stores/locState";

/**
 * Loc 数据字段（楼层文件中与位置相关的字段）
 */
export const LOC_FIELDS = [
  "events",
  "autoEvent",
  "changeFloor",
  "beforeBattle",
  "afterBattle",
  "afterGetItem",
  "afterOpenDoor",
  "cannotMove",
] as const;

export type LocField = (typeof LOC_FIELDS)[number];

/**
 * Loc 数据（某个位置的所有事件数据）
 */
export type LocData = {
  [K in LocField]?: unknown;
};

/**
 * locService - 地图选点服务
 */
class LocServiceImpl {
  /**
   * 获取指定位置的 loc 数据
   *
   * 从当前楼层数据中提取指定位置的所有 loc 字段
   *
   * @param floorId - 楼层 ID
   * @param pos - 位置坐标
   * @returns LocData 对象
   */
  getLocData(floorId: string, pos: LocPos): LocData {
    const floorData = floorService.getFloor(floorId);
    const locKey = `${pos.x},${pos.y}`;
    const locData: LocData = {};

    for (const field of LOC_FIELDS) {
      const fieldData = floorData[field as keyof typeof floorData];
      if (fieldData && typeof fieldData === "object" && locKey in fieldData) {
        locData[field] = (fieldData as Record<string, unknown>)[locKey];
      } else {
        locData[field] = null;
      }
    }

    return locData;
  }

  /**
   * 保存 loc 数据修改
   *
   * 将 action 转换为楼层级别的 action 并保存
   *
   * @param floorId - 楼层 ID
   * @param pos - 位置坐标
   * @param actions - 修改操作列表
   *
   * @example
   * // 修改 events
   * locService.saveLocData('MT1', { x: 5, y: 5 }, [
   *   ['change', "['events']", { ... }]
   * ]);
   */
  saveLocData(floorId: string, pos: LocPos, actions: Action[]): void {
    if (actions.length === 0) return;

    const locKey = `${pos.x},${pos.y}`;

    // 将 loc 级别的 action 转换为 floor 级别的 action
    const floorActions: Action[] = actions.map((action) => {
      const [type, path, value] = action;

      // 处理 autoEvent 的特殊路径格式
      // autoEvent 的路径格式是 ['autoEvent']['pageId']
      // 需要转换为 ['autoEvent']['x,y']['pageId']
      if (/\['autoEvent'\]\['\d+'\]$/.test(path)) {
        const newPath = path.replace(
          /\['\d+'\]$/,
          (v) => `['${locKey}']${v}`
        );
        return [type, newPath, value] as Action;
      }

      // 普通字段：添加位置索引
      // ['events'] -> ['events']['x,y']
      return [type, `${path}['${locKey}']`, value] as Action;
    });

    floorService.saveFloor(floorId, floorActions);
  }

  /**
   * 添加自动事件页
   *
   * 在指定位置添加新的自动事件页
   *
   * @param floorId - 楼层 ID
   * @param pos - 位置坐标
   * @returns 新页面的 ID
   */
  addAutoEventPage(floorId: string, pos: LocPos): string {
    const locKey = `${pos.x},${pos.y}`;
    const floorData = floorService.getFloor(floorId);

    // 获取当前位置的 autoEvent
    const autoEventAtLoc =
      (floorData.autoEvent as Record<string, Record<string, unknown>>)?.[
        locKey
      ] ?? {};

    // 找到下一个可用的页面 ID（从 2 开始）
    let newPageId = 2;
    while (Object.prototype.hasOwnProperty.call(autoEventAtLoc, newPageId)) {
      newPageId++;
    }

    const newPageIdStr = String(newPageId);

    // 创建新的自动事件页
    const action: Action = [
      "add",
      `['autoEvent']['${locKey}']['${newPageIdStr}']`,
      null,
    ];

    floorService.saveFloor(floorId, [action]);

    return newPageIdStr;
  }

  /**
   * 获取 floor handler 用于 Suspense
   *
   * @param floorId - 楼层 ID
   * @returns FloorDataHandler
   */
  getHandler(floorId: string) {
    return floorService.getHandler(floorId);
  }
}

export const locService = new LocServiceImpl();

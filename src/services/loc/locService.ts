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
import { locCommands } from "@/project/commands";
import type { CommandResult } from "@/project/commands";
import { getLocDataFromFloor, LOC_FIELDS, type LocData, type LocField } from "@/project/model/locModel";

/**
 * Loc 数据字段（楼层文件中与位置相关的字段）
 */
export { LOC_FIELDS, type LocData, type LocField };

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
    return getLocDataFromFloor(floorData, pos);
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
  saveLocData(floorId: string, pos: LocPos, actions: Action[]): Promise<CommandResult> {
    if (actions.length === 0) return Promise.resolve({ ok: true });

    return locCommands.patch(floorId, pos, actions);
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
  addAutoEventPage(floorId: string, pos: LocPos): Promise<CommandResult & { pageId?: string }> {
    return locCommands.addAutoEventPage(floorId, pos);
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

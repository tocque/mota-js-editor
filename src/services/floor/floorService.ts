/**
 * floorService - 楼层业务逻辑核心
 * 
 * 提供命令式 API 供 Agent、脚本、测试使用
 * 不依赖 React，可在任何 JavaScript 环境使用
 * 
 * 核心理念：
 * - 内存是真实数据源，文件只是持久化副本
 * - 命令式 API 为基底（Agent/脚本/测试可用）
 * - 支持细粒度订阅（使用 computed 创建派生 signal）
 */

import { produce } from "immer";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import type { Content } from "@/fs";
import { applyActions, type Action } from "@/utils/action";

export type { Action };
import { serializeToJsMapFile } from "@/utils/serialize";
import type { FloorData } from "@/types";
import { towerService } from "@/services/tower";
import { FloorDataHandler } from "./FloorDataHandler";

/** 楼层文件路径前缀 */
const FLOOR_FILE_PREFIX = "project/floors/";

/**
 * 创建楼层选项
 */
export interface CreateFloorOptions {
  /** 楼层标题 */
  title?: string;
  /** 楼层名称 */
  name?: string;
  /** 地图宽度 */
  width?: number;
  /** 地图高度 */
  height?: number;
  /** 是否可以飞到此楼层 */
  canFlyTo?: boolean;
  /** 是否可以从此楼层飞出 */
  canFlyFrom?: boolean;
}

/**
 * 批量修改配置
 */
export interface BatchSaveChange {
  floorId: string;
  actions: Action[];
}



/**
 * 生成初始楼层数据
 */
function generateInitialFloorData(
  floorId: string,
  options: CreateFloorOptions = {}
): FloorData {
  const width = options.width ?? 13;
  const height = options.height ?? 13;
  
  // 创建空地图（全0）
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

/**
 * 格式化地图数组为字符串（用于序列化）
 * 
 * 将二维数组格式化为易读的字符串形式，每行对齐
 * 
 * @param mapArr - 二维数组（地图数据）
 * @param trySimplify - 是否尝试简化（全0数组返回空字符串）
 * @returns 格式化后的字符串
 * 
 * @example
 * const map = [[0, 1, 2], [3, 4, 5]];
 * formatMap(map);
 * // 返回:
 * //     [   0,   1,   2],
 * //     [   3,   4,   5]
 */
export function formatMap(mapArr: number[][], trySimplify = false): string {
  // 空数组检查
  if (!mapArr || mapArr.length === 0 || mapArr[0]?.length === 0) {
    return '';
  }

  // 尝试简化：检查是否是全0数组
  if (trySimplify) {
    const isAllZero = mapArr.every(row => row.every(cell => cell === 0));
    if (isAllZero) {
      return '';
    }
  }

  // 格式化二维数组
  const height = mapArr.length;
  const width = mapArr[0].length;
  const lines: string[] = [];

  for (let i = 0; i < height; i++) {
    const row = mapArr[i];
    const cells: string[] = [];

    for (let j = 0; j < width; j++) {
      const num = row[j];
      // 右对齐，最少4个字符宽度
      const numStr = String(num);
      const padding = ' '.repeat(Math.max(4 - numStr.length, 0));
      cells.push(padding + numStr);
    }

    // 组装行：'    [   0,   1,   2],'
    const line = '    [' + cells.join(',') + ']' + (i === height - 1 ? '' : ',');
    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * 序列化楼层数据为文件内容（用于 createFloor）
 */
function stringifyFloorDataForCreate(data: FloorData): string {
  return serializeToJsMapFile(data.floorId, data);
}

/**
 * 获取楼层文件路径
 */
function getFloorPath(floorId: string): string {
  return `${FLOOR_FILE_PREFIX}${floorId}.js`;
}

/**
 * floorService - 楼层服务（命令式 API）
 */
class FloorServiceImpl {
  // DataHandler 缓存（每个 floorId 一个）
  private dataHandlers = new Map<string, FloorDataHandler>();

  /**
   * 获取或创建 DataHandler
   */
  private getDataHandler(floorId: string): FloorDataHandler {
    if (!this.dataHandlers.has(floorId)) {
      const fileHandler = FileHandlerManager.get(getFloorPath(floorId));
      this.dataHandlers.set(
        floorId,
        new FloorDataHandler(fileHandler, floorId),
      );
    }
    return this.dataHandlers.get(floorId)!;
  }

  /**
   * 获取楼层数据（load 模式：抛出异常）
   * 
   * 保证返回数据，如果加载失败则抛出异常
   * 
   * 注意：调用者需要先确保文件已加载
   * 
   * @example
   * // 在模块顶层或组件初始化时加载
   * await FileHandlerManager.load('project/floors/MT1.js');
   * 
   * // 然后使用（同步）
   * try {
   *   const data = floorService.getFloor('MT1');
   *   console.log(data.title);
   * } catch (err) {
   *   console.error('加载失败:', err);
   * }
   */
  getFloor(floorId: string): FloorData {
    return this.getDataHandler(floorId).unwrap();
  }

  /**
   * 获取楼层数据（Content 模式：返回所有状态）
   * 
   * 返回 Content<FloorData>，包含所有可能的状态
   * 
   * @example
   * const content = floorService.getFloorContent('MT1');
   * match(content)
   *   .with({ status: 'loaded' }, (c) => console.log(c.value.title))
   *   .with({ status: 'loading' }, () => console.log('Loading...'))
   *   .otherwise(() => {});
   */
  getFloorContent(floorId: string): Content<FloorData> {
    return this.getDataHandler(floorId).getContent();
  }

  /**
   * 获取 DataHandler（用于直接访问 signal）
   * 
   * 返回数据层的 DataHandler，可以直接访问 signal 或订阅变化
   * 
   * @example
   * // 非 React 环境：直接访问 signal
   * const handler = floorService.getHandler('MT1');
   * const content = handler.content();
   * 
   * // 订阅变化
   * const dispose = handler.subscribe(content => {
   *   console.log('content changed:', content);
   * });
   */
  getHandler(floorId: string) {
    return this.getDataHandler(floorId);
  }

  /**
   * 保存楼层修改
   * 
   * 应用 actions 到楼层数据，立即更新内存并异步落盘
   * 
   * 使用 immer 保证不可变性，避免直接修改原数据
   * 
   * 注意：调用者需要先确保文件已加载
   * 
   * @example
   * floorService.saveFloor('MT1', [
   *   ['change', "['title']", '新标题']
   * ]);
   */
  saveFloor(floorId: string, actions: Action[]): void {
    if (actions.length === 0) {
      return;
    }

    // 使用 handler.update() 的转换函数模式 + immer
    // immer 会自动处理结构共享，只克隆修改的部分
    this.getDataHandler(floorId).update((currentData) =>
      produce(currentData, (draft) => {
        applyActions(draft as Record<string, unknown>, actions);
      })
    );
  }

  /**
   * 批量修改多个楼层
   * 
   * 并行修改多个楼层，每个楼层的写入是串行的
   * 
   * @example
   * floorService.batchSave([
   *   { floorId: 'MT1', actions: [{ type: 'change', path: ['title'], value: 'A' }] },
   *   { floorId: 'MT2', actions: [{ type: 'change', path: ['title'], value: 'B' }] }
   * ]);
   */
  batchSave(changes: BatchSaveChange[]): void {
    changes.forEach((change) => this.saveFloor(change.floorId, change.actions));
  }

  /**
   * 创建新楼层
   * 
   * 生成初始数据，创建文件，添加到 floorIds
   * 
   * @example
   * await floorService.createFloor('MT10', {
   *   title: '主塔10层',
   *   width: 15,
   *   height: 15
   * });
   */
  async createFloor(
    floorId: string,
    options: CreateFloorOptions = {}
  ): Promise<void> {
    const path = getFloorPath(floorId);
    
    // 检查文件是否已存在
    const exists = await FileHandlerManager.exists(path);
    if (exists) {
      throw new Error(`Floor ${floorId} already exists`);
    }
    
    // 生成初始数据
    const floorData = generateInitialFloorData(floorId, options);
    const content = stringifyFloorDataForCreate(floorData);
    
    // 通过 FileHandler 创建文件（idle 状态下 update 会创建新文件）
    const handler = FileHandlerManager.get(path);
    handler.update(content);
    
    // 添加到 floorIds（使用 towerService）
    towerService.addFloorId(floorId);
    
    // 等待持久化完成
    await handler.waitForIdle();
  }

  /**
   * 批量创建楼层
   * 
   * @example
   * await floorService.batchCreateFloors(['MT10', 'MT11', 'MT12'], {
   *   width: 15,
   *   height: 15
   * });
   */
  async batchCreateFloors(
    floorIds: string[],
    options: CreateFloorOptions = {}
  ): Promise<void> {
    for (const floorId of floorIds) {
      await this.createFloor(floorId, options);
    }
  }

  /**
   * 重命名楼层
   * 
   * 用新 floorId 保存楼层，删除旧文件，更新 floorIds
   * 
   * 注意：此方法不处理 legacy 状态（core.floors、editor.currentFloorId 等），
   * 这些应该由 UI 层处理。
   * 
   * @example
   * await floorService.renameFloor('MT1', 'MT1_new');
   */
  async renameFloor(oldFloorId: string, newFloorId: string): Promise<void> {
    const oldPath = getFloorPath(oldFloorId);
    const newPath = getFloorPath(newFloorId);
    
    // 检查新文件是否已存在
    const exists = await FileHandlerManager.exists(newPath);
    if (exists) {
      throw new Error(`Floor ${newFloorId} already exists`);
    }
    
    // 获取当前楼层数据
    const floorData = this.getFloor(oldFloorId);
    
    // 更新 floorId 字段
    const newFloorData = produce(floorData, (draft) => {
      draft.floorId = newFloorId;
    });
    
    // 用新 floorId 创建新文件
    const content = serializeToJsMapFile(newFloorId, newFloorData);
    const newHandler = FileHandlerManager.get(newPath);
    newHandler.update(content);
    await newHandler.waitForIdle();
    
    // 删除旧文件
    await FileHandlerManager.delete(oldPath);
    
    // 更新 floorIds（使用 towerService）
    towerService.renameFloorId(oldFloorId, newFloorId);
    
    // 清理 DataHandler 缓存
    this.dataHandlers.delete(oldFloorId);
  }

  /**
   * 删除楼层
   * 
   * 删除文件，从 floorIds 移除，清理 handler
   * 
   * @example
   * await floorService.deleteFloor('MT10');
   */
  async deleteFloor(floorId: string): Promise<void> {
    const path = getFloorPath(floorId);
    
    // 删除文件（FileHandlerManager 会处理 handler 清理）
    await FileHandlerManager.delete(path);
    
    // 从 floorIds 移除（使用 towerService）
    towerService.removeFloorId(floorId);
    
    // 清理 DataHandler 缓存
    this.dataHandlers.delete(floorId);
  }

  /**
   * 重新加载楼层数据（从文件重新读取）
   * 
   * @example
   * await floorService.refetch('MT1');
   */
  async refetch(floorId: string): Promise<void> {
    const path = getFloorPath(floorId);
    return FileHandlerManager.reload(path);
  }

  /**
   * 预览变更后的内容（不实际写入）
   * 
   * 使用 immer 保证不修改原数据
   * 
   * @example
   * const preview = floorService.previewChanges('MT1', [
   *   ['change', "['title']", '新标题']
   * ]);
   * console.log(preview.title); // '新标题'
   */
  previewChanges(floorId: string, actions: Action[]): FloorData {
    // 获取当前数据
    const currentData = this.getFloor(floorId);
    
    // 使用 immer 创建草稿并应用 actions
    return produce(currentData, (draft) => {
      applyActions(draft as Record<string, unknown>, actions);
    });
  }
}

// 导出单例
export const floorService = new FloorServiceImpl();


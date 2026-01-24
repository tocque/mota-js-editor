/**
 * coreFloorsSync - 遗留兼容层
 * 
 * 职责：保持 core.floors 与 FileHandler 同步，供未重构模块使用
 * 
 * 工作原理：
 * 1. 订阅所有楼层文件的 FileHandler 变更
 * 2. 文件变更时，解析内容并同步到 core.floors
 * 3. 同步更新（无延迟）- signal 自动触发 effect
 * 
 * 数据流：
 * floorService.saveFloor()
 *     │
 *     ▼
 * FileHandler.update()
 *     │
 *     ├─→ UI 组件更新 (useFloorData)
 *     │
 *     └─→ coreFloorsSync 订阅
 *             │
 *             ▼
 *         core.floors[floorId] = data
 *         (遗留代码可继续使用)
 * 
 * 未来：完全重构后可删除此模块
 */

import { effect } from "alien-signals";
import { floorService } from "./floorService";
import { ContentUtils } from "@/fs/ContentUtils";

/** 订阅清理函数映射 */
const subscriptions = new Map<string, () => void>();

/** 是否已启动同步 */
let isSetup = false;

/**
 * 启动 core.floors 同步
 * 
 * 为所有已存在的楼层建立同步
 * 
 * @example
 * setupCoreFloorsSync();
 */
export function setupCoreFloorsSync(): void {
  if (isSetup) {
    console.warn('coreFloorsSync already setup');
    return;
  }
  
  isSetup = true;
  
  // 为所有现有楼层建立同步
  if (typeof core !== 'undefined' && core.floorIds) {
    core.floorIds.forEach(floorId => {
      addFloorSync(floorId);
    });
  }
}

/**
 * 为新创建的楼层添加同步
 * 
 * 订阅 FileHandler，当数据变化时同步到 core.floors
 * 
 * @example
 * addFloorSync('MT10');
 */
export function addFloorSync(floorId: string): void {
  // 避免重复订阅
  if (subscriptions.has(floorId)) {
    return;
  }
  
  // 检查 core 是否存在
  if (typeof core === 'undefined') {
    console.warn('core is not defined, skipping floor sync');
    return;
  }
  
  // 获取 DataHandler
  const handler = floorService.getHandler(floorId);
  
  // 使用 effect 订阅 signal 变化
  // effect 会自动追踪依赖，当 handler.content 变化时触发
  const dispose = effect(() => {
    // 调用 computed signal 获取当前值
    const content = handler.content();
    
    // 只在成功加载时同步
    if (content && ContentUtils.isLoaded(content)) {
      // 同步更新 core.floors（无延迟）
      core.floors[floorId] = content.value as unknown as ResolvedMap;
    }
  });
  
  // 保存清理函数
  subscriptions.set(floorId, dispose);
}

/**
 * 移除楼层同步
 * 
 * 取消订阅，清理 core.floors
 * 
 * @example
 * removeFloorSync('MT10');
 */
export function removeFloorSync(floorId: string): void {
  // 取消订阅
  const dispose = subscriptions.get(floorId);
  if (dispose) {
    dispose();
    subscriptions.delete(floorId);
  }
  
  // 清理 core.floors
  if (typeof core !== 'undefined' && core.floors) {
    delete core.floors[floorId];
  }
}

/**
 * 停止所有同步
 * 
 * 取消所有订阅，清理资源
 * 
 * @example
 * stopCoreFloorsSync();
 */
export function stopCoreFloorsSync(): void {
  // 取消所有订阅
  subscriptions.forEach(dispose => dispose());
  subscriptions.clear();
  
  isSetup = false;
}

/**
 * LocState - 地图选点状态
 *
 * 使用 @tanstack/store 管理当前选中的位置信息，
 * 提供响应式的状态订阅机制。
 */

import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

export interface LocPos {
  x: number;
  y: number;
}

interface LocState {
  /** 当前选中的位置 */
  currentPos: LocPos | null;
}

/**
 * 地图选点状态 Store
 *
 * 初始值为 null，在 editor_mode.loc 被调用时更新
 */
export const locStateStore = new Store<LocState>({
  currentPos: null,
});

/**
 * 设置当前选中的位置
 *
 * 在 editor_mode.loc 中调用
 */
export function setCurrentLocPos(pos: LocPos | null): void {
  locStateStore.setState((state) => ({
    ...state,
    currentPos: pos,
  }));
}

/**
 * 获取当前选中位置的 Hook
 *
 * 自动订阅状态变化，当 currentPos 变化时触发重渲染
 */
export function useCurrentLocPos(): LocPos | null {
  return useStore(locStateStore, (state) => state.currentPos);
}

/**
 * 获取当前选中位置（非 Hook 版本）
 *
 * 用于非 React 环境
 */
export function getCurrentLocPos(): LocPos | null {
  return locStateStore.state.currentPos;
}

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

export interface LocSelection {
  floorId?: string;
  pos: LocPos;
}

interface LocState {
  /** 当前选中的地图游标 */
  currentSelection: LocSelection | null;
  /** @deprecated Use currentSelection instead. */
  currentPos: LocPos | null;
}

/**
 * 地图选点状态 Store
 *
 * 初始值为 null，在 editor_mode.loc 被调用时更新
 */
export const locStateStore = new Store<LocState>({
  currentSelection: null,
  currentPos: null,
});

/**
 * 设置当前选中的位置
 *
 * 在 editor_mode.loc 中调用
 */
export function setCurrentLocPos(pos: LocPos | null, floorId?: string): void {
  locStateStore.setState((state) => ({
    ...state,
    currentSelection: pos
      ? {
          floorId: floorId ?? state.currentSelection?.floorId,
          pos,
        }
      : null,
    currentPos: pos,
  }));
}

/**
 * 更新当前游标所在楼层，保留已选中的坐标。
 */
export function setCurrentLocFloorId(floorId: string): void {
  locStateStore.setState((state) => ({
    ...state,
    currentSelection: state.currentSelection
      ? { ...state.currentSelection, floorId }
      : null,
  }));
}

/**
 * 获取当前地图游标 Hook。
 */
export function useCurrentLocSelection(): LocSelection | null {
  return useStore(locStateStore, (state) => state.currentSelection);
}

/**
 * 获取当前选中位置的 Hook
 *
 * 自动订阅状态变化，当 currentPos 变化时触发重渲染
 */
export function useCurrentLocPos(): LocPos | null {
  return useStore(locStateStore, (state) => state.currentSelection?.pos ?? state.currentPos);
}

/**
 * 获取当前选中位置（非 Hook 版本）
 *
 * 用于非 React 环境
 */
export function getCurrentLocPos(): LocPos | null {
  return locStateStore.state.currentSelection?.pos ?? locStateStore.state.currentPos;
}

/**
 * 获取当前地图游标（非 Hook 版本）。
 */
export function getCurrentLocSelection(): LocSelection | null {
  return locStateStore.state.currentSelection;
}

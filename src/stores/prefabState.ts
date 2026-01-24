/**
 * PrefabState - 图块选择状态
 *
 * 使用 @tanstack/store 管理当前选中的图块信息，
 * 提供响应式的状态订阅机制。
 */

import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import type { PrefabInfo } from "@/services/prefab";

interface PrefabState {
  /** 当前选中的图块信息 */
  currentPrefabInfo: PrefabInfo | null;
}

/**
 * 图块状态 Store
 *
 * 初始值为 null，在 editor_mode.enemyitem 被调用时更新
 */
export const prefabStateStore = new Store<PrefabState>({
  currentPrefabInfo: null,
});

/**
 * 设置当前选中的图块信息
 *
 * 在 editor_mode.enemyitem 中调用
 */
export function setCurrentPrefabInfo(info: PrefabInfo | null): void {
  prefabStateStore.setState((state) => ({
    ...state,
    currentPrefabInfo: info,
  }));
}

/**
 * 获取当前选中的图块信息的 Hook
 *
 * 自动订阅状态变化，当 currentPrefabInfo 变化时触发重渲染
 */
export function useCurrentPrefabInfo(): PrefabInfo | null {
  return useStore(prefabStateStore, (state) => state.currentPrefabInfo);
}

/**
 * 获取当前选中图块信息（非 Hook 版本）
 *
 * 用于非 React 环境
 */
export function getCurrentPrefabInfo(): PrefabInfo | null {
  return prefabStateStore.state.currentPrefabInfo;
}

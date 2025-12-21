import { DataStore } from '../stores/DataStore';
import type { DoubleClickMode, FieldConfig, FieldType } from '../types';

/**
 * useTableCallbacks 返回类型
 */
export interface UseTableCallbacksReturn {
  /** 值变更回调 */
  onValueChange: (field: string, value: unknown) => void;
  /** 添加项回调 */
  onAddItem: (field: string, id: string) => void;
  /** 删除项回调 */
  onDeleteItem: (field: string) => void;
  /** 编辑按钮点击回调，guid 用于外部编辑器定位 DOM 元素 */
  onEditClick: (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void;
  /** 双击模式：'change' 编辑 | 'add' 添加 | 'delete' 删除 */
  doubleClickMode: DoubleClickMode;
}

/**
 * useTableCallbacks Hook - 获取表格操作回调
 *
 * 从 DataStore 读取回调函数，供子组件使用。
 *
 * @returns { onValueChange, onAddItem, onDeleteItem, onEditClick, doubleClickMode }
 *
 * @example
 * ```tsx
 * const { onValueChange, onAddItem, onDeleteItem, onEditClick, doubleClickMode } = useTableCallbacks();
 *
 * // 修改值
 * onValueChange("['main']['floorIds']", ['floor1', 'floor2']);
 *
 * // 添加新项
 * onAddItem("['enemies']", 'newEnemy');
 *
 * // 删除项
 * onDeleteItem("['enemies']['oldEnemy']");
 *
 * // 编辑按钮点击
 * onEditClick("['main']['events']", 'event', config, 'guid-123');
 *
 * // 检查双击模式
 * if (doubleClickMode === 'change') { ... }
 * ```
 */
export function useTableCallbacks(): UseTableCallbacksReturn {
  const { onValueChange, onAddItem, onDeleteItem, onEditClick, doubleClickMode } = DataStore.useStore();

  return {
    onValueChange,
    onAddItem,
    onDeleteItem,
    onEditClick,
    doubleClickMode,
  };
}

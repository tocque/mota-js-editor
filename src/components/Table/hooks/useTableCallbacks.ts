import { DataStore } from '../stores/DataStore';
import type { FieldConfig, FieldType } from '../types';

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
  /** 编辑按钮点击回调 */
  onEditClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
  /** 双击行回调 */
  onDoubleClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
}

/**
 * useTableCallbacks Hook - 获取表格操作回调
 *
 * 从 DataStore 读取回调函数，供子组件使用。
 *
 * @returns { onValueChange, onAddItem, onDeleteItem, onEditClick, onDoubleClick }
 *
 * @example
 * ```tsx
 * const { onValueChange, onAddItem, onDeleteItem, onEditClick, onDoubleClick } = useTableCallbacks();
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
 * onEditClick("['main']['events']", 'event', config);
 *
 * // 双击行
 * onDoubleClick("['main']['events']", 'event', config);
 * ```
 */
export function useTableCallbacks(): UseTableCallbacksReturn {
  const { onValueChange, onAddItem, onDeleteItem, onEditClick, onDoubleClick } = DataStore.useStore();

  return {
    onValueChange,
    onAddItem,
    onDeleteItem,
    onEditClick,
    onDoubleClick,
  };
}

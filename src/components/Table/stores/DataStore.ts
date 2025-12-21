import { useMemo } from 'react';
import { createStore } from '@/utils/store/store';
import { noop } from '@/utils/empty';
import type { CommentObject, FieldConfig, FieldType, TableNode } from '../types';
import { buildTableTree } from '../utils/traversal';

/**
 * DataStore - 管理表格数据状态和回调
 *
 * 使用 ParameterfulStore 模式，接收 data、commentObj 和回调函数作为参数。
 * 构建表格树结构并暴露回调供子组件使用。
 */

/** DataStore Provider 的参数 */
export interface DataStoreArgument {
  /** 数据对象 */
  data: Record<string, unknown>;
  /** 注释配置对象 */
  commentObj: CommentObject;
  /** 值变更回调 */
  onValueChange?: (field: string, value: unknown) => void;
  /** 添加项回调 */
  onAddItem?: (field: string, id: string) => void;
  /** 删除项回调 */
  onDeleteItem?: (field: string) => void;
  /** 编辑按钮点击回调 - 用于外部编辑器集成 */
  onEditClick?: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
  /** 双击行回调 - 用于外部编辑器集成 */
  onDoubleClick?: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
}

export interface DataStoreValue {
  /** 表格节点树结构 */
  rootNodes: TableNode[];
  /** 所有可折叠的字段路径（gap 行） */
  gapFields: string[];
  /** 值变更回调，供子组件使用 */
  onValueChange: (field: string, value: unknown) => void;
  /** 添加项回调，供子组件使用 */
  onAddItem: (field: string, id: string) => void;
  /** 删除项回调，供子组件使用 */
  onDeleteItem: (field: string) => void;
  /** 编辑按钮点击回调，供子组件使用 */
  onEditClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
  /** 双击行回调，供子组件使用 */
  onDoubleClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
}

function useDataStore(argument: DataStoreArgument): DataStoreValue {
  const { data, commentObj, onValueChange, onAddItem, onDeleteItem, onEditClick, onDoubleClick } = argument;

  // 从 data 和 commentObj 构建表格树，使用 useMemo 避免重复构建
  const { rootNodes, gapFields } = useMemo(
    () => buildTableTree(data, commentObj),
    [data, commentObj],
  );

  // 提供稳定的回调引用，未提供时使用 noop
  const handleValueChange = useMemo(() => onValueChange ?? noop, [onValueChange]);

  const handleAddItem = useMemo(() => onAddItem ?? noop, [onAddItem]);

  const handleDeleteItem = useMemo(() => onDeleteItem ?? noop, [onDeleteItem]);

  const handleEditClick = useMemo(() => onEditClick ?? noop, [onEditClick]);

  const handleDoubleClick = useMemo(() => onDoubleClick ?? noop, [onDoubleClick]);

  return {
    rootNodes,
    gapFields,
    onValueChange: handleValueChange,
    onAddItem: handleAddItem,
    onDeleteItem: handleDeleteItem,
    onEditClick: handleEditClick,
    onDoubleClick: handleDoubleClick,
  };
}

export const DataStore = createStore(useDataStore);

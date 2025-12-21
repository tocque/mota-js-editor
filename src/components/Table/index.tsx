/**
 * Table Component Module
 *
 * 动态表格组件，根据数据对象和注释配置对象渲染可编辑的表格。
 * 用于替代原有的 editor_table.ts 实现。
 */

// 主组件
export { Table } from './components/Table';

// 类型导出
export type {
  // 核心类型
  TableProps,
  TableNode,
  CommentObject,
  FieldConfig,
  FieldType,
  FieldArgs,
  // 输入组件类型
  BaseInputProps,
  TextareaInputProps,
  SelectInputProps,
  CheckboxInputProps,
  CheckboxSetProps,
  SelectConfig,
  CheckboxSetConfig,
  // 行组件类型
  TableRowProps,
  GapRowProps,
  ActionButtonsProps,
  // Hook 类型
  UseFoldReturn,
  TableContextValue,
} from './types';

// Legacy 集成辅助函数导出
export {
  createValueChangeHandler,
  createAddItemHandler,
  createDeleteItemHandler,
  createEditClickHandler,
  type ValueChangeHandlerOptions,
  type EditClickHandlerOptions,
} from './legacy';

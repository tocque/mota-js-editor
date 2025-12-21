/**
 * Legacy Integration Module
 *
 * 外部集成辅助函数，用于与现有编辑器系统集成。
 * 这些函数在使用 Table 组件时传入，不耦合在组件内部。
 */

export {
  createValueChangeHandler,
  createAddItemHandler,
  createDeleteItemHandler,
  type ValueChangeHandlerOptions,
} from './valueChangeHandler';

// 内部使用的外部编辑器集成
export { openExternalEditor } from './externalEditor';

/**
 * valueChangeHandler.ts
 *
 * 外部集成辅助函数 - 值变更处理
 * 封装 editor_mode.addAction 和自动保存逻辑
 *
 * 这些函数在使用 Table 组件时传入，不耦合在组件内部。
 */

import type { EditorMode, PrinteFunc } from '@/types';
import type { FieldConfig } from '../types';
import { checkRange } from '../utils/validation';

/** createValueChangeHandler 的配置选项 */
export interface ValueChangeHandlerOptions {
  /** 自动保存，默认为 true */
  autoSave?: boolean;
  /** 保存成功后的回调 */
  onSaveSuccess?: () => void;
  /** 保存失败后的回调 */
  onSaveError?: (error: unknown) => void;
}

/**
 * 获取全局 editor_mode 对象
 */
function getEditorMode(): EditorMode | null {
  return typeof window !== 'undefined' ? window.editor_mode ?? null : null;
}

/**
 * 获取全局 printe 函数
 */
function getPrinte(): PrinteFunc | null {
  return typeof printe !== 'undefined' ? printe : null;
}

/**
 * 创建值变更处理函数
 *
 * 封装 editor_mode.addAction 和自动保存逻辑。
 * 返回的函数可以直接传递给 Table 组件的 onValueChange prop。
 *
 * @param options - 配置选项
 * @returns 值变更处理函数
 *
 * @example
 * ```tsx
 * const handleValueChange = createValueChangeHandler({
 *   autoSave: true,
 *   onSaveSuccess: () => console.log('Saved!'),
 * });
 *
 * <Table
 *   data={data}
 *   commentObj={commentObj}
 *   onValueChange={handleValueChange}
 * />
 * ```
 */
export function createValueChangeHandler(
  options: ValueChangeHandlerOptions = {},
): (field: string, value: unknown, config?: FieldConfig) => void {
  const { autoSave = true, onSaveSuccess, onSaveError } = options;

  return (field: string, value: unknown, config?: FieldConfig) => {
    const editorMode = getEditorMode();
    const printe = getPrinte();

    if (!editorMode) {
      console.warn('editor_mode not available, value change not dispatched');
      return;
    }

    // 如果提供了 config，进行范围验证
    if (config && !checkRange(config, value)) {
      printe?.(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
      return;
    }

    // 添加变更动作
    editorMode.addAction(['change', field, value]);

    // 自动保存
    if (autoSave) {
      try {
        editorMode.onmode('save', onSaveSuccess);
      } catch (error) {
        onSaveError?.(error);
      }
    }
  };
}

/**
 * 创建添加项处理函数
 *
 * 封装添加新项的逻辑，包括 ID 验证和 editor_mode.addAction。
 *
 * @param options - 配置选项
 * @returns 添加项处理函数
 */
export function createAddItemHandler(
  options: ValueChangeHandlerOptions = {},
): (field: string, id: string) => void {
  const { autoSave = true, onSaveSuccess, onSaveError } = options;

  return (field: string, id: string) => {
    const editorMode = getEditorMode();

    if (!editorMode) {
      console.warn('editor_mode not available, add action not dispatched');
      return;
    }

    // 构建新字段路径
    const newField = field + "['" + id + "']";

    // 添加动作
    editorMode.addAction(['add', newField, null]);

    // 自动保存
    if (autoSave) {
      try {
        editorMode.onmode('save', onSaveSuccess);
      } catch (error) {
        onSaveError?.(error);
      }
    }
  };
}

/**
 * 创建删除项处理函数
 *
 * 封装删除项的逻辑，包括验证和 editor_mode.addAction。
 *
 * @param options - 配置选项
 * @returns 删除项处理函数
 */
export function createDeleteItemHandler(
  options: ValueChangeHandlerOptions = {},
): (field: string, config?: FieldConfig) => void {
  const { autoSave = true, onSaveSuccess, onSaveError } = options;

  return (field: string, config?: FieldConfig) => {
    const editorMode = getEditorMode();
    const printe = getPrinte();

    if (!editorMode) {
      console.warn('editor_mode not available, delete action not dispatched');
      return;
    }

    // 如果提供了 config，检查是否允许删除（null 是否在范围内）
    if (config && !checkRange(config, null)) {
      printe?.(field + ' : 该值不允许为null，无法删除');
      return;
    }

    // 添加删除动作
    editorMode.addAction(['delete', field, undefined]);

    // 自动保存
    if (autoSave) {
      try {
        editorMode.onmode('save', onSaveSuccess);
      } catch (error) {
        onSaveError?.(error);
      }
    }
  };
}

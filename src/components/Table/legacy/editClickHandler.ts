/**
 * editClickHandler.ts
 *
 * 外部集成辅助函数 - 编辑按钮点击处理
 * 根据字段类型调用对应的外部编辑器
 *
 * 这些函数在使用 Table 组件时传入，不耦合在组件内部。
 */

import type { EditorBlockly, EditorMulti, Editor, OpenColorPickerFunc } from '@/types';
import type { FieldConfig, FieldType } from '../types';

/**
 * 获取全局 editor_blockly 对象
 */
function getEditorBlockly(): EditorBlockly | null {
  return typeof window !== 'undefined' ? window.editor_blockly ?? null : null;
}

/**
 * 获取全局 editor_multi 对象
 */
function getEditorMulti(): EditorMulti | null {
  return typeof window !== 'undefined' ? (window.editor_multi as EditorMulti | undefined) ?? null : null;
}

/**
 * 获取全局 editor 对象
 */
function getEditor(): Editor | null {
  return typeof window !== 'undefined' ? window.editor ?? null : null;
}

/**
 * 获取全局 openColorPicker 函数
 */
function getOpenColorPicker(): OpenColorPickerFunc | null {
  return typeof window !== 'undefined' ? window.openColorPicker ?? null : null;
}

/** createEditClickHandler 的配置选项 */
export interface EditClickHandlerOptions {
  /**
   * 获取当前输入元素的值
   * 用于 material、color、point 等需要当前值的编辑器
   */
  getValue?: (field: string) => unknown;
  /**
   * 设置输入元素的值并触发 onChange
   * 用于编辑器回调后更新值
   */
  setValue?: (field: string, value: unknown) => void;
  /**
   * 获取元素的边界框（用于 color picker 定位）
   */
  getBoundingRect?: (field: string) => DOMRect | null;
}


/**
 * 创建编辑按钮点击处理函数
 *
 * 根据字段类型调用对应的外部编辑器：
 * - event: 调用 editor_blockly.import
 * - textarea: 调用 editor_multi.import
 * - material: 调用 editor.uievent.selectMaterial
 * - color: 调用 openColorPicker
 * - point: 调用 editor.uievent.selectPoint
 * - popCheckboxSet: 调用 editor.uievent.popCheckboxSet
 *
 * @param options - 配置选项
 * @returns 编辑按钮点击处理函数，接收 field、type、config 和 guid 参数
 *
 * @example
 * ```tsx
 * const handleEditClick = createEditClickHandler({
 *   getValue: (field) => getValueFromStore(field),
 *   setValue: (field, value) => updateStore(field, value),
 * });
 *
 * <Table
 *   data={data}
 *   commentObj={commentObj}
 *   onEditClick={handleEditClick}
 * />
 * ```
 */
export function createEditClickHandler(
  options: EditClickHandlerOptions = {},
): (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void {
  const { getValue, setValue, getBoundingRect } = options;

  return (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => {

    switch (type) {
      case 'event': {
        const editorBlockly = getEditorBlockly();
        if (editorBlockly) {
          editorBlockly.import(guid, { type: config._event });
        } else {
          console.warn('editor_blockly not available');
        }
        break;
      }

      case 'textarea': {
        const editorMulti = getEditorMulti();
        if (editorMulti) {
          editorMulti.import(guid, {
            lint: config._lint,
            string: typeof config._string === 'boolean' ? config._string : undefined,
            template: config._template,
            preview: config._preview,
          });
        } else {
          console.warn('editor_multi not available');
        }
        break;
      }

      case 'material': {
        const editor = getEditor();
        if (editor && setValue) {
          const currentValue = getValue?.(field);
          const valueStr = currentValue != null ? JSON.stringify(currentValue) : '';

          editor.uievent.selectMaterial(
            valueStr,
            config._docs || (typeof config._data === 'string' ? config._data : '') || '请选择素材',
            config._directory,
            (one: string) => {
              if (!/^[-A-Za-z0-9_.]+$/.test(one)) return null;
              if (config._transform) {
                try {
                  return eval('(' + config._transform + ')(one)');
                } catch {
                  return one;
                }
              }
              return one;
            },
            (data: string) => {
              let newValue: unknown = data;
              if (config._onconfirm) {
                try {
                  newValue = eval('(' + config._onconfirm + ')(currentValue, data)');
                } catch {
                  // 保持 data 作为新值
                }
              }
              setValue(field, newValue);
            },
          );
        } else {
          console.warn('editor.uievent not available or setValue not provided');
        }
        break;
      }

      case 'color': {
        const openColorPicker = getOpenColorPicker();
        if (openColorPicker && setValue) {
          const rect = getBoundingRect?.(field);
          const x = rect?.x ?? 0;
          const y = rect ? rect.y + rect.height : 0;

          // 设置 colorPicker 的初始值
          const currentValue = getValue?.(field);
          if (currentValue != null && typeof document !== 'undefined') {
            const str = String(currentValue).replace(/[^\d.,]/g, '');
            if (/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(str)) {
              const colorPicker = document.getElementById('colorPicker') as HTMLInputElement | null;
              if (colorPicker) {
                colorPicker.value = str;
              }
            }
          }

          openColorPicker(x, y, (value: string) => {
            const cleanValue = value.replace(/[^\d.,]/g, '');
            setValue(field, JSON.parse('[' + cleanValue + ']'));
          });
        } else {
          console.warn('openColorPicker not available or setValue not provided');
        }
        break;
      }

      case 'point': {
        const editor = getEditor();
        if (editor && setValue) {
          let x = 0;
          let y = 0;
          const currentValue = getValue?.(field);

          if (currentValue != null) {
            try {
              const loc = currentValue as unknown[];
              if (Array.isArray(loc) && loc.length === 2) {
                x = Number(loc[0]) || 0;
                y = Number(loc[1]) || 0;
              }
            } catch {
              // 保持默认值
            }
          }

          editor.uievent.selectPoint(
            editor.currentFloorId,
            x,
            y,
            false,
            (_floorId: string, newX: number, newY: number) => {
              setValue(field, [newX, newY]);
            },
          );
        } else {
          console.warn('editor.uievent not available or setValue not provided');
        }
        break;
      }

      case 'popCheckboxSet': {
        const editor = getEditor();
        if (editor && setValue && config._checkboxSet) {
          const currentValue = getValue?.(field);
          const checkboxSetConfig =
            typeof config._checkboxSet === 'function' ? config._checkboxSet() : config._checkboxSet;

          editor.uievent.popCheckboxSet(
            currentValue,
            checkboxSetConfig,
            config._docs || (typeof config._data === 'string' ? config._data : '') || '请选择多选项',
            (value: unknown) => {
              setValue(field, value);
            },
          );
        } else {
          console.warn('editor.uievent not available or setValue/config._checkboxSet not provided');
        }
        break;
      }

      default:
        // 对于其他类型（select, checkbox, checkboxSet, disable），不需要外部编辑器
        break;
    }
  };
}


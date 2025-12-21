/**
 * externalEditor.ts
 *
 * 内置的外部编辑器集成
 * 根据字段类型调用对应的外部编辑器
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

/**
 * 打开外部编辑器
 *
 * 根据字段类型调用对应的外部编辑器：
 * - event: 调用 editor_blockly.import
 * - textarea: 调用 editor_multi.import
 * - material: 调用 editor.uievent.selectMaterial
 * - color: 调用 openColorPicker
 * - point: 调用 editor.uievent.selectPoint
 * - popCheckboxSet: 调用 editor.uievent.popCheckboxSet
 *
 * @param field - 字段路径
 * @param type - 字段类型
 * @param config - 字段配置
 * @param guid - DOM 元素 ID，用于外部编辑器定位
 * @param getValue - 获取字段值的函数
 * @param setValue - 设置字段值的函数
 */
export function openExternalEditor(
  field: string,
  type: FieldType | undefined,
  config: FieldConfig,
  guid: string,
  getValue: (field: string) => unknown,
  setValue: (field: string, value: unknown) => void,
): void {
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
      if (editor) {
        const currentValue = getValue(field);
        const valueStr = currentValue != null ? JSON.stringify(currentValue) : '';

        editor.uievent.selectMaterial(
          valueStr,
          config._docs || (typeof config._data === 'string' ? config._data : '') || '请选择素材',
          config._directory,
          (one: string) => {
            if (!/^[-A-Za-z0-9_.]+$/.test(one)) return null;
            if (config._transform) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-implied-eval
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
                // eslint-disable-next-line @typescript-eslint/no-implied-eval
                newValue = eval('(' + config._onconfirm + ')(currentValue, data)');
              } catch {
                // 保持 data 作为新值
              }
            }
            setValue(field, newValue);
          },
        );
      } else {
        console.warn('editor.uievent not available');
      }
      break;
    }

    case 'color': {
      const openColorPicker = getOpenColorPicker();
      if (openColorPicker) {
        // 通过 guid 获取元素位置
        const element = document.getElementById(guid);
        const rect = element?.getBoundingClientRect();
        const x = rect?.x ?? 0;
        const y = rect ? rect.y + rect.height : 0;

        // 设置 colorPicker 的初始值
        const currentValue = getValue(field);
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
        console.warn('openColorPicker not available');
      }
      break;
    }

    case 'point': {
      const editor = getEditor();
      if (editor) {
        let x = 0;
        let y = 0;
        const currentValue = getValue(field);

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
        console.warn('editor.uievent not available');
      }
      break;
    }

    case 'popCheckboxSet': {
      const editor = getEditor();
      if (editor && config._checkboxSet) {
        const currentValue = getValue(field);
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
        console.warn('editor.uievent not available or config._checkboxSet not provided');
      }
      break;
    }

    default:
      // 对于其他类型（select, checkbox, checkboxSet, disable），不需要外部编辑器
      break;
  }
}

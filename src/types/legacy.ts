/**
 * Legacy 编辑器类型定义
 * 用于与旧版编辑器系统集成的全局对象类型
 */

// ============== Editor Blockly ==============

/** Blockly 编辑器接口 */
export interface EditorBlockly {
  import: (guid: string, options: { type?: string }) => void;
}

// ============== Editor Multi ==============

/** 多行编辑器接口 */
export interface EditorMulti {
  import: (
    guid: string,
    options: { lint?: boolean; string?: boolean; template?: string; preview?: boolean },
  ) => void;
}

// ============== Editor UiEvent ==============

/** 编辑器 UI 事件接口 */
export interface EditorUiEvent {
  selectMaterial: (
    value: string,
    title: string,
    directory: string | undefined,
    transform: ((one: string) => string | null) | null,
    callback: (data: string) => void,
  ) => void;
  selectPoint: (
    floorId: string,
    x: number,
    y: number,
    allowOutside: boolean,
    callback: (floorId: string, x: number, y: number) => void,
  ) => void;
  popCheckboxSet: (
    value: unknown,
    config: { key: (string | number)[]; prefix: string[] } | (() => { key: (string | number)[]; prefix: string[] }),
    title: string,
    callback: (value: unknown) => void,
  ) => void;
  previewEditorMulti?: (preview: unknown, value: string) => void;
}

// ============== Editor ==============

/** 编辑器主对象接口 */
export interface Editor {
  isMobile?: boolean;
  mode: EditorMode;
  config?: {
    get?: (key: string, defaultValue: number) => number;
    set?: (key: string, value: number) => void;
  };
  uievent: EditorUiEvent;
  util?: {
    encode64?: (str: string) => string;
    decode64?: (str: string) => string;
  };
  currentFloorId: string;
}

// ============== Editor Mode ==============

/** 编辑器模式接口 */
export interface EditorMode {
  mode: string;
  doubleClickMode?: 'change' | 'add' | 'delete';
  addAction: (action: [string, string, unknown]) => void;
  onmode: (mode: string, callback?: () => void) => void;
  changeDoubleClickModeByButton: (mode: 'add' | 'delete') => void;
}

// ============== 全局函数类型 ==============

/** 颜色选择器函数类型 */
export type OpenColorPickerFunc = (x: number, y: number, callback: (value: string) => void) => void;

/** 打印函数类型 */
export type PrinteFunc = (msg: unknown) => void;
export type PrintfFunc = (msg: string) => void;
export type PrintiFunc = (msg: string) => void;

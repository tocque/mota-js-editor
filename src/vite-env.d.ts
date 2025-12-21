/// <reference types="vite/client" />
/// <reference types="codemirror" />
/// <reference types="tern" />

import type { fs as FsModule } from "@/services/fs";
import type {
  CoreType,
  FunctionsType,
  DataCommentType,
  Editor,
  EditorMode,
  EditorBlockly,
  OpenColorPickerFunc,
  PrinteFunc,
  PrintfFunc,
  PrintiFunc,
} from "@/types";
import type { EditorMultiApi } from "@/Workbench/CodeEditor/createLegacyApi";

// ============== 全局变量声明 ==============

declare global {
  /** 文件系统模块 */
  const fs: typeof FsModule;

  /** 游戏核心对象 */
  const core: CoreType;

  /** 编辑器对象 */
  const editor: Editor | undefined;

  /** 编辑器模式 */
  const editor_mode: EditorMode | undefined;

  /** 多行编辑器 API（由 React 组件暴露） */
  var editor_multi: EditorMultiApi | undefined;

  /** Blockly 编辑器 */
  const editor_blockly: EditorBlockly | undefined;

  /** 选择框控件 */
  const selectBox: { isSelected: (value: boolean) => void } | undefined;

  /** Functions 数据（使用 UUID 命名以避免冲突） */
  const functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a: FunctionsType;

  /** 数据注释（使用 UUID 命名以避免冲突） */
  const data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc: DataCommentType;

  /** Tern 定义数组（使用 UUID 命名以避免冲突） */
  const terndefs_f6783a0a_522d_417e_8407_94c67b692e50: Tern.Def[];

  // ============== 全局函数 ==============

  /** 打开颜色选择器 */
  const openColorPicker: OpenColorPickerFunc | undefined;

  /** 确认颜色选择 */
  function confirmColor(): void;

  /** 打印成功消息 */
  const printf: PrintfFunc;

  /** 打印错误消息 */
  const printe: PrinteFunc;

  /** 打印信息消息 */
  const printi: PrintiFunc;

  // ============== Window 扩展 ==============

  interface Window {
    core: CoreType;
    editor: Editor | undefined;
    editor_mode: EditorMode | undefined;
    editor_multi: EditorMultiApi | undefined;
    editor_blockly: EditorBlockly | undefined;
    openColorPicker: OpenColorPickerFunc | undefined;
    tern: typeof import("tern");
  }
}

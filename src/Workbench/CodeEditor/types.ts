/**
 * CodeEditor 类型定义
 */

import type { Editor, EditorFromTextArea } from "codemirror";
import type { ImportArgs, MultiLineCallback } from "./contexts";

/**
 * CodeMirror 编辑器实例类型
 */
export type CodeMirrorInstance = Editor | EditorFromTextArea;

/**
 * Legacy API 接口
 * 与原 editor_multi 对象保持兼容
 * 
 * 实际使用情况（仅保留被外部调用的 API）:
 * - id: editor_ui.ts 检查编辑器状态
 * - confirm: editor_ui.ts 保存时调用
 * - import: editor_table.ts 导入表格数据
 * - multiLineEdit: editor_blockly.ts 从 Blockly 编辑
 * - editCommentJs: 6个面板组件调用
 */
export interface EditorMultiApi {
  // 属性 (editor_ui.ts 使用)
  readonly id: string;

  // Table handler (editor_table.ts)
  import: (id: string, args: ImportArgs) => boolean;
  confirm: (keep?: boolean) => void;

  // Blockly handler (editor_blockly.ts)
  multiLineEdit: (
    value: string,
    b: unknown,
    f: unknown,
    args: { lint?: boolean },
    callback: MultiLineCallback
  ) => void;

  // File handler (各面板组件)
  editCommentJs: (mod: string) => void;
}

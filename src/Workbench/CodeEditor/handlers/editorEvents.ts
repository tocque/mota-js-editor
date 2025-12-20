/**
 * CodeMirror 编辑器事件处理
 *
 * 处理 cursorActivity 和 keyup 事件，用于自动补全和参数提示。
 */

import type { Editor } from "codemirror";
import type { TernServerInstance } from "../utils/createTernServer";

/**
 * 设置编辑器事件监听
 *
 * @param codeEditor - CodeMirror 编辑器实例
 * @param ternServer - Tern 服务器实例
 * @param getAutocomplete - 获取当前自动补全状态的函数
 */
export function setupEditorEvents(
  codeEditor: Editor,
  ternServer: TernServerInstance,
  getAutocomplete: () => boolean
): void {
  // 光标活动事件 - 更新参数提示和文档
  codeEditor.on("cursorActivity", (cm) => {
    const cursor = codeEditor.getCursor();
    if (getAutocomplete() && !(cursor.line === 0 && cursor.ch === 0)) {
      ternServer.updateArgHints(cm);
      ternServer.showDocs(cm);
    }
  });

  // 记录 Ctrl/Cmd 键释放时间，用于防止误触发补全
  let ctrlRelease = Date.now();

  // 键盘释放事件 - 触发自动补全
  codeEditor.on("keyup", (cm, event) => {
    if (!event) return;

    const now = Date.now();

    // 记录 Ctrl/Cmd 键释放时间
    if (event.keyCode === 17 || event.keyCode === 91) {
      // 17 = Ctrl, 91 = Cmd
      ctrlRelease = now;
      return;
    }

    // 自动补全触发条件：
    // 1. 自动补全已启用
    // 2. 没有按住 Ctrl
    // 3. 距离上次 Ctrl 释放超过 1 秒
    // 4. 按下的是字母键、点号或下划线
    if (
      getAutocomplete() &&
      !event.ctrlKey &&
      now - ctrlRelease >= 1000 &&
      ((event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
        (!event.shiftKey && event.keyCode === 190) || // .
        (event.shiftKey && event.keyCode === 189)) // _
    ) {
      try {
        ternServer.complete(cm);
      } catch {
        // 忽略补全错误
      }
    }
  });
}

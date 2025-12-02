import type { FC } from "react";

export const CodeEditor: FC = () => {
  return (
    <div id="left7" style={{ zIndex: -1, opacity: 0 }}>
      {/* 多行文本编辑器 */}
      <div>
        <button onClick={() => editor_multi.confirm()}>确认</button>
        <button onClick={() => editor_multi.cancel()}>取消</button>
        <button onClick={() => editor_multi.confirm(true)}>应用</button>
        <button onClick={() => editor_multi.format()}>格式化</button>
        <button id="editor_multi_preview" style={{ display: "none" }}>
          预览
        </button>
        <input
          type="checkbox"
          onClick={() => editor_multi.toggerLint()}
          id="lintCheckbox"
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        />
        <span style={{ verticalAlign: "middle", marginLeft: "-3px" }}>
          语法检查
        </span>
        <select
          id="codemirrorCommands"
          onChange={() => editor_multi.doCommand(this)}
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        />
        <span>字体大小</span>
        <input
          style={{ width: 40 }}
          type="number"
          onChange={() => editor_multi.setFontSize()}
          id="editor_multi_fontsize"
        />
        <span>字体加粗</span>
        <input
          style={{ width: 40 }}
          type="checkbox"
          onChange={() => editor_multi.setFontSize()}
          id="editor_multi_fontweight"
        />
      </div>
      <textarea id="multiLineCode" name="multiLineCode" defaultValue={""} />
    </div>
  );
}

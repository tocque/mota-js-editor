import type { FC } from "react";

export const EventsEditor: FC = () => {
  return (
    <div id="left6" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      <div style={{ position: "relative", height: "95%" }}>
        {/* eventsEditor */}
        <h3>
          事件编辑器 &nbsp;&nbsp;
          {/*
            <button onClick={() => editor_blockly.showXML()}>Show XML</button>
            <button onClick={() => editor_blockly.runCode()}>console.log(obj=code)</button>
            */}
          <button onClick={() => editor_blockly.confirm()}>确认</button>
          <button onClick={() => editor_blockly.confirm(true)}>应用</button>
          <button id="blocklyParse" onClick={() => editor_blockly.parse()}>
            解析
          </button>
          <button onClick={() => editor_blockly.cancel()}>取消</button>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginLeft: 10
            }}
          >
            <div className="searchLogo" />
            <input type="text" id="searchBlock" placeholder="搜索事件块..." />
          </div>
          <button
            className="cpPanel"
            onClick={() => editor_blockly.selectPointFromButton()}
            style={{ marginLeft: 5 }}
          >
            地图选点
          </button>
          <button
            className="cpPanel"
            onClick={() => editor.uievent.searchUsedFlags()}
            style={{ marginLeft: 5 }}
          >
            变量出现位置搜索
          </button>
          <input
            type="checkbox"
            className="cpPanel"
            id="blocklyReplace"
            onChange={() => editor_blockly.triggerReplace()}
            style={{ marginLeft: 10 }}
          />
          <span
            className="cpPanel"
            style={{ marginLeft: "-4px", fontSize: 13 }}
          >
            开启中文名替换
          </span>
          <input
            type="checkbox"
            className="cpPanel"
            id="blocklyExpandCompare"
            onChange={() => editor_blockly.triggerExpandCompare()}
            style={{ marginLeft: 10 }}
          />
          <span
            className="cpPanel"
            style={{ marginLeft: "-4px", fontSize: 13 }}
          >
            展开值块逻辑运算
          </span>
          <div
            dangerouslySetInnerHTML={{
              __html: `<xml id="toolbox" style="display:none"></xml>`
            }}
          ></div>
        </h3>
        <div style={{ position: "relative", height: "100%" }}>
          <div id="blocklyArea">
            <div id="blocklyDiv" />
          </div>
          <textarea id="codeArea" spellCheck="false" defaultValue={""} />
        </div>
      </div>
    </div>
  );
};

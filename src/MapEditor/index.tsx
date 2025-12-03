import { useEffect, useState, type FC } from "react";

export const MapEditor: FC = () => {
  const [tipMessage, setTipMessage] = useState('');
  const [tipClass, setTipClass] = useState('');

  const print = (msg: string, cls: string) => {
    if (msg === '') {
      setTipMessage('');
      setTipClass('');
      return;
    }
    setTipMessage(msg);
    setTipClass(cls);
  }

  useEffect(() => {
    window.printf = function (msg) {
        selectBox.isSelected(false);
        print(msg, 'successText');
    }
    window.printe = function (msg) {
        selectBox.isSelected(false);
        print(msg, 'warnText');
    }
    window.printi = function (msg) {
        print(msg, 'infoText');
    }
  }, []);

  return (
    <>
      <div id="mid">
        <table className="col" id="mapColMark" />
        <table className="row" id="mapRowMark" />
        <div className="map" id="mapEdit">
          <canvas className="gameCanvas" id="ebm" />
          <canvas className="gameCanvas" id="efg" />
          <canvas className="gameCanvas" id="eui" style={{ zIndex: 100 }} />
        </div>
        <div className="tools">
          <div id="tip">
            {tipMessage && <p className={tipClass}>{tipMessage}</p>}
          </div>
          <select id="editModeSelect" style={{ fontSize: 12 }}>
            <option value="map">地图编辑(Z)</option>
            <option value="loc">地图选点(X)</option>
            <option value="enemyitem">图块属性(C)</option>
            <option value="floor">楼层属性(V)</option>
            <option value="tower">全塔属性(B)</option>
            <option value="functions">脚本编辑(N)</option>
            <option value="appendpic">追加素材(M)</option>
            <option value="commonevent">公共事件(,)</option>
            <option value="plugins">插件编写(.)</option>
          </select>
          <span style={{ fontSize: 12 }}>
            <input
              type="checkbox"
              id="showMovable"
              style={{ marginLeft: 0, marginRight: 2 }}
            />
            通行度
          </span>
          <select id="editorTheme" style={{ marginLeft: 0, fontSize: 11 }}>
            <option value="editor_color">默认白</option>
            <option value="editor_color_dark">夜间黑</option>
          </select>
          <br />
          <span style={{ fontSize: 12 }}>
            <input
              type="radio"
              id="brushMod"
              name="brushMod"
              defaultValue="line"
              defaultChecked
            />
            线
            <input
              type="radio"
              id="brushMod2"
              name="brushMod"
              defaultValue="rectangle"
            />
            矩形
            <input
              type="radio"
              id="brushMod3"
              name="brushMod"
              defaultValue="tileset"
            />
            tile平铺
            <input
              type="radio"
              id="brushMod4"
              name="brushMod"
              defaultValue="fill"
            />
            填充
          </span>
          <br />
          <span style={{ fontSize: 12 }}>
            <input
              type="radio"
              id="layerMod2"
              name="layerMod"
              defaultValue="bgmap"
            />
            背景层
            <input
              type="radio"
              id="layerMod"
              name="layerMod"
              defaultValue="map"
              defaultChecked
              style={{ marginLeft: 5 }}
            />
            事件层
            <input
              type="radio"
              id="layerMod3"
              name="layerMod"
              defaultValue="fgmap"
              style={{ marginLeft: 5 }}
            />
            前景层
          </span>
          <br />
          <div id="viewportButtons" style={{ marginBottom: 7 }}>
            <input type="button" defaultValue="←" />
            <input type="button" defaultValue="↑" />
            <input type="button" defaultValue="↓" />
            <input type="button" defaultValue="→" />
            <input
              type="button"
              id="bigmapBtn"
              defaultValue="大地图"
              style={{ marginLeft: 5 }}
            />
          </div>
          <select id="selectFloor" style={{ marginBottom: 5 }} />
          <input type="button" defaultValue="选层" id="selectFloorBtn" />
          <input type="button" defaultValue="保存地图" id="saveFloor" />
          <input
            type="button"
            defaultValue="后退"
            id="undoFloor"
            style={{ display: "none" }}
          />
          <input type="button" defaultValue="帮助文档" id="openDoc" />
          <input
            type="button"
            defaultValue="前往游戏"
            onClick={() => window.open('./index.html', '_blank')}
          />
        </div>
      </div>
      <div id="mid2">
        <p style={{ margin: 10 }}>
          <span id="lastUsedTitle" />
          <small>（Ctrl+滚轮放缩，右键置顶）</small>{" "}
          <button id="clearLastUsedBtn">清除</button>
        </p>
        <div className="map" id="lastUsedDiv">
          <canvas
            id="lastUsed"
            className="gameCanvas"
            style={{ overflow: "hidden" }}
          />
        </div>
      </div>
      <div id="right">
        <div id="iconLib">
          <div id="iconImages" />
          <div id="selectBox">
            <div id="dataSelection" style={{ display: "none" }} />
          </div>
        </div>
        <button id="iconExpandBtn" />
      </div>
      <div id="menuDiv">
        <div id="midMenu" style={{ display: "none" }}>
          <div id="extraEvent" className="menuitem" style={{ display: "none" }}>
            <div className="menuitem-content" />
          </div>
          <div id="chooseThis" className="menuitem">
            <div className="menuitem-content">选中此点</div>
          </div>
          <div id="chooseInRight" className="menuitem">
            <div className="menuitem-content">在素材区选中此图块</div>
          </div>
          <div id="copyLoc" className="menuitem">
            <div className="menuitem-content">复制此事件</div>
          </div>
          <div id="pasteLoc" className="menuitem">
            <div className="menuitem-content">粘贴到此事件</div>
          </div>
          <div id="clearEvent" className="menuitem">
            <div className="menuitem-content">仅清空此点事件</div>
          </div>
          <div id="clearLoc" className="menuitem">
            <div className="menuitem-content">清空此点及事件</div>
          </div>
        </div>
      </div>
    </>
  );
}

import type { FC } from "react";

export const AppendPicPanel: FC = () => {

  return (
    <div id="left1" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      {/* appendpic */}
      <h3 className="leftTabHeader">追加素材</h3>
      <div className="leftTabContent">
        <p>
          <input
            id="selectFileBtn"
            type="button"
            defaultValue="导入文件到画板"
          />
          <select id="selectAppend" />
          {/* ["terrains", "animates", "enemys", "enemy48", "items", "npcs", "npc48"] */}
          <input id="appendConfirm" type="button" defaultValue="追加" />
          <input
            id="quickAppendConfirm"
            type="button"
            defaultValue="快速追加"
          />
          <span style={{ fontSize: 13 }}>&nbsp;&nbsp;自动注册</span>
          <input id="appendRegister" type="checkbox" defaultChecked />
        </p>
        <p>
          <small>
            从V2.7.1开始，你可以直接将素材图片拖到对应的素材区，将自动追加并注册。同时，4x4的道具素材已支持快速追加一次16个。
          </small>
        </p>
        <p>
          色相:
          <input
            id="changeColorInput"
            type="range"
            min={0}
            max={12}
            step={1}
            defaultValue={0}
            list="huelists"
            style={{ width: "60%", marginLeft: "3%", verticalAlign: "middle" }}
          />
          <datalist id="huelists" style={{ display: "none" }}>
            <option value={0} />
            <option value={1} />
            <option value={2}></option>
            <option value={3} />
            <option value={4} />
            <option value={5}></option>
            <option value={6} />
            <option value={7} />
            <option value={8}></option>
            <option value={9} />
            <option value={10} />
            <option value={11} />
            <option value={12}></option>
          </datalist>
        </p>
        <div
          id="appendPicCanvas"
          style={{ position: "relative", overflow: "auto", height: 470 }}
        >
          <canvas style={{ position: "absolute" }} />
          {/* 用于画出灰白相间背景 */}
          <canvas style={{ position: "absolute" }} />
          {/* 用于画出选中文件 */}
          <canvas style={{ position: "absolute", zIndex: 100 }} />
          {/* 用于响应鼠标点击 */}
          <canvas style={{ position: "absolute", display: "none" }} />
          {/* 画出追加后的sprite用于储存 */}
          <div id="appendPicSelection">
            <div className="appendSelection">
              <span style={{ top: 0, left: 2 }}>1</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 0, left: 14 }}>2</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 12, left: 2 }}>3</span>
            </div>
            <div className="appendSelection">
              <span style={{ top: 12, left: 14 }}>4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
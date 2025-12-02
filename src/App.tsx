import { useEffect, type FC } from "react";
import { setupEditor } from "./setupEditor";
import { Workbench } from "./Workbench";

const App: FC = () => {

  useEffect(() => {
    setupEditor();
  }, []);

  return (
    <>
      <link href="_server/css/editor.css" rel="stylesheet" />
      <link href="_server/thirdparty/awesomplete.css" rel="stylesheet" />
      <link id="color_css" rel="stylesheet" />

      <Workbench />
      {/* <script>/* */}
      <div id="gameInject" style={{ display: "none" }} />
      {/* UI预览 & 地图选点 */}
      <div id="uieventDiv" style={{ display: "none" }}>
        <div id="uieventDialog">
          <div id="uieventHead">
            <span id="uieventTitle" />
            <select id="uieventSelect" style={{ marginLeft: 20 }} />
            <button id="uieventNo">关闭</button>
            <button id="uieventYes">确定</button>
          </div>
          <hr style={{ clear: "both", marginTop: 0 }} />
          <div id="uieventBody">
            <canvas className="gameCanvas" id="uievent" />
            <div id="selectPointBox" />
            <div
              id="uieventExtraBody"
              style={{ display: "none", marginTop: "-10px" }}
            />
          </div>
          <div id="selectPoint">
            <select id="selectPointFloor" />
            <div id="selectPointButtons">
              <input type="button" defaultValue="←" />
              <input type="button" defaultValue="↑" />
              <input type="button" defaultValue="↓" />
              <input type="button" defaultValue="→" />
              <input
                type="button"
                defaultValue="切换大地图"
                style={{ marginLeft: 10 }}
              />
              <input type="button" defaultValue="复制楼层ID" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

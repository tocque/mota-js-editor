import { useEffect, type FC } from "react";
import { setupEditor } from "./setupEditor";

const App: FC = () => {

  useEffect(() => {
    setupEditor();
  }, []);

  return (
    <>
      <link href="_server/css/editor.css" rel="stylesheet" />
      <link href="_server/CodeMirror/codemirror.css" rel="stylesheet" />
      <link href="_server/thirdparty/awesomplete.css" rel="stylesheet" />
      <link id="color_css" rel="stylesheet" />

      <div className="main">
        <div id="left" style={{ zIndex: -1, opacity: 0 }}>
          {/* map */}
          <div id="arrEditor">
            <table className="col" id="arrColMark" />
            <table className="row" id="arrRowMark" />
            <div id="mapEditArea">
              <textarea cols={10} rows={10} id="pout" defaultValue={""} />
            </div>
            <div id="editTip">
              <input type="button" defaultValue="新建空白地图" id="newMap" />
              <input
                id="newFileName"
                placeholder="新楼层id"
                style={{ width: 70 }}
              />
              <span style={{ verticalAlign: "bottom" }}>宽</span>
              <input id="newMapWidth" style={{ width: 20 }} />
              <span style={{ verticalAlign: "bottom" }}>高</span>
              <input id="newMapHeight" style={{ width: 20 }} />
              <input
                type="checkbox"
                id="newMapStatus"
                defaultChecked
                style={{ verticalAlign: "bottom" }}
              />
              <span style={{ verticalAlign: "bottom", marginLeft: "-4px" }}>
                保留楼层属性
              </span>
            </div>
            <div id="editBtns">
              <input type="button" defaultValue="导出并复制地图" id="exportMap" />
              <input type="button" defaultValue="从框中导入地图" id="importMap" />
              <input type="button" defaultValue="清除地图" id="clearMapButton" />
              <input type="button" defaultValue="删除地图" id="deleteMap" />
            </div>
            <input type="button" defaultValue="批量创建空白地图 ↓" id="newMaps" />
            <div id="newFloors" style={{ display: "none" }}>
              <span style={{ verticalAlign: "bottom" }}>楼层ID格式: </span>
              <input id="newFloorIds" style={{ width: 70 }} defaultValue="MT${i}" />
              <span style={{ verticalAlign: "bottom" }}>地图中文名格式: </span>
              <input
                id="newFloorTitles"
                style={{ width: 100 }}
                defaultValue="主塔 ${i} 层"
              />
              <br />
              <span style={{ verticalAlign: "bottom" }}>状态栏名称: </span>
              <input id="newFloorNames" style={{ width: 70 }} defaultValue="${i}" />
              <span style={{ verticalAlign: "bottom" }}>宽</span>
              <input id="newMapsWidth" style={{ width: 20 }} />
              <span style={{ verticalAlign: "bottom" }}>高</span>
              <input id="newMapsHeight" style={{ width: 20 }} />
              <input
                type="checkbox"
                id="newMapsStatus"
                defaultChecked
                style={{ verticalAlign: "bottom" }}
              />
              <span style={{ verticalAlign: "bottom", marginLeft: "-4px" }}>
                保留楼层属性
              </span>
              <br />
              <span style={{ verticalAlign: "bottom" }}>从 i=</span>
              <input id="newMapsFrom" defaultValue={1} style={{ width: 20 }} />
              <span style={{ verticalAlign: "bottom" }}>到</span>
              <input id="newMapsTo" defaultValue={5} style={{ width: 20 }} />
              <input type="button" defaultValue="确认创建" id="createNewMaps" />
            </div>
          </div>
        </div>
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
        <div id="left2" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* loc */}
          <h3 className="leftTabHeader">
            地图选点&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.uifunctions.addAutoEvent()}>
              添加自动事件页
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('loc')}>配置表格</button>
          </h3>
          <div className="leftTabContent">
            <p
              id="pos_a6771a78_a099_417c_828f_0a24851ebfce"
              style={{ marginLeft: 15 }}
            >
              0,0
            </p>
            <div className="etable">
              <table>
                <tbody id="table_3d846fc4_7644_44d1_aa04_433d266a73df">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="left3" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* enemyitem */}
          <h3 className="leftTabHeader">
            图块属性&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('add')}>
              添加
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('delete')}>
              删除
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('enemyitem')}>
              配置表格
            </button>
          </h3>
          <div className="leftTabContent">
            <div id="enemyItemTable">
              {/* enemy and item */}
              <div className="etable">
                <table>
                  <tbody id="table_a3f03d4c_55b8_4ef6_b362_b345783acd72">
                    <tr>
                      <td>条目</td>
                      <td>注释</td>
                      <td>值</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "-10px", marginBottom: 10 }}>
                <button id="copyEnemyItem">复制属性</button>
                <button id="pasteEnemyItem">粘贴属性</button>
                <button id="clearEnemyItem">清空属性</button>
                <button id="clearAllEnemyItem">批量清空属性</button>
              </div>
            </div>
            <div id="newIdIdnum">
              {/* id and idnum */}
              <input placeholder="新id（唯一标识符）" />
              <input placeholder="新idnum（10000以内数字）" />
              <button>确定</button>
              <br />
              <button style={{ marginTop: 10 }}>自动注册</button>
              <button style={{ marginTop: 10, marginLeft: 5 }}>删除此素材</button>
              <button style={{ marginTop: 10, marginLeft: 5 }}>
                以此素材为模板追加
              </button>
            </div>
            <div id="changeId">
              {/* id and idnum */}
              <input placeholder="修改图块id为" style={{ width: 100 }} />
              <button>确定</button>
              <button style={{ marginLeft: 5 }}>删除此素材</button>
              <button style={{ marginLeft: 5 }}>以此素材为模板追加</button>
            </div>
          </div>
        </div>
        <div id="left4" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* floor */}
          <h3 className="leftTabHeader">
            楼层属性&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('add')}>
              添加
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('delete')}>
              删除
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('floor')}>配置表格</button>
          </h3>
          <div className="leftTabContent">
            <div className="etable">
              <table>
                <tbody id="table_4a3b1b09_b2fb_4bdf_b9ab_9f4cdac14c74">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id="changeFloorId">
              {/* id and idnum */}
              <input placeholder="修改floorId为" />
              <button>确定</button>
            </div>
            <div id="changeFloorSize" style={{ fontSize: 13 }}>
              修改地图大小：宽
              <input style={{ width: 25 }} defaultValue={13} />
              ，高
              <input style={{ width: 25 }} defaultValue={13} />， 偏移x
              <input style={{ width: 25 }} defaultValue={0} /> y
              <input style={{ width: 25 }} defaultValue={0} />
              <button>确定</button>
            </div>
          </div>
        </div>
        <div id="left5" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* tower */}
          <h3 className="leftTabHeader">
            全塔属性&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('add')}>
              添加
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('tower')}>配置表格</button>
          </h3>
          <div className="leftTabContent">
            <div className="etable">
              <table>
                <tbody id="table_b6a03e4c_5968_4633_ac40_0dfdd2c9cde5">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
        <div id="colorPanel" className="cpPanel" style={{ display: "none" }}>
          <input className="color" id="colorPicker" defaultValue="255,215,0,1" />
          <button onClick={() => confirmColor()}>确定</button>
        </div>
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
        <div id="left8" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* functions */}
          <h3 className="leftTabHeader">
            脚本编辑&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('functions')}>
              配置表格
            </button>
          </h3>
          <div className="leftTabContent">
            <div className="etable">
              <table>
                <tbody id="table_e260a2be_5690_476a_b04e_dacddede78b3">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="left9" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* commonevent */}
          <h3 className="leftTabHeader">
            公共事件&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.table.addfunc()}>添加</button>&nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('delete')}>
              删除
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('commonevent')}>
              配置表格
            </button>
          </h3>
          <div className="leftTabContent">
            <div className="etable">
              <table>
                <tbody id="table_b7bf0124_99fd_4af8_ae2f_0017f04a7c7d">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="left10" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
          {/* plugins */}
          <h3 className="leftTabHeader">
            插件编写&nbsp;&nbsp;
            <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
            <button onClick={() => editor.table.addfunc()}>添加</button>&nbsp;&nbsp;
            <button onClick={() => editor.mode.changeDoubleClickModeByButton('delete')}>
              删除
            </button>
            &nbsp;&nbsp;
            <button onClick={() => editor_multi.editCommentJs('plugins')}>
              配置表格
            </button>
          </h3>
          <div className="leftTabContent">
            <div className="etable">
              <table>
                <tbody id="table_e2c034ec_47c6_48ae_8db8_4f8f32fea2d6">
                  <tr>
                    <td>条目</td>
                    <td>注释</td>
                    <td>值</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="mid">
          <table className="col" id="mapColMark" />
          <table className="row" id="mapRowMark" />
          <div className="map" id="mapEdit">
            <canvas className="gameCanvas" id="ebm" />
            <canvas className="gameCanvas" id="efg" />
            <canvas className="gameCanvas" id="eui" style={{ zIndex: 100 }} />
          </div>
          <div className="tools">
            <div id="tip" />
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
      </div>
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

import { floorService } from "@/services/floor";
import { useGameCoreInitialized } from "@/stores/GameDataStore";
import { isValidFloorId } from "@/utils/string";
import { type FC, useRef, useState } from "react";
import { BatchCreateMapsForm } from "./BatchCreateMapsForm";

export const MapPanel: FC = () => {
  const [poutValue, setPoutValue] = useState("");
  const [newMapWidth, setNewMapWidth] = useState("");
  const [newMapHeight, setNewMapHeight] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newMapStatus, setNewMapStatus] = useState(true);
  const [batchCreateMapsFormVisible, setBatchCreateMapsFormVisible] = useState(false);

  const poutRef = useRef<HTMLTextAreaElement>(null);

  useGameCoreInitialized((core) => {
    setNewMapWidth(core.__SIZE__);
    setNewMapHeight(core.__SIZE__);
  });

  const formatArr = function() {
    let formatArrStr = "";

    const si = editor.map.length, sk = editor.map[0].length;
    if (poutValue.split(/\D+/).join(" ").trim().split(" ").length != si * sk) return false;
    const arr = poutValue.replace(/\s+/g, "").split("],[");

    if (arr.length != si) return;
    for (let i = 0; i < si; i++) {
      let a = [];
      formatArrStr += "[";
      if (i == 0 || i == si - 1) a = arr[i].split(/\D+/).join(" ").trim().split(" ");
      else a = arr[i].split(/\D+/);
      if (a.length != sk) {
        formatArrStr = "";
        return;
      }

      for (let k = 0; k < sk; k++) {
        const num = parseInt(a[k]);
        formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(" ") + num + (k == sk - 1 ? "" : ",");
      }
      formatArrStr += "]" + (i == si - 1 ? "" : ",\n");
    }
    return formatArrStr;
  };

  const exportMap = () => {
    editor.updateMap();
    const sx = editor.map.length - 1, sy = editor.map[0].length - 1;

    let filestr = "";
    for (let yy = 0; yy <= sy; yy++) {
      filestr += "[";
      for (let xx = 0; xx <= sx; xx++) {
        let mapxy = editor.map[yy][xx];
        if (typeof mapxy == typeof ({})) {
          if ("idnum" in mapxy) mapxy = mapxy.idnum;
          else {
            printe("生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！");
            return;
          }
        } else if (typeof mapxy == "undefined") {
          printe("生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！");
          return;
        }
        mapxy = String(mapxy);
        mapxy = Array(Math.max(4 - mapxy.length, 0)).join(" ") + mapxy;
        filestr += mapxy + (xx == sx ? "" : ",");
      }

      filestr += "]" + (yy == sy ? "" : ",\n");
    }
    setPoutValue(filestr);
    if (formatArr()) {
      if (poutRef.current) {
        poutRef.current.focus();
        poutRef.current.setSelectionRange(0, filestr.length);
        document.execCommand("Copy");
      }
      printf("导出并复制成功！");
    } else {
      printe("无法导出并复制此地图，可能有不合法块。");
    }
  };

  const importMap = () => {
    const sy = editor.map.length, sx = editor.map[0].length;
    let mapArray = null;
    let value = poutValue.trim();
    // 去除可能末尾的 ','
    if (value.endsWith(",")) value = value.substring(0, value.length - 1);
    try {
      mapArray = JSON.parse(value);
    } catch (e) {
      console.log(e);
    }
    try {
      mapArray = mapArray || JSON.parse("[" + value + "]");
    } catch (e) {
      console.log(e);
    }
    if (mapArray == null || mapArray.length != sy || mapArray[0].length != sx) {
      printe("格式错误！请使用正确格式(请使用地图生成器进行生成，且需要和本地图宽高完全一致)");
      return;
    }
    let hasError = false;
    for (let y = 0; y < sy; y++) {
      for (let x = 0; x < sx; x++) {
        const num = mapArray[y][x];
        if (num == 0) {
          editor.map[y][x] = 0;
        } else if (editor.indexs[num] == null || editor.indexs[num][0] == null) {
          printe("当前有未定义ID（在地图区域显示红块），请用有效的图块进行覆盖！");
          hasError = true;
          editor.map[y][x] = {};
        } else editor.map[y][x] = editor.ids[[editor.indexs[num][0]]];
      }
    }
    editor.updateMap();
    if (!hasError) printf("地图导入成功！");
  };

  const clearMap = () => {
    if (!confirm("你确定要清除地图上所有内容么？此过程不可逆！")) return;
    editor.mapInit();
    editor_mode.onmode("");
    editor.file.saveFloorFile((err) => {
      if (err) {
        printe(err);
        throw err;
      }
      printf("地图清除成功");
    });
    editor.updateMap();
  };

  // 使用 floorService.deleteFloor 删除地图
  const deleteMap = async () => {
    if (!confirm("你确定要删除此地图么？此过程不可逆！")) return;
    editor_mode.onmode("");

    try {
      await floorService.deleteFloor(editor.currentFloorId);
      printe("删除成功,请F5刷新编辑器生效");
    } catch (err) {
      printe(String(err));
      throw err;
    }
  };

  // 使用 floorService.createFloor 创建新地图
  const createNewMap = async () => {
    if (!newFileName) return;

    // 检查是否已存在（不区分大小写）
    const findFunc = function(id: string) {
      const re = new RegExp(newFileName, "i");
      return re.test(id);
    };
    if (core.floorIds.find(findFunc) != null) {
      printe("同名楼层已存在！(不区分大小写)");
      return;
    }

    // 验证楼层名格式
    if (!isValidFloorId(newFileName)) {
      printe("楼层名不合法！请使用字母、数字、下划线，且不能以数字开头！");
      return;
    }

    const width = parseInt(newMapWidth);
    const height = parseInt(newMapHeight);
    if (Number.isNaN(width) || Number.isNaN(height) || width > 128 || height > 128) {
      printe("新建地图的宽高都不得大于128");
      return;
    }

    editor_mode.onmode("");

    try {
      // 使用 floorService.createFloor 创建楼层
      // 它会自动创建文件并更新 floorIds
      await floorService.createFloor(newFileName, {
        title: newMapStatus ? undefined : newFileName, // saveStatus=true 时保留默认标题
        name: newMapStatus ? undefined : newFileName,
        width,
        height,
      });
      printe("新建成功,请F5刷新编辑器生效");
    } catch (err) {
      printe(String(err));
      throw err;
    }
  };

  const toggleBatchCreateMapsForm = () => {
    setBatchCreateMapsFormVisible(!batchCreateMapsFormVisible);
  };

  return (
    <div id="left" className="leftTab">
      {/* map */}
      <div id="arrEditor">
        <table className="col" id="arrColMark" />
        <table className="row" id="arrRowMark" />
        <div id="mapEditArea">
          <textarea
            ref={poutRef}
            cols={10}
            rows={10}
            id="pout"
            value={poutValue}
            onChange={(e) => setPoutValue(e.target.value)}
          />
        </div>
        <div id="editTip">
          <input type="button" defaultValue="新建空白地图" onClick={createNewMap} />
          <input
            id="newFileName"
            placeholder="新楼层id"
            style={{ width: 70 }}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <span style={{ verticalAlign: "bottom" }}>宽</span>
          <input
            id="newMapWidth"
            style={{ width: 20 }}
            value={newMapWidth}
            onChange={(e) => setNewMapWidth(e.target.value)}
          />
          <span style={{ verticalAlign: "bottom" }}>高</span>
          <input
            id="newMapHeight"
            style={{ width: 20 }}
            value={newMapHeight}
            onChange={(e) => setNewMapHeight(e.target.value)}
          />
          <input
            type="checkbox"
            id="newMapStatus"
            checked={newMapStatus}
            onChange={(e) => setNewMapStatus(e.target.checked)}
            style={{ verticalAlign: "bottom" }}
          />
          <span style={{ verticalAlign: "bottom", marginLeft: "-4px" }}>
            保留楼层属性
          </span>
        </div>
        <div id="editBtns">
          <input type="button" defaultValue="导出并复制地图" id="exportMap" onClick={exportMap} />
          <input type="button" defaultValue="从框中导入地图" id="importMap" onClick={importMap} />
          <input type="button" defaultValue="清除地图" id="clearMapButton" onClick={clearMap} />
          <input type="button" defaultValue="删除地图" id="deleteMap" onClick={deleteMap} />
        </div>
        <input type="button" defaultValue="批量创建空白地图 ↓" id="newMaps" onClick={toggleBatchCreateMapsForm} />
        <BatchCreateMapsForm visible={batchCreateMapsFormVisible} />
      </div>
    </div>
  );
};

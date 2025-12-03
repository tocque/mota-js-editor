import { createMapFile, batchCreateMapFiles } from "@/fs/maps";
import { useGameData } from "@/stores/GameDataStore";
import { useEffect, useRef, useState, type FC } from "react";

export const MapPanel: FC = () => {
  const [poutValue, setPoutValue] = useState("");
  const [newMapWidth, setNewMapWidth] = useState("");
  const [newMapHeight, setNewMapHeight] = useState("");
  const [newMapsWidth, setNewMapsWidth] = useState("");
  const [newMapsHeight, setNewMapsHeight] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newMapStatus, setNewMapStatus] = useState(true);
  const [newFloorIds, setNewFloorIds] = useState("MT${i}");
  const [newFloorTitles, setNewFloorTitles] = useState("主塔 ${i} 层");
  const [newFloorNames, setNewFloorNames] = useState("${i}");
  const [newMapsFrom, setNewMapsFrom] = useState("1");
  const [newMapsTo, setNewMapsTo] = useState("5");
  const [newMapsStatus, setNewMapsStatus] = useState(true);

  const poutRef = useRef<HTMLTextAreaElement>(null);

  useGameData((core) => {
    setNewMapWidth(core.__SIZE__);
    setNewMapHeight(core.__SIZE__);
    setNewMapsWidth(core.__SIZE__);
    setNewMapsHeight(core.__SIZE__);
  });

  const formatArr = function () {
    let formatArrStr = '';

    const si = editor.map.length, sk = editor.map[0].length;
    if (poutValue.split(/\D+/).join(' ').trim().split(' ').length != si * sk) return false;
    const arr = poutValue.replace(/\s+/g, '').split('],[');

    if (arr.length != si) return;
    for (let i = 0; i < si; i++) {
      let a = [];
      formatArrStr += '[';
      if (i == 0 || i == si - 1) a = arr[i].split(/\D+/).join(' ').trim().split(' ');
      else a = arr[i].split(/\D+/);
      if (a.length != sk) {
        formatArrStr = '';
        return;
      }

      for (let k = 0; k < sk; k++) {
        const num = parseInt(a[k]);
        formatArrStr += Array(Math.max(4 - String(num).length, 0)).join(' ') + num + (k == sk - 1 ? '' : ',');
      }
      formatArrStr += ']' + (i == si - 1 ? '' : ',\n');
    }
    return formatArrStr;
  }

  const exportMap = () => {
    editor.updateMap();
    const sx = editor.map.length - 1, sy = editor.map[0].length - 1;

    let filestr = '';
    for (let yy = 0; yy <= sy; yy++) {
      filestr += '['
      for (let xx = 0; xx <= sx; xx++) {
        let mapxy = editor.map[yy][xx];
        if (typeof (mapxy) == typeof ({})) {
          if ('idnum' in mapxy) mapxy = mapxy.idnum;
          else {
            printe("生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！");
            return;
          }
        } else if (typeof (mapxy) == 'undefined') {
          printe("生成失败! 地图中有未定义的图块，建议先用其他有效图块覆盖或点击清除地图！");
          return;
        }
        mapxy = String(mapxy);
        mapxy = Array(Math.max(4 - mapxy.length, 0)).join(' ') + mapxy;
        filestr += mapxy + (xx == sx ? '' : ',')
      }

      filestr += ']' + (yy == sy ? '' : ',\n');
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
      printe("无法导出并复制此地图，可能有不合法块。")
    }
  }

  const importMap = () => {
    const sy = editor.map.length, sx = editor.map[0].length;
    let mapArray = null;
    let value = poutValue.trim();
    // 去除可能末尾的 ','
    if (value.endsWith(',')) value = value.substring(0, value.length - 1);
    try { mapArray = JSON.parse(value); } catch (e) { console.log(e) }
    try { mapArray = mapArray || JSON.parse('[' + value + ']'); } catch (e) { console.log(e) }
    if (mapArray == null || mapArray.length != sy || mapArray[0].length != sx) {
      printe('格式错误！请使用正确格式(请使用地图生成器进行生成，且需要和本地图宽高完全一致)');
      return;
    }
    let hasError = false;
    for (let y = 0; y < sy; y++)
      for (let x = 0; x < sx; x++) {
        const num = mapArray[y][x];
        if (num == 0)
          editor.map[y][x] = 0;
        else if (editor.indexs[num] == null || editor.indexs[num][0] == null) {
          printe('当前有未定义ID（在地图区域显示红块），请用有效的图块进行覆盖！')
          hasError = true;
          editor.map[y][x] = {};
        } else editor.map[y][x] = editor.ids[[editor.indexs[num][0]]];
      }
    editor.updateMap();
    if (!hasError) printf('地图导入成功！');
  }

  const clearMap = () => {
    if (!confirm('你确定要清除地图上所有内容么？此过程不可逆！')) return;
    editor.mapInit();
    editor_mode.onmode('');
    editor.file.saveFloorFile(function (err) {
      if (err) {
        printe(err);
        throw (err)
      }
      ; printf('地图清除成功');
    });
    editor.updateMap();
  }

  const deleteMap = () => {
    if (!confirm('你确定要删除此地图么？此过程不可逆！')) return;
    editor_mode.onmode('');
    const index = core.floorIds.indexOf(editor.currentFloorId);
    if (index >= 0) {
      core.floorIds.splice(index, 1);
      editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
        if (objs_.slice(-1)[0] != null) {
          printe(objs_.slice(-1)[0]);
          throw (objs_.slice(-1)[0])
        }
        ; printe('删除成功,请F5刷新编辑器生效');
      });
    }
    else printe('删除成功,请F5刷新编辑器生效');
  }

  const createNewMap = async () => {
    if (!newFileName) return;
    const findFunc = function (id) {
      const re = new RegExp(newFileName, 'i');
      return re.test(id);
    }
    if (core.floorIds.find(findFunc) != null) {
      printe("同名楼层已存在！(不区分大小写)");
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newFileName)) {
      printe("楼层名不合法！请使用字母、数字、下划线，且不能以数字开头！");
      return;
    }
    const width = parseInt(newMapWidth);
    const height = parseInt(newMapHeight);
    if (!core.isset(width) || !core.isset(height) || width > 128 || height > 128) {
      printe("新建地图的宽高都不得大于128");
      return;
    }

    editor_mode.onmode('');
    await createMapFile(newFileName, {
      width,
      height,
      saveStatus: newMapStatus
    }).catch((err) => {
      if (err) {
        printe(err);
        throw (err)
      }
    });
    core.floorIds.push(newFileName);
    editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {
      //console.log(objs_);
      if (objs_.slice(-1)[0] != null) {
        printe(objs_.slice(-1)[0]);
        throw (objs_.slice(-1)[0])
      }
      ; printe('新建成功,请F5刷新编辑器生效');
    });
  }

  useEffect(() => {

    const newMaps = document.getElementById('newMaps');
    const newFloors = document.getElementById('newFloors');
    newMaps.onclick = function () {
      if (newFloors.style.display == 'none') newFloors.style.display = 'block';
      else newFloors.style.display = 'none';
    }
  }, []);

  const createNewMaps = async () => {
    if (!newFloorIds) return;
    const from = parseInt(newMapsFrom),
      to = parseInt(newMapsTo);
    if (!core.isset(from) || !core.isset(to) || from > to) {
      printe("请输入有效的起始和终止楼层");
      return;
    }
    if (to - from >= 100) {
      printe("一次最多创建99个楼层");
      return;
    }
    const floorIdList = [];
    for (let i = from; i <= to; i++) {
      var floorId = newFloorIds.replace(/\${(.*?)}/g, function (word, value) {
        return eval(value);
      });
      const findFunc = function (id) {
        const re = new RegExp(floorId, 'i');
        return re.test(id);
      }
      if (core.floorIds.find(findFunc) != null) {
        printe("同名楼层已存在！(不区分大小写)");
        return;
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
        printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
        return;
      }
      if (floorIdList.indexOf(floorId) >= 0) {
        printe("尝试重复创建楼层 " + floorId + " ！");
        return;
      }
      floorIdList.push(floorId);
    }

    const width = parseInt(newMapsWidth);
    const height = parseInt(newMapsHeight);
    if (!core.isset(width) || !core.isset(height) || width > 128 || height > 128) {
      printe("新建地图的宽高都不得大于128");
      return;
    }
    editor_mode.onmode('');

    await batchCreateMapFiles(floorIdList, from, to, {
      width,
      height,
      saveStatus: newMapsStatus,
      floorTitlesTemplate: newFloorTitles,
      floorNamesTemplate: newFloorNames
    }).catch((err) => {
      printe(err);
      throw (err);
    });
    core.floorIds = core.floorIds.concat(floorIdList);
    editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
      if (objs_.slice(-1)[0] != null) {
        printe(objs_.slice(-1)[0]);
        throw (objs_.slice(-1)[0])
      }
      ; printe('批量创建 ' + floorIdList[0] + '~' + floorIdList[floorIdList.length - 1] + ' 成功,请F5刷新编辑器生效');
    });
  };

  return (
    <div id="left" style={{ zIndex: -1, opacity: 0 }}>
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
        <input type="button" defaultValue="批量创建空白地图 ↓" id="newMaps" />
        <div id="newFloors" style={{ display: "none" }}>
          <span style={{ verticalAlign: "bottom" }}>楼层ID格式: </span>
          <input 
            id="newFloorIds" 
            style={{ width: 70 }} 
            value={newFloorIds}
            onChange={(e) => setNewFloorIds(e.target.value)}
          />
          <span style={{ verticalAlign: "bottom" }}>地图中文名格式: </span>
          <input
            id="newFloorTitles"
            style={{ width: 100 }}
            value={newFloorTitles}
            onChange={(e) => setNewFloorTitles(e.target.value)}
          />
          <br />
          <span style={{ verticalAlign: "bottom" }}>状态栏名称: </span>
          <input 
            id="newFloorNames" 
            style={{ width: 70 }} 
            value={newFloorNames}
            onChange={(e) => setNewFloorNames(e.target.value)}
          />
          <span style={{ verticalAlign: "bottom" }}>宽</span>
          <input 
            id="newMapsWidth" 
            style={{ width: 20 }} 
            value={newMapsWidth}
            onChange={(e) => setNewMapsWidth(e.target.value)}
          />
          <span style={{ verticalAlign: "bottom" }}>高</span>
          <input 
            id="newMapsHeight" 
            style={{ width: 20 }} 
            value={newMapsHeight}
            onChange={(e) => setNewMapsHeight(e.target.value)}
          />
          <input
            type="checkbox"
            id="newMapsStatus"
            checked={newMapsStatus}
            onChange={(e) => setNewMapsStatus(e.target.checked)}
            style={{ verticalAlign: "bottom" }}
          />
          <span style={{ verticalAlign: "bottom", marginLeft: "-4px" }}>
            保留楼层属性
          </span>
          <br />
          <span style={{ verticalAlign: "bottom" }}>从 i=</span>
          <input 
            id="newMapsFrom" 
            value={newMapsFrom}
            onChange={(e) => setNewMapsFrom(e.target.value)}
            style={{ width: 20 }} 
          />
          <span style={{ verticalAlign: "bottom" }}>到</span>
          <input 
            id="newMapsTo" 
            value={newMapsTo}
            onChange={(e) => setNewMapsTo(e.target.value)}
            style={{ width: 20 }} 
          />
          <input type="button" defaultValue="确认创建" onClick={createNewMaps} />
        </div>
      </div>
    </div>
  );
}

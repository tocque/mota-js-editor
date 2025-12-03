import { batchCreateMapFiles } from "@/fs/maps";
import { useGameData } from "@/stores/GameDataStore";
import { useState, type FC } from "react";

export const BatchCreateMapsForm: FC = () => {
  const [newMapsWidth, setNewMapsWidth] = useState("");
  const [newMapsHeight, setNewMapsHeight] = useState("");
  const [newFloorIds, setNewFloorIds] = useState("MT${i}");
  const [newFloorTitles, setNewFloorTitles] = useState("主塔 ${i} 层");
  const [newFloorNames, setNewFloorNames] = useState("${i}");
  const [newMapsFrom, setNewMapsFrom] = useState("1");
  const [newMapsTo, setNewMapsTo] = useState("5");
  const [newMapsStatus, setNewMapsStatus] = useState(true);
  
  useGameData((core) => {
    setNewMapsWidth(core.__SIZE__);
    setNewMapsHeight(core.__SIZE__);
  });

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
  );
};

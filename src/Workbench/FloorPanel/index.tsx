import { useState, type FC } from "react";

export const FloorPanel: FC = () => {
  const [floorIdValue, setFloorIdValue] = useState('');
  const [newWidth, setNewWidth] = useState('13');
  const [newHeight, setNewHeight] = useState('13');
  const [offsetX, setOffsetX] = useState('0');
  const [offsetY, setOffsetY] = useState('0');

  const handleChangeFloorId = () => {
    const floorId = floorIdValue;
    if (floorId) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(floorId)) {
        printe("楼层名 " + floorId + " 不合法！请使用字母、数字、下划线，且不能以数字开头！");
        return;
      }
      if (main.floorIds.indexOf(floorId) >= 0) {
        printe("楼层名 " + floorId + " 已存在！");
        return;
      }
      const currentFloorId = editor.currentFloorId;
      editor.currentFloorId = floorId;
      editor.currentFloorData.floorId = floorId;
      editor.file.saveFloorFile(function (err) {
        if (err) {
          printe(err);
          throw (err);
        }
        core.floorIds[core.floorIds.indexOf(currentFloorId)] = floorId;
        editor.file.editTower([['change', "['main']['floorIds']", core.floorIds]], function (objs_) {//console.log(objs_);
          if (objs_.slice(-1)[0] != null) {
            printe(objs_.slice(-1)[0]);
            throw (objs_.slice(-1)[0])
          }
          alert("修改floorId成功，需要刷新编辑器生效。\n请注意，原始的楼层文件没有删除，请根据需要手动删除。");
          window.location.reload();
        });
      });
    } else {
      printe('请输入要修改到的floorId');
    }
  }

  const handleChangeFloorSize = () => {
    const width = parseInt(newWidth);
    const height = parseInt(newHeight);
    let x = parseInt(offsetX);
    let y = parseInt(offsetY);
    if (!(width <= 128 && height <= 128 && x >= 0 && y >= 0)) {
      printe("参数错误！宽高不得大于128，偏移量不得小于0");
      return;
    }
    const currentFloorData = editor.currentFloorData;
    const currWidth = currentFloorData.width;
    const currHeight = currentFloorData.height;
    if (width < currWidth) x = -x;
    if (height < currHeight) y = -y;
    // Step 1:创建一个新的地图
    const newFloorData = core.clone(currentFloorData);
    newFloorData.width = width;
    newFloorData.height = height;

    // Step 2:更新map, bgmap和fgmap
    editor.dom.maps.forEach(function (name) {
      newFloorData[name] = [];
      if (currentFloorData[name] && currentFloorData[name].length > 0) {
        for (let j = 0; j < height; ++j) {
          newFloorData[name][j] = [];
          for (let i = 0; i < width; ++i) {
            const oi = i - x;
            const oj = j - y;
            if (oi >= 0 && oi < currWidth && oj >= 0 && oj < currHeight) {
              newFloorData[name][j].push(currentFloorData[name][oj][oi]);
            } else {
              newFloorData[name][j].push(0);
            }
          }
        }
      }
    });

    // Step 3:更新所有坐标
    ["events", "beforeBattle", "afterBattle", "afterGetItem", "afterOpenDoor", "changeFloor", "autoEvent", "cannotMove"].forEach(function (name) {
      newFloorData[name] = {};
      if (!currentFloorData[name]) return;
      for (const loc in currentFloorData[name]) {
        const oxy = loc.split(','), ox = parseInt(oxy[0]), oy = parseInt(oxy[1]);
        const nx = ox + x, ny = oy + y;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          newFloorData[name][nx + "," + ny] = core.clone(currentFloorData[name][loc]);
        }
      }
    });

    // Step 4:上楼点&下楼点
    ["upFloor", "downFloor"].forEach(function (name) {
      if (newFloorData[name] && newFloorData[name].length == 2) {
        newFloorData[name][0] += x;
        newFloorData[name][1] += y;
      }
    });

    editor.file.saveFloor(newFloorData, function (err) {
      if (err) {
        printe(err);
        throw (err)
      }
      ; alert('地图更改大小成功，即将刷新地图...\n请检查所有点的事件是否存在问题。');
      window.location.reload();
    });
  }

  return (

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
          <input 
            value={floorIdValue}
            onChange={(e) => setFloorIdValue(e.target.value)}
            placeholder="修改floorId为" 
          />
          <button onClick={handleChangeFloorId}>确定</button>
        </div>
        <div id="changeFloorSize" style={{ fontSize: 13 }}>
          修改地图大小：宽
          <input 
            style={{ width: 25 }} 
            value={newWidth}
            onChange={(e) => setNewWidth(e.target.value)}
          />
          ，高
          <input 
            style={{ width: 25 }} 
            value={newHeight}
            onChange={(e) => setNewHeight(e.target.value)}
          />， 偏移x
          <input 
            style={{ width: 25 }} 
            value={offsetX}
            onChange={(e) => setOffsetX(e.target.value)}
          /> y
          <input 
            style={{ width: 25 }} 
            value={offsetY}
            onChange={(e) => setOffsetY(e.target.value)}
          />
          <button onClick={handleChangeFloorSize}>确定</button>
        </div>
      </div>
    </div>
  );
}
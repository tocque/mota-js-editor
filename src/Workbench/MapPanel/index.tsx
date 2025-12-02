import type { FC } from "react";

export const MapPanel: FC = () => {
  return (
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
  );
}

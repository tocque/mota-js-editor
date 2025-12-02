import type { FC } from "react";

export const FloorPanel: FC = () => {
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
  );
}
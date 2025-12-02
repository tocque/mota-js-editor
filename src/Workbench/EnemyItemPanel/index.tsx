import type { FC } from "react";

export const EnemyItemPanel: FC = () => {

  return (
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
  );
}
export const TowerPanel = () => {
  return (
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
  );
}
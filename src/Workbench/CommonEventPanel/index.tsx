export const CommonEventPanel = () => {
  return (
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
  );
}

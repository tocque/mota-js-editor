export const PluginPanel = () => {
  return (
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
  );
}

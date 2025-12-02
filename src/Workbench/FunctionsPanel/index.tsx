export const FunctionsPanel = () => {
  return (
    <div id="left8" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      {/* functions */}
      <h3 className="leftTabHeader">
        脚本编辑&nbsp;&nbsp;
        <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
        <button onClick={() => editor_multi.editCommentJs('functions')}>
          配置表格
        </button>
      </h3>
      <div className="leftTabContent">
        <div className="etable">
          <table>
            <tbody id="table_e260a2be_5690_476a_b04e_dacddede78b3">
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
};

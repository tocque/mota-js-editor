export const LocPanel = () => {
  return (
    <div id="left2" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      {/* loc */}
      <h3 className="leftTabHeader">
        地图选点&nbsp;&nbsp;
        <button onClick={() => editor.mode.onmode('save')}>保存</button>&nbsp;&nbsp;
        <button onClick={() => editor.uifunctions.addAutoEvent()}>
          添加自动事件页
        </button>
        &nbsp;&nbsp;
        <button onClick={() => editor_multi.editCommentJs('loc')}>配置表格</button>
      </h3>
      <div className="leftTabContent">
        <p
          id="pos_a6771a78_a099_417c_828f_0a24851ebfce"
          style={{ marginLeft: 15 }}
        >
          0,0
        </p>
        <div className="etable">
          <table>
            <tbody id="table_3d846fc4_7644_44d1_aa04_433d266a73df">
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

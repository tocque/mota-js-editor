import { useState, type FC } from "react";

export const PrefabPanel: FC = () => {
  const [newId, setNewId] = useState('');
  const [newIdnum, setNewIdnum] = useState('');
  const [changeIdValue, setChangeIdValue] = useState('');

  const handleAddIdIdnum = () => {
    if (newId && newIdnum) {
      const id = newId;
      const idnum = parseInt(newIdnum);
      if (Number.isNaN(idnum)) {
        printe('不合法的idnum');
        return;
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
        printe('不合法的id，请使用字母、数字或下划线，且不能以数字开头');
        return;
      }
      if (id == 'hero' || id == 'this' || id == 'none' || id == 'airwall') {
        printe('不得使用保留关键字作为id！');
        return;
      }
      if (core.statusBar.icons[id] != null) {
        alert('警告！此ID在状态栏图标中被注册；仍然允许使用，但是\\i[]等绘制可能出现冲突。');
      }
      editor.file.changeIdAndIdnum(id, idnum, editor_mode.info, (err) => {
        if (err) {
          printe(err);
          throw (err)
        }
        printe('添加id和idnum成功,请F5刷新编辑器');
      });
    } else {
      printe('请输入id和idnum');
    }
  }

  const handleAutoRegister = () => {
    editor.file.autoRegister(editor_mode.info, (err) => {
      if (err) {
        printe(err);
        throw (err)
      }
      printe('该列所有剩余项全部自动注册成功,请F5刷新编辑器');
    })
  }

  const handleRemoveMaterial = () => {
    if (!confirm("警告！你确定要删除此素材吗？此过程不可逆！")) return;
    editor.file.removeMaterial(editor_mode.info, (err) => {
      if (err) {
        printe(err);
        throw err;
      }
      alert('删除此素材成功！');
      window.location.reload();
    });
  }

  const handleAppendMaterial = () => {
    editor.uifunctions.appendMaterialByInfo(editor_mode.info);
  }

  const handleChangeId = () => {
    const id = changeIdValue;
    if (id) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
        printe('不合法的id，请使用字母、数字或下划线，且不能以数字开头')
        return;
      }
      if (id == 'hero' || id == 'this' || id == 'none' || id == 'airwall') {
        printe('不得使用保留关键字作为id！');
        return;
      }
      if (editor_mode.info.images == 'autotile') {
        printe('自动元件不可修改id！');
        return;
      }
      if (editor_mode.info.idnum >= 10000) {
        printe('额外素材不可修改id！');
        return;
      }
      if (core.statusBar.icons[id] != null) {
        alert('警告！此ID在状态栏图标中被注册；仍然允许使用，但是\\i[]等绘制可能出现冲突。');
      }
      editor.file.changeIdAndIdnum(id, null, editor_mode.info, (err) => {
        if (err) {
          printe(err);
          throw (err);
        }
        printe('修改id成功,请F5刷新编辑器');
      });
    } else {
      printe('请输入要修改到的ID');
    }
  }

  const handleDeletePrefab = () => {
    if (editor_mode.info.isTile) {
      printe("额外素材不可删除！");
      return;
    }
    if (!confirm("警告！你确定要删除此素材吗？此过程不可逆！\n请务必首先进行备份操作，并保证此素材没有在地图的任何位置使用，否则可能会出现不可知的后果！")) return;
    editor.file.removeMaterial(editor_mode.info, (err) => {
      if (err) {
        printe(err);
        return;
      }
      alert('删除此素材成功！');
      window.location.reload();
    });
  }
  const handleAppendPrefab = () => {
    editor.uifunctions.appendMaterialByInfo(editor_mode.info);
  }

  const handleCopyEnemyItem = () => {
    const cls = (editor_mode.info || {}).images;
    if (editor_mode.mode != 'enemyitem' || (cls != 'enemys' && cls != 'enemy48' && cls != 'items')) return;
    editor.uivalues.copyEnemyItem.type = cls;
    const id = editor_mode.info.id;
    if (cls == 'enemys' || cls == 'enemy48') {
      editor.uivalues.copyEnemyItem.data = core.clone(enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id]);
      printf("怪物属性复制成功");
    } else if (cls == 'items') {
      editor.uivalues.copyEnemyItem.data = core.clone(items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id]);
      printf("道具属性复制成功");
    }
  }

  const handlePasteEnemyItem = () => {
    const cls = (editor_mode.info || {}).images;
    if (editor_mode.mode != 'enemyitem' || !cls || cls != editor.uivalues.copyEnemyItem.type) return;
    const id = editor_mode.info.id;
    if (cls == 'enemys' || cls == 'enemy48') {
      if (confirm("你确定要覆盖此怪物的全部属性么？这是个不可逆操作！")) {
        var name = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].name;
        const displayIdInBook = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].displayIdInBook;
        enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id] = core.clone(editor.uivalues.copyEnemyItem.data);
        enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].id = id;
        enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].name = name;
        enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].displayIdInBook = displayIdInBook;
        editor.file.saveSetting('enemys', [], (err) => {
          if (err) printe(err);
          else printf("怪物属性粘贴成功\n请再重新选中该怪物方可查看更新后的表格。");
        })
      }
    } else if (cls == 'items') {
      if (confirm("你确定要覆盖此道具的全部属性么？这是个不可逆操作！")) {
        var name = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id].name;
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id] = core.clone(editor.uivalues.copyEnemyItem.data);
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id].id = id;
        items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id].name = name;
        editor.file.saveSetting('items', [], (err) => {
          if (err) printe(err);
          else printf("道具属性粘贴成功\n请再重新选中该道具方可查看更新后的表格。");
        })
      }
    }
  }

  const _clearEnemy = function (id) {
    const info = core.clone(comment_c456ea59_6018_45ef_8bcc_211a24c627dc._data.enemys_template);
    info.id = id;
    info.name = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].name;
    info.displayIdInBook = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id].displayIdInBook;
    enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id] = info;
  }

  const _clearItem = function (id) {
    for (const x in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id]) {
      if (x != 'id' && x != 'cls' && x != 'name') delete items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id][x];
    }
  }

  const handleClearEnemyItem = () => {
    const cls = (editor_mode.info || {}).images;
    if (editor_mode.mode != 'enemyitem' || !cls) return;
    const id = editor_mode.info.id;
    if (cls == 'enemys' || cls == 'enemy48') {
      if (confirm("你确定要清空本怪物的全部属性么？这是个不可逆操作！")) {
        _clearEnemy(id);
        editor.file.saveSetting('enemys', [], (err) => {
          if (err) printe(err);
          else printf("怪物属性清空成功\n请再重新选中该怪物方可查看更新后的表格。");
        })
      }
    } else if (cls == 'items') {
      if (confirm("你确定要清空本道具的全部属性么？这是个不可逆操作！")) {
        _clearItem(id);
        editor.file.saveSetting('items', [], (err) => {
          if (err) printe(err);
          else printf("道具属性清空成功\n请再重新选中该道具方可查看更新后的表格。");
        })
      }
    }
  }

  const handleClearAllEnemyItem = () => {
    const cls = (editor_mode.info || {}).images;
    if (editor_mode.mode != 'enemyitem' || !cls) return;
    var id = editor_mode.info.id;
    if (cls == 'enemys' || cls == 'enemy48') {
      if (confirm("你确定要批量清空【全塔怪物】的全部属性么？这是个不可逆操作！")) {
        for (var id in enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80)
          _clearEnemy(id);
        editor.file.saveSetting('enemys', [], (err) => {
          if (err) printe(err);
          else printf("全塔全部怪物属性清空成功！");
        })
      }
    } else if (cls == 'items') {
      if (confirm("你确定要批量清空【全塔所有自动注册且未修改ID的道具】的全部属性么？这是个不可逆操作！")) {
        for (var id in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a) {
          if (/^I\d+$/.test(id)) {
            _clearItem(id);
          }
        }
        editor.file.saveSetting('items', [], (err) => {
          if (err) printe(err);
          else printf("全塔全部道具属性清空成功！");
        })
      }
    }
  }

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
            <button id="copyEnemyItem" onClick={handleCopyEnemyItem}>复制属性</button>
            <button id="pasteEnemyItem" onClick={handlePasteEnemyItem}>粘贴属性</button>
            <button id="clearEnemyItem" onClick={handleClearEnemyItem}>清空属性</button>
            <button id="clearAllEnemyItem" onClick={handleClearAllEnemyItem}>批量清空属性</button>
          </div>
        </div>
        <div id="newIdIdnum">
          {/* id and idnum */}
          <input placeholder="新id（唯一标识符）" onChange={(e) => setNewId(e.target.value)} />
          <input placeholder="新idnum（10000以内数字）" onChange={(e) => setNewIdnum(e.target.value)} />
          <button onClick={handleAddIdIdnum}>确定</button>
          <br />
          <button onClick={handleAutoRegister} style={{ marginTop: 10 }}>自动注册</button>
          <button onClick={handleRemoveMaterial} style={{ marginTop: 10, marginLeft: 5 }}>删除此素材</button>
          <button onClick={handleAppendMaterial} style={{ marginTop: 10, marginLeft: 5 }}>
            以此素材为模板追加
          </button>
        </div>
        <div id="changeId">
          {/* id and idnum */}
          <input placeholder="修改图块id为" style={{ width: 100 }} onChange={(e) => setChangeIdValue(e.target.value)} />
          <button onClick={handleChangeId}>确定</button>
          <button style={{ marginLeft: 5 }} onClick={handleDeletePrefab}>删除此素材</button>
          <button style={{ marginLeft: 5 }} onClick={handleAppendPrefab}>以此素材为模板追加</button>
        </div>
      </div>
    </div>
  );
}
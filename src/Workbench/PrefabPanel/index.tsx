/**
 * PrefabPanel - 图块属性编辑面板
 *
 * 使用 Suspense 架构，数据状态由 ContentBoundary 统一处理
 * 业务组件只写"数据已就绪"的逻辑
 */

import { useCallback, useMemo, useState, type FC } from "react";
import { cloneDeep } from "es-toolkit";
import { ContentLeftTab } from "../components/ContentLeftTab";
import { Table, EditModeSegmented } from "@/components/Table";
import { useTableMetaEditor } from "@/components/Table/hooks";
import { useTableMetaSuspense } from "@/hooks";
import { useDataSuspense } from "@/hooks/suspense";
import { prefabService, type PrefabInfo } from "@/services/prefab";
import { enemyService, type EnemysData } from "@/services/enemy";
import { itemService, type ItemsData } from "@/services/item";
import { useCurrentPrefabInfo } from "@/stores/prefabState";
import type { IDataHandler } from "@/fs/interfaces";
import type { Action } from "@/utils/action";
import type { MapsBlocksData } from "@/services/mapBlock";
import type { EditMode, TableAction } from "@/components/Table/types";
import type { CommentObject } from "@/components/Table";

type PrefabData = EnemysData | ItemsData | MapsBlocksData;

/**
 * 根据 prefabInfo.images 获取对应的 commentObj 子对象
 */
function getCommentObjForPrefab(
  meta: CommentObject,
  info: PrefabInfo | null
): CommentObject | null {
  if (!info?.images) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaData = (meta as any)?._data;
  if (!metaData) return null;

  if (info.images === "enemys" || info.images === "enemy48") {
    return metaData.enemys || null;
  } else if (info.images === "items") {
    return metaData.items || null;
  } else {
    return metaData.maps || null;
  }
}

/**
 * 获取当前图块的数据项
 */
function getPrefabItemData(
  data: Record<string, unknown> | null,
  info: PrefabInfo | null
): Record<string, unknown> | null {
  if (!data || !info) return null;

  const type = prefabService.getPrefabType(info);

  switch (type) {
    case "enemy":
    case "item":
      return info.id ? (data[info.id] as Record<string, unknown>) : null;
    case "mapBlock":
      return info.idnum !== undefined
        ? (data[String(info.idnum)] as Record<string, unknown>)
        : null;
    default:
      return null;
  }
}

// ==================== 未注册图块区域 ====================

interface NewIdIdnumSectionProps {
  info: PrefabInfo;
}

const NewIdIdnumSection: FC<NewIdIdnumSectionProps> = ({ info }) => {
  const [newId, setNewId] = useState("");
  const [newIdnum, setNewIdnum] = useState("");

  const handleAddIdIdnum = useCallback(() => {
    if (newId && newIdnum) {
      const id = newId;
      const idnum = parseInt(newIdnum);
      if (Number.isNaN(idnum)) {
        printe("不合法的idnum");
        return;
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
        printe("不合法的id，请使用字母、数字或下划线，且不能以数字开头");
        return;
      }
      if (id === "hero" || id === "this" || id === "none" || id === "airwall") {
        printe("不得使用保留关键字作为id！");
        return;
      }
      if ((core.statusBar as Record<string, Record<string, unknown>>)?.icons?.[id] != null) {
        alert(
          "警告！此ID在状态栏图标中被注册；仍然允许使用，但是\\i[]等绘制可能出现冲突。"
        );
      }
      editor?.file?.changeIdAndIdnum(id, idnum, info, (err: string | null) => {
        if (err) {
          printe(err);
          throw err;
        }
        printe("添加id和idnum成功,请F5刷新编辑器");
      });
    } else {
      printe("请输入id和idnum");
    }
  }, [newId, newIdnum, info]);

  const handleAutoRegister = useCallback(() => {
    editor?.file?.autoRegister(info, (err: string | null) => {
      if (err) {
        printe(err);
        throw err;
      }
      printe("该列所有剩余项全部自动注册成功,请F5刷新编辑器");
    });
  }, [info]);

  const handleRemoveMaterial = useCallback(() => {
    if (!confirm("警告！你确定要删除此素材吗？此过程不可逆！")) return;
    editor?.file?.removeMaterial(info, (err: string | null) => {
      if (err) {
        printe(err);
        throw err;
      }
      alert("删除此素材成功！");
      window.location.reload();
    });
  }, [info]);

  const handleAppendMaterial = useCallback(() => {
    editor?.uifunctions?.appendMaterialByInfo(info);
  }, [info]);

  return (
    <div id="newIdIdnum">
      <input
        placeholder="新id（唯一标识符）"
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
      />
      <input
        placeholder="新idnum（10000以内数字）"
        value={newIdnum}
        onChange={(e) => setNewIdnum(e.target.value)}
      />
      <button onClick={handleAddIdIdnum}>确定</button>
      <br />
      <button onClick={handleAutoRegister} style={{ marginTop: 10 }}>
        自动注册
      </button>
      <button
        onClick={handleRemoveMaterial}
        style={{ marginTop: 10, marginLeft: 5 }}
      >
        删除此素材
      </button>
      <button
        onClick={handleAppendMaterial}
        style={{ marginTop: 10, marginLeft: 5 }}
      >
        以此素材为模板追加
      </button>
    </div>
  );
};

// ==================== 修改 ID 区域 ====================

interface ChangeIdSectionProps {
  info: PrefabInfo;
}

const ChangeIdSection: FC<ChangeIdSectionProps> = ({ info }) => {
  const [changeIdValue, setChangeIdValue] = useState("");

  const handleChangeId = useCallback(() => {
    const id = changeIdValue;
    if (id) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(id)) {
        printe("不合法的id，请使用字母、数字或下划线，且不能以数字开头");
        return;
      }
      if (id === "hero" || id === "this" || id === "none" || id === "airwall") {
        printe("不得使用保留关键字作为id！");
        return;
      }
      if (info.images === "autotile") {
        printe("自动元件不可修改id！");
        return;
      }
      if (info.idnum !== undefined && info.idnum >= 10000) {
        printe("额外素材不可修改id！");
        return;
      }
      if ((core.statusBar as Record<string, Record<string, unknown>>)?.icons?.[id] != null) {
        alert(
          "警告！此ID在状态栏图标中被注册；仍然允许使用，但是\\i[]等绘制可能出现冲突。"
        );
      }
      editor?.file?.changeIdAndIdnum(id, null, info, (err: string | null) => {
        if (err) {
          printe(err);
          throw err;
        }
        printe("修改id成功,请F5刷新编辑器");
      });
    } else {
      printe("请输入要修改到的ID");
    }
  }, [changeIdValue, info]);

  const handleDeletePrefab = useCallback(() => {
    if (info.isTile) {
      printe("额外素材不可删除！");
      return;
    }
    if (
      !confirm(
        "警告！你确定要删除此素材吗？此过程不可逆！\n请务必首先进行备份操作，并保证此素材没有在地图的任何位置使用，否则可能会出现不可知的后果！"
      )
    )
      return;
    editor?.file?.removeMaterial(info, (err: string | null) => {
      if (err) {
        printe(err);
        return;
      }
      alert("删除此素材成功！");
      window.location.reload();
    });
  }, [info]);

  const handleAppendPrefab = useCallback(() => {
    editor?.uifunctions?.appendMaterialByInfo(info);
  }, [info]);

  return (
    <div id="changeId">
      <input
        placeholder="修改图块id为"
        style={{ width: 100 }}
        value={changeIdValue}
        onChange={(e) => setChangeIdValue(e.target.value)}
      />
      <button onClick={handleChangeId}>确定</button>
      <button style={{ marginLeft: 5 }} onClick={handleDeletePrefab}>
        删除此素材
      </button>
      <button style={{ marginLeft: 5 }} onClick={handleAppendPrefab}>
        以此素材为模板追加
      </button>
    </div>
  );
};

// ==================== 图块属性表格区域 ====================

interface EnemyItemTableSectionProps {
  info: PrefabInfo;
  handler: IDataHandler<PrefabData>;
  editMode: EditMode;
}

const EnemyItemTableSection: FC<EnemyItemTableSectionProps> = ({
  info,
  handler,
  editMode,
}) => {
  // 使用 Suspense hooks
  const [allData] = useDataSuspense(handler);
  const meta = useTableMetaSuspense("comment");

  // 获取当前图块的数据项
  const itemData = useMemo(
    () => getPrefabItemData(allData as Record<string, unknown>, info),
    [allData, info]
  );

  // 获取对应的 commentObj
  const commentObj = useMemo(
    () => getCommentObjForPrefab(meta, info),
    [meta, info]
  );

  // 统一的变更处理 - 即时保存
  const handleChange = useCallback(
    async (action: TableAction) => {
      try {
        prefabService.savePrefabData(info, [action]);
        printf?.("保存成功！");
      } catch (err) {
        printe?.(String(err));
      }
    },
    [info]
  );

  // 复制/粘贴/清空功能
  // 剪贴板数据前缀，用于识别是否为编辑器数据
  const CLIPBOARD_PREFIX = "mota-prefab:";

  const handleCopyEnemyItem = useCallback(async () => {
    const prefabType = prefabService.getPrefabType(info);
    if (!prefabType || prefabType === "mapBlock") return;

    const id = info.id;
    let data: unknown;
    let typeLabel: string;

    if (prefabType === "enemy") {
      data = enemyService.getEnemy(id!);
      typeLabel = "怪物";
    } else {
      data = itemService.getItem(id!);
      typeLabel = "道具";
    }

    const clipboardData = JSON.stringify({ type: prefabType, data });
    await navigator.clipboard.writeText(CLIPBOARD_PREFIX + clipboardData);
    printf(`${typeLabel}属性已复制到剪贴板`);
  }, [info]);

  const handlePasteEnemyItem = useCallback(async () => {
    const prefabType = prefabService.getPrefabType(info);
    if (!prefabType || prefabType === "mapBlock") return;

    try {
      const text = await navigator.clipboard.readText();
      if (!text.startsWith(CLIPBOARD_PREFIX)) {
        printe("剪贴板内容不是有效的图块数据");
        return;
      }

      const { type, data } = JSON.parse(text.slice(CLIPBOARD_PREFIX.length));
      if (type !== prefabType) {
        printe(`类型不匹配：剪贴板中是${type === "enemy" ? "怪物" : "道具"}数据`);
        return;
      }

      const id = info.id;
      if (prefabType === "enemy") {
        if (!confirm("你确定要覆盖此怪物的全部属性么？这是个不可逆操作！")) return;
        const currentEnemy = enemyService.getEnemy(id!);
        const newEnemy = {
          ...cloneDeep(data),
          id,
          name: currentEnemy?.name,
          displayIdInBook: currentEnemy?.displayIdInBook,
        };
        const action: Action = ["change", `['${id}']`, newEnemy];
        enemyService.saveEnemysData([action]);
        printf("怪物属性粘贴成功\n请再重新选中该怪物方可查看更新后的表格。");
      } else {
        if (!confirm("你确定要覆盖此道具的全部属性么？这是个不可逆操作！")) return;
        const currentItem = itemService.getItem(id!);
        const newItem = {
          ...cloneDeep(data),
          id,
          name: currentItem?.name,
        };
        const action: Action = ["change", `['${id}']`, newItem];
        itemService.saveItemsData([action]);
        printf("道具属性粘贴成功\n请再重新选中该道具方可查看更新后的表格。");
      }
    } catch {
      printe("剪贴板内容解析失败");
    }
  }, [info]);

  const handleClearEnemyItem = useCallback(() => {
    const cls = info.images;
    if (!cls) return;
    const id = info.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (meta as any)?._data;
    if (cls === "enemys" || cls === "enemy48") {
      if (confirm("你确定要清空本怪物的全部属性么？这是个不可逆操作！")) {
        const currentEnemy = enemyService.getEnemy(id!);
        const newEnemy = {
          ...cloneDeep(metaData?.enemys_template),
          id,
          name: currentEnemy?.name,
          displayIdInBook: currentEnemy?.displayIdInBook,
        };
        const action: Action = ["change", `['${id}']`, newEnemy];
        enemyService.saveEnemysData([action]);
        printf("怪物属性清空成功\n请再重新选中该怪物方可查看更新后的表格。");
      }
    } else if (cls === "items") {
      if (confirm("你确定要清空本道具的全部属性么？这是个不可逆操作！")) {
        const currentItem = itemService.getItem(id!);
        // 只保留 id, cls, name
        const newItem = {
          id: currentItem?.id,
          cls: currentItem?.cls,
          name: currentItem?.name,
        };
        const action: Action = ["change", `['${id}']`, newItem];
        itemService.saveItemsData([action]);
        printf("道具属性清空成功\n请再重新选中该道具方可查看更新后的表格。");
      }
    }
  }, [info, meta]);

  const handleClearAllEnemyItem = useCallback(() => {
    const cls = info.images;
    if (!cls) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (meta as any)?._data;
    if (cls === "enemys" || cls === "enemy48") {
      if (
        confirm(
          "你确定要批量清空【全塔怪物】的全部属性么？这是个不可逆操作！"
        )
      ) {
        const enemysData = enemyService.getEnemysData();
        const actions: Action[] = Object.keys(enemysData).map((id) => {
          const currentEnemy = enemysData[id];
          const newEnemy = {
            ...cloneDeep(metaData?.enemys_template),
            id,
            name: currentEnemy?.name,
            displayIdInBook: currentEnemy?.displayIdInBook,
          };
          return ["change", `['${id}']`, newEnemy];
        });
        enemyService.saveEnemysData(actions);
        printf("全塔全部怪物属性清空成功！");
      }
    } else if (cls === "items") {
      if (
        confirm(
          "你确定要批量清空【全塔所有自动注册且未修改ID的道具】的全部属性么？这是个不可逆操作！"
        )
      ) {
        const itemsData = itemService.getItemsData();
        const actions: Action[] = Object.keys(itemsData)
          .filter((id) => /^I\d+$/.test(id))
          .map((id) => {
            const currentItem = itemsData[id];
            // 只保留 id, cls, name
            const newItem = {
              id: currentItem?.id,
              cls: currentItem?.cls,
              name: currentItem?.name,
            };
            return ["change", `['${id}']`, newItem];
          });
        itemService.saveItemsData(actions);
        printf("全塔全部道具属性清空成功！");
      }
    }
  }, [info, meta]);

  // 显示复制/粘贴按钮（仅对 enemy 和 item 类型）
  const showCopyPasteButtons =
    info.images === "enemys" ||
    info.images === "enemy48" ||
    info.images === "items";

  if (!itemData || !commentObj) {
    return <div>无数据</div>;
  }

  return (
    <div id="enemyItemTable">
      <Table
        data={itemData}
        commentObj={commentObj}
        onChange={handleChange}
        editMode={editMode}
      />
      {showCopyPasteButtons && (
        <div style={{ marginTop: "-10px", marginBottom: 10 }}>
          <button id="copyEnemyItem" onClick={handleCopyEnemyItem}>
            复制属性
          </button>
          <button id="pasteEnemyItem" onClick={handlePasteEnemyItem}>
            粘贴属性
          </button>
          <button id="clearEnemyItem" onClick={handleClearEnemyItem}>
            清空属性
          </button>
          <button id="clearAllEnemyItem" onClick={handleClearAllEnemyItem}>
            批量清空属性
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== 主内容组件 ====================

interface PrefabPanelContentProps {
  editMode: EditMode;
}

const PrefabPanelContent: FC<PrefabPanelContentProps> = ({ editMode }) => {
  const info = useCurrentPrefabInfo();

  // 如果没有选中图块，显示空状态
  if (!info || Object.keys(info).length === 0) {
    return <div>请选择一个图块</div>;
  }

  // 如果没有 id，显示新建区域
  if (!info.id) {
    return <NewIdIdnumSection info={info} />;
  }

  // 获取 handler，如果无效则不渲染表格
  const handler = prefabService.getHandler(info);
  if (!handler) {
    return (
      <>
        <div>无法加载数据</div>
        <ChangeIdSection info={info} />
      </>
    );
  }

  // 否则显示编辑区域
  return (
    <>
      <EnemyItemTableSection info={info} handler={handler} editMode={editMode} />
      <ChangeIdSection info={info} />
    </>
  );
};

// ==================== 面板组件 ====================

/**
 * PrefabPanel - 面板组件
 *
 * 负责布局和 actions，不直接依赖数据
 * actions 始终显示，不受数据加载状态影响
 */
export const PrefabPanel: FC = () => {
  // 在 Panel 层维护 editMode（不依赖数据）
  const [editMode, setEditMode] = useState<EditMode>("change");

  // 使用 useTableMetaEditor 获取编辑器打开函数
  const { openEditor } = useTableMetaEditor("comment");

  // 保存按钮点击处理
  const handleSave = useCallback(() => {
    editor?.mode.onmode("save");
  }, []);

  // 添加按钮点击处理
  const handleAdd = useCallback(() => {
    editor?.mode.changeDoubleClickModeByButton("add");
  }, []);

  // 删除按钮点击处理
  const handleDelete = useCallback(() => {
    editor?.mode.changeDoubleClickModeByButton("delete");
  }, []);

  // 配置表格按钮点击处理
  const handleConfigure = useCallback(() => {
    openEditor();
  }, [openEditor]);

  // 操作按钮区域（始终显示）
  const actions = (
    <>
      <button onClick={handleSave}>保存</button>
      &nbsp;&nbsp;
      <EditModeSegmented value={editMode} onChange={setEditMode} />
      &nbsp;&nbsp;
      <button onClick={handleAdd}>添加</button>
      &nbsp;&nbsp;
      <button onClick={handleDelete}>删除</button>
      &nbsp;&nbsp;
      <button onClick={handleConfigure}>配置表格</button>
    </>
  );

  return (
    <ContentLeftTab id="left3" title="图块属性" actions={actions}>
      <PrefabPanelContent editMode={editMode} />
    </ContentLeftTab>
  );
};

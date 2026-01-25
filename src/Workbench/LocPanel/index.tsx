/**
 * LocPanel - 地图选点编辑面板
 *
 * 使用 Suspense 架构，数据状态由 ContentBoundary 统一处理
 * 业务组件只写"数据已就绪"的逻辑
 */

import { useCallback, useMemo, useState, type FC } from "react";
import { ContentLeftTab } from "../components/ContentLeftTab";
import { Table, EditModeSegmented } from "@/components/Table";
import { useTableMetaEditor } from "@/components/Table/hooks";
import { useLocTableMetaSuspense } from "@/hooks/suspense/useLocTableMetaSuspense";
import { useCurrentLocPos } from "@/stores/locState";
import { useCurrentFloorId } from "@/stores/editorState";
import { locService, LOC_FIELDS } from "@/services/loc";
import { floorService } from "@/services/floor";
import { useDataSuspense } from "@/hooks/suspense";
import type { EditMode, TableAction } from "@/components/Table/types";
import type { CommentObject } from "@/components/Table";

// ==================== 表格内容区域 ====================

interface LocTableSectionProps {
  floorId: string;
  pos: { x: number; y: number };
  editMode: EditMode;
}

/**
 * 从楼层数据中提取指定位置的 loc 数据
 */
function getLocDataFromFloor(
  floorData: Record<string, unknown>,
  pos: { x: number; y: number }
): Record<string, unknown> {
  const locKey = `${pos.x},${pos.y}`;
  const locData: Record<string, unknown> = {};

  for (const field of LOC_FIELDS) {
    const fieldData = floorData[field];
    if (fieldData && typeof fieldData === "object" && locKey in fieldData) {
      locData[field] = (fieldData as Record<string, unknown>)[locKey];
    } else {
      locData[field] = null;
    }
  }

  return locData;
}

const LocTableSection: FC<LocTableSectionProps> = ({
  floorId,
  pos,
  editMode,
}) => {
  // 使用 Suspense hooks 获取数据
  const handler = floorService.getHandler(floorId);
  const [floorData] = useDataSuspense(handler);
  const meta = useLocTableMetaSuspense();

  // 从楼层数据中提取当前位置的 loc 数据
  const locData = useMemo(
    () => getLocDataFromFloor(floorData as Record<string, unknown>, pos),
    [floorData, pos]
  );

  // 统一的变更处理 - 即时保存
  const handleChange = useCallback(
    (action: TableAction) => {
      try {
        locService.saveLocData(floorId, pos, [action]);
        printf?.("保存成功！");
      } catch (err) {
        printe?.(String(err));
      }
    },
    [floorId, pos]
  );

  if (!meta) {
    return <div>无元数据</div>;
  }

  return (
    <div id="locTable">
      <Table
        data={locData}
        commentObj={meta as CommentObject}
        onChange={handleChange}
        editMode={editMode}
      />
    </div>
  );
};

// ==================== 主内容组件 ====================

interface LocPanelContentProps {
  editMode: EditMode;
}

const LocPanelContent: FC<LocPanelContentProps> = ({ editMode }) => {
  const pos = useCurrentLocPos();
  const floorId = useCurrentFloorId();

  // 如果没有选中位置，显示空状态
  if (!pos) {
    return <div>请选择一个位置</div>;
  }

  // 如果没有当前楼层，显示空状态
  if (!floorId) {
    return <div>请先选择一个楼层</div>;
  }

  return (
    <>
      <p style={{ marginLeft: 15 }}>
        {pos.x},{pos.y}
      </p>
      <LocTableSection floorId={floorId} pos={pos} editMode={editMode} />
    </>
  );
};

// ==================== 面板组件 ====================

/**
 * LocPanel - 面板组件
 *
 * 负责布局和 actions，不直接依赖数据
 * actions 始终显示，不受数据加载状态影响
 */
export const LocPanel: FC = () => {
  const pos = useCurrentLocPos();
  const floorId = useCurrentFloorId();

  // 在 Panel 层维护 editMode（不依赖数据）
  const [editMode, setEditMode] = useState<EditMode>("change");

  // 使用 useTableMetaEditor 获取编辑器打开函数
  const { openEditor } = useTableMetaEditor("comment");

  // 保存按钮点击处理
  const handleSave = useCallback(() => {
    editor?.mode.onmode("save");
  }, []);

  // 添加自动事件页
  const handleAddAutoEvent = useCallback(() => {
    if (!pos || !floorId) {
      printe?.("请先选择一个位置");
      return;
    }

    try {
      const newPageId = locService.addAutoEventPage(floorId, pos);
      printf?.(`添加自动事件页 ${newPageId} 成功`);
    } catch (err) {
      printe?.(String(err));
    }
  }, [pos, floorId]);

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
      <button onClick={handleAddAutoEvent}>添加自动事件页</button>
      &nbsp;&nbsp;
      <button onClick={handleConfigure}>配置表格</button>
    </>
  );

  return (
    <ContentLeftTab id="left2" title="地图选点" actions={actions}>
      <LocPanelContent editMode={editMode} />
    </ContentLeftTab>
  );
};

/**
 * ContextMenu - 右键菜单组件
 *
 * 地图编辑区的右键菜单
 * 迁移自 editor_mappanel.ts 的菜单相关函数
 */

import { useCallback, useEffect, useMemo, type FC } from "react";
import { createPortal } from "react-dom";
import {
  useFloorDataSuspense,
  useModelResourceSuspense,
  useTowerDataSuspense,
} from "@/hooks/suspense";
import {
  MAP_EVENT_FIELDS,
  mapCommands,
  type MapLayer,
} from "@/project/commands/mapCommands";
import { projectModel, type RegistryBlockInfo } from "@/project/model/projectModel";
import { setCurrentFloorId } from "@/stores/editorState";
import { setCurrentLocPos } from "@/stores/locState";
import { notifyCommandResult, notifyError } from "@/utils/notify";
import { MapEditorStore, type CopiedInfo } from "./MapEditorStore";
import { formatLoc } from "./utils/coordinate";
import type { BlockInfo } from "./MaterialPanel/types";

export interface ContextMenuProps {
  /** 楼层 ID */
  floorId: string;
  /** 是否可见 */
  visible: boolean;
  /** 菜单位置 X */
  x: number;
  /** 菜单位置 Y */
  y: number;
  /** 关闭菜单回调 */
  onClose: () => void;
  /** 选中素材回调 */
  onSelectBlock?: (block: BlockInfo | 0) => void;
}

/** 菜单项类型 */
interface MenuItem {
  id: string;
  label: string;
  visible?: boolean;
  onClick: () => void;
}

function registryBlockToBlockInfo(block: RegistryBlockInfo): BlockInfo {
  const record = block as RegistryBlockInfo & { cls?: string; images?: string; y?: number };
  return {
    ...record,
    idnum: block.idnum,
    id: record.id ?? "",
    images: record.images ?? record.cls ?? "terrains",
    y: typeof record.y === "number" ? record.y : block.idnum,
    isTile: block.kind === "tileset",
  };
}

/**
 * ContextMenu 组件
 */
export const ContextMenu: FC<ContextMenuProps> = ({
  floorId,
  visible,
  x,
  y,
  onClose,
  onSelectBlock,
}) => {
  const [floor] = useFloorDataSuspense(floorId);
  const [tower] = useTowerDataSuspense();
  const blockRegistryResource = useMemo(() => projectModel.blockRegistry(), []);
  const blockRegistry = useModelResourceSuspense(blockRegistryResource);
  const store = MapEditorStore.useStore();
  const { state } = store;
  const { pos, layerMod, copiedInfo } = state;
  const floorIds = (tower.main?.floorIds ?? []) as string[];

  // 获取当前图层的地图数据
  const getLayerMap = useCallback(() => {
    switch (layerMod) {
      case "bgmap":
        return floor.bgmap ?? [];
      case "fgmap":
        return floor.fgmap ?? [];
      default:
        return floor.map ?? [];
    }
  }, [floor, layerMod]);

  // 获取当前位置的图块
  const getCurrentBlock = useCallback(() => {
    const map = getLayerMap();
    const cell = map[pos[1]]?.[pos[0]] as BlockInfo | number | 0 | undefined;
    if (cell == null || cell === 0) return 0;
    if (typeof cell === "number") {
      const block = blockRegistry.get(cell);
      if (block) return registryBlockToBlockInfo(block);
      return { idnum: cell, id: "", images: "terrains", y: cell } as BlockInfo;
    }
    return cell;
  }, [getLayerMap, pos, blockRegistry]);

  // 关闭菜单
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // 点击外部关闭
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = () => {
      handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, handleClose]);

  // 选中此点
  const handleChooseThis = useCallback(() => {
    store.setSelectedBlock(undefined);
    handleClose();
    printf?.(`已选中位置 (${pos[0]}, ${pos[1]})`);
  }, [store, pos, handleClose]);

  // 在素材区选中此图块
  const handleChooseInRight = useCallback(() => {
    const block = getCurrentBlock();
    if (block !== undefined) {
      onSelectBlock?.(block);
    }
    handleClose();
  }, [getCurrentBlock, onSelectBlock, handleClose]);

  // 复制此事件
  const handleCopy = useCallback(() => {
    const map = getLayerMap();
    const cell = map[pos[1]]?.[pos[0]];
    const loc = formatLoc(pos);

    // 收集事件数据
    const events: Record<string, unknown> = {};
    for (const field of MAP_EVENT_FIELDS) {
      const fieldData = floor[field as keyof typeof floor] as
        | Record<string, unknown>
        | undefined;
      if (fieldData?.[loc]) {
        events[field] = structuredClone(fieldData[loc]);
      }
    }

    const copiedData: CopiedInfo = {
      w: 1,
      h: 1,
      layer: layerMod,
      data: [
        {
          map: cell as BlockInfo | 0,
          events,
        },
      ],
    };

    store.setCopiedInfo(copiedData);
    handleClose();
    printf?.("该点事件已复制");
  }, [getLayerMap, pos, floor, layerMod, store, handleClose]);

  // 粘贴到此事件
  const handlePaste = useCallback(async () => {
    if (!copiedInfo) {
      notifyError("没有复制的事件");
      handleClose();
      return;
    }

    const data = copiedInfo.data[0];
    if (!data) {
      handleClose();
      return;
    }

    const result = await mapCommands.pasteInfo({
      floorId,
      layer: layerMod as MapLayer,
      pos: { x: pos[0], y: pos[1] },
      info: copiedInfo,
    });

    if (notifyCommandResult(result, "粘贴到事件成功")) {
      store.setHasUnsavedChanges(true);
    }
    handleClose();
  }, [copiedInfo, pos, layerMod, floorId, store, handleClose]);

  // 仅清空此点事件
  const handleClearEvent = useCallback(async () => {
    const result = await mapCommands.clearEvents(floorId, { x: pos[0], y: pos[1] });
    if (notifyCommandResult(result, "只清空该点事件成功")) {
      store.setHasUnsavedChanges(true);
    }
    handleClose();
  }, [pos, floorId, store, handleClose]);

  // 清空此点及事件
  const handleClearLoc = useCallback(async () => {
    const result = await mapCommands.clearLoc(floorId, layerMod as MapLayer, {
      x: pos[0],
      y: pos[1],
    });
    if (notifyCommandResult(result, "清空该点和事件成功")) {
      store.setHasUnsavedChanges(true);
    }
    handleClose();
  }, [pos, layerMod, floorId, store, handleClose]);

  // 判断是否显示附加事件菜单项
  const getExtraEventInfo = useCallback(() => {
    const block = getCurrentBlock();
    const loc = formatLoc(pos);
    const changeFloor = floor.changeFloor as Record<string, unknown> | undefined;

    if (changeFloor?.[loc]) {
      return { visible: true, label: "跳转到目标传送点" };
    }

    if (block === 0 || block === undefined) {
      return { visible: true, label: "绑定出生点为此点" };
    }

    if (block.id === "upFloor") {
      return { visible: true, label: "绑定上楼事件" };
    }

    if (block.id === "downFloor") {
      return { visible: true, label: "绑定下楼事件" };
    }

    if (
      ["leftPortal", "rightPortal", "downPortal", "upPortal"].includes(
        block.id
      )
    ) {
      return { visible: true, label: "绑定楼传事件" };
    }

    if (block.id === "specialDoor") {
      return { visible: true, label: "绑定机关门事件" };
    }

    return null;
  }, [getCurrentBlock, pos, floor]);

  // 处理附加事件
  const handleExtraEvent = useCallback(async () => {
    const info = getExtraEventInfo();
    if (!info) return;

    const currentPos = { x: pos[0], y: pos[1] };
    const loc = formatLoc(pos);
    const changeFloor = floor.changeFloor as Record<string, unknown> | undefined;
    const block = getCurrentBlock();

    if (changeFloor?.[loc]) {
      const result = mapCommands.resolveChangeFloorTarget(floorId, currentPos, floorIds);
      if (result.ok) {
        const { target } = result;
        store.pushRecentFloor(floorId);
        store.setCurrentFloorId(target.floorId);
        setCurrentFloorId(target.floorId);
        if (target.pos) {
          store.setPos([target.pos.x, target.pos.y]);
          store.setViewportOffset([
            Math.max(0, (target.pos.x - 6) * 32),
            Math.max(0, (target.pos.y - 6) * 32),
          ]);
          setCurrentLocPos(target.pos, target.floorId);
        }
        printf?.("已跳转到目标传送点");
      } else {
        notifyCommandResult(result, "");
      }
      handleClose();
      return;
    }

    if (block === 0 || block === undefined) {
      const result = await mapCommands.bindStartPoint(floorId, currentPos);
      notifyCommandResult(result, "绑定出生点成功");
      handleClose();
      return;
    }

    if (block.id === "specialDoor") {
      const countText = window.prompt("请输入需要绑定的怪物数量", "1");
      const count = Number(countText);
      if (!Number.isInteger(count) || count <= 0) {
        notifyError("机关门绑定数量不合法");
        handleClose();
        return;
      }
      store.setBindSpecialDoor({ loc, enemys: [], n: count });
      printf?.("请依次点击需要绑定的怪物");
      handleClose();
      return;
    }

    const result = await mapCommands.bindStair(floorId, currentPos, block.id);
    if (notifyCommandResult(result, `${info.label}成功`)) {
      store.setHasUnsavedChanges(true);
    }
    handleClose();
  }, [getExtraEventInfo, pos, floor, getCurrentBlock, floorId, floorIds, store, handleClose]);

  // 构建菜单项
  const extraEventInfo = getExtraEventInfo();
  const menuItems: MenuItem[] = [
    ...(extraEventInfo
      ? [
          {
            id: "extraEvent",
            label: extraEventInfo.label,
            onClick: handleExtraEvent,
          },
        ]
      : []),
    {
      id: "chooseThis",
      label: `选中此点 (${pos[0]}, ${pos[1]})`,
      onClick: handleChooseThis,
    },
    {
      id: "chooseInRight",
      label: "在素材区选中此图块",
      onClick: handleChooseInRight,
    },
    {
      id: "copyLoc",
      label: "复制此事件",
      onClick: handleCopy,
    },
    {
      id: "pasteLoc",
      label: "粘贴到此事件",
      onClick: handlePaste,
    },
    {
      id: "clearEvent",
      label: "仅清空此点事件",
      onClick: handleClearEvent,
    },
    {
      id: "clearLoc",
      label: "清空此点及事件",
      onClick: handleClearLoc,
    },
  ];

  if (!visible) return null;

  // 使用 Portal 渲染到 body
  return createPortal(
    <div
      id="midMenu"
      data-test-id="context-menu"
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
        background: "var(--bg-color, #fff)",
        border: "1px solid var(--border-color, #ccc)",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: 160,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="menuitem"
          data-test-id={`context-menu-${item.id}`}
          onClick={item.onClick}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            borderBottom: "1px solid var(--border-color, #eee)",
          }}
        >
          <div className="menuitem-content">{item.label}</div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ContextMenu;

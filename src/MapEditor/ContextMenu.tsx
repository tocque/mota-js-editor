/**
 * ContextMenu - 右键菜单组件
 *
 * 地图编辑区的右键菜单
 * 迁移自 editor_mappanel.ts 的菜单相关函数
 */

import { useCallback, useEffect, type FC } from "react";
import { createPortal } from "react-dom";
import { useFloorDataSuspense } from "@/hooks/suspense";
import { floorService } from "@/services/floor";
import { MapEditorStore, type CopiedInfo, type LayerMod } from "./MapEditorStore";
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
  const store = MapEditorStore.useStore();
  const { state } = store;
  const { pos, layerMod, copiedInfo } = state;

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
    return map[pos[1]]?.[pos[0]] as BlockInfo | number | 0 | undefined;
  }, [getLayerMap, pos]);

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
      onSelectBlock?.(block as BlockInfo | 0);
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
    const eventFields = [
      "events",
      "beforeBattle",
      "afterBattle",
      "afterGetItem",
      "afterOpenDoor",
      "changeFloor",
      "autoEvent",
    ];

    for (const field of eventFields) {
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
  const handlePaste = useCallback(() => {
    if (!copiedInfo) {
      printe?.("没有复制的事件");
      handleClose();
      return;
    }

    const data = copiedInfo.data[0];
    if (!data) {
      handleClose();
      return;
    }

    const actions: Array<["change", string, unknown]> = [];
    const loc = formatLoc(pos);

    // 粘贴地图数据
    actions.push(["change", `['${layerMod}'][${pos[1]}][${pos[0]}]`, data.map]);

    // 如果来源是 map 层且目标也是 map 层，粘贴事件
    if (copiedInfo.layer === "map" && layerMod === "map") {
      const eventFields = [
        "events",
        "beforeBattle",
        "afterBattle",
        "afterGetItem",
        "afterOpenDoor",
        "changeFloor",
        "autoEvent",
      ];

      for (const field of eventFields) {
        if (data.events[field] !== undefined) {
          actions.push([
            "change",
            `['${field}']['${loc}']`,
            structuredClone(data.events[field]),
          ]);
        } else {
          // 清除原有事件
          actions.push(["change", `['${field}']['${loc}']`, undefined]);
        }
      }
    }

    floorService.saveFloor(floorId, actions);
    store.setHasUnsavedChanges(true);
    handleClose();
    printf?.("粘贴到事件成功");
  }, [copiedInfo, pos, layerMod, floorId, store, handleClose]);

  // 仅清空此点事件
  const handleClearEvent = useCallback(() => {
    const loc = formatLoc(pos);
    const actions: Array<["change", string, unknown]> = [];

    const eventFields = [
      "events",
      "beforeBattle",
      "afterBattle",
      "afterGetItem",
      "afterOpenDoor",
      "changeFloor",
      "autoEvent",
    ];

    for (const field of eventFields) {
      actions.push(["change", `['${field}']['${loc}']`, undefined]);
    }

    floorService.saveFloor(floorId, actions);
    store.setHasUnsavedChanges(true);
    handleClose();
    printf?.("只清空该点事件成功");
  }, [pos, floorId, store, handleClose]);

  // 清空此点及事件
  const handleClearLoc = useCallback(() => {
    const loc = formatLoc(pos);
    const actions: Array<["change", string, unknown]> = [];

    // 清空地图数据
    actions.push(["change", `['${layerMod}'][${pos[1]}][${pos[0]}]`, 0]);

    // 清空事件
    if (layerMod === "map") {
      const eventFields = [
        "events",
        "beforeBattle",
        "afterBattle",
        "afterGetItem",
        "afterOpenDoor",
        "changeFloor",
        "autoEvent",
      ];

      for (const field of eventFields) {
        actions.push(["change", `['${field}']['${loc}']`, undefined]);
      }
    }

    floorService.saveFloor(floorId, actions);
    store.setHasUnsavedChanges(true);
    handleClose();
    printf?.("清空该点和事件成功");
  }, [pos, layerMod, floorId, store, handleClose]);

  // 判断是否显示附加事件菜单项
  const getExtraEventInfo = useCallback(() => {
    const block = getCurrentBlock();
    if (block === 0 || block === undefined) {
      return { visible: true, label: "绑定出生点为此点" };
    }

    if (typeof block !== "object") return null;

    const loc = formatLoc(pos);
    const changeFloor = floor.changeFloor as Record<string, unknown> | undefined;

    if (changeFloor?.[loc]) {
      return { visible: true, label: "跳转到目标传送点" };
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
  const handleExtraEvent = useCallback(() => {
    const info = getExtraEventInfo();
    if (!info) return;

    // TODO: 实现具体的附加事件绑定逻辑
    handleClose();
    printf?.(`${info.label} 功能待完善`);
  }, [getExtraEventInfo, handleClose]);

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

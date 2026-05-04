/**
 * MapEditor - 地图编辑器主组件
 *
 * 整合所有子组件，提供完整的地图编辑功能
 */

import { useCallback, useEffect, useState, Suspense, type FC } from "react";
import { MapEditorStore } from "./MapEditorStore";
import { MapCanvas } from "./MapCanvas";
import { ContextMenu } from "./ContextMenu";
import { ToolBar } from "./ToolBar";
import { MaterialPanel } from "./MaterialPanel";
import { RecentlyUsedPanel } from "./RecentlyUsedPanel";
import { RowColMarks } from "./RowColMarks";
import type { SelectedBlock, BlockInfo } from "./MaterialPanel/types";

/** 默认楼层 ID */
const DEFAULT_FLOOR_ID = "MT0";

/**
 * 地图编辑器内部组件（需要 Store Provider）
 */
const MapEditorInner: FC = () => {
  const [tipMessage, setTipMessage] = useState("");
  const [tipClass, setTipClass] = useState("");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const store = MapEditorStore.useStore();
  const { state } = store;
  const { currentFloorId, selectedBlock } = state;

  // 使用默认楼层 ID
  const floorId = currentFloorId || DEFAULT_FLOOR_ID;

  // 初始化楼层 ID
  useEffect(() => {
    if (!currentFloorId) {
      store.setCurrentFloorId(DEFAULT_FLOOR_ID);
    }
  }, [currentFloorId, store]);

  // 打印函数
  const print = useCallback((msg: string, cls: string) => {
    if (msg === "") {
      setTipMessage("");
      setTipClass("");
      return;
    }
    setTipMessage(msg);
    setTipClass(cls);
  }, []);

  // 设置全局打印函数
  useEffect(() => {
    window.printf = function (msg: string) {
      print(msg, "successText");
    };
    window.printe = function (msg: unknown) {
      print(String(msg), "warnText");
    };
    window.printi = function (msg: string) {
      print(msg, "infoText");
    };
  }, [print]);

  // 处理素材选中变化
  const handleSelectedBlockChange = useCallback(
    (block: SelectedBlock) => {
      store.setSelectedBlock(block);
    },
    [store]
  );

  // 处理右键菜单显示
  const handleContextMenu = useCallback((x: number, y: number) => {
    setContextMenuPos({ x, y });
    setContextMenuVisible(true);
  }, []);

  // 关闭右键菜单
  const handleCloseContextMenu = useCallback(() => {
    setContextMenuVisible(false);
  }, []);

  // 双击选中素材
  const handleDoubleClickSelect = useCallback(
    (block: BlockInfo | 0) => {
      store.setSelectedBlock(block === 0 ? undefined : block);
    },
    [store]
  );

  // 从右键菜单选中素材
  const handleSelectBlockFromMenu = useCallback(
    (block: BlockInfo | 0) => {
      store.setSelectedBlock(block === 0 ? undefined : block);
    },
    [store]
  );

  // 楼层切换
  const handleFloorChange = useCallback(
    (newFloorId: string) => {
      store.setCurrentFloorId(newFloorId);
    },
    [store]
  );

  // 最近使用面板的选中回调
  const handleRecentlyUsedSelect = useCallback(
    (item: { id: string; images: string; x: number; y: number; isTile?: boolean }) => {
      const block: BlockInfo = {
        idnum: 0, // TODO: 从实际数据中获取
        id: item.id,
        images: item.images,
        y: item.y,
        x: item.x,
        isTile: item.isTile,
      };
      store.setSelectedBlock(block);
    },
    [store]
  );

  return (
    <>
      <div id="mid">
        {/* 行列标记 */}
        <RowColMarks />

        {/* 地图编辑区 */}
        <Suspense fallback={<div className="map" id="mapEdit">Loading...</div>}>
          <MapCanvas
            floorId={floorId}
            onContextMenu={handleContextMenu}
            onDoubleClickSelect={handleDoubleClickSelect}
          />
        </Suspense>

        {/* 工具栏 */}
        <Suspense fallback={<div className="tools">Loading...</div>}>
          <ToolBar
            floorId={floorId}
            tipMessage={tipMessage}
            tipClass={tipClass}
            onFloorChange={handleFloorChange}
          />
        </Suspense>
      </div>

      {/* 最近使用面板 */}
      <RecentlyUsedPanel
        items={[]}
        selectedId={
          typeof selectedBlock === "object" ? selectedBlock?.id : undefined
        }
        onSelect={handleRecentlyUsedSelect}
      />

      {/* 素材面板 */}
      <MaterialPanel
        selectedBlock={selectedBlock}
        onSelectedBlockChange={handleSelectedBlockChange}
      />

      {/* 右键菜单 */}
      <Suspense fallback={null}>
        <ContextMenu
          floorId={floorId}
          visible={contextMenuVisible}
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={handleCloseContextMenu}
          onSelectBlock={handleSelectBlockFromMenu}
        />
      </Suspense>
    </>
  );
};

/**
 * MapEditor 导出组件
 *
 * 包装 Provider 提供状态管理
 */
export const MapEditor: FC = () => (
  <MapEditorStore.Provider>
    <MapEditorInner />
  </MapEditorStore.Provider>
);

export default MapEditor;

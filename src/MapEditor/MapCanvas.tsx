/**
 * MapCanvas - 地图画布交互组件
 *
 * 处理地图编辑区域的所有鼠标交互
 * 迁移自 editor_mappanel.ts 的鼠标事件处理
 */

import { useCallback, useEffect, useRef, type FC, type MouseEvent } from "react";
import { useNode } from "@/hooks/useNode";
import { useFloorDataSuspense } from "@/hooks/suspense";
import { floorService } from "@/services/floor";
import type { LocPOD } from "@/utils/coordinate";
import { MapEditorStore } from "./MapEditorStore";
import { EventOverlay } from "./EventOverlay";
import {
  eToLoc,
  locToPos,
  locToPosBigmap,
  posToDrawLoc,
  isSamePos,
  formatLoc,
  CANVAS_SIZE,
  TILE_SIZE,
  GRID_COUNT,
} from "./utils/coordinate";
import {
  drawArrow,
  drawSelectionRect,
  fillPathPoint,
  drawSelectionRectBigmap,
} from "./utils/drawHelpers";
import { fillModeBfs } from "./utils/fillBfs";
import type { BlockInfo } from "./MaterialPanel/types";

export interface MapCanvasProps {
  /** 楼层 ID */
  floorId: string;
  /** 右键菜单显示回调 */
  onContextMenu?: (x: number, y: number) => void;
  /** 双击选中素材回调 */
  onDoubleClickSelect?: (block: BlockInfo | 0) => void;
}

/**
 * MapCanvas 组件
 */
export const MapCanvas: FC<MapCanvasProps> = ({
  floorId,
  onContextMenu,
  onDoubleClickSelect,
}) => {
  const [uiCanvas, mountUiCanvas] = useNode<HTMLCanvasElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [floor, updateFloor] = useFloorDataSuspense(floorId);
  const store = MapEditorStore.useStore();
  const { state } = store;

  const {
    pos,
    selectedBlock,
    layerMod,
    brushMod,
    bigmap,
    bigmapInfo,
    viewportOffset,
    holdingPath,
    stepPostfix,
    startPos,
    endPos,
    bindSpecialDoor,
    tileSize,
  } = state;

  const floorWidth = (floor.width ?? GRID_COUNT) as number;
  const floorHeight = (floor.height ?? GRID_COUNT) as number;

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

  // 清除 UI Canvas
  const clearUiCanvas = useCallback(() => {
    if (!uiCanvas) return;
    const ctx = uiCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
  }, [uiCanvas]);

  // 获取格子位置
  const getPos = useCallback(
    (e: MouseEvent): LocPOD => {
      if (!containerRef.current) return [0, 0];

      const loc = eToLoc(e, containerRef.current);

      if (bigmap) {
        return locToPosBigmap(loc, bigmapInfo, floorWidth, floorHeight);
      }

      return locToPos(loc, viewportOffset);
    },
    [bigmap, bigmapInfo, viewportOffset, floorWidth, floorHeight]
  );

  // 判断是否已选中素材
  const isBlockSelected = useCallback(() => {
    return selectedBlock !== undefined && selectedBlock !== 0;
  }, [selectedBlock]);

  // 鼠标按下
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      store.setSelectedArea(null);

      const currentPos = getPos(e);
      store.setPos(currentPos);

      // 机关门绑定模式
      if (bindSpecialDoor.loc !== null) {
        const loc = formatLoc(currentPos);
        const map = getLayerMap();
        const cell = map[currentPos[1]]?.[currentPos[0]];
        const cellId = typeof cell === "object" && cell ? cell.id : undefined;

        // TODO: 检测是否是怪物，需要接入 enemyService
        if (cellId) {
          const index = bindSpecialDoor.enemys.indexOf(loc);
          const newEnemys = [...bindSpecialDoor.enemys];

          if (index >= 0) {
            newEnemys.splice(index, 1);
          } else {
            newEnemys.push(loc);
          }

          store.setBindSpecialDoor({
            ...bindSpecialDoor,
            enemys: newEnemys,
          });

          // 检查是否完成绑定
          if (newEnemys.length === bindSpecialDoor.n) {
            // TODO: 执行机关门绑定操作
          }
        }
        return;
      }

      // 未选中素材时进入选点模式
      if (!isBlockSelected()) {
        store.setStartPos(currentPos);
        return;
      }

      // 已选中素材时开始绘图
      store.setHoldingPath(true);
      store.clearStepPostfix();
      store.pushStepPostfix(currentPos);
      clearUiCanvas();

      if (brushMod === "line" && uiCanvas) {
        const ctx = uiCanvas.getContext("2d");
        if (ctx) {
          fillPathPoint(ctx, currentPos, viewportOffset);
        }
      }
    },
    [
      store,
      getPos,
      bindSpecialDoor,
      isBlockSelected,
      brushMod,
      uiCanvas,
      viewportOffset,
      getLayerMap,
      clearUiCanvas,
    ]
  );

  // 鼠标移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentPos = getPos(e);

      // 更新悬停位置（用于行列标记高亮）
      if (!bigmap) {
        store.setHoverPos(currentPos);
      }

      // 未选中素材时绘制箭头或选区
      if (!isBlockSelected()) {
        if (startPos === null) return;

        if (isSamePos(endPos, currentPos)) return;
        store.setEndPos(currentPos);

        if (!uiCanvas) return;
        const ctx = uiCanvas.getContext("2d");
        if (!ctx) return;

        clearUiCanvas();

        if (!isSamePos(startPos, currentPos)) {
          if (e.buttons === 2) {
            // 右键拖拽：绘制选区
            if (bigmap) {
              drawSelectionRectBigmap(ctx, startPos, currentPos, bigmapInfo);
            } else {
              drawSelectionRect(ctx, startPos, currentPos, viewportOffset);
            }
          } else {
            // 左键拖拽：绘制箭头
            const startDraw = bigmap
              ? [
                  bigmapInfo.left + startPos[0] * bigmapInfo.size + bigmapInfo.size / 2,
                  bigmapInfo.top + startPos[1] * bigmapInfo.size + bigmapInfo.size / 2,
                ]
              : posToDrawLoc(startPos, viewportOffset);
            const endDraw = bigmap
              ? [
                  bigmapInfo.left + currentPos[0] * bigmapInfo.size + bigmapInfo.size / 2,
                  bigmapInfo.top + currentPos[1] * bigmapInfo.size + bigmapInfo.size / 2,
                ]
              : posToDrawLoc(currentPos, viewportOffset);

            drawArrow(
              ctx,
              startDraw[0] + TILE_SIZE / 2,
              startDraw[1] + TILE_SIZE / 2,
              endDraw[0] + TILE_SIZE / 2,
              endDraw[1] + TILE_SIZE / 2
            );
          }
        }
        return;
      }

      // 绘图模式
      if (!holdingPath) return;

      const lastPos = stepPostfix[stepPostfix.length - 1];
      if (!lastPos) return;

      // 计算与最后一点相邻的方向
      const dx = currentPos[0] - lastPos[0];
      const dy = currentPos[1] - lastPos[1];

      const directions = [dy, -dx, -dy, dx]; // 下、左、上、右
      let maxDir = 0;
      let maxIndex = -1;

      for (let i = 0; i < 4; i++) {
        if (directions[i] > maxDir) {
          maxDir = directions[i];
          maxIndex = i;
        }
      }

      if (maxIndex < 0) return;

      const dirOffsets: LocPOD[] = [
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, 0],
      ];
      const [offX, offY] = dirOffsets[maxIndex];
      const nextPos: LocPOD = [lastPos[0] + offX, lastPos[1] + offY];

      store.pushStepPostfix(nextPos);

      if (!uiCanvas) return;
      const ctx = uiCanvas.getContext("2d");
      if (!ctx) return;

      if (brushMod === "line") {
        fillPathPoint(ctx, nextPos, viewportOffset);
      } else {
        // 矩形/tileset 模式：绘制矩形预览
        clearUiCanvas();
        const firstPos = stepPostfix[0];
        if (bigmap) {
          drawSelectionRectBigmap(ctx, firstPos, nextPos, bigmapInfo);
        } else {
          drawSelectionRect(ctx, firstPos, nextPos, viewportOffset);
        }
      }
    },
    [
      getPos,
      isBlockSelected,
      startPos,
      endPos,
      store,
      uiCanvas,
      bigmap,
      bigmapInfo,
      viewportOffset,
      holdingPath,
      stepPostfix,
      brushMod,
      clearUiCanvas,
    ]
  );

  // 鼠标抬起
  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const currentPos = getPos(e);

      // 右键单击显示菜单
      if (e.button === 2 && (endPos === null || isSamePos(startPos, endPos))) {
        onContextMenu?.(e.clientX, e.clientY);
        store.clearStepPostfix();
        clearUiCanvas();
        store.clearDragState();
        return;
      }

      // 未选中素材时的拖拽操作
      if (!isBlockSelected()) {
        if (e.button === 2 && startPos && endPos) {
          // 右键拖拽：选中区域
          store.setSelectedArea([startPos, endPos]);
          printf?.("已经选中该区域");
        } else if (startPos && endPos && !isSamePos(startPos, endPos)) {
          // 左键拖拽：交换位置
          // TODO: 实现 exchangePos 功能
          printf?.("交换位置功能待实现");
        }
        clearUiCanvas();
        store.clearDragState();
        return;
      }

      // 绘图模式完成
      store.setHoldingPath(false);

      if (stepPostfix.length === 0) return;

      // 收集要绘制的位置
      let positions = [...stepPostfix];

      // 矩形模式：展开为所有点
      if (brushMod !== "line") {
        const first = positions[0];
        const last = positions[positions.length - 1];
        let [x0, y0] = first;
        let [x1, y1] = last;

        if (x0 > x1) [x0, x1] = [x1, x0];
        if (y0 > y1) [y0, y1] = [y1, y0];

        positions = [];
        for (let j = y0; j <= y1; j++) {
          for (let i = x0; i <= x1; i++) {
            positions.push([i, j]);
          }
        }
      }

      // 单点且 tileSize > 1 时展开
      if (
        positions.length === 1 &&
        (tileSize[0] > 1 || tileSize[1] > 1)
      ) {
        const [px, py] = positions[0];
        positions = [];
        for (let j = py; j < py + tileSize[1]; j++) {
          for (let i = px; i < px + tileSize[0]; i++) {
            if (j < floorHeight && i < floorWidth) {
              positions.push([i, j]);
            }
          }
        }
      }

      // 填充模式：BFS 寻找连通区域
      if (positions.length === 1 && brushMod === "fill") {
        const [px, py] = positions[0];
        const map = getLayerMap();
        positions = fillModeBfs(
          map as (BlockInfo | number | 0)[][],
          px,
          py,
          floorWidth,
          floorHeight
        );
      }

      // 应用修改
      const actions: Array<["change", string, unknown]> = [];

      for (const [px, py] of positions) {
        const path = `['${layerMod}'][${py}][${px}]`;
        actions.push(["change", path, selectedBlock]);

        // 自动绑定楼梯事件
        if (layerMod === "map" && selectedBlock && typeof selectedBlock === "object") {
          const loc = `${px},${py}`;
          if (selectedBlock.id === "upFloor") {
            actions.push([
              "change",
              `['changeFloor']['${loc}']`,
              { floorId: ":next", stair: "downFloor" },
            ]);
          } else if (selectedBlock.id === "downFloor") {
            actions.push([
              "change",
              `['changeFloor']['${loc}']`,
              { floorId: ":before", stair: "upFloor" },
            ]);
          }
        }
      }

      if (actions.length > 0) {
        floorService.saveFloor(floorId, actions);
        store.setHasUnsavedChanges(true);

        // TODO: 更新最近使用记录
      }

      store.clearStepPostfix();
      clearUiCanvas();
    },
    [
      getPos,
      endPos,
      startPos,
      onContextMenu,
      store,
      clearUiCanvas,
      isBlockSelected,
      stepPostfix,
      brushMod,
      tileSize,
      floorWidth,
      floorHeight,
      getLayerMap,
      layerMod,
      selectedBlock,
      floorId,
    ]
  );

  // 鼠标移出
  const handleMouseLeave = useCallback(() => {
    // 清除悬停位置（取消行列标记高亮）
    store.setHoverPos(null);
  }, [store]);

  // 双击选中素材
  const handleDoubleClick = useCallback(
    (e: MouseEvent) => {
      if (bindSpecialDoor.loc !== null) return;

      const currentPos = getPos(e);
      const map = getLayerMap();
      const cell = map[currentPos[1]]?.[currentPos[0]];

      if (cell !== undefined) {
        onDoubleClickSelect?.(cell as BlockInfo | 0);
      }
    },
    [bindSpecialDoor, getPos, getLayerMap, onDoubleClickSelect]
  );

  // 滚轮切换楼层
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // 如果有未保存的修改，不允许切换楼层
      if (state.hasUnsavedChanges) return;

      // TODO: 实现楼层切换逻辑
      // 需要获取 floorIds 列表
    },
    [state.hasUnsavedChanges]
  );

  // 阻止右键菜单
  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={containerRef}
      className="map"
      id="mapEdit"
    >
      {/* 背景层 Canvas */}
      <canvas
        className="gameCanvas"
        id="ebm"
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
      />
      {/* 事件标记层 */}
      <EventOverlay floorId={floorId} />
      {/* UI 交互层 Canvas */}
      <canvas
        ref={mountUiCanvas}
        className="gameCanvas"
        id="eui"
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ position: "absolute", zIndex: 100 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default MapCanvas;

/**
 * MapCanvas - 地图画布交互组件
 *
 * 处理地图编辑区域的所有鼠标交互
 * 迁移自 editor_mappanel.ts 的鼠标事件处理
 */

import { useCallback, useEffect, useMemo, useRef, useState, type FC, type MouseEvent } from "react";
import { useNode } from "@/hooks/useNode";
import { useModelResourceSuspense, useTowerDataSuspense } from "@/hooks/suspense";
import { useData } from "@/hooks/useData";
import { mapCommands, type MapLayer } from "@/project/commands/mapCommands";
import { projectModel, type BlockRegistry, type RegistryBlockInfo } from "@/project/model/projectModel";
import { floorService } from "@/services/floor";
import type { FloorData } from "@/types";
import { setCurrentLocPos } from "@/stores/locState";
import { notifyCommandResult, notifyError } from "@/utils/notify";
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
import type { BlockInfo, SelectedBlock } from "./MaterialPanel/types";
import { MapPixiRenderer } from "./rendering/MapPixiRenderer";

export interface MapCanvasProps {
  /** 楼层 ID */
  floorId: string;
  /** 右键菜单显示回调 */
  onContextMenu?: (x: number, y: number) => void;
  /** 双击选中素材回调 */
  onDoubleClickSelect?: (block: BlockInfo | 0) => void;
}

type MapCell = unknown;

interface DisplayFloorState {
  floorId: string;
  floor: FloorData;
}

function blockToSelectedBlock(block: RegistryBlockInfo): BlockInfo {
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

function cellToSelectedBlock(cell: MapCell, registry: BlockRegistry): SelectedBlock | undefined {
  if (cell == null) return undefined;
  if (cell === 0) return 0;
  if (typeof cell === "number") {
    const block = registry.get(cell);
    if (block) return blockToSelectedBlock(block);
    return { idnum: cell, id: "", images: "terrains", y: cell };
  }
  if (typeof cell === "object") {
    const record = cell as Partial<BlockInfo>;
    if (typeof record.idnum === "number") return record as BlockInfo;
  }
  return undefined;
}

function parseLocKey(key: string): { x: number; y: number } | null {
  const [x, y] = key.split(",").map(Number);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
  return { x, y };
}

function isEnemyBlock(block: SelectedBlock | undefined): boolean {
  if (block === undefined || block === 0) return false;
  return block.images === "enemys" || block.images === "enemy48";
}

function useDisplayFloor(floorId: string): DisplayFloorState & { isStale: boolean } {
  const handler = useMemo(() => floorService.getHandler(floorId), [floorId]);
  const [content] = useData(handler);
  const [lastLoaded, setLastLoaded] = useState<DisplayFloorState | null>(null);

  useEffect(() => {
    if (content.status === "loaded") {
      setLastLoaded({ floorId, floor: content.value });
    }
  }, [content, floorId]);

  if (content.status === "idle") {
    void handler.refetch();
  }

  if (content.status === "loaded") {
    return { floorId, floor: content.value, isStale: false };
  }

  if (content.status === "loading" || content.status === "idle") {
    if (lastLoaded) return { ...lastLoaded, isStale: true };
    throw handler.waitForSettled();
  }

  throw handler;
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

  const { floor, floorId: displayFloorId, isStale } = useDisplayFloor(floorId);
  const [tower] = useTowerDataSuspense();
  const tilesets = useMemo(
    () => Array.isArray(tower.main.tilesets) ? tower.main.tilesets.filter((item): item is string => typeof item === "string") : [],
    [tower.main.tilesets],
  );
  const blockRegistryResource = useMemo(() => projectModel.blockRegistry(), []);
  const blockRegistry = useModelResourceSuspense(blockRegistryResource);
  const spriteRegistryResource = useMemo(() => projectModel.spriteRegistry(), []);
  const spriteRegistry = useModelResourceSuspense(spriteRegistryResource);
  const store = MapEditorStore.useStore();
  const { state } = store;

  const {
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
    async (e: MouseEvent) => {
      store.setSelectedArea(null);
      if (isStale) return;

      const currentPos = getPos(e);
      store.setPos(currentPos);

      // 机关门绑定模式
      if (bindSpecialDoor.loc !== null) {
        const loc = formatLoc(currentPos);
        const map = getLayerMap();
        const cell = map[currentPos[1]]?.[currentPos[0]] as unknown;
        const block = cellToSelectedBlock(cell, blockRegistry);

        if (isEnemyBlock(block)) {
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
            const doorPos = parseLocKey(bindSpecialDoor.loc);
            if (!doorPos) {
              notifyError(`机关门坐标不合法：${bindSpecialDoor.loc}`);
              store.clearBindSpecialDoor();
              return;
            }

            const result = await mapCommands.bindSpecialDoor(
              displayFloorId,
              doorPos,
              newEnemys.map((key) => {
                const parsed = parseLocKey(key);
                if (!parsed) throw new Error(`怪物坐标不合法：${key}`);
                return parsed;
              }),
            );
            if (notifyCommandResult(result, "绑定机关门事件成功")) {
              store.setHasUnsavedChanges(true);
            }
            store.clearBindSpecialDoor();
          }
        } else {
          notifyError("请选择怪物位置");
        }
        return;
      }

      // 未选中素材时进入选点模式
      if (!isBlockSelected()) {
        setCurrentLocPos({ x: currentPos[0], y: currentPos[1] }, displayFloorId);
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
      displayFloorId,
      bindSpecialDoor,
      isStale,
      isBlockSelected,
      brushMod,
      uiCanvas,
      viewportOffset,
      getLayerMap,
      blockRegistry,
      clearUiCanvas,
    ]
  );

  // 鼠标移动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isStale) return;
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
      isStale,
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
    async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isStale) {
        store.clearStepPostfix();
        clearUiCanvas();
        store.clearDragState();
        return;
      }

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
          const result = await mapCommands.exchangeLoc({
            floorId: displayFloorId,
            layer: layerMod as MapLayer,
            from: { x: startPos[0], y: startPos[1] },
            to: { x: endPos[0], y: endPos[1] },
          });
          if (notifyCommandResult(result, "交换位置成功")) {
            store.setHasUnsavedChanges(true);
          }
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

      if (positions.length > 0) {
        try {
          const result = await mapCommands.paint({
            floorId: displayFloorId,
            layer: layerMod as MapLayer,
            positions: positions.map(([x, y]) => ({ x, y })),
            block: selectedBlock,
          });
          if (result.ok) {
            store.setHasUnsavedChanges(true);
            // TODO: 更新最近使用记录
          } else {
            notifyCommandResult(result, "");
          }
        } catch (error) {
          notifyError(error);
        } finally {
          store.clearStepPostfix();
          clearUiCanvas();
        }
        return;
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
      displayFloorId,
      isStale,
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
      if (isStale) return;

      const currentPos = getPos(e);
      const map = getLayerMap();
      const cell = map[currentPos[1]]?.[currentPos[0]];
      const block = cellToSelectedBlock(cell, blockRegistry);

      if (block !== undefined) {
        onDoubleClickSelect?.(block);
      }
    },
    [bindSpecialDoor, isStale, getPos, getLayerMap, blockRegistry, onDoubleClickSelect]
  );

  // 滚轮切换楼层
  const handleWheel = useCallback(
    () => {
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
      {/* 背景层 Pixi 渲染 */}
      <MapPixiRenderer
        floor={floor}
        blockRegistry={blockRegistry}
        spriteRegistry={spriteRegistry}
        tilesets={tilesets}
        activeLayer={layerMod as "bgmap" | "map" | "fgmap"}
        bigmap={bigmap}
        viewportOffset={viewportOffset}
      />
      {/* 事件标记层 */}
      <EventOverlay floorId={displayFloorId} />
      {/* UI 交互层 Canvas */}
      <canvas
        ref={mountUiCanvas}
        className="gameCanvas"
        id="eui"
        data-test-id="map-canvas-input"
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ position: "absolute", zIndex: 100, pointerEvents: isStale ? "none" : undefined }}
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

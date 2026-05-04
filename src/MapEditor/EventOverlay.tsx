/**
 * EventOverlay - 事件标记覆盖层
 *
 * 在地图上绘制事件标记、选中位置等信息
 * 迁移自 editor.drawEventBlock() 和 editor.drawPosSelection()
 */

import { useEffect, useCallback, type FC } from "react";
import { useNode } from "@/hooks/useNode";
import { useFloorDataSuspense, useTowerDataSuspense } from "@/hooks/suspense";
import { MapEditorStore } from "./MapEditorStore";

/** 事件颜色映射 */
const EVENT_COLORS = {
  events: "#FF0000", // 红色 - 事件
  autoEvent: "#FFA500", // 橙色 - 自动事件
  beforeBattle: "#0000FF", // 蓝色 - 战前事件
  afterBattle: "#FFFF00", // 黄色 - 战后事件
  changeFloor: "#00FF00", // 绿色 - 楼层传送
  afterGetItem: "#00FFFF", // 青色 - 获取物品后
  afterOpenDoor: "#FF00FF", // 紫色 - 开门后
} as const;

/** Canvas 尺寸常量 */
const CANVAS_SIZE = 416; // core.__PIXELS__ 默认值
const TILE_SIZE = 32;
const GRID_SIZE = 13; // core.__SIZE__ 默认值

export interface EventOverlayProps {
  /** 楼层 ID */
  floorId: string;
}

/**
 * 获取位置的事件颜色列表
 */
function getEventColors(
  loc: string,
  floorData: Record<string, unknown>
): string[] {
  const colors: string[] = [];

  if (floorData.events?.[loc as keyof typeof floorData.events]) {
    colors.push(EVENT_COLORS.events);
  }

  const autoEvent = floorData.autoEvent as Record<string, unknown> | undefined;
  if (autoEvent?.[loc]) {
    const x = autoEvent[loc] as Record<string, unknown>;
    for (const index in x) {
      if (x[index] && (x[index] as Record<string, unknown>).data) {
        colors.push(EVENT_COLORS.autoEvent);
        break;
      }
    }
  }

  if (
    (floorData.beforeBattle as Record<string, unknown> | undefined)?.[loc]
  ) {
    colors.push(EVENT_COLORS.beforeBattle);
  }

  if (
    (floorData.afterBattle as Record<string, unknown> | undefined)?.[loc]
  ) {
    colors.push(EVENT_COLORS.afterBattle);
  }

  if (
    (floorData.changeFloor as Record<string, unknown> | undefined)?.[loc]
  ) {
    colors.push(EVENT_COLORS.changeFloor);
  }

  if (
    (floorData.afterGetItem as Record<string, unknown> | undefined)?.[loc]
  ) {
    colors.push(EVENT_COLORS.afterGetItem);
  }

  if (
    (floorData.afterOpenDoor as Record<string, unknown> | undefined)?.[loc]
  ) {
    colors.push(EVENT_COLORS.afterOpenDoor);
  }

  return colors;
}

/**
 * EventOverlay 组件
 */
export const EventOverlay: FC<EventOverlayProps> = ({ floorId }) => {
  const [canvas, mountCanvas] = useNode<HTMLCanvasElement>();
  const [floor] = useFloorDataSuspense(floorId);
  const [tower] = useTowerDataSuspense();
  const { state } = MapEditorStore.useStore();

  const {
    pos,
    bigmap,
    bigmapInfo,
    viewportOffset,
    showMovable,
    bindSpecialDoor,
  } = state;

  // 绘制事件标记
  const drawEventBlock = useCallback(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const floorWidth = (floor.width ?? GRID_SIZE) as number;
    const floorHeight = (floor.height ?? GRID_SIZE) as number;

    // 大地图模式
    if (bigmap) {
      drawEventBlockBigmap(ctx, floorWidth, floorHeight);
      return;
    }

    // 显示通行度模式
    if (showMovable) {
      drawMovableOverlay(ctx, floorWidth, floorHeight);
      return;
    }

    // 获取出生点信息
    const firstData = tower.firstData as
      | { floorId: string; hero: { loc: { x: number; y: number } } }
      | undefined;

    const [offsetX, offsetY] = viewportOffset;

    // 遍历可见区域绘制事件标记
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const x = i + Math.floor(offsetX / TILE_SIZE);
        const y = j + Math.floor(offsetY / TILE_SIZE);
        const loc = `${x},${y}`;

        // 绘制出生点标记 "S"
        if (
          firstData &&
          floorId === firstData.floorId &&
          loc === `${firstData.hero.loc.x},${firstData.hero.loc.y}`
        ) {
          ctx.textAlign = "center";
          ctx.font = "bold 30px Verdana";
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.strokeText("S", TILE_SIZE * i + 16, TILE_SIZE * j + 28);
          ctx.fillText("S", TILE_SIZE * i + 16, TILE_SIZE * j + 28);
        }

        // 绘制事件颜色标记
        const colors = getEventColors(loc, floor as Record<string, unknown>);
        for (let k = 0; k < colors.length; k++) {
          ctx.fillStyle = colors[k];
          ctx.fillRect(
            TILE_SIZE * i + 8 * k,
            TILE_SIZE * j + TILE_SIZE - 8,
            8,
            8
          );
        }

        // 绘制机关门绑定的怪物编号
        const enemyIndex = bindSpecialDoor.enemys.indexOf(loc);
        if (enemyIndex >= 0) {
          ctx.textAlign = "right";
          ctx.font = "14px Verdana";
          ctx.fillStyle = "#FF7F00";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1;
          ctx.strokeText(
            String(enemyIndex + 1),
            TILE_SIZE * i + 28,
            TILE_SIZE * j + 15
          );
          ctx.fillText(
            String(enemyIndex + 1),
            TILE_SIZE * i + 28,
            TILE_SIZE * j + 15
          );
        }

        // 绘制楼梯标记
        let symbolOffset = 0;
        const upFloor = floor.upFloor as [number, number] | undefined;
        const downFloor = floor.downFloor as [number, number] | undefined;
        const flyPoint = (floor as Record<string, unknown>).flyPoint as
          | [number, number]
          | undefined;

        if (upFloor && `${upFloor[0]},${upFloor[1]}` === loc) {
          ctx.textAlign = "left";
          ctx.font = "8px Verdana";
          ctx.fillText("🔼", TILE_SIZE * i + symbolOffset, TILE_SIZE * j + 8);
          symbolOffset += 8;
        }

        if (downFloor && `${downFloor[0]},${downFloor[1]}` === loc) {
          ctx.textAlign = "left";
          ctx.font = "8px Verdana";
          ctx.fillText("🔽", TILE_SIZE * i + symbolOffset, TILE_SIZE * j + 8);
          symbolOffset += 8;
        }

        if (flyPoint && `${flyPoint[0]},${flyPoint[1]}` === loc) {
          ctx.textAlign = "left";
          ctx.font = "8px Verdana";
          ctx.fillText("🔃", TILE_SIZE * i + symbolOffset, TILE_SIZE * j + 8);
        }
      }
    }
  }, [
    canvas,
    floor,
    tower,
    floorId,
    bigmap,
    viewportOffset,
    showMovable,
    bindSpecialDoor,
  ]);

  // 大地图模式绘制
  const drawEventBlockBigmap = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      floorWidth: number,
      floorHeight: number
    ) => {
      const { top, left, size } = bigmapInfo;
      const psize = size / 4;

      for (let i = 0; i < floorWidth; i++) {
        for (let j = 0; j < floorHeight; j++) {
          const loc = `${i},${j}`;
          const colors = getEventColors(loc, floor as Record<string, unknown>);

          for (let k = 0; k < colors.length; k++) {
            ctx.fillStyle = colors[k];
            ctx.fillRect(
              left + size * i + psize * k,
              top + size * (j + 1) - psize,
              psize,
              psize
            );
          }
        }
      }
    },
    [bigmapInfo, floor]
  );

  // 绘制通行度覆盖层
  const drawMovableOverlay = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      _floorWidth: number,
      _floorHeight: number
    ) => {
      // 半透明遮罩
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // TODO: 实现完整的通行度显示
      // 需要从 core.generateMovableArray() 获取数据
      // 这里暂时只绘制遮罩
    },
    []
  );

  // 绘制位置选择框
  const drawPosSelection = useCallback(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "rgba(255,255,255,0.7)";

    if (bigmap) {
      const { top, left, size } = bigmapInfo;
      const psize = size / 8;
      ctx.lineWidth = psize;
      ctx.strokeRect(
        left + pos[0] * size + psize,
        top + pos[1] * size + psize,
        size - 2 * psize,
        size - 2 * psize
      );
    } else {
      const [offsetX, offsetY] = viewportOffset;
      ctx.lineWidth = 4;
      ctx.strokeRect(
        TILE_SIZE * pos[0] - offsetX + 4,
        TILE_SIZE * pos[1] - offsetY + 4,
        24,
        24
      );
    }
  }, [canvas, pos, bigmap, bigmapInfo, viewportOffset]);

  // 合并绘制
  const draw = useCallback(() => {
    drawEventBlock();
    drawPosSelection();
  }, [drawEventBlock, drawPosSelection]);

  // 监听状态变化重绘
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={mountCanvas}
      className="gameCanvas"
      id="efg"
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      style={{ position: "absolute", zIndex: 50 }}
    />
  );
};

export default EventOverlay;

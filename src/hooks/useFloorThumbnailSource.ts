import { useEffect, useState } from "react";
import { useGameCore } from "@/stores/GameDataStore";
import type { CoreType } from "@/types";

/**
 * 楼层缩略图视口配置
 */
export type FloorThumbnailViewport =
  | { mode: "all" } // 整图缩放
  | { mode: "partial"; centerX: number; centerY: number }; // 局部视口

/**
 * 楼层缩略图选项
 */
export interface FloorThumbnailOptions {
  /** 楼层 ID */
  floorId: string;
  /** 视口配置 */
  viewport: FloorThumbnailViewport;
}

/**
 * 扩展的 Core 类型，包含清除地图方法
 */
type CoreWithClearMap = CoreType & {
  clearMap: (ctx: CanvasRenderingContext2D) => void;
};

/**
 * 生成楼层缩略图的 Hook
 * 返回一个离屏 canvas，可作为 GridCanvas 的 source
 *
 * @param options - 楼层缩略图选项
 * @returns 离屏 canvas 或 null
 */
export const useFloorThumbnailSource = (
  options: FloorThumbnailOptions,
): HTMLCanvasElement | null => {
  const { floorId, viewport } = options;
  const core = useGameCore<CoreWithClearMap>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  // 提取 viewport 的原始值以避免对象引用导致的无限循环
  const viewportMode = viewport.mode;
  const viewportCenterX = viewport.mode === "partial" ? viewport.centerX : 0;
  const viewportCenterY = viewport.mode === "partial" ? viewport.centerY : 0;

  useEffect(() => {
    if (!core || !floorId) {
      setCanvas(null);
      return;
    }

    // 创建离屏 canvas
    const offscreen = document.createElement("canvas");
    offscreen.width = core.__PIXELS__;
    offscreen.height = core.__PIXELS__;
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      setCanvas(null);
      return;
    }

    // 清除并绘制缩略图
    core.clearMap(ctx);

    if (viewportMode === "all") {
      core.drawThumbnail(floorId, null, { ctx, all: true });
    } else {
      core.drawThumbnail(floorId, null, {
        ctx,
        centerX: viewportCenterX,
        centerY: viewportCenterY,
        all: false,
      });
    }

    setCanvas(offscreen);
  }, [core, floorId, viewportMode, viewportCenterX, viewportCenterY]);

  return canvas;
};

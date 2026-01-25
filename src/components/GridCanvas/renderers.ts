import type { GridPOD, LocPOD } from "@/utils/coordinate";
import type { MarkerRenderer } from "./types";

/**
 * 绘制选择框标记
 * 实现三层边框效果：外层黑色 (3px) → 中间白色 (2px) → 内层黑色 (1px)
 *
 * @param label - 可选标签文本
 * @param labelOffset - 标签偏移位置
 */
export const selectionBox = (
  label?: string,
  labelOffset: { top: number; left: number } = { top: 0, left: 2 },
): MarkerRenderer => {
  return (ctx: CanvasRenderingContext2D, pixelPos: LocPOD, gridSize: GridPOD): void => {
    const [boxX, boxY] = pixelPos;
    const [gridWidth, gridHeight] = gridSize;

    ctx.save();

    const marginLeft = 3;
    const marginTop = 3;
    const adjustedX = boxX + marginLeft;
    const adjustedY = boxY + marginTop;
    const adjustedWidth = gridWidth - 6;
    const adjustedHeight = gridHeight - 6;

    // 绘制外层黑边 (box-shadow: 0 0 0 3px #000)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      adjustedX - 1.5,
      adjustedY - 1.5,
      adjustedWidth + 3,
      adjustedHeight + 3,
    );

    // 绘制中间白边 (box-shadow: 0 0 0 2px #fff)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      adjustedX - 0.5,
      adjustedY - 0.5,
      adjustedWidth + 1,
      adjustedHeight + 1,
    );

    // 绘制内层黑边 (border: 1px solid #000)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(adjustedX, adjustedY, adjustedWidth, adjustedHeight);

    // 绘制数字标签（如果提供）
    if (label) {
      const labelX = adjustedX + labelOffset.left;
      const labelY = adjustedY + labelOffset.top;

      // 绘制文字描边
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.font = "bold 14px Arial";
      ctx.textBaseline = "top";
      ctx.strokeText(label, labelX, labelY);

      // 绘制文字填充
      ctx.fillStyle = "#fff";
      ctx.fillText(label, labelX, labelY);
    }

    ctx.restore();
  };
};

/**
 * 绘制文字标签
 * 在网格右下角绘制带描边的文字
 *
 * @param text - 标签文本
 * @param color - 文字颜色，默认橙色
 */
export const labelText = (text: string, color = "#FF7F00"): MarkerRenderer => {
  return (ctx: CanvasRenderingContext2D, pixelPos: LocPOD, gridSize: GridPOD): void => {
    const [x, y] = pixelPos;
    const [width, height] = gridSize;

    ctx.save();
    ctx.textAlign = "right";
    ctx.font = "14px Verdana";
    ctx.fillStyle = color;
    ctx.fillText(String(text), x + width - 4, y + height - 6);
    ctx.restore();
  };
};

/**
 * 组合多个渲染器
 * 按顺序执行所有渲染器
 *
 * @param renderers - 要组合的渲染器数组
 */
export const compose = (...renderers: MarkerRenderer[]): MarkerRenderer => {
  return (ctx: CanvasRenderingContext2D, pixelPos: LocPOD, gridSize: GridPOD): void => {
    renderers.forEach((r) => r(ctx, pixelPos, gridSize));
  };
};

/**
 * 带标签的选择框（组合渲染器）
 *
 * @param text - 标签文本
 */
export const selectionWithLabel = (text: string): MarkerRenderer => {
  return compose(selectionBox(), labelText(text));
};

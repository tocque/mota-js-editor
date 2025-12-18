/**
 * Disable image smoothing on a canvas rendering context
 * This ensures pixel-perfect rendering without anti-aliasing
 * @param ctx - The canvas rendering context (2D context)
 */
export function disableImageSmoothing(ctx: CanvasRenderingContext2D): void {
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
}

import type { LocPOD } from "@/utils/coordinate";
import { getFrameCountForMaterial, getGridSizeForMaterial } from "@/utils/appendPic/materialConfig";
import { drawImageFromGrid, createSpriteCanvas, getAppendPos } from "@/utils/appendPic/draw";
import { createEmptyCanvas } from "@/utils/canvas/create";
import { BinaryFileHandler } from "@/fs";
import { materialCommands } from "@/project/commands";
import { notifyCommandResult, notifyError, notifySuccess } from "@/utils/notify";

type ImageSource = HTMLImageElement | HTMLCanvasElement;

interface AppendMaterialParams {
  sourceImage: ImageSource;
  materialType: string;
  frameSelections: LocPOD[];
  autoRegister: boolean;
}

interface QuickAppendMaterialParams {
  sourceImage: ImageSource;
  materialType: string;
  autoRegister: boolean;
}

async function loadProjectImage(path: string): Promise<HTMLImageElement> {
  const handler = new BinaryFileHandler(path);
  await handler.load();
  await handler.waitForSettled();
  const content = handler.getContent();
  if (content.status !== "loaded") {
    throw content.status === "error"
      ? content.error
      : new Error(`Failed to load image: ${path}`);
  }
  return content.value;
}

function assertFrameSelections(frameSelections: LocPOD[], expected: number): void {
  if (frameSelections.length < expected) {
    throw new Error(`请先选择 ${expected} 帧素材位置`);
  }
  for (let i = 0; i < expected; i += 1) {
    if (!frameSelections[i]) throw new Error(`请先选择 ${expected} 帧素材位置`);
  }
}

/**
 * 追加 Autotile 素材
 */
export async function appendAutotileMaterial(sourceImage: ImageSource): Promise<void> {
  if (sourceImage.width % 96 !== 0 || sourceImage.height !== 128) {
    notifyError("不合法的Autotile图片！");
    return;
  }

  // 创建临时 canvas 并绘制图像
  const spriteCtx = createEmptyCanvas([sourceImage.width, sourceImage.height]);
  const spriteCanvas = spriteCtx.canvas;
  spriteCtx.drawImage(sourceImage, 0, 0);
  const imgbase64 = spriteCanvas.toDataURL().split(",")[1];

  const result = await materialCommands.appendAutotileImage(imgbase64);
  if (result.ok) {
    notifySuccess(`自动元件${result.filename}注册成功`);
  } else {
    notifyCommandResult(result, "");
  }
}

/**
 * 追加普通素材
 */
export async function appendMaterial(params: AppendMaterialParams): Promise<void> {
  const { sourceImage, materialType, frameSelections, autoRegister } = params;

  // 创建 sprite canvas
  const gridSize = getGridSizeForMaterial(materialType);
  const [, gridHeight] = gridSize;
  const frameCount = getFrameCountForMaterial(materialType);
  assertFrameSelections(frameSelections, frameCount);
  const targetImg = await loadProjectImage(`project/materials/${materialType}.png`);
  const { canvas: spriteCanvas, ctx: spriteCtx } = createSpriteCanvas(targetImg, gridHeight);

  // 追加新素材 - 使用工具函数简化
  frameSelections.forEach((pos, index) => {
    const destPos = getAppendPos(index, spriteCanvas.height, gridSize);
    drawImageFromGrid(spriteCtx, sourceImage, pos, gridSize, destPos);
  });

  const imgbase64 = spriteCanvas.toDataURL("image/png");
  const imgName = materialType;

  try {
    const result = await materialCommands.appendMaterialImage(
      imgName,
      imgbase64.split(",")[1],
      {
        autoRegister,
        rowCount: Math.floor(spriteCanvas.height / gridHeight),
      },
    );
    if (notifyCommandResult(result, autoRegister ? "追加素材并自动注册成功！" : "追加素材成功！")) {
      notifySuccess("你可以继续追加其他素材。");
    }
  } catch (err) {
    notifyError(err);
    throw err;
  }
}

/**
 * 快速追加素材
 */
export async function quickAppendMaterial(params: QuickAppendMaterialParams): Promise<void> {
  const { sourceImage, materialType, autoRegister } = params;

  if (!["items", "enemys", "enemy48", "npcs", "npc48"].includes(materialType)) {
    notifyError("只有怪物或NPC才能快速导入！");
    return;
  }

  const gridSize = getGridSizeForMaterial(materialType);
  const [, gridHeight] = gridSize;
  let sw = sourceImage.width,
    sh = sourceImage.height;
  if (materialType === "items") {
    if (sw % 32 || sh % 32) {
      notifyError("只有长宽都是32的倍数的道具图才可以快速导入！");
      return;
    }
  } else {
    if ((sw !== 128 && sw !== 96) || sh !== 4 * gridHeight) {
      notifyError("只有 3*4 或 4*4 的素材图片才可以快速导入！");
      return;
    }
  }
  sw = sw / 32;
  sh = sh / gridHeight;

  // 创建临时 sprite canvas
  const targetImg = await loadProjectImage(`project/materials/${materialType}.png`);
  const appendSize = materialType === "items" ? sw * sh - 1 : 3;
  const spriteCtx = createEmptyCanvas([targetImg.width, targetImg.height + appendSize * gridHeight]);
  const spriteCanvas = spriteCtx.canvas;

  // 绘制现有内容
  spriteCtx.drawImage(targetImg, 0, 0);

  // 创建源 canvas
  const sourceCtx = createEmptyCanvas([sourceImage.width, sourceImage.height]);
  const sourceCanvas = sourceCtx.canvas;
  sourceCtx.drawImage(sourceImage, 0, 0);
  if (spriteCanvas.width === 32) {
    // 1帧：道具
    for (let i = 0; i < sw * sh; ++i) {
      const srcGridX = i % sw;
      const srcGridY = Math.floor(i / sw);
      const destY = spriteCanvas.height - (sw * sh - i) * gridHeight;
      drawImageFromGrid(spriteCtx, sourceCanvas, [srcGridX, srcGridY], [32, 32], [0, destY]);
    }
  } else if (spriteCanvas.width === 64) {
    // 两帧
    if (sw === 3) {
      // 3*4的规格使用13帧
      const destY = spriteCanvas.height - 4 * gridHeight;
      drawImageFromGrid(spriteCtx, sourceCanvas, [0, 0], [32, 4 * gridHeight], [0, destY]);
      drawImageFromGrid(spriteCtx, sourceCanvas, [2, 0], [32, 4 * gridHeight], [32, destY]);
    } else {
      // 4*4的规格使用23帧
      const destY = spriteCanvas.height - 4 * gridHeight;
      drawImageFromGrid(spriteCtx, sourceCanvas, [1, 0], [64, 4 * gridHeight], [0, destY]);
    }
  } else {
    // 四帧
    if (sw === 3) {
      // 3*4的规格使用2123帧
      const destY = spriteCanvas.height - 4 * gridHeight;
      drawImageFromGrid(spriteCtx, sourceCanvas, [1, 0], [32, 4 * gridHeight], [0, destY]);
      drawImageFromGrid(spriteCtx, sourceCanvas, [0, 0], [96, 4 * gridHeight], [32, destY]);
    } else {
      // 4*4的规格使用1234帧
      const destY = spriteCanvas.height - 4 * gridHeight;
      drawImageFromGrid(spriteCtx, sourceCanvas, [0, 0], [128, 4 * gridHeight], [0, destY]);
    }
  }

  const imgbase64 = spriteCanvas.toDataURL("image/png");
  const imgName = materialType;

  try {
    const result = await materialCommands.appendMaterialImage(
      imgName,
      imgbase64.split(",")[1],
      {
        autoRegister,
        rowCount: Math.floor(spriteCanvas.height / gridHeight),
      },
    );
    if (notifyCommandResult(result, autoRegister ? "快速追加素材并自动注册成功！" : "快速追加素材成功！")) {
      notifySuccess("你可以继续追加其他素材。");
    }
  } catch (err) {
    notifyError(err);
    throw err;
  }
}

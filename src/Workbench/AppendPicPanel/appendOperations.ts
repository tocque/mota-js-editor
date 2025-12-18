import type { LocPOD } from "@/utils/coordinate";
import { getGridSizeForMaterial } from "@/utils/appendPic/materialConfig";
import { drawImageFromGrid, createSpriteCanvas, getAppendPos } from "@/utils/appendPic/draw";
import { createEmptyCanvas } from "@/utils/canvas/create";

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

/**
 * 追加 Autotile 素材
 */
export function appendAutotileMaterial(sourceImage: ImageSource): void {
  if (sourceImage.width % 96 !== 0 || sourceImage.height !== 128) {
    printe("不合法的Autotile图片！");
    return;
  }

  // 创建临时 canvas 并绘制图像
  const spriteCtx = createEmptyCanvas([sourceImage.width, sourceImage.height]);
  const spriteCanvas = spriteCtx.canvas;
  spriteCtx.drawImage(sourceImage, 0, 0);
  const imgbase64 = spriteCanvas.toDataURL().split(",")[1];

  // Step 1: List文件名
  // @ts-expect-error Global fs from editor
  fs.readdir("./project/autotiles", (err, data) => {
    if (err) {
      printe(err);
      throw err;
    }

    // Step 2: 选择Autotile文件名
    let filename;
    for (let i = 1; ; ++i) {
      filename = "autotile" + i;
      if (data.indexOf(filename + ".png") === -1) break;
    }

    // Step 3: 写入文件
    // @ts-expect-error Global fs from editor
    fs.writeFile("./project/autotiles/" + filename + ".png", imgbase64, "base64", (err) => {
      if (err) {
        printe(err);
        throw err;
      }
      // Step 4: 自动注册
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.file.registerAutotile(filename, (err: any) => {
        if (err) {
          printe(err);
          throw err;
        }
        printe("自动元件" + filename + "注册成功,请F5刷新编辑器");
      });
    });
  });
}

/**
 * 追加普通素材
 */
export function appendMaterial(params: AppendMaterialParams): void {
  const { sourceImage, materialType, frameSelections, autoRegister } = params;

  // 创建 sprite canvas
  const targetImg = core.material.images[materialType];
  const gridSize = getGridSizeForMaterial(materialType);
  const [, gridHeight] = gridSize;
  const { canvas: spriteCanvas, ctx: spriteCtx } = createSpriteCanvas(targetImg, gridHeight);

  // 追加新素材 - 使用工具函数简化
  frameSelections.forEach((pos, index) => {
    const destPos = getAppendPos(index, spriteCanvas.height, gridSize);
    drawImageFromGrid(spriteCtx, sourceImage, pos, gridSize, destPos);
  });

  const imgbase64 = spriteCanvas.toDataURL("image/png");
  const imgName = materialType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fs.writeFile("./project/materials/" + imgName + ".png", imgbase64.split(",")[1], "base64", (err: any) => {
    if (err) {
      printe(err);
      throw err;
    }

    // 更新全局图片引用
    core.material.images[imgName].src = imgbase64;
    editor.widthsX[imgName][3] = spriteCanvas.height - gridHeight;
    if (autoRegister) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.file.autoRegister({ images: imgName }, (e: any) => {
        if (e) {
          printe(e);
          throw e;
        }
        printf("追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。");
      });
    } else {
      printf("追加素材成功！你可以继续追加其他素材，最后再刷新以使用。");
    }
  });
}

/**
 * 快速追加素材
 */
export function quickAppendMaterial(params: QuickAppendMaterialParams): void {
  const { sourceImage, materialType, autoRegister } = params;

  if (!["items", "enemys", "enemy48", "npcs", "npc48"].includes(materialType)) {
    return printe("只有怪物或NPC才能快速导入！");
  }

  const gridSize = getGridSizeForMaterial(materialType);
  const [, gridHeight] = gridSize;
  let sw = sourceImage.width,
    sh = sourceImage.height;
  if (materialType === "items") {
    if (sw % 32 || sh % 32) {
      return printe("只有长宽都是32的倍数的道具图才可以快速导入！");
    }
  } else {
    if ((sw !== 128 && sw !== 96) || sh !== 4 * gridHeight) {
      return printe("只有 3*4 或 4*4 的素材图片才可以快速导入！");
    }
  }
  sw = sw / 32;
  sh = sh / gridHeight;

  // 创建临时 sprite canvas
  const targetImg = core.material.images[materialType];
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fs.writeFile("./project/materials/" + imgName + ".png", imgbase64.split(",")[1], "base64", (err: any) => {
    if (err) {
      printe(err);
      throw err;
    }

    // 更新全局图片引用
    core.material.images[imgName].src = imgbase64;
    editor.widthsX[imgName][3] = spriteCanvas.height - gridHeight;
    if (autoRegister) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editor.file.autoRegister({ images: imgName }, (e: any) => {
        if (e) {
          printe(e);
          throw e;
        }
        printf("快速追加素材并自动注册成功！你可以继续追加其他素材，最后再刷新以使用。");
      });
    } else {
      printf("快速追加素材成功！你可以继续追加其他素材，最后再刷新以使用。");
    }
  });
}

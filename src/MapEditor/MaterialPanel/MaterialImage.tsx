/**
 * MaterialImage - 素材图片组件
 *
 * 内部加载图片，处理点击事件，包含选中框
 */

import { useState, useEffect, useCallback, type FC, type MouseEvent } from "react";
import { BinaryFileHandler } from "@/fs";
import { Grid, type LocPOD } from "@/utils/coordinate";
import type { MaterialImageProps, SelectedBlock } from "./types";

export const MaterialImage: FC<MaterialImageProps> = ({
  id,
  path,
  materialType,
  grid,
  folded,
  foldPerCol,
  selection,
  onClick,
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // 加载图片
  useEffect(() => {
    const handler = new BinaryFileHandler(path);
    handler.load().then(() => {
      const content = handler.getContent();
      if (content.status === "loaded") {
        setImage(content.value);
        setImageSrc(content.value.src);
      }
    });
  }, [path]);

  // 处理点击事件
  const handleClick = useCallback(
    (e: MouseEvent<HTMLImageElement>) => {
      if (!image) return;

      // 1. 获取相对于图片的像素坐标
      const pixelLoc: LocPOD = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];

      // 2. 转换为格子坐标
      let gridLoc = Grid.unmapLoc(pixelLoc, grid);

      // 3. 折叠模式转换
      if (folded) {
        const [x, y] = gridLoc;
        const realY = y + foldPerCol * x;
        gridLoc = [0, realY];
      }

      // 4. 查找 BlockInfo
      const blockInfo = findBlockInfo(materialType, gridLoc, image);

      // 5. 回调
      onClick(id, blockInfo, gridLoc, grid);
    },
    [id, image, grid, folded, foldPerCol, materialType, onClick],
  );

  if (!image || !imageSrc) {
    return null;
  }

  // 判断是否选中，计算选中框位置
  const isSelected = selection?.id === id;
  const selectionPixelLoc = isSelected ? Grid.mapLoc(selection.gridLoc, grid) : null;

  return (
    <div style={{ position: "relative" }}>
      <img
        src={imageSrc}
        alt={materialType}
        draggable={false}
        onClick={handleClick}
        style={{ imageRendering: "pixelated", display: "block" }}
      />
      {isSelected && selectionPixelLoc && (
        <div
          className="dataSelection"
          style={{
            left: selectionPixelLoc[0],
            top: selectionPixelLoc[1],
          }}
        />
      )}
    </div>
  );
};

/**
 * 根据素材类型和格子坐标查找 BlockInfo
 *
 * 注意：完整的 BlockInfo 需要从 editor.ids 中查找
 * 这里返回基本信息，由外部补全
 */
function findBlockInfo(
  materialType: string,
  gridLoc: LocPOD,
  _image: HTMLImageElement,
): SelectedBlock {
  const [_x, y] = gridLoc;

  // 特殊位置处理
  if (materialType === "terrains") {
    if (y === 0) {
      // 清除块
      return 0;
    }
    if (y === 1) {
      // airwall (idnum = 17)
      return {
        idnum: 17,
        id: "airwall",
        images: "terrains",
        y: 0,
      };
    }
    // 普通 terrains，y 需要减 2（因为预留了清除块和 airwall）
    return {
      idnum: 0, // 需要后续补全
      id: "",
      images: materialType,
      y: y - 2,
    };
  }

  // autotile 特殊处理
  if (materialType === "autotile") {
    return {
      idnum: 0,
      id: "",
      images: materialType,
      y: 0,
    };
  }

  // 普通素材
  return {
    idnum: 0, // 需要后续补全
    id: "",
    images: materialType,
    y,
  };
}

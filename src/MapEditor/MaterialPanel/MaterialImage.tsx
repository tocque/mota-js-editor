/**
 * MaterialImage - 素材图片组件
 *
 * 内部加载图片，处理点击事件，包含选中框
 */

import { useState, useEffect, useCallback, type FC, type MouseEvent } from "react";
import { BinaryFileHandler } from "@/fs";
import { Grid, type LocPOD } from "@/utils/coordinate";
import type { MaterialImageProps } from "./types";

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

      onClick(id, gridLoc, grid);
    },
    [id, image, grid, folded, foldPerCol, onClick],
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
        data-test-id={`material-image-${id}`}
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

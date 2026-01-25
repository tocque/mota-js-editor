import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FC,
  type WheelEvent,
} from "react";
import { clamp } from "es-toolkit";
import { GridCanvas, labelText, selectionBox } from "@/components/GridCanvas";
import type { GridMarker } from "@/components/GridCanvas";
import { LongPressButton } from "@/components/LongPressButton";
import { useFloorThumbnailSource } from "@/hooks/useFloorThumbnailSource";
import { floorService } from "@/services/floor";
import { towerService } from "@/services/tower";
import { useCurrentFloorId } from "@/stores/editorState";
import { useGameCore } from "@/stores/GameDataStore";
import type { CoreType } from "@/types";
import { getLastCoordinate, isMultipointString, parseMultipoints } from "@/utils/coordinate";
import type { LocPOD } from "@/utils/coordinate";
import type { SelectPointResult } from "../shared/types";

interface SelectPointContentProps {
  initialFloorId?: string;
  initialX?: number | string;
  initialY?: number | string;
  initialBigmap?: boolean;
  onTitleChange: (title: string) => void;
  onResultChange: (result: SelectPointResult) => void;
}

export const SelectPointContent: FC<SelectPointContentProps> = (props) => {
  const {
    initialFloorId,
    initialX,
    initialY,
    initialBigmap,
    onTitleChange,
    onResultChange,
  } = props;

  const storeFloorId = useCurrentFloorId();
  const core = useGameCore<CoreType>();

  const [currentFloorId, setCurrentFloorId] = useState<string>(
    () => initialFloorId || storeFloorId || "",
  );
  const [multipoints, setMultipoints] = useState<string[]>(() => {
    if (isMultipointString(initialX, initialY)) {
      return parseMultipoints(initialX as string, initialY as string);
    }
    return [];
  });
  const [posX, setPosX] = useState<number>(() => {
    if (isMultipointString(initialX, initialY)) {
      return getLastCoordinate(initialX as string);
    }
    if (typeof initialX === "string") return core ? core.calValue(initialX) : 0;
    return initialX ?? 0;
  });
  const [posY, setPosY] = useState<number>(() => {
    if (isMultipointString(initialX, initialY)) {
      return getLastCoordinate(initialY as string);
    }
    if (typeof initialY === "string") return core ? core.calValue(initialY) : 0;
    return initialY ?? 0;
  });
  const [isBigmap, setIsBigmap] = useState<boolean>(() => !!initialBigmap);
  const [width, setWidth] = useState<number>(() => {
    if (!core) return 0;
    const fid = initialFloorId || storeFloorId || "";
    const floorData = fid ? floorService.getFloor(fid) : null;
    return floorData?.width || core.__SIZE__;
  });
  const [height, setHeight] = useState<number>(() => {
    if (!core) return 0;
    const fid = initialFloorId || storeFloorId || "";
    const floorData = fid ? floorService.getFloor(fid) : null;
    return floorData?.height || core.__SIZE__;
  });
  const [left, setLeft] = useState<number>(() => {
    if (!core) return 0;
    const fid = initialFloorId || storeFloorId || "";
    const floorData = fid ? floorService.getFloor(fid) : null;
    const resolvedWidth = floorData?.width || core.__SIZE__;
    const x =
      typeof initialX === "number" ? initialX
        : typeof initialX === "string" ? core.calValue(initialX)
          : 0;
    return clamp(x - core.__HALF_SIZE__, 0, resolvedWidth - core.__SIZE__);
  });
  const [top, setTop] = useState<number>(() => {
    if (!core) return 0;
    const fid = initialFloorId || storeFloorId || "";
    const floorData = fid ? floorService.getFloor(fid) : null;
    const resolvedHeight = floorData?.height || core.__SIZE__;
    const y =
      typeof initialY === "number" ? initialY
        : typeof initialY === "string" ? core.calValue(initialY)
          : 0;
    return clamp(y - core.__HALF_SIZE__, 0, resolvedHeight - core.__SIZE__);
  });

  const floorOptions = useMemo(() => towerService.getFloorIds(), []);

  // 计算网格像素偏移（用于大地图模式居中）
  const { gridSize: logicalGridSize, gridOffset } = useMemo(() => {
    if (!core) return { gridSize: 32, gridOffset: [0, 0] as LocPOD };
    const safeWidth = width || core.__SIZE__;
    const safeHeight = height || core.__SIZE__;
    const scale = isBigmap ? core.__SIZE__ / Math.max(safeWidth, safeHeight) : 1;
    const size = 32 * scale;
    const leftOffset = isBigmap
      ? core.__PIXELS__ * Math.max(0, (1 - safeWidth / safeHeight) / 2)
      : 0;
    const topOffset = isBigmap
      ? core.__PIXELS__ * Math.max(0, (1 - safeHeight / safeWidth) / 2)
      : 0;
    return { gridSize: size, gridOffset: [leftOffset, topOffset] as LocPOD };
  }, [core, height, isBigmap, width]);

  // 获取缩略图源
  const thumbnailSource = useFloorThumbnailSource({
    floorId: currentFloorId,
    viewport: isBigmap
      ? { mode: "all" }
      : { mode: "partial", centerX: left + (core?.__HALF_SIZE__ ?? 0), centerY: top + (core?.__HALF_SIZE__ ?? 0) },
  });

  // 创建标记数组
  const markers = useMemo((): GridMarker[] => {
    const result: GridMarker[] = [];

    // 多选点标记
    multipoints.forEach((point, index) => {
      const [px, py] = point.split(",").map((value) => parseInt(value, 10));
      // 在部分视图模式下，需要减去视口偏移
      const gridPos: LocPOD = isBigmap ? [px, py] : [px - left, py - top];
      result.push({
        gridPos,
        render: labelText(String(index + 1)),
      });
    });

    // 当前选择框
    const selectionGridPos: LocPOD = isBigmap
      ? [posX, posY]
      : [posX - left, posY - top];
    result.push({
      gridPos: selectionGridPos,
      render: selectionBox(),
    });

    return result;
  }, [isBigmap, left, multipoints, posX, posY, top]);

  useEffect(() => {
    onTitleChange(`地图选点【右键多选】 (${posX},${posY})`);
  }, [onTitleChange, posX, posY]);

  // Update result when selection changes
  useEffect(() => {
    const points = multipoints || [];
    if (points.length > 0) {
      onResultChange({
        floorId: currentFloorId,
        x: points.map((one) => one.split(",")[0]).join(","),
        y: points.map((one) => one.split(",")[1]).join(","),
      });
    } else {
      onResultChange({
        floorId: currentFloorId,
        x: posX,
        y: posY,
      });
    }
  }, [currentFloorId, multipoints, onResultChange, posX, posY]);

  const setPoint = useCallback((targetFloorId?: string, nextX?: number, nextY?: number) => {
    if (!core) return;
    const floorIds = towerService.getFloorIds();
    let nextFloorId = targetFloorId || storeFloorId || "";
    if (!floorIds.includes(nextFloorId)) {
      nextFloorId = storeFloorId || "";
    }
    const resolvedX = nextX != null ? nextX : posX || 0;
    const resolvedY = nextY != null ? nextY : posY || 0;
    const floorData = nextFloorId ? floorService.getFloor(nextFloorId) : null;
    const resolvedWidth = floorData?.width || core.__SIZE__;
    const resolvedHeight = floorData?.height || core.__SIZE__;

    setCurrentFloorId(nextFloorId);
    setPosX(resolvedX);
    setPosY(resolvedY);
    setWidth(resolvedWidth);
    setHeight(resolvedHeight);
    setLeft(clamp(resolvedX - core.__HALF_SIZE__, 0, resolvedWidth - core.__SIZE__));
    setTop(clamp(resolvedY - core.__HALF_SIZE__, 0, resolvedHeight - core.__SIZE__));
  }, [core, storeFloorId, posX, posY]);

  const move = useCallback((dx: number, dy: number) => {
    if (!core) return;
    if (isBigmap) return;
    setLeft((prev) => clamp(prev + dx, 0, width - core.__SIZE__));
    setTop((prev) => clamp(prev + dy, 0, height - core.__SIZE__));
  }, [core, height, isBigmap, width]);

  const triggerBigmap = useCallback(() => {
    setIsBigmap((prev) => !prev);
    setMultipoints([]);
    setPoint(currentFloorId);
  }, [currentFloorId, setPoint]);

  // Handle WASD keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyW") move(0, -1);
      if (event.code === "KeyA") move(-1, 0);
      if (event.code === "KeyS") move(0, 1);
      if (event.code === "KeyD") move(1, 0);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const handleFloorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMultipoints([]);
    setPoint(event.target.value);
  };

  // GridCanvas 点击事件：gridPos 是相对于 canvas 视口的网格坐标
  const handleCanvasClick = useCallback((gridPos: LocPOD) => {
    if (!core) return;
    const [gx, gy] = gridPos;
    // 转换为绝对楼层坐标
    const absoluteX = isBigmap ? gx : left + gx;
    const absoluteY = isBigmap ? gy : top + gy;
    setPosX(clamp(absoluteX, 0, width - 1));
    setPosY(clamp(absoluteY, 0, height - 1));
  }, [core, isBigmap, left, top, width, height]);

  // GridCanvas 右键菜单事件：多选模式
  const handleCanvasContextMenu = useCallback((gridPos: LocPOD) => {
    if (isBigmap) return;
    const [gx, gy] = gridPos;
    const nextX = left + gx;
    const nextY = top + gy;
    setMultipoints((prev) => {
      if (prev.includes(`${nextX},${nextY}`)) {
        return prev.filter((one) => one !== `${nextX},${nextY}`);
      }
      return [...prev, `${nextX},${nextY}`];
    });
    setPosX(nextX);
    setPosY(nextY);
  }, [isBigmap, left, top]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!core) return;
    const floorIds = towerService.getFloorIds();
    const index = floorIds.indexOf(currentFloorId);
    const delta = event.deltaY > 0 ? -1 : 1;
    const nextIndex = clamp(index + delta, 0, floorIds.length - 1);
    setMultipoints([]);
    setPoint(floorIds[nextIndex]);
  };

  const copyFloorId = async () => {
    try {
      await navigator.clipboard.writeText(currentFloorId);
      alert(`楼层ID ${currentFloorId} 已成功复制到剪切板`);
    } catch {
      alert("无法复制楼层ID");
    }
  };

  return (
    <>
      {!core ? (
        <div style={{ padding: 12 }}>Loading...</div>
      ) : null}
      <div
        id="uieventBody"
        style={{ overflow: "hidden" }}
        onWheel={handleWheel}
      >
        <GridCanvas
          source={thumbnailSource}
          width={core?.__PIXELS__ ?? 0}
          height={core?.__PIXELS__ ?? 0}
          gridSize={[logicalGridSize, logicalGridSize]}
          offset={gridOffset}
          markers={markers}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          className="gameCanvas"
        />
        <div id="uieventExtraBody" style={{ display: "none", marginTop: "-10px" }} />
      </div>
      <div id="selectPoint">
        <select id="selectPointFloor" value={currentFloorId} onChange={handleFloorChange}>
          {floorOptions.map((one) => (
            <option key={one} value={one}>{one}</option>
          ))}
        </select>
        <div id="selectPointButtons">
          <LongPressButton onPress={() => move(-1, 0)}>←</LongPressButton>
          <LongPressButton onPress={() => move(0, -1)}>↑</LongPressButton>
          <LongPressButton onPress={() => move(0, 1)}>↓</LongPressButton>
          <LongPressButton onPress={() => move(1, 0)}>→</LongPressButton>
          <input
            type="button"
            defaultValue="切换大地图"
            style={{ marginLeft: 10 }}
            onClick={triggerBigmap}
          />
          <input type="button" defaultValue="复制楼层ID" onClick={copyFloorId} />
        </div>
      </div>
    </>
  );
};

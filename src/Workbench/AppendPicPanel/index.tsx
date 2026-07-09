import { useEffect, useRef, useState, useMemo, type FC, type ChangeEvent, type FormEvent } from "react";
import { GridCanvas, selectionBox } from "@/components/GridCanvas";
import type { GridMarker } from "@/components/GridCanvas";
import { BinaryFileHandler } from "@/fs";
import { EditorStore } from "@/stores/EditorStore";
import { useAppendPicTemplate, consumeAppendPicTemplate } from "@/stores/appendPicState";
import { TList } from "./constants";
import { hueRotate } from "@/utils/canvas/hue";
import { getGridSizeForMaterial, getFrameCountForMaterial } from "@/utils/appendPic/materialConfig";
import { createEmptyCanvas } from "@/utils/canvas/create";
import type { LocPOD } from "@/utils/coordinate";
import { appendAutotileMaterial, appendMaterial, quickAppendMaterial } from "./appendOperations";
import { processImageFile } from "./imageProcessing";

export const AppendPicPanel: FC = () => {
  const { uiRatio } = EditorStore.useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendTemplate = useAppendPicTemplate();
  const [autoRegisterChecked, setAppendRegisterChecked] = useState(true);

  // 状态管理
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [materialType, setMaterialType] = useState<string>("terrains");
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [frameSelections, setFrameSelections] = useState<LocPOD[]>([]);
  const [hueRotateDegree, setHueRotateDegree] = useState<number>(0);

  // 从 materialType 派生的计算值
  const gridSize = useMemo(() => getGridSizeForMaterial(materialType), [materialType]);
  const frameCount = useMemo(() => getFrameCountForMaterial(materialType), [materialType]);

  // hueRotate 后的图像
  const displayImage = useMemo(() => {
    if (!sourceImage || hueRotateDegree === 0) {
      return sourceImage;
    }

    const tempCtx = createEmptyCanvas([sourceImage.width, sourceImage.height]);
    tempCtx.drawImage(sourceImage, 0, 0);
    hueRotate(tempCtx, hueRotateDegree);

    return tempCtx.canvas;
  }, [sourceImage, hueRotateDegree]);

  // 创建帧选择标记
  const markers = useMemo((): GridMarker[] => {
    const labelOffsets = [
      { top: 0, left: 2 },
      { top: 0, left: 14 },
      { top: 12, left: 2 },
      { top: 12, left: 14 },
    ];
    return frameSelections.map((gridPos, index) => ({
      gridPos,
      render: selectionBox(String(index + 1), labelOffsets[index % 4]),
    }));
  }, [frameSelections]);

  // Canvas 尺寸和样式
  const canvasWidth = displayImage?.width ?? 0;
  const canvasHeight = displayImage?.height ?? 0;
  const canvasStyle = useMemo(() => ({
    position: "absolute" as const,
    zIndex: 100,
    width: canvasWidth / uiRatio + "px",
    height: canvasHeight / uiRatio + "px",
    imageRendering: "pixelated" as const,
  }), [canvasWidth, canvasHeight, uiRatio]);

  // --- selectAppend (现在通过 React state 管理)
  const handleSelectAppendChange = (value: string) => {
    setMaterialType(value);
    setFrameSelections([]);
    setCurrentFrame(0);
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        if (!reader.result) return;
        const processedImage = await processImageFile(reader.result as string, gridSize);
        setSourceImage(processedImage);
      } catch (e) {
        printe(e);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangeColorInput = (e: FormEvent<HTMLInputElement>) => {
    const value = Number((e.target as HTMLInputElement).value);
    const degree = value * 30;
    setHueRotateDegree(degree);
  };

  // appendConfirm
  const handleAppendConfirmClick = () => {
    if (!displayImage) {
      printe("请先导入图片！");
      return;
    }

    if (materialType === "autotile") {
      appendAutotileMaterial(displayImage);
    } else {
      appendMaterial({
        sourceImage: displayImage,
        materialType,
        frameSelections,
        autoRegister: autoRegisterChecked,
      });
    }
  };

  const handleQuickAppendConfirmClick = () => {
    if (!displayImage) {
      printe("请先导入图片！");
      return;
    }

    quickAppendMaterial({
      sourceImage: displayImage,
      materialType,
      autoRegister: autoRegisterChecked,
    });
  };

  // GridCanvas 点击事件
  const handleCanvasClick = (gridPos: LocPOD) => {
    const ii = currentFrame;
    setFrameSelections((prev) => {
      const newSelections = [...prev];
      newSelections[ii] = gridPos;
      return newSelections;
    });
    setCurrentFrame((prev) => (prev + 1) % frameCount);
  };
  
  useEffect(() => {
    if (!appendTemplate) return;
    void (async () => {
      const info = consumeAppendPicTemplate();
      if (!info) return;
      if (info.isTile) {
        printe("额外素材不支持此功能！");
        return;
      }
      if (!info.images) {
        printe("素材信息缺少 images");
        return;
      }

      try {
        let source: HTMLCanvasElement | HTMLImageElement;
        const grid = getGridSizeForMaterial(info.images);
        if (info.images === "autotile") {
          if (!info.id) throw new Error("自动元件缺少 id");
          const handler = new BinaryFileHandler(`project/autotiles/${info.id}.png`);
          await handler.load();
          await handler.waitForSettled();
          const content = handler.getContent();
          if (content.status !== "loaded") throw new Error(`无法加载自动元件：${info.id}`);
          source = content.value;
        } else {
          const row = typeof info.y === "number" ? info.y : 0;
          const handler = new BinaryFileHandler(`project/materials/${info.images}.png`);
          await handler.load();
          await handler.waitForSettled();
          const content = handler.getContent();
          if (content.status !== "loaded") throw new Error(`无法加载素材：${info.images}`);
          const image = content.value;
          const ctx = createEmptyCanvas([image.width, grid[1]]);
          ctx.drawImage(image, 0, row * grid[1], image.width, grid[1], 0, 0, image.width, grid[1]);
          source = ctx.canvas;
        }

        const processedImage = await processImageFile(source, grid);
        setSourceImage(processedImage);
        setMaterialType(info.images);
        setFrameSelections([]);
        setCurrentFrame(0);
        setHueRotateDegree(0);
      } catch (e) {
        printe(e);
      }
    })();
  }, [appendTemplate]);

  return (
    <div id="left1" className="leftTab" data-test-id="panel-appendpic">
      {/* appendpic */}
      <h3 className="leftTabHeader">追加素材</h3>
      <div className="leftTabContent">
        <p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <input
            id="selectFileBtn"
            type="button"
            value="导入文件到画板"
            onClick={handleSelectFileClick}
          />
          <select 
            id="selectAppend" 
            value={materialType}
            onChange={(e) => {
              handleSelectAppendChange(e.target.value);
            }}
          >
            {TList.map((image) => (
              <option key={image} value={image}>
                {image}
              </option>
            ))}
          </select>
          <input id="appendConfirm" type="button" defaultValue="追加" onClick={handleAppendConfirmClick} />
          <input
            id="quickAppendConfirm"
            type="button"
            defaultValue="快速追加"
            onClick={handleQuickAppendConfirmClick}
          />
          <span style={{ fontSize: 13 }}>&nbsp;&nbsp;自动注册</span>
          <input id="appendRegister" type="checkbox" checked={autoRegisterChecked} onChange={(e) => setAppendRegisterChecked(e.target.checked)} />
        </p>
        <p>
          <small>
            从V2.7.1开始，你可以直接将素材图片拖到对应的素材区，将自动追加并注册。同时，4x4的道具素材已支持快速追加一次16个。
          </small>
        </p>
        <p>
          色相:
          <input
            id="changeColorInput"
            type="range"
            min={0}
            max={12}
            step={1}
            defaultValue={0}
            list="huelists"
            style={{ width: "60%", marginLeft: "3%", verticalAlign: "middle" }}
            onInput={handleChangeColorInput}
          />
          <datalist id="huelists" style={{ display: "none" }}>
            <option value={0} />
            <option value={1} />
            <option value={2}></option>
            <option value={3} />
            <option value={4} />
            <option value={5}></option>
            <option value={6} />
            <option value={7} />
            <option value={8}></option>
            <option value={9} />
            <option value={10} />
            <option value={11} />
            <option value={12}></option>
          </datalist>
        </p>
        <div
          id="appendPicCanvas"
          data-test-id="appendpic-canvas"
          style={{ position: "relative", overflow: "auto", height: 470 }}
        >
          <GridCanvas
            source={displayImage}
            width={canvasWidth}
            height={canvasHeight}
            gridSize={gridSize}
            markers={markers}
            showCheckboard={true}
            onClick={handleCanvasClick}
            style={canvasStyle}
          />
        </div>
      </div>
    </div>
  );
};

import { useState, useMemo, type FC, type FormEvent } from "react";
import { GridCanvas, selectionBox } from "@/components/GridCanvas";
import type { GridMarker } from "@/components/GridCanvas";
import { EditorStore, useEditorInitialized } from "@/stores/EditorStore";
import { TList } from "./constants";
import { hueRotate } from "@/utils/canvas/hue";
import { getGridSizeForMaterial, getFrameCountForMaterial } from "@/utils/appendPic/materialConfig";
import { createEmptyCanvas } from "@/utils/canvas/create";
import type { LocPOD } from "@/utils/coordinate";
import { appendAutotileMaterial, appendMaterial, quickAppendMaterial } from "./appendOperations";
import { processImageFile } from "./imageProcessing";

export const AppendPicPanel: FC = () => {
  const { uiRatio } = EditorStore.useStore();
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
    core.readFile(async (content: string) => {
      try {
        const processedImage = await processImageFile(content, gridSize);
        setSourceImage(processedImage);
      } catch (e) {
        printe(e);
      }
    }, null, "image/*", "img");
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
  
  useEditorInitialized(() => {

    editor.uifunctions.dragImageToAppend = async function(file: File, cls: string) {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          if (!reader.result) return;
          const gridSize = getGridSizeForMaterial(cls);
          const processedImage = await processImageFile(reader.result as string, gridSize);
          
          if (cls === "terrains") return;
          if (confirm("你确定要快速追加么？")) {
            if (cls === "autotile") {
              appendAutotileMaterial(processedImage);
            } else {
              quickAppendMaterial({
                sourceImage: processedImage,
                materialType: cls,
                autoRegister: autoRegisterChecked,
              });
            }
          }
        } catch (e) {
          printe(e);
        }
      };
      reader.readAsDataURL(file);
    };

    // @ts-expect-error Legacy editor functions with any types
    editor.uifunctions.appendMaterialByInfo = async function(info) {
      if (info.isTile) {
        printe("额外素材不支持此功能！");
        return;
      }
      let img = null;
      const cls = info.images;
      const height = cls == "enemy48" || cls == "npc48" ? 48 : 32;

      if (cls == "autotile") {
        img = core.material.images.autotile[info.id];
      } else {
        const image = core.material.images[cls];
        const width = image.width;
        img = document.createElement("canvas");
        img.width = width;
        img.height = height;
        img.getContext("2d")!.drawImage(image, 0, info.y * height, width, height, 0, 0, width, height);
      }

      editor.mode.change("appendpic");
      
      // 纯函数处理，不修改编辑器状态
      try {
        const gridSize = getGridSizeForMaterial(cls);
        const processedImage = await processImageFile(img, gridSize);
        
        // 将处理后的图像设置到编辑器状态
        setSourceImage(processedImage);
        setMaterialType(cls);
        setHueRotateDegree(0);
      } catch (e) {
        printe(e);
      }
    };
  });

  return (
    <div id="left1" className="leftTab">
      {/* appendpic */}
      <h3 className="leftTabHeader">追加素材</h3>
      <div className="leftTabContent">
        <p>
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

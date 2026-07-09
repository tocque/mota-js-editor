/**
 * MaterialPanel - 素材面板组件
 *
 * 显示所有可用素材，支持点击选择
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type FC,
} from "react";
import { Button } from "antd";
import { fs } from "@/services/fs";
import { useModelResourceSuspense } from "@/hooks/suspense";
import { projectModel, type BlockRegistry, type RegistryBlockInfo } from "@/project/model/projectModel";
import { useConfigItem } from "@/stores/useEditorConfig";
import { type LocPOD, type GridPOD } from "@/utils/coordinate";
import { MaterialImage } from "./MaterialImage";
import type { BlockInfo, MaterialPanelProps, SelectedBlock } from "./types";

/** 素材类型配置 */
const MATERIAL_TYPES = [
  { name: "animates", path: "project/materials/animates.png", grid: [32, 32] as GridPOD },
  { name: "enemys", path: "project/materials/enemys.png", grid: [32, 32] as GridPOD },
  { name: "enemy48", path: "project/materials/enemy48.png", grid: [32, 48] as GridPOD },
  { name: "items", path: "project/materials/items.png", grid: [32, 32] as GridPOD },
  { name: "npcs", path: "project/materials/npcs.png", grid: [32, 32] as GridPOD },
  { name: "npc48", path: "project/materials/npc48.png", grid: [32, 48] as GridPOD },
] as const;

/** 纵向堆叠的素材（terrains + airwall） */
const TERRAIN_MATERIALS = [
  { name: "airwall", path: "project/materials/airwall.png", grid: [32, 32] as GridPOD },
  { name: "terrains", path: "project/materials/terrains.png", grid: [32, 32] as GridPOD },
] as const;

export const MaterialPanel: FC<MaterialPanelProps> = ({
  onSelectedBlockChange,
}) => {
  const iconLibRef = useRef<HTMLDivElement>(null);
  const blockRegistryResource = useMemo(() => projectModel.blockRegistry(), []);
  const blockRegistry = useModelResourceSuspense(blockRegistryResource);

  // 折叠状态（持久化）
  const [folded, setFolded] = useConfigItem("folded", false);
  const [foldPerCol] = useConfigItem("foldPerCol", 50);

  // autotiles 文件列表
  const [autotileFiles, setAutotileFiles] = useState<string[]>([]);

  // 当前选中的素材 ID 和格子位置
  const [selection, setSelection] = useState<{ id: string; gridLoc: LocPOD } | null>(null);

  // 列出 autotiles 目录
  useEffect(() => {
    fs.promises.readdir("project/autotiles").then((files) => {
      const pngFiles = files.filter((f) => f.endsWith(".png"));
      setAutotileFiles(pngFiles);
    }).catch(() => {
      // 目录不存在时忽略
      setAutotileFiles([]);
    });
  }, []);

  // 处理素材点击
  const handleMaterialClick = useCallback(
    (id: string, gridLoc: LocPOD, _grid: GridPOD) => {
      const info = resolveSelectedBlock(id, gridLoc, blockRegistry);
      onSelectedBlockChange(info);
      setSelection({ id, gridLoc });
    },
    [blockRegistry, onSelectedBlockChange],
  );

  // 切换折叠状态
  const handleToggleFold = useCallback(() => {
    const newFolded = !folded;
    if (newFolded) {
      const perCol = parseInt(prompt("请输入折叠素材模式下每列的个数：", "50") || "0", 10);
      if (perCol > 0) {
        setFolded(true);
        // foldPerCol 需要单独设置
      }
    } else {
      if (confirm("你想要展开素材吗？\n展开模式下将显示全素材内容。")) {
        setFolded(false);
      }
    }
  }, [folded, setFolded]);

  return (
    <div id="right">
      <div id="iconLib" ref={iconLibRef}>
        <div id="iconImages" style={{ display: "flex", alignItems: "flex-start" }}>
          {/* terrains + airwall 纵向堆叠 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {TERRAIN_MATERIALS.map((mat) => (
              <MaterialImage
                key={mat.name}
                id={mat.name}
                path={mat.path}
                materialType={mat.name}
                grid={mat.grid}
                folded={folded}
                foldPerCol={foldPerCol}
                selection={selection}
                onClick={handleMaterialClick}
              />
            ))}
          </div>

          {/* 其他素材类型 */}
          {MATERIAL_TYPES.map((mat) => (
            <MaterialImage
              key={mat.name}
              id={mat.name}
              path={mat.path}
              materialType={mat.name}
              grid={mat.grid}
              folded={folded}
              foldPerCol={foldPerCol}
              selection={selection}
              onClick={handleMaterialClick}
            />
          ))}

          {/* autotiles 纵向堆叠 */}
          {autotileFiles.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {autotileFiles.map((file) => (
                <MaterialImage
                  key={file}
                  id={`autotile:${file}`}
                  path={`project/autotiles/${file}`}
                  materialType="autotile"
                  grid={[32, 32]}
                  folded={folded}
                  foldPerCol={foldPerCol}
                  selection={selection}
                  onClick={handleMaterialClick}
                />
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={handleToggleFold}
          style={{ position: 'absolute', right: 20, bottom: 30 }}
        >
          {folded ? "展开素材区" : "折叠素材区"}
        </Button>
      </div>
    </div>
  );
};

export default MaterialPanel;

function toBlockInfo(block: RegistryBlockInfo): BlockInfo {
  return {
    ...block,
    idnum: block.idnum,
    id: block.id ?? "",
    images: block.images ?? block.cls ?? "terrains",
    y: typeof block.y === "number" ? block.y : block.idnum,
    x: block.x,
    isTile: block.kind === "tileset" || block.isTile,
  };
}

function findBlockBySprite(
  registry: BlockRegistry,
  images: string,
  y: number,
  id?: string,
): BlockInfo | undefined {
  for (const block of registry.values()) {
    if ((block.images ?? block.cls) !== images) continue;
    if (id && block.id !== id) continue;
    if (typeof block.y === "number" && block.y === y) return toBlockInfo(block);
  }
  return undefined;
}

function resolveSelectedBlock(id: string, gridLoc: LocPOD, registry: BlockRegistry): SelectedBlock {
  const [, y] = gridLoc;

  if (id === "airwall") {
    return {
      idnum: 17,
      id: "airwall",
      images: "terrains",
      y: 0,
    };
  }

  if (id === "terrains") {
    return findBlockBySprite(registry, "terrains", y) ?? {
      idnum: 0,
      id: "",
      images: "terrains",
      y,
    };
  }

  if (id.startsWith("autotile:")) {
    const autotileId = id.slice("autotile:".length).replace(/\.png$/i, "");
    return findBlockBySprite(registry, "autotile", 0, autotileId) ?? {
      idnum: 0,
      id: autotileId,
      images: "autotile",
      y: 0,
    };
  }

  return findBlockBySprite(registry, id, y) ?? {
    idnum: 0,
    id: "",
    images: id,
    y,
  };
}

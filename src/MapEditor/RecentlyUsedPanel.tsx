import { useCallback, useEffect, useMemo, useState, type FC, type MouseEvent } from "react";
import { useNode } from "@/hooks/useNode";
import { Segmented } from "antd";

/** 最近使用素材的信息 */
export interface LastUsedItem {
  /** 素材 ID */
  id: string;
  /** 图片组名称，如 'terrains', 'enemys', 'autotile' 等 */
  images: string;
  /** 在图片组中的 x 坐标 */
  x: number;
  /** 在图片组中的 y 坐标 */
  y: number;
  /** 是否是 tileset 素材 */
  isTile?: boolean;
  /** 最近使用时间戳 */
  recent: number;
  /** 使用频率 */
  frequent: number;
  /** 是否置顶 */
  istop?: number;
}

/** 排序类型 */
export type SortType = "recent" | "frequent";

export interface RecentlyUsedPanelProps {
  /** 最近使用的素材列表 */
  items: LastUsedItem[];
  /** 当前选中的素材 ID */
  selectedId?: string;
  /** 每行显示的素材数量，默认 12 */
  itemsPerRow?: number;
  /** 素材选中回调 */
  onSelect?: (item: LastUsedItem) => void;
  /** 素材置顶状态变更回调 */
  onToggleTop?: (item: LastUsedItem, istop: boolean) => void;
  /** 清除所有素材回调 */
  onClear?: () => void;
}

export const RecentlyUsedPanel: FC<RecentlyUsedPanelProps> = ({
  items,
  selectedId,
  itemsPerRow = 12,
  onSelect,
  onToggleTop,
  onClear,
}) => {
  const [canvas, mountCanvas] = useNode<HTMLCanvasElement>();
  const [sortType, setSortType] = useState<SortType>("recent");
  const [containerRef, mountContainer] = useNode<HTMLDivElement>();

  // 排序后的素材列表
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        // 置顶优先
        if ((a.istop || 0) !== (b.istop || 0)) {
          return (b.istop || 0) - (a.istop || 0);
        }
        // 然后按排序类型
        return (b[sortType] || 0) - (a[sortType] || 0);
      }),
    [items, sortType]
  );

  // 绘制 canvas
  const drawCanvas = useCallback(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tileSize = 32;
    const rows = Math.ceil(sortedItems.length / itemsPerRow);
    const canvasHeight = Math.max(rows * tileSize, tileSize);

    // 调整 canvas 尺寸
    canvas.setAttribute("width", String(itemsPerRow * tileSize));
    canvas.setAttribute("height", String(canvasHeight));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,128,0,0.85)";
    ctx.fillStyle = "rgba(255,0,0,0.85)";
    ctx.lineWidth = 4;

    for (let i = 0; i < sortedItems.length; i++) {
      const info = sortedItems[i];
      if (!info || !info.images) continue;

      const x = i % itemsPerRow;
      const y = Math.floor(i / itemsPerRow);
      const dx = x * tileSize;
      const dy = y * tileSize;

      try {
        // 绘制素材图片
        // TODO: 接入实际的图片资源系统
        // 目前先绘制占位框
        ctx.strokeStyle = "rgba(128,128,128,0.5)";
        ctx.lineWidth = 1;
        ctx.strokeRect(dx + 1, dy + 1, tileSize - 2, tileSize - 2);

        // 绘制素材 ID 文字（临时，调试用）
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.font = "10px sans-serif";
        ctx.fillText(info.id.slice(0, 4), dx + 2, dy + 12);

        // 置顶标记 - 红点
        if (info.istop) {
          ctx.fillStyle = "rgba(255,0,0,0.85)";
          ctx.fillRect(dx, dy + tileSize - 8, 8, 8);
        }

        // 选中标记 - 橙色边框
        if (selectedId && info.id === selectedId) {
          ctx.strokeStyle = "rgba(255,128,0,0.85)";
          ctx.lineWidth = 4;
          ctx.strokeRect(dx + 2, dy + 2, tileSize - 4, tileSize - 4);
        }
      } catch {
        // 忽略绘制错误
      }
    }
  }, [canvas, sortedItems, itemsPerRow, selectedId]);

  // 监听变化重绘
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // 处理 canvas 点击
  const handleCanvasClick = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!canvas || !containerRef) return;

      const tileSize = 32;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left + containerRef.scrollLeft;
      const py = e.clientY - rect.top + containerRef.scrollTop;

      const x = Math.floor(px / tileSize);
      const y = Math.floor(py / tileSize);
      const index = x + itemsPerRow * y;

      if (index >= sortedItems.length) return;

      const item = sortedItems[index];
      if (!item) return;

      // 右键置顶/取消置顶
      if (e.button === 2) {
        onToggleTop?.(item, !item.istop);
        return;
      }

      // 左键选中
      onSelect?.(item);
    },
    [canvas, containerRef, itemsPerRow, sortedItems, onSelect, onToggleTop]
  );

  // 阻止右键菜单
  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  // 处理清除
  const handleClear = useCallback(() => {
    if (
      window.confirm(
        "你确定要清理全部最近使用图块么？\n所有最近使用和最常使用图块（含置顶图块）都将被清除；此过程不可逆！"
      )
    ) {
      onClear?.();
      if (containerRef) {
        containerRef.scrollTo(0, 0);
      }
    }
  }, [onClear, containerRef]);

  // 切换排序类型
  const handleSortTypeChange = useCallback((type: SortType) => {
    setSortType(type);
    if (containerRef) {
      containerRef.scrollTo(0, 0);
    }
  }, [containerRef]);

  return (
    <div id="mid2">
      <p style={{ margin: 10 }}>
        <Segmented
          size="small"
          value={sortType}
          onChange={(value) => handleSortTypeChange(value as "recent" | "frequent")}
          options={[
            { label: "最近使用", value: "recent" },
            { label: "最常使用", value: "frequent" },
          ]}
        />
        <small>（Ctrl+滚轮放缩，右键置顶）</small>{" "}
        <button onClick={handleClear}>清除</button>
      </p>
      <div className="map" id="lastUsedDiv" ref={mountContainer}>
        <canvas
          ref={mountCanvas}
          className="gameCanvas"
          style={{ overflow: "hidden" }}
          onMouseUp={handleCanvasClick}
          onContextMenu={handleContextMenu}
        />
      </div>
    </div>
  );
};

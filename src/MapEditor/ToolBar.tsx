/**
 * ToolBar - 地图编辑器工具栏
 *
 * 包含画笔模式、图层切换、视口控制、楼层选择等控件
 */

import { useCallback, type FC, type ChangeEvent } from "react";
import { useTowerDataSuspense } from "@/hooks/suspense";
import { projectData } from "@/project/data/projectData";
import { setCurrentFloorId } from "@/stores/editorState";
import { PanelStore, type PanelId } from "@/stores/PanelStore";
import { EditorStore } from "@/stores/EditorStore";
import { notifyError } from "@/utils/notify";
import { MapEditorStore, type BrushMod, type LayerMod } from "./MapEditorStore";

export interface ToolBarProps {
  /** 当前楼层 ID */
  floorId: string;
  /** 提示消息 */
  tipMessage: string;
  /** 提示样式类 */
  tipClass: string;
  /** 楼层切换回调 */
  onFloorChange?: (floorId: string) => void;
}

/**
 * ToolBar 组件
 */
export const ToolBar: FC<ToolBarProps> = ({
  floorId,
  tipMessage,
  tipClass,
  onFloorChange,
}) => {
  const [tower] = useTowerDataSuspense();
  const { activePanel, setActivePanel } = PanelStore.useStore();
  const { theme, setTheme } = EditorStore.useStore();
  const store = MapEditorStore.useStore();
  const { state } = store;

  const {
    brushMod,
    layerMod,
    bigmap,
    showMovable,
    hasUnsavedChanges,
  } = state;

  const floorIds = (tower.main?.floorIds ?? []) as string[];

  // 面板切换
  const handlePanelChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setActivePanel(e.target.value as PanelId);
    },
    [setActivePanel]
  );

  // 通行度切换
  const handleShowMovableChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.setShowMovable(e.target.checked);
      if (e.target.checked) {
        printf?.(
          "此模式下将显示每个点的不可通行状态。<br/>请注意，修改了图块属性的不可出入方向后需要刷新才会正确显示在地图上。"
        );
      }
    },
    [store]
  );

  // 主题切换
  const handleThemeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newTheme = e.target.value;
      setTheme(newTheme);
    },
    [setTheme]
  );

  // 画笔模式切换
  const handleBrushModChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const mod = e.target.value as BrushMod;
      store.setBrushMod(mod);

      if (mod === "fill") {
        printf?.("填充模式下，将会用选中的素材替换所有和目标点联通的相同素材");
      } else if (mod === "tileset") {
        printf?.(
          "tileset平铺模式下可以按选中tileset素材，并在地图上拖动来一次绘制一个区域"
        );
      }
    },
    [store]
  );

  // 图层切换
  const handleLayerModChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      store.setLayerMod(e.target.value as LayerMod);
    },
    [store]
  );

  // 视口移动
  const handleViewportMove = useCallback(
    (dx: number, dy: number) => {
      store.moveViewport(dx, dy);
      printi?.("你可以按【大地图】（或F键）快捷切换大地图模式");
    },
    [store]
  );

  // 大地图切换
  const handleBigmapToggle = useCallback(() => {
    store.toggleBigmap();
    if (!bigmap) {
      printf?.("已进入大地图模式");
    } else {
      printf?.("已退出大地图模式");
    }
  }, [store, bigmap]);

  // 楼层选择
  const handleFloorSelect = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const newFloorId = e.target.value;
      if (newFloorId === floorId) return;

      if (hasUnsavedChanges) {
        printe?.("请先保存地图！");
        return;
      }

      store.pushRecentFloor(floorId);
      store.setCurrentFloorId(newFloorId);
      setCurrentFloorId(newFloorId);
      onFloorChange?.(newFloorId);
    },
    [floorId, hasUnsavedChanges, store, onFloorChange]
  );

  // 选层按钮
  const handleSelectFloorBtn = useCallback(() => {
    // TODO: 打开楼层选择弹窗
    printf?.("楼层选择弹窗待实现");
  }, []);

  // 保存楼层
  const handleSaveFloor = useCallback(async () => {
    try {
      await projectData.floor(floorId).waitForIdle();
      store.setHasUnsavedChanges(false);
      printf?.("保存成功");
    } catch (error) {
      notifyError(error);
    }
  }, [floorId, store]);

  // 后退楼层
  const handleUndoFloor = useCallback(() => {
    if (hasUnsavedChanges) {
      printe?.("请先保存地图！");
      return;
    }

    const prevFloorId = store.popRecentFloor();
    if (prevFloorId && prevFloorId !== floorId) {
      store.setCurrentFloorId(prevFloorId);
      setCurrentFloorId(prevFloorId);
      onFloorChange?.(prevFloorId);
    }
  }, [hasUnsavedChanges, store, floorId, onFloorChange]);

  // 打开帮助文档
  const handleOpenDoc = useCallback(() => {
    window.open("/_docs/", "_blank");
  }, []);

  // 前往游戏
  const handleGoToGame = useCallback(() => {
    window.open("./index.html", "_blank");
  }, []);

  return (
    <div className="tools">
      {/* 提示区域 */}
      <div id="tip">
        {tipMessage && (
          <p className={tipClass} dangerouslySetInnerHTML={{ __html: tipMessage }} />
        )}
      </div>

      {/* 面板选择 */}
      <select
        id="editModeSelect"
        data-test-id="edit-mode-select"
        style={{ fontSize: 12 }}
        value={activePanel}
        onChange={handlePanelChange}
      >
        <option value="map">地图编辑(Z)</option>
        <option value="loc">地图选点(X)</option>
        <option value="enemyitem">图块属性(C)</option>
        <option value="floor">楼层属性(V)</option>
        <option value="tower">全塔属性(B)</option>
        <option value="functions">脚本编辑(N)</option>
        <option value="appendpic">追加素材(M)</option>
        <option value="commonevent">公共事件(,)</option>
        <option value="plugins">插件编写(.)</option>
      </select>

      {/* 通行度 */}
      <span style={{ fontSize: 12 }}>
        <input
          type="checkbox"
          id="showMovable"
          checked={showMovable}
          onChange={handleShowMovableChange}
          style={{ marginLeft: 0, marginRight: 2 }}
        />
        通行度
      </span>

      {/* 主题选择 */}
      <select
        id="editorTheme"
        value={theme}
        onChange={handleThemeChange}
        style={{ marginLeft: 0, fontSize: 11 }}
      >
        <option value="editor_color">默认白</option>
        <option value="editor_color_dark">夜间黑</option>
      </select>

      <br />

      {/* 画笔模式 */}
      <span style={{ fontSize: 12 }}>
        <input
          type="radio"
          name="brushMod"
          value="line"
          checked={brushMod === "line"}
          onChange={handleBrushModChange}
        />
        线
        <input
          type="radio"
          name="brushMod"
          value="rectangle"
          checked={brushMod === "rectangle"}
          onChange={handleBrushModChange}
        />
        矩形
        <input
          type="radio"
          name="brushMod"
          value="tileset"
          checked={brushMod === "tileset"}
          onChange={handleBrushModChange}
        />
        tile平铺
        <input
          type="radio"
          name="brushMod"
          value="fill"
          checked={brushMod === "fill"}
          onChange={handleBrushModChange}
        />
        填充
      </span>

      <br />

      {/* 图层选择 */}
      <span style={{ fontSize: 12 }}>
        <input
          type="radio"
          name="layerMod"
          value="bgmap"
          data-test-id="layer-mode-bgmap"
          checked={layerMod === "bgmap"}
          onChange={handleLayerModChange}
        />
        背景层
        <input
          type="radio"
          name="layerMod"
          value="map"
          data-test-id="layer-mode-map"
          checked={layerMod === "map"}
          onChange={handleLayerModChange}
          style={{ marginLeft: 5 }}
        />
        事件层
        <input
          type="radio"
          name="layerMod"
          value="fgmap"
          data-test-id="layer-mode-fgmap"
          checked={layerMod === "fgmap"}
          onChange={handleLayerModChange}
          style={{ marginLeft: 5 }}
        />
        前景层
      </span>

      <br />

      {/* 视口控制按钮 */}
      <div id="viewportButtons" style={{ marginBottom: 7 }}>
        <input
          type="button"
          value="←"
          onClick={() => handleViewportMove(-1, 0)}
        />
        <input
          type="button"
          value="↑"
          onClick={() => handleViewportMove(0, -1)}
        />
        <input
          type="button"
          value="↓"
          onClick={() => handleViewportMove(0, 1)}
        />
        <input
          type="button"
          value="→"
          onClick={() => handleViewportMove(1, 0)}
        />
        <input
          type="button"
          id="bigmapBtn"
          value="大地图"
          className={bigmap ? "highlight" : ""}
          onClick={handleBigmapToggle}
          style={{ marginLeft: 5 }}
        />
      </div>

      {/* 楼层选择 */}
      <select
        id="selectFloor"
        data-test-id="floor-select"
        value={floorId}
        onChange={handleFloorSelect}
        style={{ marginBottom: 5 }}
      >
        {floorIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <input
        type="button"
        value="选层"
        id="selectFloorBtn"
        onClick={handleSelectFloorBtn}
      />
      <input
        type="button"
        value="保存地图"
        id="saveFloor"
        className={hasUnsavedChanges ? "highlight" : ""}
        onClick={handleSaveFloor}
      />
      <input
        type="button"
        value="后退"
        id="undoFloor"
        onClick={handleUndoFloor}
        style={{ display: state.recentFloors.length > 0 ? "inline" : "none" }}
      />
      <input
        type="button"
        value="帮助文档"
        id="openDoc"
        onClick={handleOpenDoc}
      />
      <input
        type="button"
        value="前往游戏"
        onClick={handleGoToGame}
      />
    </div>
  );
};

export default ToolBar;

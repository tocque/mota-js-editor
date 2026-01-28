import { mergeStores } from "@/utils/store/store";
import { GameDataStore } from "./GameDataStore";
import { EditorStore } from "./EditorStore";
import { PanelStore } from "./PanelStore";

export const GlobalStore = mergeStores([
  EditorStore,
  GameDataStore,
  PanelStore,
]);

// 导出独立的状态管理
export { prefabStateStore, setCurrentPrefabInfo, useCurrentPrefabInfo, getCurrentPrefabInfo } from "./prefabState";
export { locStateStore, setCurrentLocPos, useCurrentLocPos, getCurrentLocPos } from "./locState";
export { editorStateStore, setCurrentFloorId, useCurrentFloorId } from "./editorState";

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
export {
  prefabStateStore,
  setCurrentPrefabInfo,
  setCurrentPrefabSelection,
  useCurrentPrefabInfo,
  useCurrentPrefabSelection,
  getCurrentPrefabInfo,
  getCurrentPrefabSelection,
} from "./prefabState";
export {
  locStateStore,
  setCurrentLocPos,
  setCurrentLocFloorId,
  useCurrentLocPos,
  useCurrentLocSelection,
  getCurrentLocPos,
  getCurrentLocSelection,
} from "./locState";
export { editorStateStore, setCurrentFloorId, useCurrentFloorId } from "./editorState";
export {
  appendPicStateStore,
  consumeAppendPicTemplate,
  setAppendPicTemplate,
  useAppendPicTemplate,
} from "./appendPicState";

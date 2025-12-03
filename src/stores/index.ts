import { mergeStores } from "@/utils/store/store";
import { GameDataStore } from "./GameDataStore";

export const EditorStore = mergeStores([
  GameDataStore,
]);

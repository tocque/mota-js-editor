import { mergeStores } from "@/utils/store/store";
import { GameDataStore } from "./GameDataStore";
import { EditorStore } from "./EditorStore";

export const GlobalStore = mergeStores([
  EditorStore,
  GameDataStore,
]);

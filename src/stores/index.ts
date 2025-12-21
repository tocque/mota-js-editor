import { mergeStores } from "@/utils/store/store";
import { GameDataStore } from "./GameDataStore";
import { EditorStore } from "./EditorStore";
import { TowerDataStore } from "./TowerDataStore";

export const GlobalStore = mergeStores([
  EditorStore,
  GameDataStore,
  TowerDataStore,
]);

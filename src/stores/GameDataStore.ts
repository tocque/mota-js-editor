import { createStore } from "@/utils/store/store";
import { useEffect } from "react";
import { EditorStore } from "./EditorStore";

export const GameDataStore = createStore(() => {
  const { editorInitialized } = EditorStore.useStore();

  return {
    gameInitialized: editorInitialized,
  }
});

export const useGameData = (accessor: (core: any) => void) => {
  const { gameInitialized } = GameDataStore.useStore();

  useEffect(() => {
    if (gameInitialized) {
      accessor(core);
    }
  }, [gameInitialized]);
}

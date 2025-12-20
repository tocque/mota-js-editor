import { createStore } from "@/utils/store/store";
import { useEffect } from "react";
import { EditorStore } from "./EditorStore";

const useGameDataStore = () => {
  const { editorInitialized } = EditorStore.useStore();

  return {
    gameInitialized: editorInitialized,
  }
};

export const GameDataStore = createStore(useGameDataStore);

export const useGameData = (accessor: (core: any) => void) => {
  const { gameInitialized } = GameDataStore.useStore();

  useEffect(() => {
    if (gameInitialized) {
      accessor(core);
    }
  }, [gameInitialized]);
}

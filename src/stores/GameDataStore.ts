import { createStore } from "@/utils/store/store";
import { useEffect, useState } from "react";

export const GameDataStore = createStore(() => {
  const [gameInitialized, setGameInitialized] = useState(false);

  return {
    gameInitialized,
    setGameInitialized,
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

import { createStore } from "@/utils/store/store";
import { useEffect } from "react";
import { EditorStore } from "./EditorStore";
import type { CoreType } from "@/types";

const useGameDataStore = () => {
  const { editorInitialized } = EditorStore.useStore();

  return {
    gameInitialized: editorInitialized,
  }
};

export const GameDataStore = createStore(useGameDataStore);

export const useGameCoreInitialized = <TCore = CoreType>(accessor: (core: TCore) => void) => {
  const { gameInitialized } = GameDataStore.useStore();

  useEffect(() => {
    if (gameInitialized) {
      const w = typeof window === "undefined"
        ? undefined
        : (window as unknown as { core?: unknown });
      const c = w?.core as TCore | undefined;
      if (c == null) return;
      accessor(c);
    }
  }, [gameInitialized, accessor]);
}

export function useGameCore<TCore = CoreType>(): TCore | undefined {
  const { gameInitialized } = GameDataStore.useStore();
  if (!gameInitialized) return undefined;
  const w = typeof window === "undefined"
    ? undefined
    : (window as unknown as { core?: unknown });
  return (w?.core as TCore | undefined) ?? undefined;
}

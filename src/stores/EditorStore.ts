import { createStore } from "@/utils/store/store";
import { useEffect, useState } from "react";
import { useConfigItem } from "./useEditorConfig";
import type { Editor } from "@/types";

const useEditorStore = () => {
  const [editorInitialized, setEditorInitialized] = useState(false);

  const [uiRatio, setUIRatio] = useState(1);

  const [theme, setTheme] = useConfigItem("theme", "editor_color_light");

  return {
    editorInitialized,
    setEditorInitialized,
    uiRatio,
    setUIRatio,
    theme,
    setTheme,
  }
};

export const EditorStore = createStore(useEditorStore);

export const useEditorInitialized = <TEditor = Editor>(accessor: (editor: TEditor) => void) => {
  const { editorInitialized } = EditorStore.useStore();

  useEffect(() => {
    if (editorInitialized) {
      const w = typeof window === "undefined"
        ? undefined
        : (window as unknown as { editor?: unknown });
      const ed = w?.editor as TEditor | undefined;
      if (ed == null) return;
      accessor(ed);
    }
  }, [editorInitialized, accessor]);
}

export function useEditor<TEditor = Editor>(): TEditor | undefined {
  const { editorInitialized } = EditorStore.useStore();
  if (!editorInitialized) return undefined;
  const w = typeof window === "undefined"
    ? undefined
    : (window as unknown as { editor?: unknown });
  return (w?.editor as TEditor | undefined) ?? undefined;
}

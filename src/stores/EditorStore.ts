import { createStore } from "@/utils/store/store";
import { useEffect, useState } from "react";

export const EditorStore = createStore(() => {
  const [editorInitialized, setEditorInitialized] = useState(false);

  const [uiRatio, setUIRatio] = useState(1);

  return {
    editorInitialized,
    setEditorInitialized,
    uiRatio,
    setUIRatio,
  }
});

export const useEditor = (accessor: (editor: any) => void) => {
  const { editorInitialized: editorInitialized } = EditorStore.useStore();

  useEffect(() => {
    if (editorInitialized) {
      accessor(editor);
    }
  }, [editorInitialized]);
}

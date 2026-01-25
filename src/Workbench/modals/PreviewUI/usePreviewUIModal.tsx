import { useCallback, useState } from "react";
import { useEditorInitialized } from "@/stores/EditorStore";
import { ModalShell, type ModalShellSelectOption } from "../shared/ModalShell";
import type { PreviewUIOptions, UIData, UseModalReturn } from "../shared/types";
import { PreviewUIContent } from "./PreviewUIContent";

interface PreviewUIState extends PreviewUIOptions {
  resolve: (value: null) => void;
}

const PREVIEW_OPTIONS: ModalShellSelectOption[] = [
  { value: "thumbnail", label: "缩略图" },
  { value: "#000000", label: "黑色" },
  { value: "#FFFFFF", label: "白色" },
];

export function usePreviewUIModal(): UseModalReturn<PreviewUIOptions, null> {
  const [state, setState] = useState<PreviewUIState | null>(null);
  const [background, setBackground] = useState("thumbnail");

  const open = useCallback((options: PreviewUIOptions) => {
    return new Promise<null>((resolve) => {
      setState({ ...options, resolve });
      setBackground("thumbnail");
    });
  }, []);

  const handleClose = useCallback(() => {
    state?.resolve(null);
    setState(null);
  }, [state]);

  // 注册全局 API
  useEditorInitialized(() => {
    editor.uievent = editor.uievent || {};
    editor.uievent.previewUI = (list: UIData[]) => {
      open({ list: list || [] });
    };
  });

  const holder = state ? (
    <ModalShell
      title="UI绘制预览"
      onClose={handleClose}
      selectOptions={PREVIEW_OPTIONS}
      selectValue={background}
      onSelectChange={setBackground}
    >
      <PreviewUIContent list={state.list} background={background} />
    </ModalShell>
  ) : null;

  return [open, holder];
}

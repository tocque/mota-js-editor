import { useCallback, useState } from "react";
import { useEditorInitialized } from "@/stores/EditorStore";
import { ModalShell, type ModalShellSelectOption } from "../shared/ModalShell";
import type { StatusBarPreviewOptions, UseModalReturn } from "../shared/types";
import { StatusBarPreviewContent } from "./StatusBarPreviewContent";

interface StatusBarPreviewState extends StatusBarPreviewOptions {
  resolve: (value: null) => void;
}

const STATUS_BAR_OPTIONS: ModalShellSelectOption[] = [
  { value: "horizontal", label: "横屏" },
  { value: "vertical", label: "竖屏" },
];

export function useStatusBarPreviewModal(): UseModalReturn<StatusBarPreviewOptions, null> {
  const [state, setState] = useState<StatusBarPreviewState | null>(null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const open = useCallback((options: StatusBarPreviewOptions) => {
    return new Promise<null>((resolve) => {
      setState({ ...options, resolve });
      setOrientation("horizontal");
    });
  }, []);

  const handleClose = useCallback(() => {
    state?.resolve(null);
    setState(null);
  }, [state]);

  // 注册全局 API
  useEditorInitialized(() => {
    editor.uievent = editor.uievent || {};
    editor.uievent.previewStatusBar = (code: string) => {
      if (!/^function\s*\(\)\s*{/.test(code)) return;
      open({ code });
    };
    editor.uievent.previewEditorMulti = (mode: string, code: string) => {
      if (mode === "statusBar") {
        if (!/^function\s*\(\)\s*{/.test(code)) return;
        open({ code });
      }
    };
  });

  const holder = state ? (
    <ModalShell
      title="状态栏自绘预览"
      onClose={handleClose}
      selectOptions={STATUS_BAR_OPTIONS}
      selectValue={orientation}
      onSelectChange={(value) => setOrientation(value as "horizontal" | "vertical")}
      overflow="auto"
    >
      <StatusBarPreviewContent code={state.code} orientation={orientation} />
    </ModalShell>
  ) : null;

  return [open, holder];
}

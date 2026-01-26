import { useCallback, useEffect, useRef, useState } from "react";
import { ContentBoundary } from "@/components/ContentBoundary";
import { useEditorInitialized } from "@/stores/EditorStore";
import type { SelectPointOptions, SelectPointResult, UseModalReturn } from "../shared/types";
import { SelectPointContent } from "./SelectPointContent";

interface SelectPointState extends SelectPointOptions {
  resolve: (value: SelectPointResult | null) => void;
}

// Custom shell for SelectPoint (different layout from ModalShell)
const SelectPointShell: React.FC<{
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, onConfirm, children }) => {
  // ESC handled by ModalShell pattern, but we need custom implementation here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div id="uieventDiv" style={{ display: "block" }}>
      <div id="uieventDialog">
        <div id="uieventHead">
          <span id="uieventTitle">{title}</span>
          <button id="uieventNo" onClick={onClose}>关闭</button>
          <button id="uieventYes" onClick={onConfirm}>确定</button>
        </div>
        <hr style={{ clear: "both", marginTop: 0 }} />
        <ContentBoundary loadingUI={<div style={{ padding: 12 }}>加载中...</div>}>
          {children}
        </ContentBoundary>
      </div>
    </div>
  );
};

export function useSelectPointModal(): UseModalReturn<SelectPointOptions, SelectPointResult> {
  const [state, setState] = useState<SelectPointState | null>(null);
  const [title, setTitle] = useState("地图选点【右键多选】");
  const resultRef = useRef<SelectPointResult>({ floorId: "", x: 0, y: 0 });

  const open = useCallback((options: SelectPointOptions) => {
    return new Promise<SelectPointResult | null>((resolve) => {
      setState({ ...options, resolve });
      setTitle("地图选点【右键多选】");
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state?.resolve(resultRef.current);
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    state?.resolve(null);
    setState(null);
  }, [state]);

  const handleResultChange = useCallback((result: SelectPointResult) => {
    resultRef.current = result;
  }, []);

  // 注册全局 API
  useEditorInitialized(() => {
    editor.uievent = editor.uievent || {};
    editor.uievent.selectPoint = (
      floorId?: string,
      x?: number | string,
      y?: number | string,
      bigmap?: boolean,
      callback?: (floorId: string, x: number | string, y: number | string) => void,
    ) => {
      open({ floorId, x, y, bigmap }).then((result) => {
        if (result !== null) callback?.(result.floorId, result.x, result.y);
      });
    };
  });

  const holder = state ? (
    <SelectPointShell title={title} onClose={handleCancel} onConfirm={handleConfirm}>
      <SelectPointContent
        initialFloorId={state.floorId}
        initialX={state.x}
        initialY={state.y}
        initialBigmap={state.bigmap}
        onTitleChange={setTitle}
        onResultChange={handleResultChange}
      />
    </SelectPointShell>
  ) : null;

  return [open, holder];
}

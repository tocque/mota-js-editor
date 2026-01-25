import { useCallback, useState } from "react";
import { useEditorInitialized } from "@/stores/EditorStore";
import { getCurrentFloorId } from "@/stores/editorState";
import { ModalShell } from "../shared/ModalShell";
import type { SelectFloorOptions, UseModalReturn } from "../shared/types";
import { SelectFloorContent } from "./SelectFloorContent";

interface SelectFloorState extends SelectFloorOptions {
  resolve: (value: string | null) => void;
}

export function useSelectFloorModal(): UseModalReturn<SelectFloorOptions, string> {
  const [state, setState] = useState<SelectFloorState | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");

  const open = useCallback((options: SelectFloorOptions) => {
    return new Promise<string | null>((resolve) => {
      const initialFloorId = Array.isArray(options.initialFloorId)
        ? options.initialFloorId[0]
        : options.initialFloorId;
      const floorId = initialFloorId || getCurrentFloorId() || "";
      setState({ ...options, resolve });
      setSelectedFloorId(floorId);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state?.resolve(selectedFloorId);
    setState(null);
  }, [selectedFloorId, state]);

  const handleCancel = useCallback(() => {
    state?.resolve(null);
    setState(null);
  }, [state]);

  // 注册全局 API
  useEditorInitialized(() => {
    editor.uievent = editor.uievent || {};
    editor.uievent.selectFloor = (
      floorId: string | null,
      title: string,
      callback?: (floorId: string) => void,
    ) => {
      open({ title, initialFloorId: floorId || undefined }).then((result) => {
        if (result !== null) callback?.(result);
      });
    };
  });

  const holder = state ? (
    <ModalShell
      title={state.title}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      overflow="auto"
    >
      <SelectFloorContent value={selectedFloorId} onChange={setSelectedFloorId} />
    </ModalShell>
  ) : null;

  return [open, holder];
}

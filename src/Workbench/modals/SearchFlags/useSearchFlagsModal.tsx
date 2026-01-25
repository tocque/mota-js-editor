import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEditor, useEditorInitialized } from "@/stores/EditorStore";
import { ModalShell, type ModalShellSelectOption } from "../shared/ModalShell";
import type { SearchFlagsOptions, UseModalReturn } from "../shared/types";
import { SearchFlagsContent } from "./SearchFlagsContent";

interface SearchFlagsState {
  resolve: (value: null) => void;
}

type EditorWithFlags = { used_flags?: Record<string, boolean> };

export function useSearchFlagsModal(): UseModalReturn<SearchFlagsOptions, null> {
  const [state, setState] = useState<SearchFlagsState | null>(null);
  const [selectedFlag, setSelectedFlag] = useState("");
  const editor = useEditor<EditorWithFlags>();

  const flagOptions = useMemo((): ModalShellSelectOption[] => {
    if (!editor?.used_flags) return [];
    return Object.keys(editor.used_flags).sort().map((flag) => ({
      value: `flag:${flag}`,
      label: `flag:${flag}`,
    }));
  }, [state, editor]); // Re-compute when modal opens

  const open = useCallback((_options: SearchFlagsOptions) => {
    return new Promise<null>((resolve) => {
      setState({ resolve });
      // Set initial flag to first option
      if (editor?.used_flags) {
        const flags = Object.keys(editor.used_flags).sort();
        if (flags.length > 0) {
          setSelectedFlag(`flag:${flags[0]}`);
        }
      }
    });
  }, [editor]);

  const handleClose = useCallback(() => {
    state?.resolve(null);
    setState(null);
  }, [state]);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // 注册全局 API
  useEditorInitialized((editor) => {
    editor.uievent = editor.uievent || {};
    editor.uievent.searchUsedFlags = () => openRef.current({});
  });

  const holder = state ? (
    <ModalShell
      title="搜索变量"
      onClose={handleClose}
      selectOptions={flagOptions}
      selectValue={selectedFlag}
      onSelectChange={setSelectedFlag}
      overflow="auto"
    >
      <SearchFlagsContent selectedFlag={selectedFlag} />
    </ModalShell>
  ) : null;

  return [open, holder];
}

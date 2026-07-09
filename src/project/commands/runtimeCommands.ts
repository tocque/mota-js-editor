import { commandError, commandOk, type CommandResult } from "./types";

type Callback = (...args: unknown[]) => void;

function getWindowRecord(): Record<string, unknown> {
  return typeof window === "undefined" ? {} : window as unknown as Record<string, unknown>;
}

class RuntimeCommands {
  hasBlockly(): boolean {
    return Boolean(getWindowRecord().editor_blockly);
  }

  hasMultiEditor(): boolean {
    return Boolean(getWindowRecord().editor_multi);
  }

  hasLegacyUiEvent(): boolean {
    const editor = getWindowRecord().editor as { uievent?: unknown } | undefined;
    return Boolean(editor?.uievent);
  }

  openBlockly(value: unknown, options: unknown, onConfirm: Callback): CommandResult {
    const blockly = getWindowRecord().editor_blockly as {
      import?: (value: unknown, options: unknown, callbacks: { onConfirm: Callback }) => void;
    } | undefined;
    if (!blockly?.import) return commandError("runtime-blockly", "Blockly runtime unavailable");
    blockly.import(value, options, { onConfirm });
    return commandOk();
  }

  openMulti(value: string, options: unknown, onConfirm: Callback): CommandResult {
    const multi = getWindowRecord().editor_multi as {
      open?: (value: string, options: unknown, callbacks: { onConfirm: Callback }) => void;
    } | undefined;
    if (!multi?.open) return commandError("runtime-multi", "Multi editor runtime unavailable");
    multi.open(value, options, { onConfirm });
    return commandOk();
  }

  changeDoubleClickMode(mode: "add" | "delete"): CommandResult {
    const editor = getWindowRecord().editor as {
      mode?: {
        changeDoubleClickModeByButton?: (mode: "add" | "delete") => void;
      };
    } | undefined;
    if (!editor?.mode?.changeDoubleClickModeByButton) {
      return commandError("runtime-double-click-mode", "Runtime map edit mode unavailable");
    }
    try {
      editor.mode.changeDoubleClickModeByButton(mode);
      return commandOk();
    } catch (error) {
      return commandError("runtime-double-click-mode", error);
    }
  }
}

export const runtimeCommands = new RuntimeCommands();

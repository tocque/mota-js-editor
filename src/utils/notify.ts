import type { CommandResult } from "@/project/commands";

type NotifyWindow = Window & {
  printf?: (message: string) => void;
  printe?: (message: string) => void;
};

function getNotifyWindow(): NotifyWindow | undefined {
  return typeof window === "undefined" ? undefined : window as NotifyWindow;
}

export function notifySuccess(message: string): void {
  const win = getNotifyWindow();
  if (win?.printf) {
    win.printf(message);
  } else {
    console.info(message);
  }
}

export function notifyError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const win = getNotifyWindow();
  if (win?.printe) {
    win.printe(message);
  } else {
    console.error(message);
  }
}

export function notifyCommandResult(result: CommandResult, successMessage: string): boolean {
  if (result.ok) {
    notifySuccess(successMessage);
    return true;
  }
  notifyError(`${result.stage}: ${result.error.message}`);
  return false;
}

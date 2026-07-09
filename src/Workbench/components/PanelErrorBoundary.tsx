import { Component, type ErrorInfo, type ReactNode } from "react";
import { DataHandler } from "@/fs/DataHandler";
import { FileHandler } from "@/fs/FileHandler";

interface Props {
  panelId: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

function isRecoverableResource(value: unknown): boolean {
  return Boolean(
    value
      && typeof value === "object"
      && "content" in value
      && "refetch" in value
      && "waitForSettled" in value
      && "recoverable" in value,
  );
}

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    if (error instanceof DataHandler || error instanceof FileHandler || isRecoverableResource(error)) {
      throw error;
    }
    return {
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`Panel ${this.props.panelId} failed`, error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div style={{ padding: 12, color: "#8a4b00", whiteSpace: "pre-wrap" }}>
          {`面板暂不可用：${this.state.error.message}`}
        </div>
      );
    }
    return this.props.children;
  }
}

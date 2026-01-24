/**
 * EditorHandler - 编辑器初始化状态的 Handler
 *
 * 临时方案：让 useDataSuspense 可以等待 setupEditor 完成
 * 完全迁移后可移除
 *
 * 用于解决 TableMetaDataHandler 的 parse 依赖全局变量的问题
 * （这些全局变量在 setupEditor 中初始化）
 */

import { signal } from "alien-signals";
import { waitUntil } from "@/utils/base/signal";
import type { Content } from "./types";

class EditorHandlerImpl {
  private _content = signal<Content<void>>({ status: "loading" });
  readonly content = () => this._content();

  /**
   * 标记编辑器已就绪
   *
   * 在 setupEditor 完成后调用
   */
  markReady() {
    this._content({ status: "loaded", value: undefined });
  }

  /**
   * 等待状态 settled
   *
   * 用于 Suspense：loading 时挂起，ready 后继续
   */
  waitForSettled(): Promise<void> {
    return waitUntil(() => {
      const status = this._content().status;
      return status !== "loading" && status !== "idle";
    });
  }
}

export const editorHandler = new EditorHandlerImpl();

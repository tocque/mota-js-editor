/**
 * useEditorReadySuspense - 等待 editor 初始化完成
 *
 * 某些 hooks（如 TableMeta 的 parse）依赖 setupEditor 中初始化的全局变量，
 * 需要先等待 editor ready 才能正常工作
 *
 * 使用 Suspense 模式：在 editor 未就绪时 throw Promise
 */

import { editorHandler } from "@/fs/EditorHandler";
import { useSignal } from "../useFs";

/**
 * 等待 editor 初始化完成
 *
 * 在 editor 未就绪时 throw Promise，由 Suspense 捕获
 * 返回后保证 editor 已初始化完成
 *
 * @throws Promise - 当 editor 未就绪时
 *
 * @example
 * function MyComponent() {
 *   useEditorReadySuspense();
 *   // 这里可以安全地访问依赖 editor 的功能
 *   const meta = tableMetaService.getTableMeta('comment');
 *   return <div>{JSON.stringify(meta)}</div>;
 * }
 */
export function useEditorReadySuspense(): void {
  const editorContent = useSignal(editorHandler.content);
  if (editorContent.status !== "loaded") {
    throw editorHandler.waitForSettled();
  }
}

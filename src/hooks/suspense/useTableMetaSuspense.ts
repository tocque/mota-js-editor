/**
 * Suspense 版本的 useTableMeta
 *
 * 在数据未就绪时 throw handler
 * 业务组件只需要处理数据已加载的情况
 */

import {
  tableMetaService,
  type MetaFileKey,
} from "@/services/tableMeta/tableMetaService";
import type { CommentObject } from "@/components/Table";
import { useDataSuspense } from "./useDataSuspense";
import { useEditorReadySuspense } from "./useEditorReadySuspense";

/**
 * Suspense 版本的表格元数据 Hook
 *
 * 在数据未就绪时 throw handler，由 ContentBoundary 捕获处理
 * 业务组件只需要写"数据已就绪"的逻辑
 *
 * 注意：TableMeta 的 parse 依赖 setupEditor 中初始化的全局变量，
 * 所以需要先等待 editor ready
 *
 * @param key - 元数据文件 key
 * @returns CommentObject - 元数据对象
 * @throws IDataHandler - 当数据未就绪时抛出
 *
 * @example
 * // 业务组件只写正常逻辑
 * function MetaViewer() {
 *   const meta = useTableMetaSuspense('dataComment');
 *
 *   // 这里 meta 保证是 CommentObject 类型，不需要检查状态
 *   return <div>{JSON.stringify(meta)}</div>;
 * }
 *
 * // 使用时包裹 ContentBoundary
 * <ContentBoundary>
 *   <MetaViewer />
 * </ContentBoundary>
 */
export function useTableMetaSuspense(key: MetaFileKey): CommentObject {
  // 先等待 editor ready（TableMeta 的 parse 依赖全局变量）
  useEditorReadySuspense();

  const handler = tableMetaService.getHandler(key);
  const [data] = useDataSuspense(handler);
  return data;
}

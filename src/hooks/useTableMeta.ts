/**
 * TableMeta Hooks
 *
 * 提供表格元数据的 React Hooks，基于 tableMetaService
 */

import { useSignal } from "./useFs";
import {
  tableMetaService,
  type MetaFileKey,
} from "@/services/tableMeta/tableMetaService";
import type { Content } from "@/fs/types";
import type { CommentObject } from "@/components/Table";

/**
 * useTableMeta - 完整元数据 Hook
 *
 * @param key - 元数据文件 key
 * @returns Content<CommentObject> 元数据内容
 */
export function useTableMeta(key: MetaFileKey): Content<CommentObject> {
  const handler = tableMetaService.getHandler(key);
  return useSignal(handler.content);
}

// ==================== 预定义 Selectors ====================

/** 提取 floors._data.floor */
export const selectFloorMeta = (data: CommentObject): CommentObject =>
  (data._data?.floors as CommentObject)?._data?.floor as CommentObject ??
  ({} as CommentObject);

/** 提取 floors._data.loc */
export const selectLocMeta = (data: CommentObject): CommentObject =>
  (data._data?.floors as CommentObject)?._data?.loc as CommentObject ??
  ({} as CommentObject);

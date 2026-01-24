/**
 * TableMeta Hooks
 * 
 * 提供表格元数据的 React Hooks，基于 tableMetaService
 * 
 * 职责：
 * - useTableMeta() - 完整元数据
 * - useFloorTableMeta() - 只订阅 floor 子对象
 * - useLocTableMeta() - 只订阅 loc 子对象
 * - 无业务逻辑，只是对 tableMetaService 的包装
 */

import { useMemo } from "react";
import { computed } from "alien-signals";
import { useSignal } from "./useFs";
import { tableMetaService, type MetaFileKey } from "@/services/tableMeta/tableMetaService";
import { ContentUtils } from "@/fs/ContentUtils";
import type { Content } from "@/fs/types";
import type { CommentObject } from "@/components/Table";

/**
 * useTableMeta - 完整元数据 Hook
 * 
 * 订阅指定 key 的完整元数据
 * 
 * @param key - 元数据文件 key
 * @returns Content<CommentObject> 元数据内容
 * 
 * @example
 * function MetaEditor() {
 *   const content = useTableMeta('comment');
 *   
 *   return match(content)
 *     .with({ status: 'loaded' }, (c) => <div>{JSON.stringify(c.value)}</div>)
 *     .otherwise(() => <Loading />);
 * }
 */
export function useTableMeta(key: MetaFileKey): Content<CommentObject> {
  const handler = tableMetaService.getHandler(key);
  return useSignal(handler.content);
}

/**
 * useFloorTableMeta - 楼层表格元数据 Hook
 * 
 * 只订阅 comment.js 中的 floors._data.floor 子对象
 * 当 floors._data.loc 变化时，此 hook 不会触发重渲染
 * 
 * @returns Content<CommentObject> floor 元数据内容
 * 
 * @example
 * function FloorPropertiesPanel() {
 *   const content = useFloorTableMeta();
 *   
 *   return match(content)
 *     .with({ status: 'loaded' }, (c) => (
 *       <div>Floor properties: {Object.keys(c.value._data || {}).length}</div>
 *     ))
 *     .otherwise(() => <Loading />);
 * }
 */
export function useFloorTableMeta(): Content<CommentObject> {
  const handler = tableMetaService.getHandler('comment');
  
  // 使用 computed 创建派生 signal，只订阅 floors._data.floor
  const floorMeta = useMemo(
    () =>
      computed(() => {
        return ContentUtils.map(handler.content(), (data) => {
          // 提取 floors._data.floor
          const floors = data._data?.floors as CommentObject | undefined;
          const floor = floors?._data?.floor as CommentObject | undefined;
          return floor || ({} as CommentObject);
        });
      }),
    [handler],
  );
  
  return useSignal(floorMeta);
}

/**
 * useLocTableMeta - 位置表格元数据 Hook
 * 
 * 只订阅 comment.js 中的 floors._data.loc 子对象
 * 当 floors._data.floor 变化时，此 hook 不会触发重渲染
 * 
 * @returns Content<CommentObject> loc 元数据内容
 * 
 * @example
 * function LocPropertiesPanel() {
 *   const content = useLocTableMeta();
 *   
 *   return match(content)
 *     .with({ status: 'loaded' }, (c) => (
 *       <div>Loc properties: {Object.keys(c.value._data || {}).length}</div>
 *     ))
 *     .otherwise(() => <Loading />);
 * }
 */
export function useLocTableMeta(): Content<CommentObject> {
  const handler = tableMetaService.getHandler('comment');
  
  // 使用 computed 创建派生 signal，只订阅 floors._data.loc
  const locMeta = useMemo(
    () =>
      computed(() => {
        return ContentUtils.map(handler.content(), (data) => {
          // 提取 floors._data.loc
          const floors = data._data?.floors as CommentObject | undefined;
          const loc = floors?._data?.loc as CommentObject | undefined;
          return loc || ({} as CommentObject);
        });
      }),
    [handler],
  );
  
  return useSignal(locMeta);
}

/**
 * useObjectTableMeta - comment.js 完整元数据 Hook
 *
 * comment.js 包含多个 table meta：items, enemys, maps, floors 等。
 * 返回完整的解析结果，由上层 hooks 提取需要的部分。
 */

import { useMemo } from 'react';
import { useTableMetaFile } from '../useTableMetaFile';
import { parseTableMetaJs, META_FILE_CONFIG } from '../tableMetaService';
import type { CommentObject, FieldConfig } from '@/components/Table';

/**
 * comment.js 中的完整元数据结构
 * 包含 _data 字段，其中包含 items, enemys, maps, floors 等子对象
 */
export interface FullCommentMeta extends CommentObject {
  _data?: Record<string, FieldConfig | CommentObject>;
}

/**
 * useObjectTableMeta 返回值类型
 */
export interface UseObjectTableMetaResult {
  /** 解析后的完整元数据对象 */
  fullMeta: FullCommentMeta | undefined;
  /** 文件 key（供 useTableMetaEditor 使用） */
  fileKey: 'comment';
  /** 保存文件内容（裸文本） */
  save: (content: string) => Promise<void>;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 加载错误 */
  error: Error | null;
}

const COMMENT_KEY = 'comment' as const;

/**
 * comment.js 完整元数据 hook
 *
 * comment.js 包含多个 table meta：items, enemys, maps, floors 等
 * 返回完整的解析结果，由上层 hooks 提取需要的部分
 */
export function useObjectTableMeta(): UseObjectTableMetaResult {
  const { content, save, isLoading, isSaving, error } = useTableMetaFile(COMMENT_KEY);

  const fullMeta = useMemo<FullCommentMeta | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.comment.varName) as FullCommentMeta;
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    fullMeta,
    fileKey: COMMENT_KEY,
    save,
    isLoading,
    isSaving,
    error,
  };
}

// ==================== 上层 Hooks ====================
// 从 fullMeta 中提取特定对象的 meta

/**
 * 子对象元数据 Hook 返回值类型
 */
export interface UseSubObjectTableMetaResult {
  /** 解析后的元数据对象 */
  meta: CommentObject | undefined;
  /** 文件 key（供 useTableMetaEditor 使用） */
  fileKey: 'comment';
  /** 保存文件内容（裸文本） */
  save: (content: string) => Promise<void>;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 加载错误 */
  error: Error | null;
}

/**
 * useItemTableMeta - 物品表格元数据 Hook
 */
export function useItemTableMeta(): UseSubObjectTableMetaResult {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(
    () => fullMeta?._data?.items as CommentObject | undefined,
    [fullMeta],
  );
  return { meta, ...rest };
}

/**
 * useEnemyTableMeta - 怪物表格元数据 Hook
 */
export function useEnemyTableMeta(): UseSubObjectTableMetaResult {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(
    () => fullMeta?._data?.enemys as CommentObject | undefined,
    [fullMeta],
  );
  return { meta, ...rest };
}

/**
 * useMapTableMeta - 地图表格元数据 Hook
 */
export function useMapTableMeta(): UseSubObjectTableMetaResult {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(
    () => fullMeta?._data?.maps as CommentObject | undefined,
    [fullMeta],
  );
  return { meta, ...rest };
}

/**
 * useFloorTableMeta - 楼层表格元数据 Hook
 */
export function useFloorTableMeta(): UseSubObjectTableMetaResult {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(
    () => fullMeta?._data?.floors as CommentObject | undefined,
    [fullMeta],
  );
  return { meta, ...rest };
}

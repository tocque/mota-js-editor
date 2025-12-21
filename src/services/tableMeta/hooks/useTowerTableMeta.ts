/**
 * useTowerTableMeta - 全塔属性表格元数据 Hook
 *
 * 基于 useTableMetaFile，解析后返回 CommentObject。
 * 用于 TowerPanel 等需要全塔属性配置的组件。
 */

import { useMemo } from 'react';
import { useTableMetaFile } from '../useTableMetaFile';
import { parseTableMetaJs, META_FILE_CONFIG } from '../tableMetaService';
import type { CommentObject } from '@/components/Table';

/**
 * useTowerTableMeta 返回值类型
 */
export interface UseTowerTableMetaResult {
  /** 解析后的元数据对象 */
  meta: CommentObject | undefined;
  /** 文件 key（供 useTableMetaEditor 使用） */
  fileKey: 'dataComment';
  /** 保存文件内容（裸文本） */
  save: (content: string) => Promise<void>;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 加载错误 */
  error: Error | null;
}

const DATA_COMMENT_KEY = 'dataComment' as const;

/**
 * 全塔属性表格元数据 hook
 *
 * 基于 useTableMetaFile，解析后返回 CommentObject
 */
export function useTowerTableMeta(): UseTowerTableMetaResult {
  const { content, save, isLoading, isSaving, error } = useTableMetaFile(DATA_COMMENT_KEY);

  const meta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.dataComment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    meta,
    fileKey: DATA_COMMENT_KEY,
    save,
    isLoading,
    isSaving,
    error,
  };
}

/**
 * useFunctionsTableMeta - 脚本编辑表格元数据 Hook
 */
export interface UseFunctionsTableMetaResult {
  meta: CommentObject | undefined;
  fileKey: 'functionsComment';
  save: (content: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

const FUNCTIONS_COMMENT_KEY = 'functionsComment' as const;

export function useFunctionsTableMeta(): UseFunctionsTableMetaResult {
  const { content, save, isLoading, isSaving, error } = useTableMetaFile(FUNCTIONS_COMMENT_KEY);

  const meta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.functionsComment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    meta,
    fileKey: FUNCTIONS_COMMENT_KEY,
    save,
    isLoading,
    isSaving,
    error,
  };
}

/**
 * useEventsTableMeta - 公共事件表格元数据 Hook
 */
export interface UseEventsTableMetaResult {
  meta: CommentObject | undefined;
  fileKey: 'eventsComment';
  save: (content: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

const EVENTS_COMMENT_KEY = 'eventsComment' as const;

export function useEventsTableMeta(): UseEventsTableMetaResult {
  const { content, save, isLoading, isSaving, error } = useTableMetaFile(EVENTS_COMMENT_KEY);

  const meta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.eventsComment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    meta,
    fileKey: EVENTS_COMMENT_KEY,
    save,
    isLoading,
    isSaving,
    error,
  };
}

/**
 * usePluginsTableMeta - 插件表格元数据 Hook
 */
export interface UsePluginsTableMetaResult {
  meta: CommentObject | undefined;
  fileKey: 'pluginsComment';
  save: (content: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

const PLUGINS_COMMENT_KEY = 'pluginsComment' as const;

export function usePluginsTableMeta(): UsePluginsTableMetaResult {
  const { content, save, isLoading, isSaving, error } = useTableMetaFile(PLUGINS_COMMENT_KEY);

  const meta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.pluginsComment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    meta,
    fileKey: PLUGINS_COMMENT_KEY,
    save,
    isLoading,
    isSaving,
    error,
  };
}

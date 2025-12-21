/**
 * useTableMetaFile - 表格元数据文件 React Query Hook
 *
 * 提供裸文本的读写能力，不关心内容结构。
 * 使用 React Query 管理加载和缓存。
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadTableMetaFile, saveTableMetaFile, type MetaFileKey } from './tableMetaService';

/**
 * 生成 Query Key
 */
export const getTableMetaQueryKey = (key: MetaFileKey) => ['tableMetaFile', key] as const;

/**
 * useTableMetaFile 返回值类型
 */
export interface UseTableMetaFileResult {
  /** 文件内容（裸文本） */
  content: string | undefined;
  /** 文件 key */
  fileKey: MetaFileKey;
  /** 保存文件内容 */
  save: (content: string) => Promise<void>;
  /** 等待内容加载完成的 Promise */
  promise: Promise<string>;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 加载错误 */
  error: Error | null;
}

/**
 * 表格元数据文件的 React Query hook（底层，裸文本）
 *
 * @param key - 文件 key
 * @returns UseTableMetaFileResult
 */
export function useTableMetaFile(key: MetaFileKey): UseTableMetaFileResult {
  const queryClient = useQueryClient();
  const queryKey = getTableMetaQueryKey(key);

  // Query: 加载文件内容
  const query = useQuery<string, Error>({
    queryKey,
    queryFn: () => loadTableMetaFile(key),
    staleTime: Infinity,
    placeholderData: (previousData) => previousData,
  });

  // Mutation: 保存文件内容
  const mutation = useMutation<void, Error, string>({
    mutationFn: (content: string) => saveTableMetaFile(key, content),
    onSuccess: (_, content) => {
      // 更新缓存
      queryClient.setQueryData(queryKey, content);
    },
    onError: (error) => {
      if (typeof printe === 'function') {
        printe(`保存失败: ${error.message}`);
      }
    },
  });

  return {
    content: query.data,
    fileKey: key,
    save: mutation.mutateAsync,
    promise: query.promise,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    error: query.error,
  };
}

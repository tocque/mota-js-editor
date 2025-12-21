/**
 * useTableMetaEditor - 表格元数据编辑器 Hook
 *
 * 基于 useTableMetaFile，提供打开代码编辑器的函数。
 * 集成 editor_multi.open 打开编辑器，处理保存回调。
 */

import { useCallback } from 'react';
import { useTableMetaFile, type MetaFileKey } from '@/services/tableMeta';
import type { EditorMulti } from '@/types';

/**
 * 获取全局 editor_multi 对象
 */
function getEditorMulti(): EditorMulti | null {
  return typeof window !== 'undefined' ? (window.editor_multi as EditorMulti | undefined) ?? null : null;
}

/**
 * useTableMetaEditor 返回值类型
 */
export interface UseTableMetaEditorResult {
  /** 打开编辑器（内部会等待数据加载完成） */
  openEditor: () => Promise<void>;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
}

/**
 * 表格元数据编辑器 hook
 *
 * 基于 useTableMetaFile，提供打开编辑器的函数。
 * 编辑器内部会处理保存和更新缓存。
 *
 * @param key - 文件 key
 * @returns UseTableMetaEditorResult
 */
export function useTableMetaEditor(key: MetaFileKey): UseTableMetaEditorResult {
  const { promise, save, isLoading, isSaving } = useTableMetaFile(key);

  const openEditor = useCallback(async () => {
    // 等待内容加载完成
    let content: string;
    try {
      content = await promise;
    } catch (error) {
      if (typeof printe === 'function') {
        printe(`加载元数据文件失败: ${(error as Error).message}`);
      }
      return;
    }

    // 获取 editor_multi
    const editorMulti = getEditorMulti();
    if (!editorMulti) {
      if (typeof printe === 'function') {
        printe('editor_multi 不可用');
      }
      return;
    }

    // 打开代码编辑器
    editorMulti.open(
      content,
      {
        lint: true,
        contextId: `tableMeta-${key}`,
      },
      {
        onConfirm: async (newContent: string) => {
          try {
            await save(newContent);
            if (typeof printf === 'function') {
              printf(`${key} 配置已更新`);
            }
          } catch {
            // 错误已在 mutation.onError 中处理
          }
        },
      },
    );
  }, [promise, key, save]);

  return {
    openEditor,
    isLoading,
    isSaving,
  };
}

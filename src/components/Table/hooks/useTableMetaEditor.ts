/**
 * useTableMetaEditor - 表格元数据编辑器 Hook
 *
 * 基于 tableMetaService，提供打开代码编辑器的函数。
 * 集成 editor_multi.open 打开编辑器，处理保存回调。
 */

import { useCallback, useMemo } from 'react';
import { tableMetaService, type MetaFileKey } from '@/services/tableMeta';
import { useSignal } from '@/hooks/useFs';
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
}

/**
 * 表格元数据编辑器 hook
 *
 * 基于 tableMetaService，提供打开编辑器的函数。
 * 编辑器内部会处理保存和更新缓存。
 *
 * @param key - 文件 key
 * @returns UseTableMetaEditorResult
 */
export function useTableMetaEditor(key: MetaFileKey): UseTableMetaEditorResult {
  // 获取底层 FileHandler（裸文本层）
  const fileHandler = useMemo(
    () => tableMetaService.getHandler(key).getFileHandler(),
    [key],
  );

  // 订阅内容状态
  const content = useSignal(fileHandler.content);

  const openEditor = useCallback(async () => {
    // 等待状态稳定（避免 error/not-found 时无限挂起）
    await fileHandler.waitForSettled();

    const currentContent = fileHandler.getContent();
    if (currentContent.status !== 'loaded') {
      if (typeof printe === 'function') {
        printe(`加载元数据文件失败: ${currentContent.status}`);
      }
      return;
    }

    const text = currentContent.value;

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
      text,
      {
        lint: true,
        contextId: `tableMeta-${key}`,
      },
      {
        onConfirm: async (newContent: string) => {
          try {
            fileHandler.update(newContent);
            await fileHandler.waitForIdle();
            if (typeof printf === 'function') {
              printf(`${key} 配置已更新`);
            }
          } catch (error) {
            if (typeof printe === 'function') {
              printe(`保存失败: ${(error as Error).message}`);
            }
          }
        },
      },
    );
  }, [fileHandler, key]);

  return {
    openEditor,
    isLoading: content.status === 'loading',
  };
}

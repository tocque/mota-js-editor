/**
 * TowerDataStore - 全塔属性数据 Store
 *
 * 纯数据层，负责：
 * - 使用 useQuery 获取原始数据
 * - 使用 useTowerTableMeta 获取 commentObj
 * - 使用 useMutation 实现批量保存（接收外部传入的 actionList）
 *
 * actionList 由 Panel 层管理，保存时传入。
 */

import { createStore } from '@/utils/store/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TOWER_QUERY_KEY } from '@/queryClient';
import { fetchTowerData, saveActions, type Action } from '@/services/tower';
import { useTowerTableMeta } from '@/services/tableMeta';
import type { CommentObject } from '@/components/Table';

/**
 * 处理 main 字段的 null 填充
 * 根据 commentObj 中定义的字段，对 data.main 进行处理
 */
function processMainFields(
  data: Record<string, unknown>,
  commentObj: CommentObject
): Record<string, unknown> {
  const result = { ...data, main: {} };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainCommentData = (commentObj as any)?._data?.main?._data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorMain = (editor as any)?.main as Record<string, unknown> | undefined;
  const dataMain = data.main as Record<string, unknown> | undefined;

  if (mainCommentData && typeof mainCommentData === 'object') {
    const mainData: Record<string, unknown> = {};

    for (const key of Object.keys(mainCommentData)) {
      if (editorMain && key in editorMain) {
        mainData[key] = dataMain?.[key];
      } else {
        mainData[key] = null;
      }
    }

    result.main = mainData;
  }

  return result;
}

const useTowerDataStore = () => {
  const queryClient = useQueryClient();

  // 从 useTowerTableMeta 获取 commentObj
  const metaQuery = useTowerTableMeta();

  // Query: 获取原始数据
  const dataQuery = useQuery({
    queryKey: TOWER_QUERY_KEY,
    queryFn: fetchTowerData,
  });

  // 处理 main 字段
  const data = dataQuery.data && metaQuery.meta
    ? processMainFields(dataQuery.data, metaQuery.meta)
    : undefined;

  // Mutation: 批量保存（接收外部传入的 actionList）
  const saveMutation = useMutation({
    mutationFn: (actionList: Action[]) => saveActions(actionList),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: TOWER_QUERY_KEY });
      printf?.('保存成功！');
    },
    onError: (err) => {
      printe?.(String(err));
    },
  });

  return {
    // 数据
    data,
    commentObj: metaQuery.meta,
    isLoading: dataQuery.isLoading || metaQuery.isLoading,
    error: dataQuery.error || metaQuery.error,
    // 保存（由调用方传入 actionList）
    save: (actionList: Action[]) => saveMutation.mutateAsync(actionList),
    isSaving: saveMutation.isPending,
  };
};

export const TowerDataStore = createStore(useTowerDataStore);

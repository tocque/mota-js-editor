/**
 * TowerDataStore - 全塔属性数据 Store
 *
 * 纯数据层，负责：
 * - 使用 useQuery 获取数据
 * - 使用 useMutation 实现批量保存（接收外部传入的 actionList）
 *
 * actionList 由 Panel 层管理，保存时传入。
 */

import { createStore } from '@/utils/store/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TOWER_QUERY_KEY } from '@/queryClient';
import { fetchTowerData, saveActions, type Action } from '@/services/tower';

const useTowerDataStore = () => {
  const queryClient = useQueryClient();

  // Query: 获取数据
  const { data: towerData, isLoading, error } = useQuery({
    queryKey: TOWER_QUERY_KEY,
    queryFn: fetchTowerData,
  });

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
    towerData,
    isLoading,
    error,
    // 保存（由调用方传入 actionList）
    save: (actionList: Action[]) => saveMutation.mutateAsync(actionList),
    isSaving: saveMutation.isPending,
  };
};

export const TowerDataStore = createStore(useTowerDataStore);

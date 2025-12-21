/**
 * FloorDataStore - 楼层属性数据 Store
 *
 * 纯数据层，负责：
 * - 使用 useQuery 获取楼层数据（通过 floorId 参数）
 * - 使用 useFloorTableMeta 获取 commentObj
 * - 使用 useMutation 实现保存（接收外部传入的 actionList）
 *
 * 与 TowerDataStore 不同，FloorDataStore 通过 floorId 参数显式指定操作对象，
 * 不同楼层的数据独立缓存。
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FLOOR_QUERY_KEY } from '@/queryClient';
import { fetchFloorData, saveActions, type Action } from '@/services/floor';
import { useFloorTableMeta } from '@/services/tableMeta';
import type { CommentObject } from '@/components/Table';

interface UseFloorDataStoreProps {
  floorId: string;
}

interface UseFloorDataStoreResult {
  /** 楼层数据 */
  data: Record<string, unknown> | undefined;
  /** 楼层元数据配置 */
  commentObj: CommentObject | undefined;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 加载错误 */
  error: Error | null;
  /** 保存修改（由调用方传入 actionList） */
  save: (actionList: Action[]) => Promise<void>;
  /** 是否正在保存 */
  isSaving: boolean;
}

/**
 * 楼层数据 Store Hook
 *
 * @param props - 包含 floorId 的配置对象
 * @returns 楼层数据、元数据、加载状态和保存方法
 */
export function useFloorDataStore(props: UseFloorDataStoreProps): UseFloorDataStoreResult {
  const { floorId } = props;
  const queryClient = useQueryClient();

  // 从 useFloorTableMeta 获取 commentObj
  const metaQuery = useFloorTableMeta();
  const floorMeta = metaQuery.meta;

  // Query: 获取楼层数据
  const dataQuery = useQuery({
    queryKey: FLOOR_QUERY_KEY(floorId),
    queryFn: () => {
      if (!floorMeta) {
        throw new Error('楼层元数据未加载');
      }
      return fetchFloorData(floorId, floorMeta);
    },
    enabled: !!floorMeta && !!floorId,
  });

  // Mutation: 保存修改（接收外部传入的 actionList）
  const saveMutation = useMutation({
    mutationFn: (actionList: Action[]) => saveActions(floorId, actionList),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: FLOOR_QUERY_KEY(floorId) });
      printf?.('保存成功！');
    },
    onError: (err) => {
      printe?.(String(err));
    },
  });

  return {
    data: dataQuery.data,
    commentObj: floorMeta,
    isLoading: dataQuery.isLoading || metaQuery.isLoading,
    error: dataQuery.error || metaQuery.error,
    save: (actionList: Action[]) => saveMutation.mutateAsync(actionList),
    isSaving: saveMutation.isPending,
  };
}

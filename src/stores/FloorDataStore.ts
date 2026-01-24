/**
 * FloorDataStore - 楼层属性数据 Store
 *
 * 纯数据层，负责：
 * - 使用 useFloorData 获取楼层数据（基于 signal）
 * - 使用 useTableMeta 获取 commentObj
 * - 使用 floorService.saveFloor 实现保存
 *
 * 与 TowerDataStore 不同，FloorDataStore 通过 floorId 参数显式指定操作对象。
 */

import { useMemo, useCallback, useState } from 'react';
import { useFloorData } from '@/hooks/useFloor';
import { useTableMeta } from '@/hooks/useTableMeta';
import { floorService, type Action } from '@/services/floor';
import { ContentUtils } from '@/fs/ContentUtils';
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

  // 保存状态
  const [isSaving, setIsSaving] = useState(false);

  // 使用新的 useFloorData hook 获取楼层数据
  const [floorContent] = useFloorData(floorId);

  // 使用 useTableMeta 获取 comment.js 完整元数据
  const metaContent = useTableMeta('comment');

  // 从 metaContent 中提取 floors 子对象
  const floorMeta = useMemo(() => {
    if (!ContentUtils.isLoaded(metaContent)) return undefined;
    // 提取 floors 对象（包含 floor 和 loc 两个子对象）
    const floors = metaContent.value._data?.floors as CommentObject | undefined;
    // 返回 floors._data.floor（楼层属性的元数据）
    return floors?._data?.floor as CommentObject | undefined;
  }, [metaContent]);

  // 计算数据和状态
  const data = useMemo(() => {
    if (!ContentUtils.isLoaded(floorContent)) return undefined;
    return floorContent.value as unknown as Record<string, unknown>;
  }, [floorContent]);

  const isLoading = ContentUtils.isLoading(floorContent) || ContentUtils.isLoading(metaContent);

  const error = useMemo(() => {
    if (ContentUtils.isError(floorContent)) return floorContent.error;
    if (ContentUtils.isError(metaContent)) return metaContent.error;
    return null;
  }, [floorContent, metaContent]);

  // 保存方法 - 使用 floorService.saveFloor
  const save = useCallback(async (actionList: Action[]) => {
    if (actionList.length === 0) return;

    setIsSaving(true);
    try {
      // 同步更新内存 + 异步落盘
      floorService.saveFloor(floorId, actionList);
      printf?.('保存成功！');
    } catch (err) {
      printe?.(String(err));
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [floorId]);

  return {
    data,
    commentObj: floorMeta,
    isLoading,
    error,
    save,
    isSaving,
  };
}

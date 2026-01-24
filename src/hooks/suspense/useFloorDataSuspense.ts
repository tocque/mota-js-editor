/**
 * Suspense 版本的 useFloorData
 *
 * 在数据未就绪时 throw handler
 * 业务组件只需要处理数据已加载的情况
 */

import { floorService } from "@/services/floor";
import type { FloorData } from "@/types";
import type { UpdateFn } from "../useFs";
import { useDataSuspense } from "./useDataSuspense";

/**
 * Suspense 版本的楼层数据 Hook
 *
 * 在数据未就绪时 throw handler，由 ContentBoundary 捕获处理
 * 业务组件只需要写"数据已就绪"的逻辑
 *
 * @param floorId - 楼层 ID
 * @returns [FloorData, UpdateFn] - 数据和更新函数
 * @throws IDataHandler - 当数据未就绪时抛出
 *
 * @example
 * // 业务组件只写正常逻辑
 * function FloorEditor({ floorId }: { floorId: string }) {
 *   const [floor, update] = useFloorDataSuspense(floorId);
 *
 *   // 这里 floor 保证是 FloorData 类型，不需要检查状态
 *   return <Input value={floor.title} onChange={...} />;
 * }
 *
 * // 使用时包裹 ContentBoundary
 * <ContentBoundary>
 *   <FloorEditor floorId="MT1" />
 * </ContentBoundary>
 */
export function useFloorDataSuspense(
  floorId: string,
): [FloorData, UpdateFn<FloorData>] {
  const handler = floorService.getHandler(floorId);
  return useDataSuspense(handler);
}

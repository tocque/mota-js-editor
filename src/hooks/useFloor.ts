/**
 * Floor 业务 Hooks
 * 
 * 提供楼层相关的所有 React Hooks
 * 
 * 设计理念：
 * - 无业务逻辑，只是对 floorService 的包装
 * - 内部调用 floorService.getHandler()
 * - 使用 useSignal 订阅 DataHandler 的 signal
 */

import { floorService } from "@/services/floor";
import type { FloorData } from "@/types";
import type { Content } from "@/fs";
import { useData } from "./useData";
import type { UpdateFn } from "./useFs";

/**
 * 订阅楼层数据（可写）
 * 
 * 返回 [Content<FloorData>, update] 元组
 * - Content<FloorData>: 楼层数据的所有可能状态
 * - update: 更新函数，支持三种模式：
 *   1. 直接设置：update(newData)
 *   2. 同步转换：update(current => ({ ...current, title: 'New' }))
 *   3. 异步转换：await update(async current => await process(current))
 * 
 * @example
 * // 基础用法
 * function FloorEditor({ floorId }: { floorId: string }) {
 *   const [content, update] = useFloorData(floorId);
 *   
 *   const handleTitleChange = (newTitle: string) => {
 *     update(data => ({ ...data, title: newTitle }));
 *   };
 *   
 *   return match(content)
 *     .with({ status: 'loaded' }, (c) => (
 *       <Input value={c.value.title} onChange={handleTitleChange} />
 *     ))
 *     .otherwise(() => <Loading />);
 * }
 * 
 * @example
 * // 异步更新
 * function FloorMapProcessor({ floorId }: { floorId: string }) {
 *   const [content, update] = useFloorData(floorId);
 *   
 *   const handleProcess = async () => {
 *     await update(async data => ({
 *       ...data,
 *       map: await processMap(data.map)
 *     }));
 *   };
 *   
 *   return match(content)
 *     .with({ status: 'loaded' }, (c) => (
 *       <Button onClick={handleProcess}>Process Map</Button>
 *     ))
 *     .otherwise(() => <Loading />);
 * }
 * 
 * @example
 * // 使用类型守卫
 * function FloorSize({ floorId }: { floorId: string }) {
 *   const [content] = useFloorData(floorId);
 *   
 *   if (ContentUtils.isLoading(content)) {
 *     return <Loading />;
 *   }
 *   
 *   if (ContentUtils.isLoaded(content)) {
 *     return <div>{content.value.width} x {content.value.height}</div>;
 *   }
 *   
 *   return <Error />;
 * }
 */
export function useFloorData(
  floorId: string
): [
  Content<FloorData>,
  UpdateFn<FloorData>
] {
  const handler = floorService.getHandler(floorId);
  return useData(handler);
}

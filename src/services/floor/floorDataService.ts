/**
 * FloorDataService - 楼层数据服务
 *
 * 封装楼层数据的读取和写入操作，
 * 通过 floorId 参数显式指定操作对象，不依赖全局状态。
 */

import { applyActions, type Action } from '@/utils/action';
import { encode64 } from '@/utils/encoding';
import { serializeToJsMapFile, alertWhenCompress } from '@/utils/serialize';
import { createWriteExecutor } from '@/utils/writeExecutor';
import { fs } from '@/services/fs';
import type { CommentObject, FieldConfig } from '@/components/Table';
import type { FloorData } from '@/types';

export type { Action };

/** 楼层文件路径前缀 */
const FLOOR_FILE_PREFIX = 'project/floors/';

/** 写入执行器实例 */
const writeExecutor = createWriteExecutor();

/** 地图相关字段，需要从楼层数据中过滤掉 */
const MAP_FIELDS = new Set(['map', 'bgmap', 'fgmap']);

/**
 * 获取楼层数据对象
 *
 * @param floorId - 楼层 ID
 * @returns 楼层数据对象
 * @throws 当楼层不存在时抛出错误
 */
function getFloorData(floorId: string): FloorData {
  const floors = core.floors as Record<string, FloorData>;
  const floorData = floors[floorId];
  if (!floorData) {
    throw new Error(`楼层 ${floorId} 不存在`);
  }
  return floorData;
}

/**
 * 从 commentObj 中提取 loc 相关字段名
 *
 * @param commentObj - 楼层注释配置对象
 * @returns loc 字段名集合
 */
function getLocFields(commentObj: CommentObject): Set<string> {
  const locData = (commentObj._data as Record<string, CommentObject | FieldConfig> | undefined)
    ?.loc as CommentObject | undefined;
  const locFields = locData?._data;

  if (!locFields || typeof locFields !== 'object') {
    return new Set();
  }

  return new Set(Object.keys(locFields as Record<string, unknown>));
}

/**
 * 从 commentObj 中提取 floor 相关字段名
 *
 * @param commentObj - 楼层注释配置对象
 * @returns floor 字段名集合
 */
function getFloorFields(commentObj: CommentObject): Set<string> {
  const floorData = (commentObj._data as Record<string, CommentObject | FieldConfig> | undefined)
    ?.floor as CommentObject | undefined;
  const floorFields = floorData?._data;

  if (!floorFields || typeof floorFields !== 'object') {
    return new Set();
  }

  return new Set(Object.keys(floorFields as Record<string, unknown>));
}

/**
 * 获取楼层属性数据
 *
 * 从 core.floors 获取楼层数据，过滤掉 map 和 loc 相关字段，
 * 补充 commentObj 中定义但数据中不存在的字段为 null。
 *
 * @param floorId - 楼层 ID
 * @param commentObj - 楼层注释配置对象（用于过滤 loc 字段和补充缺失字段）
 * @returns 过滤后的楼层数据
 * @throws 当楼层不存在时抛出错误
 */
export function fetchFloorData(
  floorId: string,
  commentObj: CommentObject,
): Record<string, unknown> {
  const floorData = getFloorData(floorId);

  // 获取需要过滤的 loc 字段
  const locFields = getLocFields(commentObj);

  // 过滤数据：排除 map 相关字段和 loc 相关字段
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(floorData)) {
    if (!MAP_FIELDS.has(key) && !locFields.has(key)) {
      result[key] = floorData[key];
    }
  }

  // 补充 commentObj 中定义但数据中不存在的字段为 null
  const floorFields = getFloorFields(commentObj);
  for (const key of floorFields) {
    if (!(key in result)) {
      result[key] = null;
    }
  }

  return result;
}

/**
 * 写入楼层文件
 *
 * @param floorId - 楼层 ID
 * @param floorData - 楼层数据对象
 */
async function writeFloorFile(
  floorId: string,
  floorData: Record<string, unknown>,
): Promise<void> {
  const content = serializeToJsMapFile(floorId, floorData);
  await fs.promises.writeFile(
    `${FLOOR_FILE_PREFIX}${floorId}.js`,
    encode64(content),
    'base64',
  );
}

/**
 * 保存楼层属性修改
 *
 * 应用 action 列表到楼层数据对象，序列化并写入文件。
 * 使用写入同步管理处理并发。
 *
 * @param floorId - 楼层 ID
 * @param actions - Action 列表
 */
export async function saveActions(
  floorId: string,
  actions: Action[],
): Promise<void> {
  if (actions.length === 0) {
    return;
  }

  const floorData = getFloorData(floorId);

  // 立即应用所有 actions 到数据对象（同步操作）
  applyActions(floorData, actions);

  // 提醒用户关于压缩文件
  alertWhenCompress();

  // 文件写入放到 writeExecutor 中处理并发
  await writeExecutor.exec(async () => {
    await writeFloorFile(floorId, getFloorData(floorId));
  });
}

/**
 * 使用新 floorId 保存楼层
 *
 * 将楼层数据以新的 floorId 保存到新文件。
 * 注意：此函数不会删除旧文件，也不会更新 floorIds 列表。
 *
 * @param oldFloorId - 原楼层 ID
 * @param newFloorId - 新楼层 ID
 */
export async function saveFloorWithNewId(
  oldFloorId: string,
  newFloorId: string,
): Promise<void> {
  const floorData = getFloorData(oldFloorId);

  // 更新 floorId 字段
  floorData.floorId = newFloorId;

  // 提醒用户关于压缩文件
  alertWhenCompress();

  // 写入新文件
  await writeFloorFile(newFloorId, floorData);
}

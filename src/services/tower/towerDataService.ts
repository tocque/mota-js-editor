/**
 * TowerDataService - 全塔属性数据服务
 *
 * 封装全塔属性数据的读取和写入操作，
 * 提供 Promise 风格的 API。
 */

import type { CommentObject } from '@/components/Table';
import { applyActions, type Action } from '@/utils/action';
import { encode64 } from '@/utils/encoding';
import { serializeToJsFile, alertWhenCompress } from '@/utils/serialize';
import { createWriteExecutor } from '@/utils/writeExecutor';
import { fs } from '@/services/fs';

export type { Action };

/** 全塔属性数据结构 */
export interface TowerData {
  /** 数据对象 */
  data: Record<string, unknown>;
  /** 注释配置对象 */
  commentObj: CommentObject;
}

/** 数据变量名 */
const DATA_VAR_NAME = 'data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d';

/** 数据文件路径 */
const DATA_FILE_PATH = 'project/data.js';

/** 写入执行器实例 */
const writeExecutor = createWriteExecutor();

/**
 * 获取全局数据对象
 * @returns 全塔属性数据对象
 */
function getDataObject(): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any)[DATA_VAR_NAME] as Record<string, unknown>;
}

/**
 * 获取注释配置对象
 *
 * @returns 注释配置对象
 * @throws 当 editor.file.dataComment 不可用时抛出错误
 */
export function getCommentObject(): CommentObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataComment = (editor as any)?.file?.dataComment;
  if (!dataComment) {
    throw new Error('editor.file.dataComment 不可用');
  }
  return dataComment as CommentObject;
}

/**
 * 读取全塔属性数据
 *
 * 从 data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d 读取数据，
 * 合并 main 字段，缺失字段设为 null。
 *
 * @returns 包含数据对象和注释配置
 */
export function readTowerData(): TowerData {
  const dataObj = getDataObject();
  const commentObj = getCommentObject();

  // 复制数据对象，并初始化 main 字段
  const data: Record<string, unknown> = { ...dataObj, main: {} };

  // 获取 main 字段的注释配置
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainCommentData = (commentObj as any)?._data?.main?._data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorMain = (editor as any)?.main as Record<string, unknown> | undefined;
  const dataMain = dataObj.main as Record<string, unknown> | undefined;

  if (mainCommentData && typeof mainCommentData === 'object') {
    const mainData: Record<string, unknown> = {};

    // 遍历注释配置中定义的所有 main 字段
    for (const key of Object.keys(mainCommentData)) {
      if (editorMain && key in editorMain) {
        // 如果 editor.main 中存在该字段，使用 data 对象中的值
        mainData[key] = dataMain?.[key];
      } else {
        // 如果 editor.main 中不存在该字段，设为 null
        mainData[key] = null;
      }
    }

    data.main = mainData;
  }

  return { data, commentObj };
}

/**
 * 写入全塔属性数据
 *
 * 应用 action 列表到数据对象，序列化并写入文件。
 * 使用写入同步管理处理并发。
 *
 * 注意：actions 的应用是同步的，立即修改数据对象。
 * writeExecutor 只管理文件写入的并发，确保最终写入的是最新状态。
 *
 * @param actions - Action 列表
 * @returns Promise，写入完成时 resolve
 */
export async function writeTowerData(actions: Action[]): Promise<void> {
  if (actions.length === 0) {
    return;
  }

  const dataObj = getDataObject();

  // 立即应用所有 actions 到数据对象（同步操作）
  applyActions(dataObj, actions);

  // 检查 firstData.floorId 是否在 main.floorIds 中
  const mainFloorIds = (dataObj.main as Record<string, unknown>)?.floorIds as string[] | undefined;
  const firstData = dataObj.firstData as Record<string, unknown> | undefined;
  if (mainFloorIds && firstData && Array.isArray(mainFloorIds)) {
    if (!mainFloorIds.includes(firstData.floorId as string)) {
      firstData.floorId = mainFloorIds[0];
    }
  }

  // 提醒用户关于压缩文件
  alertWhenCompress();

  // 文件写入放到 writeExecutor 中处理并发
  // 即使写入任务被合并，序列化的是当前最新的数据对象状态
  await writeExecutor.exec(async () => {
    const content = serializeToJsFile(DATA_VAR_NAME, getDataObject());
    await fs.promises.writeFile(DATA_FILE_PATH, encode64(content), 'base64');
  });
}

/**
 * 获取全塔属性数据（兼容旧 API）
 *
 * @returns Promise<TowerData>
 */
export function fetchTowerData(): Promise<TowerData> {
  return Promise.resolve(readTowerData());
}

/**
 * 批量保存修改（兼容旧 API）
 *
 * @param actionList - Action 列表
 * @returns Promise<void>
 */
export function saveActions(actionList: Action[]): Promise<void> {
  return writeTowerData(actionList);
}

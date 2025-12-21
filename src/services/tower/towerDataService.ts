/**
 * TowerDataService - 全塔属性数据服务
 *
 * 封装 editor.file.editTower 的数据获取和保存操作，
 * 提供 Promise 风格的 API。
 */

import type { CommentObject } from '@/components/Table';

/** Action 类型：[操作类型, 字段路径, 值] */
export type Action = ['change' | 'add' | 'delete', string, unknown];

/** 全塔属性数据结构 */
export interface TowerData {
  /** 数据对象 */
  data: Record<string, unknown>;
  /** 注释配置对象 */
  commentObj: CommentObject;
}

/**
 * 获取全塔属性数据
 *
 * 调用 editor.file.editTower([]) 获取数据和注释配置。
 * 回调格式: [data, commentObj, error]
 */
export function fetchTowerData(): Promise<TowerData> {
  return new Promise((resolve, reject) => {
    const editTower = editor?.file?.editTower;
    if (!editTower) {
      reject(new Error('editor.file.editTower 不可用'));
      return;
    }
    editTower([], (objs: unknown[]) => {
      const [data, commentObj, error] = objs as [
        Record<string, unknown>,
        CommentObject,
        string | null,
      ];
      if (error) {
        reject(new Error(error));
        return;
      }
      resolve({ data, commentObj });
    });
  });
}

/**
 * 批量保存修改
 *
 * 将 actionList 提交到 editor.file.editTower 进行保存。
 * 回调格式: [error]
 */
export function saveActions(actionList: Action[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (actionList.length === 0) {
      resolve();
      return;
    }
    const editTower = editor?.file?.editTower;
    if (!editTower) {
      reject(new Error('editor.file.editTower 不可用'));
      return;
    }
    editTower(actionList, (objs: unknown[]) => {
      const error = objs.slice(-1)[0] as string | null;
      if (error) {
        reject(new Error(error));
      } else {
        resolve();
      }
    });
  });
}

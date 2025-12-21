/**
 * Action Utilities
 *
 * 数据修改操作的工具函数，用于应用 Action 到目标对象。
 */

import { deleteByFieldPath, setByFieldPath } from '@/utils/fieldPath';

/** 操作类型 */
export type ActionType = 'change' | 'add' | 'delete';

/** Action 元组：[操作类型, 字段路径, 值] */
export type Action = [ActionType, string, unknown];

/**
 * 应用单个 Action 到目标对象
 *
 * @param target - 目标对象
 * @param action - Action 元组 [type, path, value]
 *
 * @example
 * const obj = { a: 1 };
 * applyAction(obj, ['change', "['a']", 2]);
 * // obj = { a: 2 }
 *
 * applyAction(obj, ['add', "['b']", 3]);
 * // obj = { a: 2, b: 3 }
 *
 * applyAction(obj, ['delete', "['a']", undefined]);
 * // obj = { b: 3 }
 */
export function applyAction(target: Record<string, unknown>, action: Action): void {
  const [type, path, value] = action;

  // 当值为 undefined 或操作类型为 delete 时，删除字段
  if (type === 'delete' || value === undefined) {
    deleteByFieldPath(target, path);
    return;
  }

  // change 和 add 操作都是设置值
  setByFieldPath(target, path, value);
}

/**
 * 批量应用 Actions 到目标对象
 *
 * @param target - 目标对象
 * @param actions - Action 列表
 *
 * @example
 * const obj = {};
 * applyActions(obj, [
 *   ['add', "['a']", 1],
 *   ['add', "['b']['c']", 2],
 *   ['change', "['a']", 10],
 * ]);
 * // obj = { a: 10, b: { c: 2 } }
 */
export function applyActions(target: Record<string, unknown>, actions: Action[]): void {
  for (const action of actions) {
    applyAction(target, action);
  }
}

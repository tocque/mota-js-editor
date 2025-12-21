import { useState, useCallback, useMemo } from 'react';

/** Action 类型：[操作类型, 字段路径, 值] */
export type Action = ['change' | 'add' | 'delete', string, unknown];

export interface UseActionListReturn {
  /** 当前的修改列表 */
  actionList: Action[];
  /** 是否有未保存的修改 */
  hasChanges: boolean;
  /** 添加变更动作 */
  addChange: (field: string, value: unknown) => void;
  /** 添加新增动作 */
  addAdd: (field: string, id: string) => void;
  /** 添加删除动作 */
  addDelete: (field: string) => void;
  /** 清空修改列表 */
  clear: () => void;
}

/**
 * 公共 Hook：管理修改列表
 * 可复用于所有需要批量保存的表格面板
 */
export function useActionList(): UseActionListReturn {
  const [actionList, setActionList] = useState<Action[]>([]);

  const addChange = useCallback((field: string, value: unknown) => {
    setActionList(prev => [...prev, ['change', field, value]]);
  }, []);

  const addAdd = useCallback((field: string, id: string) => {
    const newField = field + "['" + id + "']";
    setActionList(prev => [...prev, ['add', newField, null]]);
  }, []);

  const addDelete = useCallback((field: string) => {
    setActionList(prev => [...prev, ['delete', field, undefined]]);
  }, []);

  const clear = useCallback(() => {
    setActionList([]);
  }, []);

  const hasChanges = useMemo(() => actionList.length > 0, [actionList]);

  return {
    actionList,
    hasChanges,
    addChange,
    addAdd,
    addDelete,
    clear,
  };
}

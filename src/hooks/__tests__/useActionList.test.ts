/**
 * useActionList 单元测试
 *
 * 测试修改列表管理 Hook 的功能
 * **Validates: Requirements 2.1**
 *
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActionList } from '../useActionList';

describe('useActionList', () => {
  describe('初始状态', () => {
    it('actionList 应该初始化为空数组', () => {
      const { result } = renderHook(() => useActionList());

      expect(result.current.actionList).toEqual([]);
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('addChange', () => {
    it('应该正确添加变更动作', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['main']['title']", '新标题');
      });

      expect(result.current.actionList).toEqual([
        ['change', "['main']['title']", '新标题'],
      ]);
      expect(result.current.hasChanges).toBe(true);
    });

    it('应该支持连续添加多个变更', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['main']['title']", '标题1');
      });
      act(() => {
        result.current.addChange("['main']['name']", '名称1');
      });

      expect(result.current.actionList).toHaveLength(2);
      expect(result.current.actionList[0]).toEqual([
        'change',
        "['main']['title']",
        '标题1',
      ]);
      expect(result.current.actionList[1]).toEqual([
        'change',
        "['main']['name']",
        '名称1',
      ]);
    });

    it('应该支持各种类型的值', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['field1']", 123);
      });
      act(() => {
        result.current.addChange("['field2']", true);
      });
      act(() => {
        result.current.addChange("['field3']", ['a', 'b']);
      });

      expect(result.current.actionList[0][2]).toBe(123);
      expect(result.current.actionList[1][2]).toBe(true);
      expect(result.current.actionList[2][2]).toEqual(['a', 'b']);
    });
  });

  describe('addAdd', () => {
    it('应该正确构建字段路径并添加新增动作', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addAdd("['floorIds']", 'MT10');
      });

      expect(result.current.actionList).toEqual([
        ['add', "['floorIds']['MT10']", null],
      ]);
      expect(result.current.hasChanges).toBe(true);
    });

    it('应该正确处理带特殊字符的 id', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addAdd("['items']", 'item-001');
      });

      expect(result.current.actionList[0][1]).toBe("['items']['item-001']");
    });
  });

  describe('addDelete', () => {
    it('应该正确添加删除动作', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addDelete("['floorIds']['MT5']");
      });

      expect(result.current.actionList).toEqual([
        ['delete', "['floorIds']['MT5']", undefined],
      ]);
      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('clear', () => {
    it('应该清空修改列表', () => {
      const { result } = renderHook(() => useActionList());

      // 先添加一些动作
      act(() => {
        result.current.addChange("['field1']", 'value1');
      });
      act(() => {
        result.current.addAdd("['items']", 'item1');
      });
      act(() => {
        result.current.addDelete("['field2']");
      });
      expect(result.current.actionList).toHaveLength(3);
      expect(result.current.hasChanges).toBe(true);

      // 清空
      act(() => {
        result.current.clear();
      });

      expect(result.current.actionList).toEqual([]);
      expect(result.current.hasChanges).toBe(false);
    });

    it('对空列表调用应该保持为空', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.clear();
      });

      expect(result.current.actionList).toEqual([]);
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('hasChanges', () => {
    it('空列表时应该为 false', () => {
      const { result } = renderHook(() => useActionList());
      expect(result.current.hasChanges).toBe(false);
    });

    it('有动作时应该为 true', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['field']", 'value');
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it('清空后应该为 false', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['field']", 'value');
      });
      expect(result.current.hasChanges).toBe(true);

      act(() => {
        result.current.clear();
      });
      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('混合操作', () => {
    it('应该正确处理混合的 change/add/delete 操作', () => {
      const { result } = renderHook(() => useActionList());

      act(() => {
        result.current.addChange("['title']", '新标题');
      });
      act(() => {
        result.current.addAdd("['floors']", 'MT10');
      });
      act(() => {
        result.current.addDelete("['floors']['MT1']");
      });
      act(() => {
        result.current.addChange("['name']", '新名称');
      });

      expect(result.current.actionList).toEqual([
        ['change', "['title']", '新标题'],
        ['add', "['floors']['MT10']", null],
        ['delete', "['floors']['MT1']", undefined],
        ['change', "['name']", '新名称'],
      ]);
      expect(result.current.hasChanges).toBe(true);
    });
  });
});

/**
 * openExternalEditor 单元测试
 *
 * 测试外部编辑器集成的核心逻辑
 *
 * @vitest-environment jsdom
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { openExternalEditor } from '../externalEditor';
import type { FieldConfig } from '../../types';

describe('openExternalEditor', () => {
  // Mock editor_multi
  const mockOpen = vi.fn();
  const mockEditorMulti = {
    open: mockOpen,
    import: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 设置全局 editor_multi
    (window as unknown as { editor_multi: typeof mockEditorMulti }).editor_multi = mockEditorMulti;
  });

  afterEach(() => {
    // 清理全局对象
    delete (window as unknown as { editor_multi?: typeof mockEditorMulti }).editor_multi;
  });

  describe('textarea 类型', () => {
    it('应该调用 editor_multi.open 而不是 import', () => {
      const getValue = vi.fn().mockReturnValue('test value');
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        {} as FieldConfig,
        getValue,
        setValue,
      );

      expect(mockOpen).toHaveBeenCalledTimes(1);
      expect(mockEditorMulti.import).not.toHaveBeenCalled();
    });

    it('字符串模式：应该直接使用字符串值作为 initialValue', () => {
      const getValue = vi.fn().mockReturnValue('hello world');
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _string: true } as FieldConfig,
        getValue,
        setValue,
      );

      expect(mockOpen).toHaveBeenCalledWith(
        'hello world',
        expect.objectContaining({ isString: true }),
        expect.any(Object),
      );
    });

    it('对象模式：应该 JSON 序列化值作为 initialValue', () => {
      const testObject = { name: 'test', value: 123 };
      const getValue = vi.fn().mockReturnValue(testObject);
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _string: false } as FieldConfig,
        getValue,
        setValue,
      );

      expect(mockOpen).toHaveBeenCalledWith(
        JSON.stringify(testObject, null, 2),
        expect.objectContaining({ isString: false }),
        expect.any(Object),
      );
    });

    it('空值时应该使用模板作为 initialValue', () => {
      const getValue = vi.fn().mockReturnValue(null);
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _template: 'default template' } as FieldConfig,
        getValue,
        setValue,
      );

      expect(mockOpen).toHaveBeenCalledWith(
        'default template',
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('应该传递 lint 和 preview 配置', () => {
      const getValue = vi.fn().mockReturnValue('test');
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _lint: true, _preview: true } as FieldConfig,
        getValue,
        setValue,
      );

      expect(mockOpen).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          lint: true,
          preview: true,
        }),
        expect.any(Object),
      );
    });

    it('onConfirm 回调：字符串模式应该直接传递值', () => {
      const getValue = vi.fn().mockReturnValue('original');
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _string: true } as FieldConfig,
        getValue,
        setValue,
      );

      // 获取 onConfirm 回调并调用
      const callbacks = mockOpen.mock.calls[0][2];
      callbacks.onConfirm('new value');

      expect(setValue).toHaveBeenCalledWith('testField', 'new value');
    });

    it('onConfirm 回调：对象模式应该解析 JSON 值', () => {
      const getValue = vi.fn().mockReturnValue({});
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _string: false } as FieldConfig,
        getValue,
        setValue,
      );

      // 获取 onConfirm 回调并调用
      const callbacks = mockOpen.mock.calls[0][2];
      callbacks.onConfirm('{ "name": "test", "value": 42 }');

      expect(setValue).toHaveBeenCalledWith('testField', { name: 'test', value: 42 });
    });

    it('onConfirm 回调：对象模式解析失败时应该保留原始字符串', () => {
      const getValue = vi.fn().mockReturnValue({});
      const setValue = vi.fn();

      openExternalEditor(
        'testField',
        'textarea',
        { _string: false } as FieldConfig,
        getValue,
        setValue,
      );

      // 获取 onConfirm 回调并调用（传入无效 JSON）
      const callbacks = mockOpen.mock.calls[0][2];
      callbacks.onConfirm('invalid json {{{');

      expect(setValue).toHaveBeenCalledWith('testField', 'invalid json {{{');
    });
  });

  describe('editor_multi 不可用时', () => {
    it('应该输出警告而不抛出错误', () => {
      // 移除 editor_multi
      delete (window as unknown as { editor_multi?: typeof mockEditorMulti }).editor_multi;

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const getValue = vi.fn().mockReturnValue('test');
      const setValue = vi.fn();

      // 不应该抛出错误
      expect(() => {
        openExternalEditor(
          'testField',
          'textarea',
          {} as FieldConfig,
          getValue,
          setValue,
        );
      }).not.toThrow();

      expect(consoleWarn).toHaveBeenCalledWith('editor_multi not available');
      consoleWarn.mockRestore();
    });
  });
});

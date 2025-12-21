/**
 * towerDataService 单元测试
 *
 * 测试全塔属性数据服务功能
 * - 数据读取和 main 字段合并
 * - 数据写入和序列化
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock window 对象
const mockWindow: Record<string, unknown> = {};
vi.stubGlobal('window', mockWindow);

// Mock editor 全局变量
vi.stubGlobal('editor', undefined);

// Mock fs 模块
vi.mock('@/services/fs', () => ({
  fs: {
    promises: {
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
  },
}));

// Mock serialize 模块
vi.mock('@/utils/serialize', () => ({
  serializeToJsFile: vi.fn((varName: string, data: unknown) => {
    return `var ${varName} =\n${JSON.stringify(data, null, '\t')}`;
  }),
  alertWhenCompress: vi.fn(),
}));

// 动态导入被测模块（在 mock 设置之后）
const importModule = async () => {
  // 清除模块缓存以确保使用最新的 mock
  vi.resetModules();
  return import('../towerDataService');
};

describe('towerDataService', () => {
  beforeEach(() => {
    // 设置测试数据
    mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] = {
      firstData: {
        version: '1.0.0',
        floorId: 'MT0',
      },
      values: {
        lavaDamage: 100,
      },
      main: {
        floorIds: ['MT0', 'sample0'],
        name: 'Test Tower',
      },
    };

    // 设置 editor 对象
    const mockEditor = {
      main: {
        floorIds: ['MT0', 'sample0'],
        name: 'Test Tower',
      },
      file: {
        dataComment: {
          _type: 'object',
          _data: {
            firstData: { _type: 'object', _data: {} },
            values: { _type: 'object', _data: {} },
            main: {
              _type: 'object',
              _data: {
                floorIds: { _leaf: true },
                name: { _leaf: true },
                missingField: { _leaf: true },
              },
            },
          },
        },
      },
      useCompress: false,
    };
    vi.stubGlobal('editor', mockEditor);

    vi.clearAllMocks();
  });

  afterEach(() => {
    // 清理全局对象
    delete mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'];
    vi.stubGlobal('editor', undefined);
  });

  describe('getCommentObject', () => {
    it('应该返回 editor.file.dataComment 对象', async () => {
      const { getCommentObject } = await importModule();
      const commentObj = getCommentObject();

      expect(commentObj).toBeDefined();
      expect(commentObj._type).toBe('object');
      expect(commentObj._data).toBeDefined();
    });

    it('当 editor.file.dataComment 不可用时应该抛出错误', async () => {
      // 移除 dataComment
      vi.stubGlobal('editor', { file: {} });

      const { getCommentObject } = await importModule();
      expect(() => getCommentObject()).toThrow('editor.file.dataComment 不可用');
    });

    it('当 editor 不可用时应该抛出错误', async () => {
      vi.stubGlobal('editor', undefined);

      const { getCommentObject } = await importModule();
      expect(() => getCommentObject()).toThrow('editor.file.dataComment 不可用');
    });
  });

  describe('readTowerData', () => {
    it('应该返回数据对象和注释配置', async () => {
      const { readTowerData } = await importModule();
      const result = readTowerData();

      expect(result.data).toBeDefined();
      expect(result.commentObj).toBeDefined();
    });

    it('应该合并 data 对象和 main 字段', async () => {
      const { readTowerData } = await importModule();
      const result = readTowerData();

      expect(result.data.firstData).toBeDefined();
      expect(result.data.values).toBeDefined();
      expect(result.data.main).toBeDefined();
    });

    it('应该从 data 对象中获取 main 字段的值', async () => {
      const { readTowerData } = await importModule();
      const result = readTowerData();
      const main = result.data.main as Record<string, unknown>;

      expect(main.floorIds).toEqual(['MT0', 'sample0']);
      expect(main.name).toBe('Test Tower');
    });

    it('当 main 字段在 editor.main 中不存在时应该设为 null', async () => {
      const { readTowerData } = await importModule();
      const result = readTowerData();
      const main = result.data.main as Record<string, unknown>;

      // missingField 在 commentObj 中定义但不在 editor.main 中
      expect(main.missingField).toBeNull();
    });

    it('应该只包含 commentObj 中定义的 main 字段', async () => {
      const { readTowerData } = await importModule();
      const result = readTowerData();
      const main = result.data.main as Record<string, unknown>;

      // 只有 commentObj._data.main._data 中定义的字段
      expect(Object.keys(main)).toEqual(['floorIds', 'name', 'missingField']);
    });
  });

  describe('writeTowerData', () => {
    it('空 actions 列表时应该直接返回', async () => {
      const { fs } = await import('@/services/fs');
      const { writeTowerData } = await importModule();

      await writeTowerData([]);

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('应该应用 change action 到数据对象', async () => {
      const { fs } = await import('@/services/fs');
      const { serializeToJsFile } = await import('@/utils/serialize');
      const { writeTowerData } = await importModule();

      await writeTowerData([['change', "['firstData']['version']", '2.0.0']]);

      // 验证 serializeToJsFile 被调用
      expect(serializeToJsFile).toHaveBeenCalled();
      expect(fs.promises.writeFile).toHaveBeenCalled();

      // 验证数据对象被修改
      const dataObj = mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] as Record<
        string,
        unknown
      >;
      expect((dataObj.firstData as Record<string, unknown>).version).toBe('2.0.0');
    });

    it('应该应用 add action 到数据对象', async () => {
      const { writeTowerData } = await importModule();

      await writeTowerData([['add', "['values']['newValue']", 200]]);

      const dataObj = mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] as Record<
        string,
        unknown
      >;
      expect((dataObj.values as Record<string, unknown>).newValue).toBe(200);
    });

    it('应该应用 delete action 到数据对象', async () => {
      const { writeTowerData } = await importModule();

      await writeTowerData([['delete', "['values']['lavaDamage']", undefined]]);

      const dataObj = mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] as Record<
        string,
        unknown
      >;
      expect((dataObj.values as Record<string, unknown>).lavaDamage).toBeUndefined();
    });

    it('应该调用 alertWhenCompress', async () => {
      const { alertWhenCompress } = await import('@/utils/serialize');
      const { writeTowerData } = await importModule();

      await writeTowerData([['change', "['firstData']['version']", '2.0.0']]);

      expect(alertWhenCompress).toHaveBeenCalled();
    });

    it('应该使用 base64 编码写入文件', async () => {
      const { fs } = await import('@/services/fs');
      const { writeTowerData } = await importModule();

      await writeTowerData([['change', "['firstData']['version']", '2.0.0']]);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'project/data.js',
        expect.any(String),
        'base64',
      );
    });

    it('当 firstData.floorId 不在 main.floorIds 中时应该修正', async () => {
      const { writeTowerData } = await importModule();

      // 设置 firstData.floorId 为不存在的值
      const dataObj = mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] as Record<
        string,
        unknown
      >;
      (dataObj.firstData as Record<string, unknown>).floorId = 'nonexistent';

      await writeTowerData([['change', "['firstData']['version']", '2.0.0']]);

      // 应该被修正为 floorIds 的第一个元素
      expect((dataObj.firstData as Record<string, unknown>).floorId).toBe('MT0');
    });
  });

  describe('fetchTowerData (兼容 API)', () => {
    it('应该返回与 readTowerData 相同的结果', async () => {
      const { fetchTowerData } = await importModule();
      const result = await fetchTowerData();

      expect(result.data).toBeDefined();
      expect(result.commentObj).toBeDefined();
    });

    it('应该返回 Promise<TowerData> 类型', async () => {
      const { fetchTowerData } = await importModule();
      const result = fetchTowerData();

      // 验证返回的是 Promise
      expect(result).toBeInstanceOf(Promise);

      // 验证 resolve 后的数据结构
      const data = await result;
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('commentObj');
    });

    it('返回的数据应包含正确的 main 字段结构', async () => {
      const { fetchTowerData } = await importModule();
      const result = await fetchTowerData();
      const main = result.data.main as Record<string, unknown>;

      // 验证 main 字段包含 commentObj 中定义的所有字段
      expect(main).toHaveProperty('floorIds');
      expect(main).toHaveProperty('name');
      expect(main).toHaveProperty('missingField');
      // missingField 应为 null（因为不在 editor.main 中）
      expect(main.missingField).toBeNull();
    });
  });

  describe('saveActions (兼容 API)', () => {
    it('应该调用 writeTowerData', async () => {
      const { fs } = await import('@/services/fs');
      const { saveActions } = await importModule();

      await saveActions([['change', "['firstData']['version']", '2.0.0']]);

      expect(fs.promises.writeFile).toHaveBeenCalled();
    });

    it('空 actions 列表时应该直接返回', async () => {
      const { fs } = await import('@/services/fs');
      const { saveActions } = await importModule();

      await saveActions([]);

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('应该返回 Promise<void> 类型', async () => {
      const { saveActions } = await importModule();
      const result = saveActions([['change', "['firstData']['version']", '2.0.0']]);

      // 验证返回的是 Promise
      expect(result).toBeInstanceOf(Promise);

      // 验证 resolve 后的值为 undefined
      const resolved = await result;
      expect(resolved).toBeUndefined();
    });

    it('应该支持批量 actions', async () => {
      const { saveActions } = await importModule();

      await saveActions([
        ['change', "['firstData']['version']", '3.0.0'],
        ['add', "['values']['newField']", 999],
        ['delete', "['values']['lavaDamage']", undefined],
      ]);

      // 验证所有 actions 都被应用
      const dataObj = mockWindow['data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d'] as Record<
        string,
        unknown
      >;
      expect((dataObj.firstData as Record<string, unknown>).version).toBe('3.0.0');
      expect((dataObj.values as Record<string, unknown>).newField).toBe(999);
      expect((dataObj.values as Record<string, unknown>).lavaDamage).toBeUndefined();
    });
  });
});

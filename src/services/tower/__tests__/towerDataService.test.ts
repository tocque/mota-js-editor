/**
 * towerDataService 单元测试
 *
 * 测试全塔属性数据服务功能
 * - 数据写入和序列化
 * - 兼容 API
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
  serializeToJsDataFile: vi.fn(
    (varName: string, data: unknown) => `var ${varName} =\n${JSON.stringify(data, null, '\t')}`,
  ),
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

  describe('writeTowerData', () => {
    it('空 actions 列表时应该直接返回', async () => {
      const { fs } = await import('@/services/fs');
      const { writeTowerData } = await importModule();

      await writeTowerData([]);

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('应该应用 change action 到数据对象', async () => {
      const { fs } = await import('@/services/fs');
      const { serializeToJsDataFile } = await import('@/utils/serialize');
      const { writeTowerData } = await importModule();

      await writeTowerData([['change', "['firstData']['version']", '2.0.0']]);

      // 验证 serializeToJsDataFile 被调用
      expect(serializeToJsDataFile).toHaveBeenCalled();
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

  describe('fetchTowerData', () => {
    it('应该返回数据对象', async () => {
      const { fetchTowerData } = await importModule();
      const result = await fetchTowerData();

      expect(result).toBeDefined();
      expect(result.firstData).toBeDefined();
      expect(result.values).toBeDefined();
      expect(result.main).toBeDefined();
    });

    it('应该返回 Promise 类型', async () => {
      const { fetchTowerData } = await importModule();
      const result = fetchTowerData();

      expect(result).toBeInstanceOf(Promise);
    });

    it('返回的数据应包含正确的结构', async () => {
      const { fetchTowerData } = await importModule();
      const result = await fetchTowerData();

      expect(result.main).toHaveProperty('floorIds');
      expect(result.main).toHaveProperty('name');
      expect((result.main as Record<string, unknown>).floorIds).toEqual(['MT0', 'sample0']);
      expect((result.main as Record<string, unknown>).name).toBe('Test Tower');
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

      expect(result).toBeInstanceOf(Promise);

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

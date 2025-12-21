/**
 * floorDataService 单元测试
 *
 * 测试楼层数据服务功能
 * - 数据过滤逻辑（排除 map 和 loc 字段）
 * - 数据写入和序列化
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CommentObject } from '@/components/Table';

// Mock core 全局变量
const mockCore: Record<string, unknown> = {};
vi.stubGlobal('core', mockCore);

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
  serializeToJsMapFile: vi.fn(
    (floorId: string, data: unknown) => `main.floors.${floorId} =\n${JSON.stringify(data, null, '\t')}`,
  ),
  alertWhenCompress: vi.fn(),
}));

// 动态导入被测模块（在 mock 设置之后）
const importModule = async () => {
  vi.resetModules();
  return import('../floorDataService');
};

describe('floorDataService', () => {
  // 创建测试用的 commentObj
  const createCommentObj = (
    floorFields: string[] = ['title', 'name', 'width', 'height'],
    locFields: string[] = ['events', 'beforeBattle', 'afterBattle'],
  ): CommentObject => ({
    _type: 'object',
    _data: {
      floor: {
        _type: 'object',
        _data: Object.fromEntries(floorFields.map((f) => [f, { _leaf: true }])),
      },
      loc: {
        _type: 'object',
        _data: Object.fromEntries(locFields.map((f) => [f, { _leaf: true }])),
      },
    },
  });

  beforeEach(() => {
    // 设置测试楼层数据
    mockCore.floors = {
      MT0: {
        floorId: 'MT0',
        title: '样板 0 层',
        name: '0',
        width: 13,
        height: 13,
        map: [[0, 0], [0, 0]],
        bgmap: [[0, 0], [0, 0]],
        fgmap: [[0, 0], [0, 0]],
        events: { '1,1': { type: 'event' } },
        beforeBattle: { '2,2': { type: 'battle' } },
        afterBattle: {},
        color: [0, 0, 0, 0],
      },
      sample0: {
        floorId: 'sample0',
        title: '样板 1 层',
        name: '1',
        width: 15,
        height: 15,
        map: [[1, 1], [1, 1]],
        events: {},
      },
    };

    // 设置 editor 对象
    vi.stubGlobal('editor', {
      useCompress: false,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    delete mockCore.floors;
    vi.stubGlobal('editor', undefined);
  });

  describe('fetchFloorData', () => {
    it('应该返回楼层数据', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj();

      const result = fetchFloorData('MT0', commentObj);

      expect(result).toBeDefined();
      expect(result.floorId).toBe('MT0');
      expect(result.title).toBe('样板 0 层');
    });

    it('应该过滤掉 map 相关字段', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj();

      const result = fetchFloorData('MT0', commentObj);

      expect(result.map).toBeUndefined();
      expect(result.bgmap).toBeUndefined();
      expect(result.fgmap).toBeUndefined();
    });

    it('应该过滤掉 loc 相关字段', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj(['title'], ['events', 'beforeBattle', 'afterBattle']);

      const result = fetchFloorData('MT0', commentObj);

      expect(result.events).toBeUndefined();
      expect(result.beforeBattle).toBeUndefined();
      expect(result.afterBattle).toBeUndefined();
    });

    it('应该保留非 map 和非 loc 字段', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj(['title', 'name', 'color'], []);

      const result = fetchFloorData('MT0', commentObj);

      expect(result.title).toBe('样板 0 层');
      expect(result.name).toBe('0');
      expect(result.color).toEqual([0, 0, 0, 0]);
    });

    it('应该补充 commentObj 中定义但数据中不存在的字段为 null', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj(['title', 'name', 'nonExistentField'], []);

      const result = fetchFloorData('MT0', commentObj);

      expect(result.nonExistentField).toBeNull();
    });

    it('当楼层不存在时应该抛出错误', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj();

      expect(() => fetchFloorData('nonexistent', commentObj)).toThrow('楼层 nonexistent 不存在');
    });

    it('应该正确处理不同楼层的数据', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj(['title', 'width', 'height'], []);

      const result1 = fetchFloorData('MT0', commentObj);
      const result2 = fetchFloorData('sample0', commentObj);

      expect(result1.title).toBe('样板 0 层');
      expect(result1.width).toBe(13);
      expect(result2.title).toBe('样板 1 层');
      expect(result2.width).toBe(15);
    });
  });

  describe('saveActions', () => {
    it('空 actions 列表时应该直接返回', async () => {
      const { fs } = await import('@/services/fs');
      const { saveActions } = await importModule();

      await saveActions('MT0', []);

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('应该应用 change action 到楼层数据', async () => {
      const { fs } = await import('@/services/fs');
      const { saveActions } = await importModule();

      await saveActions('MT0', [['change', "['title']", '新标题']]);

      expect(fs.promises.writeFile).toHaveBeenCalled();
      expect((mockCore.floors as Record<string, Record<string, unknown>>).MT0.title).toBe('新标题');
    });

    it('应该使用正确的文件路径', async () => {
      const { fs } = await import('@/services/fs');
      const { saveActions } = await importModule();

      await saveActions('MT0', [['change', "['title']", '新标题']]);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'project/floors/MT0.js',
        expect.any(String),
        'base64',
      );
    });

    it('应该调用 alertWhenCompress', async () => {
      const { alertWhenCompress } = await import('@/utils/serialize');
      const { saveActions } = await importModule();

      await saveActions('MT0', [['change', "['title']", '新标题']]);

      expect(alertWhenCompress).toHaveBeenCalled();
    });

    it('当楼层不存在时应该抛出错误', async () => {
      const { saveActions } = await importModule();

      await expect(saveActions('nonexistent', [['change', "['title']", '新标题']])).rejects.toThrow(
        '楼层 nonexistent 不存在',
      );
    });
  });

  describe('saveFloorWithNewId', () => {
    it('应该使用新 floorId 保存楼层', async () => {
      const { fs } = await import('@/services/fs');
      const { saveFloorWithNewId } = await importModule();

      await saveFloorWithNewId('MT0', 'newFloorId');

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        'project/floors/newFloorId.js',
        expect.any(String),
        'base64',
      );
    });

    it('应该更新楼层数据中的 floorId 字段', async () => {
      const { saveFloorWithNewId } = await importModule();

      await saveFloorWithNewId('MT0', 'newFloorId');

      expect((mockCore.floors as Record<string, Record<string, unknown>>).MT0.floorId).toBe(
        'newFloorId',
      );
    });

    it('应该调用 alertWhenCompress', async () => {
      const { alertWhenCompress } = await import('@/utils/serialize');
      const { saveFloorWithNewId } = await importModule();

      await saveFloorWithNewId('MT0', 'newFloorId');

      expect(alertWhenCompress).toHaveBeenCalled();
    });

    it('当原楼层不存在时应该抛出错误', async () => {
      const { saveFloorWithNewId } = await importModule();

      await expect(saveFloorWithNewId('nonexistent', 'newFloorId')).rejects.toThrow(
        '楼层 nonexistent 不存在',
      );
    });
  });
});

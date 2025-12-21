/**
 * FloorDataService 属性测试
 *
 * 使用 fast-check 进行属性测试，验证楼层数据服务的正确性
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fc from 'fast-check';
import type { CommentObject } from '@/components/Table';
import { jsIdentifierArb } from '@test/arbitraries';

// Mock core 全局变量
const mockCore: Record<string, unknown> = {};
vi.stubGlobal('core', mockCore);

// Mock editor 全局变量
vi.stubGlobal('editor', undefined);

// 记录写入的文件路径
let writtenFilePaths: string[] = [];

// Mock fs 模块
vi.mock('@/services/fs', () => ({
  fs: {
    promises: {
      writeFile: vi.fn().mockImplementation((path: string) => {
        writtenFilePaths.push(path);
        return Promise.resolve();
      }),
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

/**
 * 生成有效的 floorId（符合 /^[a-zA-Z_][a-zA-Z0-9_]*$/ 格式）
 */
const floorIdArb = jsIdentifierArb({ minLength: 1, maxLength: 15 });

/**
 * 生成两个不同的 floorId
 */
const twoDistinctFloorIdsArb = fc
  .tuple(floorIdArb, floorIdArb)
  .filter(([a, b]) => a !== b);

/**
 * 生成楼层数据
 */
const floorDataArb = (floorId: string) =>
  fc.record({
    floorId: fc.constant(floorId),
    title: fc.string({ minLength: 1, maxLength: 20 }),
    name: fc.string({ minLength: 1, maxLength: 10 }),
    width: fc.integer({ min: 1, max: 128 }),
    height: fc.integer({ min: 1, max: 128 }),
    color: fc.array(fc.integer({ min: 0, max: 255 }), { minLength: 4, maxLength: 4 }),
    // map 相关字段（应被过滤）
    map: fc.array(fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 5 }), {
      minLength: 1,
      maxLength: 5,
    }),
    bgmap: fc.array(fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 5 }), {
      minLength: 1,
      maxLength: 5,
    }),
    fgmap: fc.array(fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 5 }), {
      minLength: 1,
      maxLength: 5,
    }),
  });

/**
 * 创建测试用的 commentObj
 */
const createCommentObj = (
  floorFields: string[] = ['title', 'name', 'width', 'height', 'color'],
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

describe('FloorDataService 属性测试', () => {
  beforeEach(() => {
    mockCore.floors = {};
    writtenFilePaths = [];
    vi.stubGlobal('editor', { useCompress: false });
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete mockCore.floors;
    vi.stubGlobal('editor', undefined);
  });

  /**
   * **Feature: floor-panel-migration, Property 2: FloorId Parameter Isolation**
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.2, 4.5**
   *
   * *For any* two different floorIds `A` and `B`:
   * - `fetchFloorData(A, commentObj)` SHALL return data from `core.floors[A]`
   * - `fetchFloorData(B, commentObj)` SHALL return data from `core.floors[B]`
   * - `saveActions(A, actions)` SHALL write to `project/floors/A.js`
   * - `saveActions(B, actions)` SHALL write to `project/floors/B.js`
   */
  describe('Property 2: FloorId Parameter Isolation', () => {
    it('fetchFloorData 应该根据 floorId 参数返回对应楼层的数据', async () => {
      const { fetchFloorData } = await importModule();
      const commentObj = createCommentObj();

      await fc.assert(
        fc.asyncProperty(twoDistinctFloorIdsArb, async ([floorIdA, floorIdB]) => {
          // 为两个楼层设置不同的数据
          const dataA = await fc.sample(floorDataArb(floorIdA), 1)[0];
          const dataB = await fc.sample(floorDataArb(floorIdB), 1)[0];

          (mockCore.floors as Record<string, unknown>)[floorIdA] = dataA;
          (mockCore.floors as Record<string, unknown>)[floorIdB] = dataB;

          // 获取楼层 A 的数据
          const resultA = fetchFloorData(floorIdA, commentObj);
          // 获取楼层 B 的数据
          const resultB = fetchFloorData(floorIdB, commentObj);

          // 验证返回的数据来自正确的楼层
          expect(resultA.floorId).toBe(floorIdA);
          expect(resultA.title).toBe(dataA.title);
          expect(resultA.name).toBe(dataA.name);

          expect(resultB.floorId).toBe(floorIdB);
          expect(resultB.title).toBe(dataB.title);
          expect(resultB.name).toBe(dataB.name);

          // 清理
          delete (mockCore.floors as Record<string, unknown>)[floorIdA];
          delete (mockCore.floors as Record<string, unknown>)[floorIdB];
        }),
        { numRuns: 100 },
      );
    });

    it('saveActions 应该根据 floorId 参数写入对应的文件', async () => {
      const { saveActions } = await importModule();

      await fc.assert(
        fc.asyncProperty(twoDistinctFloorIdsArb, async ([floorIdA, floorIdB]) => {
          // 为两个楼层设置数据
          const dataA = await fc.sample(floorDataArb(floorIdA), 1)[0];
          const dataB = await fc.sample(floorDataArb(floorIdB), 1)[0];

          (mockCore.floors as Record<string, unknown>)[floorIdA] = { ...dataA };
          (mockCore.floors as Record<string, unknown>)[floorIdB] = { ...dataB };

          // 清空记录
          writtenFilePaths = [];

          // 保存楼层 A
          await saveActions(floorIdA, [['change', "['title']", '新标题A']]);

          // 验证写入了正确的文件
          expect(writtenFilePaths).toContain(`project/floors/${floorIdA}.js`);
          expect(writtenFilePaths).not.toContain(`project/floors/${floorIdB}.js`);

          // 清空记录
          writtenFilePaths = [];

          // 保存楼层 B
          await saveActions(floorIdB, [['change', "['title']", '新标题B']]);

          // 验证写入了正确的文件
          expect(writtenFilePaths).toContain(`project/floors/${floorIdB}.js`);
          expect(writtenFilePaths).not.toContain(`project/floors/${floorIdA}.js`);

          // 清理
          delete (mockCore.floors as Record<string, unknown>)[floorIdA];
          delete (mockCore.floors as Record<string, unknown>)[floorIdB];
        }),
        { numRuns: 100 },
      );
    });

    it('不同 floorId 的操作应该相互隔离', async () => {
      const { fetchFloorData, saveActions } = await importModule();
      const commentObj = createCommentObj();

      await fc.assert(
        fc.asyncProperty(twoDistinctFloorIdsArb, async ([floorIdA, floorIdB]) => {
          // 为两个楼层设置数据
          const dataA = await fc.sample(floorDataArb(floorIdA), 1)[0];
          const dataB = await fc.sample(floorDataArb(floorIdB), 1)[0];

          (mockCore.floors as Record<string, unknown>)[floorIdA] = { ...dataA };
          (mockCore.floors as Record<string, unknown>)[floorIdB] = { ...dataB };

          // 修改楼层 A 的标题
          await saveActions(floorIdA, [['change', "['title']", '修改后的标题']]);

          // 验证楼层 A 的数据被修改
          const resultA = fetchFloorData(floorIdA, commentObj);
          expect(resultA.title).toBe('修改后的标题');

          // 验证楼层 B 的数据未被修改
          const resultB = fetchFloorData(floorIdB, commentObj);
          expect(resultB.title).toBe(dataB.title);

          // 清理
          delete (mockCore.floors as Record<string, unknown>)[floorIdA];
          delete (mockCore.floors as Record<string, unknown>)[floorIdB];
        }),
        { numRuns: 100 },
      );
    });
  });
});

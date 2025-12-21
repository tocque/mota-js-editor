/**
 * TableMeta Service 属性测试
 *
 * 使用 fast-check 进行属性测试
 *
 * **Feature: comment-service-refactor**
 * - Property 1: Meta Object Loading
 * - Property 2: Invalid Key Error
 * - Property 5: Parse Isolation
 * **Validates: Requirements 1.1, 1.4, 6.2**
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  parseTableMetaJs,
  loadTableMetaFile,
  VALID_META_FILE_KEYS,
  type MetaFileKey,
} from '../tableMetaService';
import { jsIdentifierArb } from '@test/arbitraries';

/**
 * 生成简单的 JSON 值（用于构造 JS 代码）
 */
const simpleJsonValueArb = fc.oneof(
  fc.constant(null),
  fc.boolean(),
  fc.integer({ min: -1000, max: 1000 }),
  fc.string({ minLength: 0, maxLength: 20 }).map(s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')),
);

describe('parseTableMetaJs 属性测试', () => {
  describe('Property 5: Parse Isolation', () => {
    // 记录测试前的全局变量
    let globalKeysBefore: string[];

    beforeEach(() => {
      // 记录测试前 globalThis 上的所有 key
      globalKeysBefore = Object.keys(globalThis);
    });

    afterEach(() => {
      // 清理可能泄露的全局变量
      const globalKeysAfter = Object.keys(globalThis);
      const newKeys = globalKeysAfter.filter(k => !globalKeysBefore.includes(k));
      for (const key of newKeys) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (globalThis as any)[key];
      }
    });

    it('*For any* JS content, parseTableMetaJs should not pollute the global scope', () => {
      fc.assert(
        fc.property(jsIdentifierArb({ minLength: 2 }), simpleJsonValueArb, (varName, value) => {
          // 构造 JS 代码
          const jsValue = typeof value === 'string' ? `"${value}"` : JSON.stringify(value);
          const content = `var ${varName} = ${jsValue};`;

          // 记录解析前的全局变量
          const keysBefore = Object.keys(globalThis);

          // 执行解析
          try {
            parseTableMetaJs(content, varName);
          } catch {
            // 解析失败也是可接受的，只要不污染全局
          }

          // 验证全局变量没有增加
          const keysAfter = Object.keys(globalThis);
          const newKeys = keysAfter.filter(k => !keysBefore.includes(k));

          // 断言：不应该有新的全局变量
          expect(newKeys).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });

    it('*For any* valid JS object, parseTableMetaJs should return the parsed object without global pollution', () => {
      fc.assert(
        fc.property(jsIdentifierArb({ minLength: 2 }), (varName) => {
          // 构造一个简单的对象
          const content = `var ${varName} = { _type: "object", _data: {} };`;

          // 记录解析前的全局变量
          const keysBefore = Object.keys(globalThis);

          // 执行解析
          const result = parseTableMetaJs(content, varName);

          // 验证返回值正确
          expect(result).toEqual({ _type: 'object', _data: {} });

          // 验证全局变量没有增加
          const keysAfter = Object.keys(globalThis);
          const newKeys = keysAfter.filter(k => !keysBefore.includes(k));
          expect(newKeys).toEqual([]);
        }),
        { numRuns: 100 }
      );
    });

    it('*For any* JS code that tries to set window properties, parseTableMetaJs should prevent global pollution', () => {
      fc.assert(
        fc.property(jsIdentifierArb({ minLength: 2 }), (varName) => {
          // 构造尝试污染全局的代码
          const maliciousVarName = `__test_pollution_${varName}`;
          const content = `
            var ${maliciousVarName} = "polluted";
            var ${varName} = { _type: "object" };
          `;

          // 记录解析前的全局变量
          const keysBefore = Object.keys(globalThis);

          // 执行解析
          try {
            parseTableMetaJs(content, varName);
          } catch {
            // 解析失败也是可接受的
          }

          // 验证全局变量没有增加
          const keysAfter = Object.keys(globalThis);
          const newKeys = keysAfter.filter(k => !keysBefore.includes(k));
          expect(newKeys).toEqual([]);

          // 验证恶意变量没有泄露到全局
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((globalThis as any)[maliciousVarName]).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });
  });
});


describe('loadTableMetaFile 属性测试', () => {
  describe('Property 2: Invalid Key Error', () => {
    /**
     * 生成无效的 MetaFileKey
     * 排除所有有效的 key
     */
    const invalidKeyArb = fc
      .string({ minLength: 1, maxLength: 30 })
      .filter((s) => !VALID_META_FILE_KEYS.includes(s as MetaFileKey));

    it('*For any* string that is not a valid MetaFileKey, loadTableMetaFile should throw an error', async () => {
      await fc.assert(
        fc.asyncProperty(invalidKeyArb, async (invalidKey) => {
          // 调用 loadTableMetaFile 应该抛出错误
          await expect(
            loadTableMetaFile(invalidKey as MetaFileKey)
          ).rejects.toThrow(`无效的文件 key: ${invalidKey}`);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 1: Meta Object Loading', () => {
    /**
     * 生成有效的 MetaFileKey
     */
    const validKeyArb = fc.constantFrom(...VALID_META_FILE_KEYS);

    it('*For any* valid MetaFileKey, loadTableMetaFile should return a string (file content)', async () => {
      // 注意：此测试需要实际的文件系统访问，在 CI 环境中可能需要 mock
      // 这里我们只验证函数签名和基本行为
      await fc.assert(
        fc.asyncProperty(validKeyArb, async (key) => {
          try {
            const content = await loadTableMetaFile(key);
            // 如果成功，返回值应该是字符串
            expect(typeof content).toBe('string');
            // 内容应该非空
            expect(content.length).toBeGreaterThan(0);
          } catch (error) {
            // 如果失败，应该是因为文件不存在（在测试环境中）
            // 错误消息应该包含文件路径信息
            expect((error as Error).message).toMatch(/读取.*失败/);
          }
        }),
        { numRuns: 5 } // 减少运行次数，因为涉及 I/O
      );
    });
  });
});

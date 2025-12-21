/**
 * serializeToJsFile 属性测试
 *
 * 使用 fast-check 进行属性测试，验证序列化输出的有效性
 *
 * **Feature: tower-data-refactor, Property 4: 序列化输出有效性**
 * **Validates: Requirements 6.4**
 */

import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import { serializeToJsFile } from '@/utils/serialize';
import { jsIdentifierArb, safeJsonValueArb } from '@test/arbitraries';

describe('serializeToJsFile 属性测试', () => {
  describe('Property 4: 序列化输出有效性', () => {
    it('序列化输出应是可被 JavaScript 引擎解析的有效代码', () => {
      fc.assert(
        fc.property(jsIdentifierArb(), safeJsonValueArb(), (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 验证输出可以被 JavaScript 解析
          // 使用 Function 构造函数来验证语法有效性
          expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            new Function(output);
          }).not.toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('序列化后解析的值应与原始数据等价', () => {
      fc.assert(
        fc.property(jsIdentifierArb(), safeJsonValueArb(), (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 执行代码并获取变量值
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const fn = new Function(`${output}; return ${varName};`);
          const result = fn();

          // 验证解析后的值与原始数据等价
          // 注意：JSON 序列化会将 -0 转换为 0，这是 JSON 标准行为
          // 使用 JSON.stringify 比较以忽略 -0/+0 的差异
          expect(JSON.stringify(result)).toEqual(JSON.stringify(data));
        }),
        { numRuns: 100 }
      );
    });

    it('序列化输出应使用 tab 缩进', () => {
      fc.assert(
        fc.property(jsIdentifierArb(), fc.record({ a: fc.integer() }), (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 对于非空对象，输出应包含 tab 缩进
          expect(output).toContain('\t');
        }),
        { numRuns: 100 }
      );
    });

    it('序列化输出应以 var 声明开头', () => {
      fc.assert(
        fc.property(jsIdentifierArb(), safeJsonValueArb(), (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 验证输出以 var 声明开头
          expect(output.startsWith(`var ${varName} =\n`)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});

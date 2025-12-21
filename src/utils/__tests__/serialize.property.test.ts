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

/**
 * JavaScript 保留字列表
 */
const jsReservedWords = new Set([
  'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete',
  'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof',
  'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
  'void', 'while', 'with', 'class', 'const', 'enum', 'export', 'extends',
  'import', 'super', 'implements', 'interface', 'let', 'package', 'private',
  'protected', 'public', 'static', 'yield', 'null', 'true', 'false',
]);

/**
 * 生成有效的 JavaScript 变量名
 * 变量名必须以字母或下划线开头，后续可以是字母、数字或下划线
 * 排除 JavaScript 保留字
 */
const firstCharArb = fc.constantFrom(
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '_'
);

const restCharsArb = fc.array(
  fc.constantFrom(
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_'
  ),
  { minLength: 0, maxLength: 20 }
);

const validVarNameArb = fc
  .tuple(firstCharArb, restCharsArb)
  .map(([first, rest]) => first + rest.join(''))
  .filter((name) => !jsReservedWords.has(name));

/**
 * 生成任意 JSON 值
 */
const jsonValueArb = fc.jsonValue();

describe('serializeToJsFile 属性测试', () => {
  describe('Property 4: 序列化输出有效性', () => {
    it('序列化输出应是可被 JavaScript 引擎解析的有效代码', () => {
      fc.assert(
        fc.property(validVarNameArb, jsonValueArb, (varName, data) => {
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
        fc.property(validVarNameArb, jsonValueArb, (varName, data) => {
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
        fc.property(validVarNameArb, fc.record({ a: fc.integer() }), (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 对于非空对象，输出应包含 tab 缩进
          expect(output).toContain('\t');
        }),
        { numRuns: 100 }
      );
    });

    it('序列化输出应以 var 声明开头', () => {
      fc.assert(
        fc.property(validVarNameArb, jsonValueArb, (varName, data) => {
          const output = serializeToJsFile(varName, data);

          // 验证输出以 var 声明开头
          expect(output.startsWith(`var ${varName} =\n`)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * codeTransformers 单元测试
 *
 * 测试代码转换工具的核心功能
 */

import { describe, expect, it } from "vitest";
import {
  defaultGuidGenerator,
  deserializeWithFunctions,
  escapeNewlines,
  isFunctionString,
  isJsonStringFormat,
  safeJsonParse,
  serializeForStorage,
  serializeWithFunctions,
  unescapeNewlines,
} from "../utils/codeTransformers";

describe("codeTransformers", () => {
  describe("defaultGuidGenerator", () => {
    it("应该生成有效的 GUID 格式字符串", () => {
      const guid = defaultGuidGenerator();
      expect(guid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it("每次调用应该生成不同的 GUID", () => {
      const guid1 = defaultGuidGenerator();
      const guid2 = defaultGuidGenerator();
      expect(guid1).not.toBe(guid2);
    });
  });

  describe("serializeWithFunctions", () => {
    it("应该正确序列化普通对象", () => {
      const obj = { name: "test", value: 123 };
      const result = serializeWithFunctions(obj);
      expect(result).toContain('"name"');
      expect(result).toContain('"test"');
      expect(result).toContain('"value"');
      expect(result).toContain("123");
    });

    it("应该正确处理 null", () => {
      expect(serializeWithFunctions(null)).toBe("null");
    });

    it("应该正确处理 undefined", () => {
      expect(serializeWithFunctions(undefined)).toBe("null");
    });

    it("应该正确序列化含 Function 对象的对象", () => {
      const obj = {
        name: "test",
        handler: function () {
          return 1;
        },
      };
      const result = serializeWithFunctions(obj, {
        guidGenerator: () => "test-guid",
      });
      expect(result).toContain('"name"');
      expect(result).toContain("function");
      expect(result).toContain("return 1");
      // 函数不应该被引号包裹
      expect(result).not.toContain('"function');
    });

    it("应该正确序列化含函数字符串的对象", () => {
      const obj = {
        name: "test",
        handler: "function () { return 2; }",
      };
      const result = serializeWithFunctions(obj, {
        guidGenerator: () => "test-guid",
      });
      expect(result).toContain("function");
      expect(result).toContain("return 2");
    });

    it("应该使用自定义缩进", () => {
      const obj = { a: 1, b: 2 };
      const result = serializeWithFunctions(obj, { indent: 2 });
      expect(result).toContain("  "); // 两个空格缩进
    });

    it("应该正确处理嵌套对象", () => {
      const obj = {
        outer: {
          inner: {
            value: 42,
          },
        },
      };
      const result = serializeWithFunctions(obj);
      expect(result).toContain("outer");
      expect(result).toContain("inner");
      expect(result).toContain("42");
    });

    it("应该正确处理数组", () => {
      const obj = {
        items: [1, 2, 3],
      };
      const result = serializeWithFunctions(obj);
      expect(result).toContain("[");
      expect(result).toContain("1");
      expect(result).toContain("2");
      expect(result).toContain("3");
    });

    it("应该正确处理含多个函数的对象", () => {
      let guidCounter = 0;
      const obj = {
        fn1: function () {
          return "a";
        },
        fn2: function () {
          return "b";
        },
      };
      const result = serializeWithFunctions(obj, {
        guidGenerator: () => `guid-${++guidCounter}`,
      });
      expect(result).toContain('return "a"');
      expect(result).toContain('return "b"');
    });
  });

  describe("serializeForStorage", () => {
    it("应该将函数序列化为 JSON 字符串格式", () => {
      const obj = {
        name: "test",
        handler: function () {
          return 1;
        },
      };
      const result = serializeForStorage(obj, {
        guidGenerator: () => "test-guid",
      });
      // 函数应该被 JSON.stringify 处理
      expect(result).toContain("name");
    });

    it("应该正确处理 null", () => {
      expect(serializeForStorage(null)).toBe("null");
    });
  });

  describe("deserializeWithFunctions", () => {
    it("应该正确反序列化普通 JSON", () => {
      const str = '{"name": "test", "value": 123}';
      const result = deserializeWithFunctions(str) as { name: string; value: number };
      expect(result.name).toBe("test");
      expect(result.value).toBe(123);
    });

    it("应该正确反序列化含函数的对象", () => {
      const str = '{ "name": "test", handler: function() { return 42; } }';
      const result = deserializeWithFunctions(str) as { name: string; handler: () => number };
      expect(result.name).toBe("test");
      expect(typeof result.handler).toBe("function");
      expect(result.handler()).toBe(42);
    });

    it("应该正确处理 null 字符串", () => {
      expect(deserializeWithFunctions("null")).toBeNull();
    });

    it("应该正确处理空字符串", () => {
      expect(deserializeWithFunctions("")).toBeNull();
    });

    it("应该处理无效输入并返回 null", () => {
      expect(deserializeWithFunctions("invalid {{{")).toBeNull();
    });

    it("序列化和反序列化应该保持数据一致性（普通对象）", () => {
      const original = { a: 1, b: "test", c: [1, 2, 3] };
      const serialized = serializeWithFunctions(original);
      const deserialized = deserializeWithFunctions(serialized);
      expect(deserialized).toEqual(original);
    });
  });

  describe("escapeNewlines", () => {
    it("应该将换行符转换为转义序列", () => {
      expect(escapeNewlines("line1\nline2")).toBe("line1\\nline2");
    });

    it("应该处理多个换行符", () => {
      expect(escapeNewlines("a\nb\nc")).toBe("a\\nb\\nc");
    });

    it("应该处理空字符串", () => {
      expect(escapeNewlines("")).toBe("");
    });

    it("应该处理没有换行符的字符串", () => {
      expect(escapeNewlines("no newlines")).toBe("no newlines");
    });

    it("应该处理 null/undefined", () => {
      expect(escapeNewlines(null as unknown as string)).toBe(null);
      expect(escapeNewlines(undefined as unknown as string)).toBe(undefined);
    });
  });

  describe("unescapeNewlines", () => {
    it("应该将转义序列转换为换行符", () => {
      expect(unescapeNewlines("line1\\nline2")).toBe("line1\nline2");
    });

    it("应该处理多个转义序列", () => {
      expect(unescapeNewlines("a\\nb\\nc")).toBe("a\nb\nc");
    });

    it("应该处理空字符串", () => {
      expect(unescapeNewlines("")).toBe("");
    });

    it("应该处理没有转义序列的字符串", () => {
      expect(unescapeNewlines("no escapes")).toBe("no escapes");
    });

    it("escape 和 unescape 应该互为逆操作", () => {
      const original = "line1\nline2\nline3";
      expect(unescapeNewlines(escapeNewlines(original))).toBe(original);
    });
  });

  describe("isFunctionString", () => {
    it("应该识别以 function 开头的字符串", () => {
      expect(isFunctionString("function() {}")).toBe(true);
      expect(isFunctionString("function test() { return 1; }")).toBe(true);
    });

    it("应该拒绝非函数字符串", () => {
      expect(isFunctionString("not a function")).toBe(false);
      expect(isFunctionString("")).toBe(false);
      expect(isFunctionString("func")).toBe(false);
    });

    it("应该处理非字符串输入", () => {
      expect(isFunctionString(123 as unknown as string)).toBe(false);
      expect(isFunctionString(null as unknown as string)).toBe(false);
    });
  });

  describe("isJsonStringFormat", () => {
    it("应该识别以引号开头的字符串", () => {
      expect(isJsonStringFormat('"hello"')).toBe(true);
      expect(isJsonStringFormat('"function() {}"')).toBe(true);
    });

    it("应该拒绝非引号开头的字符串", () => {
      expect(isJsonStringFormat("hello")).toBe(false);
      expect(isJsonStringFormat("123")).toBe(false);
      expect(isJsonStringFormat("")).toBe(false);
    });

    it("应该处理非字符串输入", () => {
      expect(isJsonStringFormat(123 as unknown as string)).toBe(false);
    });
  });

  describe("safeJsonParse", () => {
    it("应该正确解析有效 JSON", () => {
      expect(safeJsonParse('{"a": 1}', {})).toEqual({ a: 1 });
      expect(safeJsonParse("[1, 2, 3]", [])).toEqual([1, 2, 3]);
      expect(safeJsonParse('"hello"', "")).toBe("hello");
    });

    it("应该在解析失败时返回默认值", () => {
      expect(safeJsonParse("invalid", "default")).toBe("default");
      expect(safeJsonParse("{invalid}", {})).toEqual({});
      expect(safeJsonParse("", null)).toBeNull();
    });
  });
});

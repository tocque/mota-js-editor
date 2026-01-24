/**
 * FunctionsDataHandler - 脚本函数数据处理器
 *
 * 职责：
 * - 继承 DataHandler，实现脚本函数数据的 parse 和 stringify
 * - 提供类型安全的脚本函数数据访问
 *
 * 数据格式：
 * - 文件格式: var functions_d6ad677b_... = \n{ events: { ... }, ui: { ... }, ... }
 * - 叶子节点是函数，解析后转为字符串存储
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";

/** 数据变量名 */
const FUNCTIONS_VAR_NAME = "functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a";

/** 嵌套 Record 类型，叶子节点为字符串（函数文本） */
export type FunctionsData = {
  [key: string]: string | FunctionsData;
};

/**
 * 内部类型：解析后的函数对象
 * @internal 导出仅供测试使用
 */
export type FunctionsRaw = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: Function | FunctionsRaw;
};

/**
 * 递归将函数对象转为函数字符串对象
 *
 * 每个函数转为带名称的字符串: function() {} -> "function name() {}"
 * @internal 导出仅供测试使用
 */
export function toFunctionStrings(obj: FunctionsRaw): FunctionsData {
  const result: FunctionsData = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "function") {
      // 函数转字符串，并添加函数名
      result[key] = value.toString().replace("function", `function ${key}`);
    } else if (typeof value === "object" && value !== null) {
      // 递归处理嵌套对象
      result[key] = toFunctionStrings(value as FunctionsRaw);
    }
  }

  return result;
}

/**
 * 递归序列化函数字符串对象为 JS 代码
 *
 * 保持函数格式（不加引号），使用 tab 缩进
 */
function serializeFunctionsData(data: FunctionsData, indent: string): string {
  const INDENT = "\t";
  const nextIndent = indent + INDENT;

  const lines = Object.entries(data).map(([key, value]) => {
    const keyStr = `${nextIndent}"${key}": `;

    if (typeof value === "string") {
      // 叶子节点是函数字符串，去掉函数名后输出（不加引号）
      const anonymousFunc = value.replace(`function ${key}`, "function");
      return `${keyStr}${anonymousFunc}`;
    } else {
      // 递归处理嵌套对象
      return `${keyStr}${serializeFunctionsData(value, nextIndent)}`;
    }
  });

  return [`{`, lines.join(",\n"), `${indent}}`].join("\n");
}

/**
 * 序列化脚本函数数据为文件内容
 * @internal 导出仅供测试使用
 */
export function stringifyFunctionsData(data: FunctionsData): string {
  const dataJSON = serializeFunctionsData(data, "");
  return `var ${FUNCTIONS_VAR_NAME} =\n${dataJSON}`;
}

/**
 * FunctionsDataHandler - 脚本函数数据处理器
 */
export class FunctionsDataHandler extends DataHandler<FunctionsData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, "Functions Data");
  }

  /**
   * 解析文本为脚本函数数据
   *
   * 使用 new Function() 执行 JS 代码，然后递归转换函数为字符串
   */
  protected parse(text: string): FunctionsData {
    try {
      // 使用 new Function() 替代 eval，更安全
      const fn = new Function(`
        "use strict";
        ${text}
        return ${FUNCTIONS_VAR_NAME};
      `);
      const obj = fn() as FunctionsRaw;

      // 递归将函数转为带名称的字符串
      return toFunctionStrings(obj);
    } catch (err) {
      throw new Error(`解析脚本函数数据失败: ${(err as Error).message}`);
    }
  }

  /**
   * 序列化脚本函数数据为文本
   */
  protected stringify(data: FunctionsData): string {
    return stringifyFunctionsData(data);
  }
}

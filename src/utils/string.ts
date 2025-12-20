/**
 * 字符串工具函数
 *
 * 提供字符串处理的通用工具
 */

/**
 * 转义换行符
 *
 * 将实际的换行符 \n 转换为转义序列 \\n
 *
 * @param str - 原始字符串
 * @returns 转义后的字符串
 *
 * @example
 * ```ts
 * escapeNewlines("line1\nline2") // => "line1\\nline2"
 * ```
 */
export function escapeNewlines(str: string): string {
  if (!str) return str;
  return str.split("\n").join("\\n");
}

/**
 * 反转义换行符
 *
 * 将转义序列 \\n 转换为实际的换行符 \n
 *
 * @param str - 转义后的字符串
 * @returns 原始字符串
 *
 * @example
 * ```ts
 * unescapeNewlines("line1\\nline2") // => "line1\nline2"
 * ```
 */
export function unescapeNewlines(str: string): string {
  if (!str) return str;
  return str.split("\\n").join("\n");
}

/**
 * 检查字符串是否以 "function" 开头
 *
 * @param str - 要检查的字符串
 * @returns 是否是函数字符串
 *
 * @example
 * ```ts
 * isFunctionString("function() {}") // => true
 * isFunctionString("not a function") // => false
 * ```
 */
export function isFunctionString(str: string): boolean {
  return typeof str === "string" && str.slice(0, 8) === "function";
}

/**
 * 检查值是否是 JSON 字符串格式（以引号开头）
 *
 * @param value - 要检查的值
 * @returns 是否是 JSON 字符串格式
 *
 * @example
 * ```ts
 * isJsonStringFormat('"hello"') // => true
 * isJsonStringFormat('hello') // => false
 * ```
 */
export function isJsonStringFormat(value: string): boolean {
  return typeof value === "string" && value.slice(0, 1) === '"';
}

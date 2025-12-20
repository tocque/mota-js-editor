/**
 * Tern Server 工厂函数
 *
 * 创建并初始化 Tern.js 服务器实例，用于代码编辑器的智能提示和自动补全。
 */

import CodeMirror, { TernServer } from "codemirror";
import type * as Tern from "tern";
import type {
  CoreType,
  DataCommentType,
  FunctionsType,
  TernCoreDef,
} from "../types";
import { buildTernDefinitions } from "./ternDefinitions";

/**
 * Tern Server 配置选项
 */
export interface TernServerOptions {
  /** 是否使用 Web Worker */
  useWorker?: boolean;
  /** 是否启用文档注释插件 */
  docComment?: boolean;
  /** 是否启用字符串补全插件 */
  completeStrings?: boolean;
}

/**
 * TernServer 实例类型别名
 * 直接使用 @types/codemirror 提供的类型
 */
export type TernServerInstance = TernServer;

/**
 * 创建 Tern Server 实例
 *
 * 此工厂函数负责：
 * 1. 使用 buildTernDefinitions 构建类型定义
 * 2. 创建并配置 TernServer 实例
 *
 * @param options - 创建选项
 * @param options.ternDefs - 基础 Tern 定义数组（terndefs_f6783a0a_522d_417e_8407_94c67b692e50）
 * @param options.core - 游戏核心对象
 * @param options.functions - 游戏函数定义对象
 * @param options.dataComment - 数据注释对象
 * @param options.CodeMirror - CodeMirror 全局对象（需要包含 TernServer）
 * @param options.serverOptions - 可选的服务器配置
 * @returns 初始化好的 TernServer 实例
 *
 * @example
 * ```ts
 * const ternServer = createTernServer({
 *   ternDefs: terndefs_f6783a0a_522d_417e_8407_94c67b692e50,
 *   core,
 *   functions: functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a,
 *   dataComment: data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc,
 *   CodeMirror,
 * });
 * ```
 */
export function createTernServer(options: {
  ternDefs: Tern.Def[];
  core: CoreType;
  functions: FunctionsType;
  dataComment: DataCommentType;
  serverOptions?: TernServerOptions;
}): TernServerInstance {
  const {
    ternDefs,
    core,
    functions,
    dataComment,
    serverOptions = {},
  } = options;

  const {
    useWorker = false,
    docComment = true,
    completeStrings = true,
  } = serverOptions;

  // 获取 coredef（通常是 ternDefs[2]）
  // 注意：原代码直接修改 terndefs_f6783a0a_522d_417e_8407_94c67b692e50[2]
  // 这里保持相同行为，直接修改传入的 ternDefs
  const coredef = ternDefs[2] as TernCoreDef;

  // 构建类型定义
  buildTernDefinitions(coredef, core, functions, dataComment);

  // 创建 TernServer 实例
  const ternServer = new TernServer({
    defs: ternDefs,
    plugins: {
      doc_comment: docComment,
      complete_strings: completeStrings,
    } as unknown as Tern.ConstructorOptions["plugins"],
    useWorker,
  });

  return ternServer;
}

/**
 * 为 TernServer 添加新文档
 *
 * @param ternServer - TernServer 实例
 * @param name - 文档名称
 * @param value - 文档内容
 * @param mode - 文档模式，默认 'javascript'
 */
export function addTernDocument(
  ternServer: TernServerInstance,
  name: string,
  value: string,
  mode = "javascript"
): void {
  ternServer.delDoc(name);
  ternServer.addDoc(name, new CodeMirror.Doc(value, mode));
}

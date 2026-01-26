/**
 * BlockSchema 类型定义
 *
 * 聚合式块定义，包含 Blockly 定义、解析器、生成器
 */

import type * as Blockly from 'blockly';

import type {
  BlockDefinition,
  BlockState,
  ConnectionState,
  EventData,
  EventObject,
  ParseContext,
} from '../parser/types';

// ============================================
// 字段映射配置
// ============================================

/**
 * 字段映射项 - 复杂映射
 */
export interface FieldMappingConfig {
  /** 事件 JSON 中的字段名 */
  eventField: string;
  /** 解析时转换：事件值 -> BlockState 值 */
  parse?: (value: unknown) => unknown;
  /** 生成时转换：BlockState 值 -> 事件值 */
  generate?: (value: unknown) => unknown;
  /** 默认值 */
  default?: unknown;
  /** 是否在生成时省略空值 */
  omitEmpty?: boolean;
}

/**
 * 字段映射配置 - 简单块使用
 *
 * key: BlockState 字段名
 * value: 事件字段名（字符串）或完整配置
 */
export type FieldMapping = Record<string, string | FieldMappingConfig>;

// ============================================
// 解析器和生成器类型
// ============================================

/**
 * 解析器函数类型
 * 将事件 JSON 转换为 BlockState
 */
export type BlockParser = (event: EventObject, context: ParseContext) => BlockState;

/**
 * 生成器函数类型
 * 将 Blockly Block 转换为事件 JSON 字符串
 */
export type BlockGenerator = (block: Blockly.Block) => string | [string, number];

// ============================================
// BlockSchema 定义
// ============================================

/**
 * 块 Schema - 聚合式块定义
 *
 * 包含块的 Blockly 定义、解析器、生成器
 */
export interface BlockSchema {
  /**
   * 对应的事件类型（如 'setValue', 'comment'）
   * 用于从事件 JSON 查找对应的解析器
   */
  eventType: string;

  /**
   * Blockly 块定义
   * 包含 type, message, args, colour 等
   */
  definition: BlockDefinition;

  /**
   * 简单块：字段映射（自动生成 parser/generator）
   * 复杂块：留空，使用 parser/generator
   *
   * 映射格式: { BlockField: 'eventField' | FieldMappingConfig }
   */
  fieldMapping?: FieldMapping;

  /**
   * 自定义解析器（复杂块）
   * 优先级高于 fieldMapping
   */
  parser?: BlockParser;

  /**
   * 自定义生成器（复杂块）
   * 优先级高于 fieldMapping
   */
  generator?: BlockGenerator;

  /**
   * 块分类（用于工具箱）
   */
  category?: string;

  /**
   * 是否为值块（有输出）
   */
  isValue?: boolean;
}

// ============================================
// 辅助类型
// ============================================

/**
 * 解析器辅助函数类型
 */
export interface ParserHelpers {
  /** 解析事件列表 */
  parseEventList: (events: EventData[], context: ParseContext) => BlockState | null;
  /** 创建表达式块 */
  createExpressionBlock: (expr: string) => ConnectionState;
}

/**
 * 注册选项
 */
export interface RegisterOptions {
  /** 是否覆盖已存在的注册 */
  override?: boolean;
}

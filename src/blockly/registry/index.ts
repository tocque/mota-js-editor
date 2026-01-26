/**
 * BlockRegistry - 块注册表
 *
 * 聚合式块定义管理，支持：
 * - 注册块定义、解析器、生成器
 * - 从 fieldMapping 自动生成解析器/生成器
 * - 支持用户自定义块扩展
 */

import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

import type { BlockState, EventObject, ParseContext } from '../parser/types';

import type {
  BlockGenerator,
  BlockParser,
  BlockSchema,
  FieldMapping,
  FieldMappingConfig,
  RegisterOptions,
} from './types';
import { generateEventJson, isEmpty, setParseEventListFn } from './utils';
import { getCategoryColour } from '../schemas/categoryColours';

/**
 * 块注册表
 *
 * 管理所有块的定义、解析器、生成器
 */
class BlockRegistry {
  /** eventType -> BlockSchema */
  private schemas = new Map<string, BlockSchema>();

  /** blockType -> BlockSchema */
  private blockTypes = new Map<string, BlockSchema>();

  /** 是否已初始化 Blockly */
  private initialized = false;

  /**
   * 注册一个块
   *
   * @param schema - 块 Schema
   * @param options - 注册选项
   */
  register(schema: BlockSchema, options: RegisterOptions = {}): void {
    const { eventType, definition } = schema;
    const { override = false } = options;

    // 检查是否已存在
    if (!override && this.schemas.has(eventType)) {
      console.warn(`BlockRegistry: eventType "${eventType}" already registered`);
      return;
    }

    // 存储 schema
    this.schemas.set(eventType, schema);
    this.blockTypes.set(definition.type, schema);

    // 如果已初始化，立即注册到 Blockly
    if (this.initialized) {
      this.registerToBlockly(schema);
    }
  }

  /**
   * 批量注册块
   *
   * @param schemas - 块 Schema 数组
   * @param options - 注册选项
   */
  registerAll(schemas: BlockSchema[], options: RegisterOptions = {}): void {
    for (const schema of schemas) {
      this.register(schema, options);
    }
  }

  /**
   * 初始化 - 将所有已注册的块注册到 Blockly
   *
   * 应该在 Blockly workspace 创建前调用
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    for (const schema of this.schemas.values()) {
      this.registerToBlockly(schema);
    }

    this.initialized = true;
  }

  /**
   * 获取解析器
   *
   * @param eventType - 事件类型
   * @returns 解析器函数，如果不存在返回 null
   */
  getParser(eventType: string): BlockParser | null {
    const schema = this.schemas.get(eventType);
    if (!schema) {
      return null;
    }

    // 优先使用自定义解析器
    if (schema.parser) {
      return schema.parser;
    }

    // 从 fieldMapping 生成解析器
    if (schema.fieldMapping) {
      return this.createParserFromMapping(schema);
    }

    return null;
  }

  /**
   * 获取 Schema
   *
   * @param eventType - 事件类型
   */
  getSchema(eventType: string): BlockSchema | undefined {
    return this.schemas.get(eventType);
  }

  /**
   * 获取 Schema（通过块类型）
   *
   * @param blockType - 块类型
   */
  getSchemaByBlockType(blockType: string): BlockSchema | undefined {
    return this.blockTypes.get(blockType);
  }

  /**
   * 获取所有已注册的 eventType
   */
  getRegisteredEventTypes(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * 检查 eventType 是否已注册
   */
  hasEventType(eventType: string): boolean {
    return this.schemas.has(eventType);
  }

  // ============================================
  // 私有方法
  // ============================================

  /**
   * 将 schema 注册到 Blockly
   */
  private registerToBlockly(schema: BlockSchema): void {
    const { definition } = schema;

    // 处理颜色继承：如果 colour 是 'auto' 或未指定，使用 category 的默认颜色
    const definitionWithColour = this.applyColourInheritance(definition, schema.category);

    // 注册块定义
    Blockly.common.defineBlocksWithJsonArray([definitionWithColour]);

    // 注册生成器
    const generator = this.getOrCreateGenerator(schema);
    javascriptGenerator.forBlock[definition.type] = generator;
  }

  /**
   * 应用颜色继承机制
   *
   * 如果 definition.colour 是 'auto' 或未指定，使用 category 的默认颜色
   * 如果显式指定了颜色（数字），则使用显式颜色
   */
  private applyColourInheritance(
    definition: BlockSchema['definition'],
    category?: string,
  ): BlockSchema['definition'] {
    // 如果 colour 是数字，说明已显式指定，直接使用
    if (typeof definition.colour === 'number') {
      return definition;
    }

    // 如果 colour 是 'auto' 或未指定，使用 category 的默认颜色
    const categoryColour = getCategoryColour(category);
    if (categoryColour !== undefined) {
      return {
        ...definition,
        colour: categoryColour,
      };
    }

    // 如果 category 也没有，保持原样（可能是字符串颜色或其他情况）
    return definition;
  }

  /**
   * 获取或创建生成器
   */
  private getOrCreateGenerator(schema: BlockSchema): BlockGenerator {
    // 优先使用自定义生成器
    if (schema.generator) {
      return schema.generator;
    }

    // 从 fieldMapping 生成
    if (schema.fieldMapping) {
      return this.createGeneratorFromMapping(schema);
    }

    // 默认生成器（不应该到达这里）
    return () => {
      console.warn(`No generator for block type: ${schema.definition.type}`);
      return '';
    };
  }

  /**
   * 从 fieldMapping 创建解析器
   */
  private createParserFromMapping(schema: BlockSchema): BlockParser {
    const { fieldMapping, definition } = schema;

    return (event: EventObject, _context: ParseContext): BlockState => {
      const fields: Record<string, unknown> = {};

      for (const [blockField, mapping] of Object.entries(fieldMapping!)) {
        const config = this.normalizeMapping(mapping);
        const eventValue = event[config.eventField];

        // 应用解析转换
        let value = eventValue ?? config.default ?? '';
        if (config.parse) {
          value = config.parse(value);
        }

        fields[blockField] = value;
      }

      return {
        type: definition.type,
        fields,
      };
    };
  }

  /**
   * 从 fieldMapping 创建生成器
   */
  private createGeneratorFromMapping(schema: BlockSchema): BlockGenerator {
    const { fieldMapping, eventType } = schema;

    return (block: Blockly.Block): string => {
      const event: Record<string, unknown> = { type: eventType };

      for (const [blockField, mapping] of Object.entries(fieldMapping!)) {
        const config = this.normalizeMapping(mapping);
        let value = block.getFieldValue(blockField);

        // 应用生成转换
        if (config.generate) {
          value = config.generate(value);
        }

        // 检查是否省略空值
        const omitEmpty = config.omitEmpty !== false; // 默认省略空值
        if (omitEmpty && isEmpty(value)) {
          continue;
        }

        event[config.eventField] = value;
      }

      return generateEventJson(event);
    };
  }

  /**
   * 规范化字段映射配置
   */
  private normalizeMapping(mapping: string | FieldMappingConfig): FieldMappingConfig {
    if (typeof mapping === 'string') {
      return { eventField: mapping };
    }
    return mapping;
  }
}

// 导出单例
export const blockRegistry = new BlockRegistry();

// 设置解析事件列表的函数引用（避免循环依赖）
// 在 parser 模块中设置
export { setParseEventListFn };

// 导出类型
export type { BlockSchema, FieldMapping, FieldMappingConfig, BlockParser, BlockGenerator };

// 导出 Order 供 schema 使用
export { Order };

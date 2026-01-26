/**
 * Blockly 工具箱配置
 *
 * 定义工具箱的分类结构和块的组织方式
 */

import type * as Blockly from 'blockly';
import { CategoryColours } from '../schemas/categoryColours';
import { allSchemas } from '../schemas';
import type { BlockSchema } from '../registry/types';

/**
 * 工具箱分类配置
 */
export interface ToolboxCategory {
  /** 分类名称 */
  name: string;
  /** 分类颜色（用于工具箱显示） */
  colour: number;
  /** 自定义回调名（用于动态分类） */
  custom?: string;
  /** 静态块列表（块类型 ID） */
  blocks?: string[];
  /** Schema category 名称（用于自动分组） */
  category?: string;
}

/**
 * 工具箱分类定义
 *
 * 基于原始配置和新的 schema 分类
 */
export const toolboxCategories: ToolboxCategory[] = [
  {
    name: '入口方块',
    colour: CategoryColours.entry,
    custom: 'entranceCategory',
    category: 'entry',
  },
  {
    name: '显示文字',
    colour: CategoryColours.text,
    category: 'text',
  },
  {
    name: '数据操作',
    colour: CategoryColours.data,
    category: 'data',
  },
  {
    name: '地图处理',
    colour: CategoryColours.map,
    category: 'map',
  },
  {
    name: '事件控制',
    colour: CategoryColours.control,
    category: 'control',
  },
  {
    name: '特效表现',
    colour: CategoryColours.effect,
    category: 'effect',
  },
  {
    name: '音像处理',
    colour: CategoryColours.effect, // 暂时使用 effect 的颜色，后续可以拆分
    category: 'effect', // 图片和音频相关块在 effect 中
  },
  {
    name: 'UI绘制',
    colour: CategoryColours.misc,
    category: 'misc', // UI 绘制相关块在 misc 中
  },
  {
    name: '交互功能',
    colour: CategoryColours.interaction,
    category: 'interaction',
  },
  {
    name: '原生脚本',
    colour: CategoryColours.unknown,
    category: 'unknown',
  },
  {
    name: '最近使用',
    colour: 0,
    custom: 'searchBlockCategory',
  },
];

/**
 * 根据 category 获取对应的工具箱分类
 */
export function getToolboxCategoryBySchemaCategory(
  schemaCategory?: string,
): ToolboxCategory | undefined {
  if (!schemaCategory) {
    return undefined;
  }
  return toolboxCategories.find((cat) => cat.category === schemaCategory);
}

/**
 * 根据 schema category 自动生成块列表
 */
export function getBlocksByCategory(category: string): string[] {
  return allSchemas
    .filter((schema) => schema.category === category && !schema.isValue)
    .map((schema) => schema.definition.type);
}

/**
 * 生成工具箱配置
 *
 * @param entryType - 当前编辑的入口类型（用于动态筛选入口块）
 * @returns Blockly 工具箱配置
 */
export function generateToolboxConfig(
  entryType?: string,
): Blockly.utils.toolbox.ToolboxDefinition {
  const contents: Blockly.utils.toolbox.ToolboxItem[] = [];

  for (const category of toolboxCategories) {
    // 跳过动态分类（由回调处理）
    if (category.custom) {
      contents.push({
        kind: 'category',
        name: category.name,
        colour: category.colour,
        custom: category.custom,
      });
      continue;
    }

    // 静态分类：根据 category 自动生成块列表
    if (category.category) {
      const blocks = getBlocksByCategory(category.category);
      if (blocks.length > 0) {
        contents.push({
          kind: 'category',
          name: category.name,
          colour: category.colour,
          contents: blocks.map((type) => ({
            kind: 'block',
            type,
          })),
        });
      }
    }
  }

  return {
    kind: 'categoryToolbox',
    contents,
  };
}

/**
 * Schemas 入口
 *
 * 导出并注册所有块 Schema
 */

import { blockRegistry } from '../registry';
import type { BlockSchema } from '../registry/types';

import { controlSchemas } from './control';
import { dataSchemas } from './data';
import { effectSchemas } from './effect';
import { entrySchemas } from './entry';
import { interactionSchemas } from './interaction';
import { mapSchemas } from './map';
import { miscSchemas } from './misc';
import { textSchemas } from './text';
import { unknownSchemas } from './unknown';

// ============================================
// 导出所有 Schema
// ============================================

export * from './text';
export * from './control';
export * from './data';
export * from './map';
export * from './interaction';
export * from './effect';
export * from './misc';
export * from './unknown';
export * from './entry';
export * from './dropdowns';

/**
 * 所有内置 Schema
 */
export const allSchemas: BlockSchema[] = [
  ...textSchemas,
  ...controlSchemas,
  ...dataSchemas,
  ...mapSchemas,
  ...interactionSchemas,
  ...effectSchemas,
  ...miscSchemas,
  ...unknownSchemas,
  ...entrySchemas,
];

/**
 * 注册所有内置块
 *
 * 应在应用初始化时调用
 */
export function registerAllSchemas(): void {
  blockRegistry.registerAll(allSchemas);
}

/**
 * 按分类获取 Schema
 */
export function getSchemasByCategory(category: string): BlockSchema[] {
  return allSchemas.filter((s) => s.category === category);
}

/**
 * TableMeta Service - 表格元数据服务
 *
 * 负责加载和保存表格元数据配置文件（*.comment.js）。
 * 使用 new Function 安全解析 JS 文件，防止泄露到全局。
 */

import type { CommentObject } from '@/components/Table';
import { fs } from '@/services/fs';
import { encode64, decode64 } from '@/utils/encoding';

// ==================== 类型定义 ====================

/**
 * 元数据文件的 key
 * 每个 key 对应一个 comment 文件
 */
export type MetaFileKey =
  | 'comment'           // comment.js (包含 items, enemys, maps, floors)
  | 'dataComment'       // data.comment.js (全塔属性)
  | 'functionsComment'  // functions.comment.js (脚本编辑)
  | 'eventsComment'     // events.comment.js (公共事件)
  | 'pluginsComment';   // plugins.comment.js (插件)

/**
 * 元数据文件配置
 */
export interface MetaFileConfig {
  /** 文件路径 */
  filePath: string;
  /** JS 变量名（用于解析文件内容） */
  varName: string;
}

// ==================== 配置 ====================

/**
 * 元数据文件配置映射表
 */
export const META_FILE_CONFIG: Record<MetaFileKey, MetaFileConfig> = {
  comment: {
    filePath: '_server/table/comment.js',
    varName: 'comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  dataComment: {
    filePath: '_server/table/data.comment.js',
    varName: 'data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  functionsComment: {
    filePath: '_server/table/functions.comment.js',
    varName: 'functions_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  eventsComment: {
    filePath: '_server/table/events.comment.js',
    varName: 'events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  pluginsComment: {
    filePath: '_server/table/plugins.comment.js',
    varName: 'plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
};

/**
 * 所有有效的 MetaFileKey 列表
 */
export const VALID_META_FILE_KEYS: MetaFileKey[] = Object.keys(META_FILE_CONFIG) as MetaFileKey[];

// ==================== 核心函数 ====================

/**
 * 加载元数据文件内容（裸文本）
 *
 * @param key - 文件 key
 * @returns Promise<string> 文件内容
 * @throws 当 key 无效或文件读取失败时抛出错误
 */
export async function loadTableMetaFile(key: MetaFileKey): Promise<string> {
  // 使用 hasOwnProperty 检查，避免原型链上的属性（如 constructor）
  if (!Object.prototype.hasOwnProperty.call(META_FILE_CONFIG, key)) {
    throw new Error(`无效的文件 key: ${key}`);
  }

  const config = META_FILE_CONFIG[key];

  try {
    const content = await fs.promises.readFile(config.filePath, 'base64');
    return decode64(content);
  } catch (err) {
    throw new Error(`读取 ${config.filePath} 失败: ${(err as Error).message}`);
  }
}

/**
 * 保存元数据文件内容
 *
 * @param key - 文件 key
 * @param content - 文件内容（未编码的 JS 代码）
 * @returns Promise<void>
 * @throws 当 key 无效或文件写入失败时抛出错误
 */
export async function saveTableMetaFile(key: MetaFileKey, content: string): Promise<void> {
  // 使用 hasOwnProperty 检查，避免原型链上的属性（如 constructor）
  if (!Object.prototype.hasOwnProperty.call(META_FILE_CONFIG, key)) {
    throw new Error(`无效的文件 key: ${key}`);
  }

  const config = META_FILE_CONFIG[key];

  try {
    const encodedContent = encode64(content);
    await fs.promises.writeFile(config.filePath, encodedContent, 'base64');

    // 同步更新 editor.file（兼容旧代码）
    try {
      const newMeta = parseTableMetaJs(content, config.varName);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).editor?.file) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).editor.file[key] = newMeta;
      }
    } catch {
      // 解析失败不影响文件保存
    }
  } catch (err) {
    throw new Error(`写入 ${config.filePath} 失败: ${(err as Error).message}`);
  }
}

/**
 * 安全解析表格元数据 JS 文件内容
 *
 * 使用 new Function 在隔离的作用域中执行，防止泄露到全局。
 *
 * @param content - JS 文件内容
 * @param varName - 变量名
 * @returns 解析后的元数据对象
 * @throws 当解析失败时抛出错误
 */
export function parseTableMetaJs(content: string, varName: string): CommentObject {
  try {
    const fn = new Function(`
      "use strict";
      ${content}
      return ${varName};
    `);
    return fn() as CommentObject;
  } catch (err) {
    throw new Error(`解析元数据内容失败: ${(err as Error).message}`);
  }
}

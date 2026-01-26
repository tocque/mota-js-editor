/**
 * 文本相关块 Schema
 *
 * 包含显示文字、注释等文本相关的事件块
 */

import type * as Blockly from 'blockly';

import type { BlockState, EventObject, ParseContext } from '../parser/types';
import type { BlockSchema } from '../registry/types';
import { BlockColours } from './colours';

// ============================================
// 辅助函数
// ============================================

/**
 * 解析文本内容中的标题和位置信息
 * 格式: \t[标题,图标]\b[位置]内容
 */
function parseTitleAndPosition(text: string): {
  title: string;
  icon: string;
  position: string;
  content: string;
} {
  let title = '';
  let icon = '';
  let position = '';
  let content = text;

  // 解析 \t[标题,图标] 或 \t[标题]
  const titleMatch = /\\t\[([^\]]*)\]/.exec(content);
  if (titleMatch) {
    const parts = titleMatch[1].split(',');
    if (parts.length >= 2) {
      title = parts[0];
      icon = parts[1];
    } else {
      title = parts[0];
    }
    content = content.replace(titleMatch[0], '');
  }

  // 解析 \b[位置]
  const posMatch = /\\b\[([^\]]*)\]/.exec(content);
  if (posMatch) {
    position = posMatch[1];
    content = content.replace(posMatch[0], '');
  }

  return { title, icon, position, content };
}

/**
 * 构建带标题和位置的文本
 */
function buildTextWithTitleAndPosition(
  title: string,
  icon: string,
  position: string,
  content: string,
): string {
  let text = '';
  if (title || icon) {
    text += '\\t[';
    if (icon) {
      text += title + ',' + icon;
    } else {
      text += title;
    }
    text += ']';
  }
  if (position) {
    text += '\\b[' + position + ']';
  }
  text += content;
  return text;
}

// ============================================
// 简单文本块 (text_0_s)
// ============================================

/**
 * 简单文本显示块
 * 对应事件: 纯字符串文本
 *
 * 这是一个特殊块，用于简单文本（不带标题/图标）
 * 生成时直接输出字符串而非对象
 */
export const text0Schema: BlockSchema = {
  eventType: 'text_simple', // 特殊类型，用于简单文本
  definition: {
    type: 'mota_text_0_s',
    message0: '显示文字 %1',
    args0: [
      {
        type: 'field_multilinetext',
        name: 'TEXT',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (160)
    tooltip: '显示一段文字',
    helpUrl: '',
  },
  category: 'text',
  // 简单块使用 fieldMapping
  fieldMapping: {
    TEXT: 'text',
  },
  // 自定义生成器：输出纯字符串
  generator: (block: Blockly.Block): string => {
    const text = block.getFieldValue('TEXT');
    if (!text) {
      return '';
    }
    // 简单文本直接作为字符串
    return JSON.stringify(text) + ',\n';
  },
};

// ============================================
// 带标题文本块 (text_1_s)
// ============================================

/**
 * 带标题/图标的文本显示块
 * 对应事件: { type: "text", text: "\t[标题,图标]内容" }
 *
 * 复杂块，需要自定义 parser/generator
 */
export const text1Schema: BlockSchema = {
  eventType: 'text', // 对应 type: 'text' 的事件
  definition: {
    type: 'mota_text_1_s',
    message0: '显示文字 标题 %1 图标 %2 位置 %3',
    args0: [
      { type: 'field_input', name: 'TITLE', text: '' },
      { type: 'field_input', name: 'ICON', text: '' },
      { type: 'field_input', name: 'POSITION', text: '' },
    ],
    message1: '坐标 X %1 Y %2 宽 %3',
    args1: [
      { type: 'field_input', name: 'POS_X', text: '' },
      { type: 'field_input', name: 'POS_Y', text: '' },
      { type: 'field_input', name: 'POS_W', text: '' },
    ],
    message2: '窗口 %1 异步 %2 内容 %3',
    args2: [
      { type: 'field_input', name: 'CODE', text: '0' },
      { type: 'field_checkbox', name: 'ASYNC', checked: false },
      { type: 'field_multilinetext', name: 'TEXT', text: '' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (160)
    tooltip: '显示带标题和图标的文字',
    helpUrl: '',
  },
  category: 'text',
  // 自定义解析器
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    const text = (event.text as string) || '';
    const pos = event.pos as [number, number, number] | undefined;
    const code = event.code as number | undefined;
    const async = event.async as boolean | undefined;

    const { title, icon, position, content } = parseTitleAndPosition(text);

    return {
      type: 'mota_text_1_s',
      fields: {
        TITLE: title,
        ICON: icon,
        POSITION: position,
        POS_X: pos?.[0]?.toString() || '',
        POS_Y: pos?.[1]?.toString() || '',
        POS_W: pos?.[2]?.toString() || '',
        CODE: code?.toString() || '0',
        ASYNC: async || false,
        TEXT: content,
      },
    };
  },
  // 自定义生成器
  generator: (block: Blockly.Block): string => {
    const title = block.getFieldValue('TITLE');
    const icon = block.getFieldValue('ICON');
    const position = block.getFieldValue('POSITION');
    const posX = block.getFieldValue('POS_X');
    const posY = block.getFieldValue('POS_Y');
    const posW = block.getFieldValue('POS_W');
    const code = block.getFieldValue('CODE');
    const async = block.getFieldValue('ASYNC') === 'TRUE';
    const content = block.getFieldValue('TEXT');

    const text = buildTextWithTitleAndPosition(title, icon, position, content);

    const event: Record<string, unknown> = { type: 'text', text };
    if (posX || posY || posW) {
      event.pos = [posX || '', posY || '', posW || ''];
    }
    if (code && code !== '0') {
      event.code = parseInt(code) || 0;
    }
    if (async) {
      event.async = true;
    }

    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// 注释块 (comment_s)
// ============================================

/**
 * 注释块 - 简单块，使用 fieldMapping
 */
export const commentSchema: BlockSchema = {
  eventType: 'comment',
  definition: {
    type: 'mota_comment_s',
    message0: '// 注释 %1',
    args0: [
      {
        type: 'field_multilinetext',
        name: 'TEXT',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.COMMENT,
    tooltip: '注释，不会执行',
    helpUrl: '',
  },
  category: 'text',
  fieldMapping: {
    TEXT: 'text',
  },
};

// ============================================
// 提示块 (tip_s)
// ============================================

/**
 * 提示块 - 简单块，使用 fieldMapping
 */
export const tipSchema: BlockSchema = {
  eventType: 'tip',
  definition: {
    type: 'mota_tip_s',
    message0: '显示提示 %1 图标 %2',
    args0: [
      { type: 'field_input', name: 'TEXT', text: '' },
      { type: 'field_input', name: 'ICON', text: '' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (160)
    tooltip: '在屏幕上方显示提示信息',
    helpUrl: '',
  },
  category: 'text',
  fieldMapping: {
    TEXT: 'text',
    ICON: 'icon',
  },
};

// ============================================
// 自动文本块 (autoText_s)
// ============================================

/**
 * 自动剧情文本块 - 复杂块
 */
export const autoTextSchema: BlockSchema = {
  eventType: 'autoText',
  definition: {
    type: 'mota_autoText_s',
    message0: '自动文本 标题 %1 图标 %2 位置 %3 时间 %4',
    args0: [
      { type: 'field_input', name: 'TITLE', text: '' },
      { type: 'field_input', name: 'ICON', text: '' },
      { type: 'field_input', name: 'POSITION', text: '' },
      { type: 'field_input', name: 'TIME', text: '' },
    ],
    message1: '内容 %1',
    args1: [
      {
        type: 'field_multilinetext',
        name: 'TEXT',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (160)
    tooltip: '自动显示的剧情文本',
    helpUrl: '',
  },
  category: 'text',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    const text = (event.text as string) || '';
    const time = event.time as number | undefined;

    const { title, icon, position, content } = parseTitleAndPosition(text);

    return {
      type: 'mota_autoText_s',
      fields: {
        TITLE: title,
        ICON: icon,
        POSITION: position,
        TIME: time?.toString() || '',
        TEXT: content,
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const title = block.getFieldValue('TITLE');
    const icon = block.getFieldValue('ICON');
    const position = block.getFieldValue('POSITION');
    const time = block.getFieldValue('TIME');
    const content = block.getFieldValue('TEXT');

    const text = buildTextWithTitleAndPosition(title, icon, position, content);

    const event: Record<string, unknown> = { type: 'autoText', text };
    if (time) {
      event.time = parseInt(time) || 0;
    }
    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// 滚动文本块 (scrollText_s)
// ============================================

/**
 * 滚动文本块 - 复杂块
 */
export const scrollTextSchema: BlockSchema = {
  eventType: 'scrollText',
  definition: {
    type: 'mota_scrollText_s',
    message0: '滚动文本 时间 %1 行高 %2 异步 %3',
    args0: [
      { type: 'field_input', name: 'TIME', text: '' },
      { type: 'field_input', name: 'LINE_HEIGHT', text: '1.4' },
      { type: 'field_checkbox', name: 'ASYNC', checked: false },
    ],
    message1: '内容 %1',
    args1: [
      {
        type: 'field_multilinetext',
        name: 'TEXT',
        text: '',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (160)
    tooltip: '滚动显示的文本',
    helpUrl: '',
  },
  category: 'text',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    return {
      type: 'mota_scrollText_s',
      fields: {
        TIME: (event.time as number)?.toString() || '',
        LINE_HEIGHT: (event.lineHeight as number)?.toString() || '1.4',
        ASYNC: (event.async as boolean) || false,
        TEXT: (event.text as string) || '',
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const time = block.getFieldValue('TIME');
    const lineHeight = block.getFieldValue('LINE_HEIGHT');
    const async = block.getFieldValue('ASYNC') === 'TRUE';
    const text = block.getFieldValue('TEXT');

    const event: Record<string, unknown> = { type: 'scrollText', text };
    if (time) {
      event.time = parseInt(time) || 0;
    }
    if (lineHeight && lineHeight !== '1.4') {
      event.lineHeight = parseFloat(lineHeight) || 1.4;
    }
    if (async) {
      event.async = true;
    }
    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// 导出所有文本 Schema
// ============================================

export const textSchemas: BlockSchema[] = [
  text0Schema,
  text1Schema,
  commentSchema,
  tipSchema,
  autoTextSchema,
  scrollTextSchema,
];

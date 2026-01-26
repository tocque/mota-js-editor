/**
 * 控制流块 Schema
 *
 * 包含条件判断、循环等控制流相关的事件块
 */

import type * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

import type {
  BlockState,
  ConnectionState,
  EventData,
  EventObject,
  ParseContext,
} from '../parser/types';
import type { BlockSchema } from '../registry/types';
import { createExpressionBlock, parseEventList, stripQuotes } from '../registry/utils';
import { BlockColours } from './colours';

// ============================================
// 表达式块 (mota_expression)
// ============================================

/**
 * 表达式输入块 - 值块
 * 用于在条件输入中输入表达式字符串
 */
export const expressionSchema: BlockSchema = {
  eventType: '_expression', // 内部类型，不对应事件
  definition: {
    type: 'mota_expression',
    message0: '%1',
    args0: [
      {
        type: 'field_input',
        name: 'EXPR',
        text: '',
      },
    ],
    output: ['Boolean', 'String'],
    colour: BlockColours.EXPRESSION,
    tooltip: '表达式',
    helpUrl: '',
  },
  category: 'control',
  isValue: true,
  fieldMapping: {
    EXPR: 'expr',
  },
  // 值块生成器返回 [code, order]
  generator: (block: Blockly.Block): [string, number] => {
    const expr = block.getFieldValue('EXPR');
    return [JSON.stringify(expr), Order.ATOMIC];
  },
};

// ============================================
// 条件判断块 (if_1_s) - 只有 true 分支
// ============================================

/**
 * 简单条件判断块（无 else）
 * 对应事件: { type: "if", condition: "...", true: [...] }
 */
export const if1Schema: BlockSchema = {
  eventType: 'if_no_else', // 内部类型，区分有无 else
  definition: {
    type: 'mota_if_1_s',
    message0: '如果 %1',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: ['Boolean', 'String'],
      },
    ],
    message1: '则执行 %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO_TRUE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '条件判断（无 else 分支）',
    helpUrl: '',
  },
  category: 'control',
  parser: (event: EventObject, context: ParseContext): BlockState => {
    const condition = (event.condition as string) || 'true';
    const trueEvents = (event.true as EventData[]) || [];

    const inputs: Record<string, ConnectionState> = {
      CONDITION: createExpressionBlock(condition),
    };

    const trueBlock = parseEventList(trueEvents, context);
    if (trueBlock) {
      inputs.DO_TRUE = { block: trueBlock };
    }

    return {
      type: 'mota_if_1_s',
      inputs,
    };
  },
  generator: (block: Blockly.Block): string => {
    const condition =
      javascriptGenerator.valueToCode(block, 'CONDITION', Order.NONE) || '"true"';
    const doTrue = javascriptGenerator.statementToCode(block, 'DO_TRUE');

    const conditionStr = stripQuotes(condition);

    const event = {
      type: 'if',
      condition: conditionStr,
      true: '__TRUE__',
    };

    let code = JSON.stringify(event);
    code = code.replace('"__TRUE__"', '[' + doTrue + ']');
    return code + ',\n';
  },
};

// ============================================
// 条件判断块 (if_s) - 有 true 和 false 分支
// ============================================

/**
 * 完整条件判断块（有 else）
 * 对应事件: { type: "if", condition: "...", true: [...], false: [...] }
 */
export const ifSchema: BlockSchema = {
  eventType: 'if',
  definition: {
    type: 'mota_if_s',
    message0: '如果 %1',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: ['Boolean', 'String'],
      },
    ],
    message1: '则执行 %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO_TRUE',
      },
    ],
    message2: '否则 %1',
    args2: [
      {
        type: 'input_statement',
        name: 'DO_FALSE',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '条件判断（有 else 分支）',
    helpUrl: '',
  },
  category: 'control',
  parser: (event: EventObject, context: ParseContext): BlockState => {
    const condition = (event.condition as string) || 'true';
    const trueEvents = (event.true as EventData[]) || [];
    const falseEvents = (event.false as EventData[]) || [];

    const inputs: Record<string, ConnectionState> = {
      CONDITION: createExpressionBlock(condition),
    };

    const trueBlock = parseEventList(trueEvents, context);
    if (trueBlock) {
      inputs.DO_TRUE = { block: trueBlock };
    }

    const falseBlock = parseEventList(falseEvents, context);
    if (falseBlock) {
      inputs.DO_FALSE = { block: falseBlock };
    }

    return {
      type: 'mota_if_s',
      inputs,
    };
  },
  generator: (block: Blockly.Block): string => {
    const condition =
      javascriptGenerator.valueToCode(block, 'CONDITION', Order.NONE) || '"true"';
    const doTrue = javascriptGenerator.statementToCode(block, 'DO_TRUE');
    const doFalse = javascriptGenerator.statementToCode(block, 'DO_FALSE');

    const conditionStr = stripQuotes(condition);

    const event = {
      type: 'if',
      condition: conditionStr,
      true: '__TRUE__',
      false: '__FALSE__',
    };

    let code = JSON.stringify(event);
    code = code.replace('"__TRUE__"', '[' + doTrue + ']');
    code = code.replace('"__FALSE__"', '[' + doFalse + ']');
    return code + ',\n';
  },
};

// ============================================
// while 循环块
// ============================================

/**
 * while 循环块
 * 对应事件: { type: "while", condition: "...", data: [...] }
 */
export const whileSchema: BlockSchema = {
  eventType: 'while',
  definition: {
    type: 'mota_while_s',
    message0: '当 %1 时循环',
    args0: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: ['Boolean', 'String'],
      },
    ],
    message1: '执行 %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '前置条件循环',
    helpUrl: '',
  },
  category: 'control',
  parser: (event: EventObject, context: ParseContext): BlockState => {
    const condition = (event.condition as string) || 'true';
    const data = (event.data as EventData[]) || [];

    const inputs: Record<string, ConnectionState> = {
      CONDITION: createExpressionBlock(condition),
    };

    const dataBlock = parseEventList(data, context);
    if (dataBlock) {
      inputs.DO = { block: dataBlock };
    }

    return {
      type: 'mota_while_s',
      inputs,
    };
  },
  generator: (block: Blockly.Block): string => {
    const condition =
      javascriptGenerator.valueToCode(block, 'CONDITION', Order.NONE) || '"true"';
    const doCode = javascriptGenerator.statementToCode(block, 'DO');

    const conditionStr = stripQuotes(condition);

    const event = {
      type: 'while',
      condition: conditionStr,
      data: '__DATA__',
    };

    let code = JSON.stringify(event);
    code = code.replace('"__DATA__"', '[' + doCode + ']');
    return code + ',\n';
  },
};

// ============================================
// do-while 循环块
// ============================================

/**
 * do-while 循环块
 * 对应事件: { type: "dowhile", condition: "...", data: [...] }
 */
export const doWhileSchema: BlockSchema = {
  eventType: 'dowhile',
  definition: {
    type: 'mota_dowhile_s',
    message0: '执行 %1',
    args0: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    message1: '当 %1 时继续',
    args1: [
      {
        type: 'input_value',
        name: 'CONDITION',
        check: ['Boolean', 'String'],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '后置条件循环',
    helpUrl: '',
  },
  category: 'control',
  parser: (event: EventObject, context: ParseContext): BlockState => {
    const condition = (event.condition as string) || 'true';
    const data = (event.data as EventData[]) || [];

    const inputs: Record<string, ConnectionState> = {
      CONDITION: createExpressionBlock(condition),
    };

    const dataBlock = parseEventList(data, context);
    if (dataBlock) {
      inputs.DO = { block: dataBlock };
    }

    return {
      type: 'mota_dowhile_s',
      inputs,
    };
  },
  generator: (block: Blockly.Block): string => {
    const condition =
      javascriptGenerator.valueToCode(block, 'CONDITION', Order.NONE) || '"true"';
    const doCode = javascriptGenerator.statementToCode(block, 'DO');

    const conditionStr = stripQuotes(condition);

    const event = {
      type: 'dowhile',
      condition: conditionStr,
      data: '__DATA__',
    };

    let code = JSON.stringify(event);
    code = code.replace('"__DATA__"', '[' + doCode + ']');
    return code + ',\n';
  },
};

// ============================================
// for 循环块
// ============================================

/**
 * for 循环块
 * 对应事件: { type: "for", name: "...", from: 0, to: 10, step: 1, data: [...] }
 */
export const forSchema: BlockSchema = {
  eventType: 'for',
  definition: {
    type: 'mota_for_s',
    message0: '循环 %1 从 %2 到 %3 步长 %4',
    args0: [
      {
        type: 'input_value',
        name: 'VAR',
        check: ['String'],
      },
      { type: 'field_input', name: 'FROM', text: '0' },
      { type: 'field_input', name: 'TO', text: '10' },
      { type: 'field_input', name: 'STEP', text: '1' },
    ],
    message1: '执行 %1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '计数循环',
    helpUrl: '',
  },
  category: 'control',
  parser: (event: EventObject, context: ParseContext): BlockState => {
    const name = (event.name as string) || 'temp:A';
    const from = event.from;
    const to = event.to;
    const step = event.step;
    const data = (event.data as EventData[]) || [];

    const inputs: Record<string, ConnectionState> = {
      VAR: createExpressionBlock(name),
    };

    const dataBlock = parseEventList(data, context);
    if (dataBlock) {
      inputs.DO = { block: dataBlock };
    }

    return {
      type: 'mota_for_s',
      fields: {
        FROM: from?.toString() || '0',
        TO: to?.toString() || '10',
        STEP: step?.toString() || '1',
      },
      inputs,
    };
  },
  generator: (block: Blockly.Block): string => {
    const varName =
      javascriptGenerator.valueToCode(block, 'VAR', Order.NONE) || '"temp:A"';
    const from = block.getFieldValue('FROM');
    const to = block.getFieldValue('TO');
    const step = block.getFieldValue('STEP');
    const doCode = javascriptGenerator.statementToCode(block, 'DO');

    const varStr = stripQuotes(varName);

    const event = {
      type: 'for',
      name: varStr,
      from: from || '0',
      to: to || '10',
      step: step || '1',
      data: '__DATA__',
    };

    let code = JSON.stringify(event);
    code = code.replace('"__DATA__"', '[' + doCode + ']');
    return code + ',\n';
  },
};

// ============================================
// break 块
// ============================================

/**
 * break 块 - 简单块
 */
export const breakSchema: BlockSchema = {
  eventType: 'break',
  definition: {
    type: 'mota_break_s',
    message0: '跳出循环 层数 %1',
    args0: [
      {
        type: 'field_input',
        name: 'N',
        text: '1',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.LOOP_CONTROL,
    tooltip: '跳出当前循环',
    helpUrl: '',
  },
  category: 'control',
  fieldMapping: {
    N: {
      eventField: 'n',
      parse: (v) => (v as number)?.toString() || '1',
      generate: (v) => {
        const n = parseInt(v as string) || 1;
        return n === 1 ? undefined : n; // n=1 时省略
      },
    },
  },
};

// ============================================
// continue 块
// ============================================

/**
 * continue 块 - 简单块
 */
export const continueSchema: BlockSchema = {
  eventType: 'continue',
  definition: {
    type: 'mota_continue_s',
    message0: '继续循环 层数 %1',
    args0: [
      {
        type: 'field_input',
        name: 'N',
        text: '1',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.LOOP_CONTROL,
    tooltip: '继续下一次循环',
    helpUrl: '',
  },
  category: 'control',
  fieldMapping: {
    N: {
      eventField: 'n',
      parse: (v) => (v as number)?.toString() || '1',
      generate: (v) => {
        const n = parseInt(v as string) || 1;
        return n === 1 ? undefined : n;
      },
    },
  },
};

// ============================================
// exit 块
// ============================================

/**
 * exit 块 - 最简单块，无字段
 */
export const exitSchema: BlockSchema = {
  eventType: 'exit',
  definition: {
    type: 'mota_exit_s',
    message0: '立刻结束事件',
    previousStatement: null,
    colour: BlockColours.EXIT,
    tooltip: '立刻结束当前事件',
    helpUrl: '',
  },
  category: 'control',
  fieldMapping: {}, // 无字段
};

// ============================================
// sleep 块
// ============================================

/**
 * sleep 块
 */
export const sleepSchema: BlockSchema = {
  eventType: 'sleep',
  definition: {
    type: 'mota_sleep_s',
    message0: '等待 %1 毫秒 不可跳过 %2',
    args0: [
      { type: 'field_input', name: 'TIME', text: '0' },
      { type: 'field_checkbox', name: 'NO_SKIP', checked: false },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SLEEP,
    tooltip: '等待指定毫秒',
    helpUrl: '',
  },
  category: 'control',
  fieldMapping: {
    TIME: {
      eventField: 'time',
      parse: (v) => (v as number)?.toString() || '0',
      generate: (v) => {
        const time = parseInt(v as string) || 0;
        return time || undefined; // 0 时省略
      },
    },
    NO_SKIP: {
      eventField: 'noSkip',
      parse: (v) => (v as boolean) || false,
      generate: (v) => (v === 'TRUE' || v === true ? true : undefined),
    },
  },
};

// ============================================
// 导出所有控制流 Schema
// ============================================

export const controlSchemas: BlockSchema[] = [
  expressionSchema,
  if1Schema,
  ifSchema,
  whileSchema,
  doWhileSchema,
  forSchema,
  breakSchema,
  continueSchema,
  exitSchema,
  sleepSchema,
];

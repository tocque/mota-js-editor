/**
 * 特效声音块 Schema
 *
 * 包含 animate, playSound, playBgm, setCurtain, setWeather 等特效声音相关的事件块
 */

import type * as Blockly from 'blockly';

import type { BlockState, EventObject, ParseContext } from '../parser/types';
import type { BlockSchema } from '../registry/types';
import { BlockColours } from './colours';

// ============================================
// animate 块
// ============================================

/**
 * 播放动画块
 * 对应事件: { type: "animate", name: "...", loc: [x, y], async: true }
 */
export const animateSchema: BlockSchema = {
  eventType: 'animate',
  definition: {
    type: 'mota_animate_s',
    message0: '播放动画 %1 位置 [%2,%3]',
    args0: [
      { type: 'field_input', name: 'NAME', text: '' },
      { type: 'field_input', name: 'X', text: '' },
      { type: 'field_input', name: 'Y', text: '' },
    ],
    message1: '异步 %1',
    args1: [{ type: 'field_checkbox', name: 'ASYNC', checked: false }],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '播放一个动画。位置为空表示全屏动画',
    helpUrl: '',
  },
  category: 'effect',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    const loc = event.loc as [number, number] | undefined;
    return {
      type: 'mota_animate_s',
      fields: {
        NAME: (event.name as string) || '',
        X: loc?.[0]?.toString() || '',
        Y: loc?.[1]?.toString() || '',
        ASYNC: (event.async as boolean) || false,
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const name = block.getFieldValue('NAME');
    const x = block.getFieldValue('X');
    const y = block.getFieldValue('Y');
    const async = block.getFieldValue('ASYNC') === 'TRUE';

    const event: Record<string, unknown> = { type: 'animate', name };

    if (x || y) {
      event.loc = [parseInt(x) || 0, parseInt(y) || 0];
    }
    if (async) {
      event.async = true;
    }

    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// stopAnimate 块
// ============================================

/**
 * 停止动画块
 * 对应事件: { type: "stopAnimate" }
 */
export const stopAnimateSchema: BlockSchema = {
  eventType: 'stopAnimate',
  definition: {
    type: 'mota_stopAnimate_s',
    message0: '停止所有动画',
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '停止当前正在播放的所有动画',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// playSound 块
// ============================================

/**
 * 播放音效块
 * 对应事件: { type: "playSound", name: "...", pitch: 100, stop: true }
 */
export const playSoundSchema: BlockSchema = {
  eventType: 'playSound',
  definition: {
    type: 'mota_playSound_s',
    message0: '播放音效 %1 音调 %2',
    args0: [
      { type: 'field_input', name: 'NAME', text: '' },
      { type: 'field_input', name: 'PITCH', text: '' },
    ],
    message1: '停止之前的 %1',
    args1: [{ type: 'field_checkbox', name: 'STOP', checked: false }],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '播放一个音效',
    helpUrl: '',
  },
  category: 'effect',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    return {
      type: 'mota_playSound_s',
      fields: {
        NAME: (event.name as string) || '',
        PITCH: (event.pitch as number)?.toString() || '',
        STOP: (event.stop as boolean) || false,
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const name = block.getFieldValue('NAME');
    const pitch = block.getFieldValue('PITCH');
    const stop = block.getFieldValue('STOP') === 'TRUE';

    const event: Record<string, unknown> = { type: 'playSound', name };

    if (pitch) {
      event.pitch = parseInt(pitch) || 100;
    }
    if (stop) {
      event.stop = true;
    }

    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// stopSound 块
// ============================================

/**
 * 停止音效块
 * 对应事件: { type: "stopSound" }
 */
export const stopSoundSchema: BlockSchema = {
  eventType: 'stopSound',
  definition: {
    type: 'mota_stopSound_s',
    message0: '停止所有音效',
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '停止所有正在播放的音效',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// playBgm 块
// ============================================

/**
 * 播放背景音乐块
 * 对应事件: { type: "playBgm", name: "...", keep: true }
 */
export const playBgmSchema: BlockSchema = {
  eventType: 'playBgm',
  definition: {
    type: 'mota_playBgm_s',
    message0: '播放背景音乐 %1 保持不变 %2',
    args0: [
      { type: 'field_input', name: 'NAME', text: '' },
      { type: 'field_checkbox', name: 'KEEP', checked: false },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '播放背景音乐。keep=true 表示切换楼层后保持',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {
    NAME: 'name',
    KEEP: {
      eventField: 'keep',
      parse: (v) => (v as boolean) || false,
      generate: (v) => (v === 'TRUE' || v === true ? true : undefined),
    },
  },
};

// ============================================
// pauseBgm 块
// ============================================

/**
 * 暂停背景音乐块
 * 对应事件: { type: "pauseBgm" }
 */
export const pauseBgmSchema: BlockSchema = {
  eventType: 'pauseBgm',
  definition: {
    type: 'mota_pauseBgm_s',
    message0: '暂停背景音乐',
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '暂停当前背景音乐',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// resumeBgm 块
// ============================================

/**
 * 恢复背景音乐块
 * 对应事件: { type: "resumeBgm" }
 */
export const resumeBgmSchema: BlockSchema = {
  eventType: 'resumeBgm',
  definition: {
    type: 'mota_resumeBgm_s',
    message0: '恢复背景音乐',
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '恢复暂停的背景音乐',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// setVolume 块
// ============================================

/**
 * 设置音量块
 * 对应事件: { type: "setVolume", value: 100 }
 */
export const setVolumeSchema: BlockSchema = {
  eventType: 'setVolume',
  definition: {
    type: 'mota_setVolume_s',
    message0: '设置音量 %1',
    args0: [{ type: 'field_input', name: 'VALUE', text: '100' }],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '设置背景音乐音量（0-100）',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {
    VALUE: {
      eventField: 'value',
      parse: (v) => (v as number)?.toString() || '100',
      generate: (v) => parseInt(v as string) || 100,
    },
  },
};

// ============================================
// setCurtain 块
// ============================================

/**
 * 设置画面色调块
 * 对应事件: { type: "setCurtain", color: [r, g, b, a], time: ..., async: true }
 */
export const setCurtainSchema: BlockSchema = {
  eventType: 'setCurtain',
  definition: {
    type: 'mota_setCurtain_s',
    message0: '设置画面色调 [%1,%2,%3,%4]',
    args0: [
      { type: 'field_input', name: 'R', text: '0' },
      { type: 'field_input', name: 'G', text: '0' },
      { type: 'field_input', name: 'B', text: '0' },
      { type: 'field_input', name: 'A', text: '0' },
    ],
    message1: '渐变时间 %1 异步 %2 保持 %3',
    args1: [
      { type: 'field_input', name: 'TIME', text: '' },
      { type: 'field_checkbox', name: 'ASYNC', checked: false },
      { type: 'field_checkbox', name: 'KEEP', checked: false },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '设置画面色调。RGBA 值范围 0-255（A 为 0 表示清除）',
    helpUrl: '',
  },
  category: 'effect',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    const color = event.color as [number, number, number, number] | undefined;
    return {
      type: 'mota_setCurtain_s',
      fields: {
        R: color?.[0]?.toString() || '0',
        G: color?.[1]?.toString() || '0',
        B: color?.[2]?.toString() || '0',
        A: color?.[3]?.toString() || '0',
        TIME: (event.time as number)?.toString() || '',
        ASYNC: (event.async as boolean) || false,
        KEEP: (event.keep as boolean) || false,
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const r = block.getFieldValue('R');
    const g = block.getFieldValue('G');
    const b = block.getFieldValue('B');
    const a = block.getFieldValue('A');
    const time = block.getFieldValue('TIME');
    const async = block.getFieldValue('ASYNC') === 'TRUE';
    const keep = block.getFieldValue('KEEP') === 'TRUE';

    const event: Record<string, unknown> = {
      type: 'setCurtain',
      color: [parseInt(r) || 0, parseInt(g) || 0, parseInt(b) || 0, parseInt(a) || 0],
    };

    if (time) {
      event.time = parseInt(time) || 0;
    }
    if (async) {
      event.async = true;
    }
    if (keep) {
      event.keep = true;
    }

    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// screenFlash 块
// ============================================

/**
 * 屏幕闪烁块
 * 对应事件: { type: "screenFlash", color: [r, g, b, a], time: ..., times: ..., async: true }
 */
export const screenFlashSchema: BlockSchema = {
  eventType: 'screenFlash',
  definition: {
    type: 'mota_screenFlash_s',
    message0: '屏幕闪烁 颜色 [%1,%2,%3,%4]',
    args0: [
      { type: 'field_input', name: 'R', text: '255' },
      { type: 'field_input', name: 'G', text: '255' },
      { type: 'field_input', name: 'B', text: '255' },
      { type: 'field_input', name: 'A', text: '1' },
    ],
    message1: '单次时间 %1 次数 %2 异步 %3',
    args1: [
      { type: 'field_input', name: 'TIME', text: '100' },
      { type: 'field_input', name: 'TIMES', text: '3' },
      { type: 'field_checkbox', name: 'ASYNC', checked: false },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '屏幕闪烁效果',
    helpUrl: '',
  },
  category: 'effect',
  parser: (event: EventObject, _context: ParseContext): BlockState => {
    const color = event.color as [number, number, number, number] | undefined;
    return {
      type: 'mota_screenFlash_s',
      fields: {
        R: color?.[0]?.toString() || '255',
        G: color?.[1]?.toString() || '255',
        B: color?.[2]?.toString() || '255',
        A: color?.[3]?.toString() || '1',
        TIME: (event.time as number)?.toString() || '100',
        TIMES: (event.times as number)?.toString() || '3',
        ASYNC: (event.async as boolean) || false,
      },
    };
  },
  generator: (block: Blockly.Block): string => {
    const r = block.getFieldValue('R');
    const g = block.getFieldValue('G');
    const b = block.getFieldValue('B');
    const a = block.getFieldValue('A');
    const time = block.getFieldValue('TIME');
    const times = block.getFieldValue('TIMES');
    const async = block.getFieldValue('ASYNC') === 'TRUE';

    const event: Record<string, unknown> = {
      type: 'screenFlash',
      color: [parseInt(r) || 255, parseInt(g) || 255, parseInt(b) || 255, parseFloat(a) || 1],
    };

    if (time) {
      event.time = parseInt(time) || 100;
    }
    if (times) {
      event.times = parseInt(times) || 3;
    }
    if (async) {
      event.async = true;
    }

    return JSON.stringify(event) + ',\n';
  },
};

// ============================================
// setWeather 块
// ============================================

/**
 * 设置天气块
 * 对应事件: { type: "setWeather", name: "...", level: 5 }
 */
export const setWeatherSchema: BlockSchema = {
  eventType: 'setWeather',
  definition: {
    type: 'mota_setWeather_s',
    message0: '设置天气 %1 强度 %2',
    args0: [
      {
        type: 'field_dropdown',
        name: 'NAME',
        options: [
          ['无', ''],
          ['雨', 'rain'],
          ['雪', 'snow'],
          ['雾', 'fog'],
          ['云', 'cloud'],
          ['晴', 'sun'],
        ],
      },
      { type: 'field_input', name: 'LEVEL', text: '5' },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: BlockColours.SOUND,
    tooltip: '设置天气效果',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {
    NAME: 'name',
    LEVEL: {
      eventField: 'level',
      parse: (v) => (v as number)?.toString() || '5',
      generate: (v) => {
        const level = parseInt(v as string);
        return isNaN(level) ? undefined : level;
      },
    },
  },
};

// ============================================
// vibrate 块
// ============================================

/**
 * 画面震动块
 * 对应事件: { type: "vibrate", time: ..., async: true }
 */
export const vibrateSchema: BlockSchema = {
  eventType: 'vibrate',
  definition: {
    type: 'mota_vibrate_s',
    message0: '画面震动 时间 %1 异步 %2',
    args0: [
      { type: 'field_input', name: 'TIME', text: '' },
      { type: 'field_checkbox', name: 'ASYNC', checked: false },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '画面震动效果',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {
    TIME: {
      eventField: 'time',
      parse: (v) => (v as number)?.toString() || '',
      generate: (v) => {
        const time = parseInt(v as string);
        return isNaN(time) ? undefined : time;
      },
    },
    ASYNC: {
      eventField: 'async',
      parse: (v) => (v as boolean) || false,
      generate: (v) => (v === 'TRUE' || v === true ? true : undefined),
    },
  },
};

// ============================================
// wait 块
// ============================================

/**
 * 等待用户操作块
 * 对应事件: { type: "wait", timeout: ... }
 */
export const waitSchema: BlockSchema = {
  eventType: 'wait',
  definition: {
    type: 'mota_wait_s',
    message0: '等待用户操作 超时 %1',
    args0: [{ type: 'field_input', name: 'TIMEOUT', text: '' }],
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '等待用户按键或点击',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {
    TIMEOUT: {
      eventField: 'timeout',
      parse: (v) => (v as number)?.toString() || '',
      generate: (v) => {
        const timeout = parseInt(v as string);
        return isNaN(timeout) ? undefined : timeout;
      },
    },
  },
};

// ============================================
// waitAsync 块
// ============================================

/**
 * 等待异步事件块
 * 对应事件: { type: "waitAsync" }
 */
export const waitAsyncSchema: BlockSchema = {
  eventType: 'waitAsync',
  definition: {
    type: 'mota_waitAsync_s',
    message0: '等待所有异步事件执行完毕',
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '等待所有异步动画、移动等执行完毕',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// stopAsync 块
// ============================================

/**
 * 停止异步事件块
 * 对应事件: { type: "stopAsync" }
 */
export const stopAsyncSchema: BlockSchema = {
  eventType: 'stopAsync',
  definition: {
    type: 'mota_stopAsync_s',
    message0: '立刻停止所有异步事件',
    previousStatement: null,
    nextStatement: null,
    colour: 'auto', // 使用 category 默认颜色 (20)
    tooltip: '立刻停止所有异步动画、移动等',
    helpUrl: '',
  },
  category: 'effect',
  fieldMapping: {},
};

// ============================================
// 导出所有特效声音 Schema
// ============================================

export const effectSchemas: BlockSchema[] = [
  animateSchema,
  stopAnimateSchema,
  playSoundSchema,
  stopSoundSchema,
  playBgmSchema,
  pauseBgmSchema,
  resumeBgmSchema,
  setVolumeSchema,
  setCurtainSchema,
  screenFlashSchema,
  setWeatherSchema,
  vibrateSchema,
  waitSchema,
  waitAsyncSchema,
  stopAsyncSchema,
];

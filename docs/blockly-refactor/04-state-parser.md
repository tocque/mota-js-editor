# 04 - 事件 JSON ↔ Blockly State 解析器

## 目标

实现事件 JSON 数据与 Blockly v12 JSON State 之间的双向转换。

## 输入/输出

```
事件 JSON (游戏数据格式)
  ↓↑
Blockly JSON State (v12 格式)
```

## 输出文件

```
src/blockly/parser/
├── eventToState.ts    # 事件 JSON → Blockly State
├── stateToEvent.ts    # Blockly State → 事件 JSON (可选，代码生成器已覆盖)
├── types.ts           # 类型定义
└── index.ts
```

## 数据格式对比

### 事件 JSON (输入)

```json
[
  { "type": "text", "text": "你好世界" },
  {
    "type": "if",
    "condition": "status:hp > 100",
    "true": [{ "type": "text", "text": "血量充足" }],
    "false": []
  }
]
```

### Blockly JSON State (输出)

```json
{
  "type": "text_0_s",
  "fields": { "EvalString_0": "你好世界" },
  "next": {
    "block": {
      "type": "if_s",
      "inputs": {
        "expression_0": {
          "shadow": {
            "type": "evalString_e",
            "fields": { "EvalString_0": "status:hp > 100" }
          }
        },
        "action_0": {
          "block": {
            "type": "text_0_s",
            "fields": { "EvalString_0": "血量充足" }
          }
        },
        "action_1": {
          "block": {
            "type": "pass_s"
          }
        }
      }
    }
  }
}
```

## 实现

### 1. 类型定义

```typescript
// src/blockly/parser/types.ts

/**
 * 事件数据 (游戏格式)
 */
export type EventData = string | EventObject;

export interface EventObject {
  type: string;
  [key: string]: unknown;
}

/**
 * Blockly State (v12 格式)
 */
export interface BlockState {
  type: string;
  id?: string;
  x?: number;
  y?: number;
  fields?: Record<string, unknown>;
  inputs?: Record<string, ConnectionState>;
  next?: ConnectionState;
  extraState?: unknown;
}

export interface ConnectionState {
  shadow?: BlockState;
  block?: BlockState;
}

/**
 * 解析上下文
 */
export interface ParseContext {
  entryType: string;  // 'event' | 'shop' | 'level' ...
}
```

### 2. 事件 → State 解析器

```typescript
// src/blockly/parser/eventToState.ts
import type { EventData, EventObject, BlockState, ParseContext } from './types';

/**
 * 解析事件列表
 */
export function parseEventList(
  events: EventData[],
  context: ParseContext
): BlockState | null {
  if (events.length === 0) return null;
  
  let result: BlockState | null = null;
  let current: BlockState | null = null;
  
  // 从后往前处理，构建链表
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    const state = parseEvent(event, context);
    
    if (current) {
      state.next = { block: current };
    }
    current = state;
  }
  
  return current;
}

/**
 * 解析单个事件
 */
export function parseEvent(
  event: EventData,
  context: ParseContext
): BlockState {
  // 字符串是简单文本
  if (typeof event === 'string') {
    return parseTextEvent({ type: 'text', text: event }, context);
  }
  
  // 根据类型分发
  switch (event.type) {
    case 'text':
      return parseTextEvent(event, context);
    case 'if':
      return parseIfEvent(event, context);
    case 'setValue':
      return parseSetValueEvent(event, context);
    // ... 其他类型
    default:
      return parseUnknownEvent(event, context);
  }
}

/**
 * 解析文本事件
 */
function parseTextEvent(event: EventObject, context: ParseContext): BlockState {
  const text = event.text as string || '';
  
  // 检查是否有标题/图标/位置等
  const hasExtra = text.includes('\\t[') || text.includes('\\b[') || event.pos;
  
  if (hasExtra) {
    // 复杂文本块 text_1_s
    const { title, icon, position, content } = parseTitleAndPosition(text);
    return {
      type: 'text_1_s',
      fields: {
        EvalString_0: title,
        IdString_0: icon,
        IdString_1: position,
        EvalString_1: content,
        // ... 其他字段
      }
    };
  }
  
  // 简单文本块 text_0_s
  return {
    type: 'text_0_s',
    fields: {
      EvalString_0: text
    }
  };
}

/**
 * 解析条件事件
 */
function parseIfEvent(event: EventObject, context: ParseContext): BlockState {
  const hasFalse = event.false && (event.false as EventData[]).length > 0;
  
  return {
    type: hasFalse ? 'if_s' : 'if_1_s',
    inputs: {
      expression_0: {
        shadow: {
          type: 'evalString_e',
          fields: { EvalString_0: event.condition as string }
        }
      },
      action_0: {
        block: parseEventList(event.true as EventData[], context) || {
          type: 'pass_s'
        }
      },
      ...(hasFalse ? {
        action_1: {
          block: parseEventList(event.false as EventData[], context) || {
            type: 'pass_s'
          }
        }
      } : {})
    }
  };
}

/**
 * 解析设置值事件
 */
function parseSetValueEvent(event: EventObject, context: ParseContext): BlockState {
  return {
    type: 'setValue_s',
    inputs: {
      id_0: expandIdBlock(event.name as string),
      expression_0: expandExpressionBlock(event.value as string)
    },
    fields: {
      Operator_List_0: event.operator || '='
    }
  };
}

/**
 * 展开 ID 块
 */
function expandIdBlock(id: string): ConnectionState {
  // 检查是否匹配特殊格式
  const flagMatch = /^switch:([A-Z])$/.exec(id);
  if (flagMatch) {
    return {
      block: {
        type: 'idFlag_e',
        fields: { Char_List_0: flagMatch[1] }
      }
    };
  }
  
  const idListMatch = /^(status|item|flag|buff):(.+)$/.exec(id);
  if (idListMatch) {
    return {
      block: {
        type: 'idIdList_e',
        fields: {
          Id_List_0: idListMatch[1],
          IdText_0: idListMatch[2]
        }
      }
    };
  }
  
  // 默认字符串
  return {
    shadow: {
      type: 'idString_e',
      fields: { IdString_0: id }
    }
  };
}

/**
 * 展开表达式块
 */
function expandExpressionBlock(expr: string): ConnectionState {
  // 布尔值
  if (expr === 'true' || expr === 'false') {
    return {
      block: {
        type: 'bool_e',
        fields: { Bool_0: expr === 'true' }
      }
    };
  }
  
  // 默认表达式字符串
  return {
    shadow: {
      type: 'evalString_e',
      fields: { EvalString_0: expr }
    }
  };
}

// ... 其他解析函数
```

### 3. 入口解析器

```typescript
// src/blockly/parser/entryParser.ts
import type { BlockState, ParseContext } from './types';
import { parseEventList } from './eventToState';

/**
 * 解析事件入口
 */
export function parseEventEntry(data: unknown): BlockState {
  const context: ParseContext = { entryType: 'event' };
  
  if (!data) data = {};
  if (typeof data === 'string') data = { data: [data] };
  if (Array.isArray(data)) data = { data };
  
  const obj = data as Record<string, unknown>;
  
  return {
    type: 'event_m',
    fields: {
      Bool_0: obj.trigger === 'action',
      Bool_1: obj.enable ?? true,
      // ... 其他字段
    },
    inputs: {
      action_0: {
        block: parseEventList(obj.data as EventData[] || [], context)
      }
    }
  };
}

/**
 * 解析商店入口
 */
export function parseShopEntry(data: unknown): BlockState {
  // ... 实现
}

/**
 * 解析等级入口
 */
export function parseLevelEntry(data: unknown): BlockState {
  // ... 实现
}
```

### 4. 导出

```typescript
// src/blockly/parser/index.ts
export { parseEventList, parseEvent } from './eventToState';
export { parseEventEntry, parseShopEntry, parseLevelEntry } from './entryParser';
export type { EventData, EventObject, BlockState, ConnectionState, ParseContext } from './types';
```

## 验收标准

- [ ] 能正确解析所有事件类型
- [ ] 生成的 State 能被 Blockly v12 正确加载
- [ ] 支持所有入口类型 (event, shop, level, autoEvent...)
- [ ] 正确展开 ID/表达式块

## 测试用例

```typescript
const events: EventData[] = [
  "简单文本",
  { type: "if", condition: "flag:test", true: ["成功"], false: [] }
];

const state = parseEventList(events, { entryType: 'event' });

// 验证结构
expect(state.type).toBe('text_0_s');
expect(state.next?.block?.type).toBe('if_1_s');
```

## 后续步骤

完成解析器后，进入 [05-code-generator.md](./05-code-generator.md) 实现代码生成。

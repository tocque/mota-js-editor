# 01 - Block JSON Schema 类型设计

## 目标

设计一个 JSON Schema 格式，用于定义 Blockly 积木。

> 参考 [00-language-spec.md](./00-language-spec.md) 了解 Mota Action DSL 语言规范。

## 输出

```
src/blockly/schema/types.ts   # TypeScript 类型定义
```

## Schema 设计

### 1. 基础 Block 定义

```typescript
// src/blockly/schema/types.ts

/**
 * 积木分类
 */
export type BlockCategory = 
  | 'entry'      // 入口方块 (event_m, shop_m...)
  | 'action'     // 动作方块 (text_s, if_s...)
  | 'value'      // 值方块 (expression, idString...)
  | 'context';   // 上下文方块 (choicesContext, switchCase...)

/**
 * 参数类型
 */
export type ArgType = 
  | 'field_input'           // 文本输入
  | 'field_number'          // 数字输入
  | 'field_dropdown'        // 下拉选择
  | 'field_checkbox'        // 复选框
  | 'field_colour'          // 颜色选择
  | 'field_multilinetext'   // 多行文本
  | 'input_value'           // 值输入 (连接值块)
  | 'input_statement';      // 语句输入 (连接动作块)

/**
 * 参数定义
 */
export interface ArgDefinition {
  type: ArgType;
  name: string;
  // field_input / field_multilinetext
  text?: string;
  // field_number
  value?: number;
  min?: number;
  max?: number;
  precision?: number;
  // field_dropdown
  options?: Array<[string, string]>;  // [显示文本, 值]
  // field_checkbox
  checked?: boolean;
  // input_value
  check?: string | string[];  // 类型检查
  // input_statement
  // (无额外属性)
}

/**
 * 代码生成配置
 */
export interface CodeGenConfig {
  /**
   * 生成类型
   * - template: 简单模板替换
   * - function: 复杂逻辑，保留函数
   */
  type: 'template' | 'function';
  
  /**
   * 生成模板 (type=template)
   * 使用 ${fieldName} 引用字段值
   */
  template?: string;
  
  /**
   * 函数体 (type=function)
   * 复杂逻辑时保留原始函数
   */
  functionBody?: string;
  
  /**
   * 字段预处理器映射
   * 字段名 → 预处理器名称
   */
  preprocess?: Record<string, string>;
  
  /**
   * 条件简化规则
   * 当所有字段为默认值时，输出简化格式
   */
  simplify?: {
    when: Record<string, unknown>;  // 字段默认值条件
    output: string;                  // 简化输出模板
  }[];
  
  /**
   * 返回类型 (值块)
   */
  returnType?: 'string' | 'array' | 'object';
  
  /**
   * Order 优先级 (值块)
   */
  order?: number;
}

/**
 * 扩展特性配置
 */
export interface FeatureConfig {
  /** 双击预览 */
  previewBlock?: boolean;
  
  /** 双击选点 [xField, yField, floorField?, forceFloor?] */
  selectPoint?: [string, string, string?, boolean?];
  
  /** 双击选素材 [路径, 字段名] */
  material?: [string, string];
  
  /** 双击多行编辑 */
  doubleclicktext?: string;
  
  /** 自动补全 - 图块ID */
  allIds?: string[];
  /** 自动补全 - 怪物ID */
  allEnemys?: string[];
  /** 自动补全 - 道具ID */
  allItems?: string[];
  /** 自动补全 - 图片名 */
  allImages?: string[];
  /** 自动补全 - 动画名 */
  allAnimates?: string[];
  /** 自动补全 - BGM */
  allBgms?: string[];
  /** 自动补全 - 音效 */
  allSounds?: string[];
  /** 自动补全 - 商店ID */
  allShops?: string[];
  /** 自动补全 - 楼层ID */
  allFloorIds?: string[];
  
  /** 支持折叠 */
  collapsible?: boolean;
  
  /** 支持禁用 */
  disableable?: boolean;
}

/**
 * 完整的 Block Schema
 */
export interface BlockSchema {
  /** 积木类型 ID */
  type: string;
  
  /** 分类 */
  category: BlockCategory;
  
  /** 显示消息模板，如 "显示文字 %1" */
  message0: string;
  message1?: string;
  message2?: string;
  // ... 最多到 message9
  
  /** 参数定义 */
  args0?: ArgDefinition[];
  args1?: ArgDefinition[];
  args2?: ArgDefinition[];
  // ... 对应 message
  
  /** 输出类型 (值块) */
  output?: string | string[] | null;
  
  /** 前置连接 */
  previousStatement?: string | string[] | null;
  
  /** 后置连接 */
  nextStatement?: string | string[] | null;
  
  /** 颜色 (0-360) */
  colour: number;
  
  /** 提示文字 */
  tooltip: string;
  
  /** 帮助链接 */
  helpUrl: string;
  
  /** 默认值 */
  defaults?: Record<string, unknown>;
  
  /** 代码生成配置 */
  codeGen: CodeGenConfig;
  
  /** 扩展特性 */
  features?: FeatureConfig;
}

/**
 * 预处理器定义
 */
export interface PreprocessorDefinition {
  name: string;
  // 预处理函数实现
  fn: (value: unknown) => unknown;
}

/**
 * 字段类型定义 (从 export.js 提取)
 */
export interface FieldTypeDefinition {
  type: string;  // field_input, field_checkbox, field_dropdown...
  text?: string;
  checked?: boolean;
  options?: Array<[string, string]>;
  default?: unknown;
}

/**
 * 工具箱分类
 */
export interface ToolboxCategory {
  name: string;
  colour?: number;
  blocks: string[];  // block type IDs
  custom?: string;   // 自定义回调名
}

/**
 * 完整的 Schema 集合
 */
export interface BlocklySchemaCollection {
  version: string;
  blocks: BlockSchema[];
  toolbox: ToolboxCategory[];
}
```

### 2. 预处理器定义

预处理器在代码生成时对字段值进行转换和验证。这些函数来自 `MotaActionFunctions.*_pre`。

```typescript
// src/blockly/schema/preprocessors.ts

/**
 * 预处理器定义
 * 每个预处理器接收字段值，返回处理后的值或抛出错误
 */
export const preprocessors: Record<string, (v: string) => string> = {
  
  // ========== 字符串类 ==========
  
  /**
   * 通用表达式字符串
   * - 检查 __door__ 占位符
   * - 调用 replaceFromName 转换友好名称 → ID
   * - 转义双引号
   */
  EvalString: (s) => {
    if (s.includes('__door__')) 
      throw new Error('请修改开门变量__door__');
    s = replaceFromName(s);
    return s.replace(/([^\\])"/g, '$1\\"')
            .replace(/^"/g, '\\"')
            .replace(/""/g, '"\\"');
  },
  
  /**
   * 多行表达式字符串
   * - 同 EvalString
   * - 额外处理换行符
   */
  EvalString_Multi: (s) => {
    if (s.includes('__door__')) 
      throw new Error('请修改开门变量__door__');
    s = replaceFromName(s);
    return s.replace(/([^\\])"/g, '$1\\"')
            .replace(/^"/g, '\\"')
            .replace(/""/g, '"\\"')
            .replace(/\n/g, '\\n');
  },
  
  /**
   * ID 字符串（变量名、道具ID等）
   * - 检查 __door__ 占位符
   * - 调用 replaceFromName + replaceFromName_token
   * - 验证字符范围：0-9 a-z A-Z _ - :
   */
  IdString: (s) => {
    if (s.includes('__door__')) 
      throw new Error('请修改开门变量__door__');
    s = replaceFromName(s);
    s = replaceFromName_token(s);
    const idPattern = /^(flag|global|temp):([a-zA-Z0-9_\u4E00-\u9FCC]+)$/;
    const idWithoutFlagPattern = /^[0-9a-zA-Z_][0-9a-zA-Z_\-:]*$/;
    if (s && !idPattern.test(s) && !idWithoutFlagPattern.test(s))
      throw new Error(`id: ${s}中包含了非法字符`);
    return s;
  },
  
  /**
   * 位置字符串（坐标 x 或 y）
   * - 支持纯数字：直接返回
   * - 支持表达式：加引号包裹
   * - 禁止多点坐标（逗号分隔）
   */
  PosString: (s) => {
    if (!s || /^-?\d+$/.test(s)) return s;
    const comma = s.indexOf(',');
    if (comma >= 0 && s.substring(0, comma).indexOf('(') < 0) 
      throw new Error('此处不可写多点坐标');
    return '"' + replaceFromName(s) + '"';
  },
  
  /**
   * JSON 字符串
   * - 验证 JSON 格式
   * - 返回压缩后的 JSON
   */
  JsonEvalString: (s) => {
    if (s === '') return '';
    s = replaceFromName(s);
    try {
      return JSON.stringify(JSON.parse(s));
    } catch (e) {
      throw new Error('此处需要填写一个合法的JSON内容');
    }
  },
  
  // ========== 数值/格式类 ==========
  
  /**
   * 整数字符串
   * - 验证格式：可选正负号 + 数字
   */
  IntString: (s) => {
    if (!/^[+-]?\d*$/.test(s)) 
      throw new Error('此项必须是整数或不填');
    return s;
  },
  
  /**
   * 颜色字符串
   * - 格式：r,g,b 或 r,g,b,a
   * - 范围：0-255, 0-255, 0-255, 0-1
   */
  ColorString: (s) => {
    const pattern = /^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/;
    if (s && !pattern.test(s))
      throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
    return s;
  },
  
  /**
   * 字体字符串
   * - 格式：[italic] [bold] 14px FontName
   */
  FontString: (s) => {
    const pattern = /^(italic )?(bold )?(\d+)px ([a-zA-Z0-9_\u4E00-\u9FCC]+)$/;
    if (s && !pattern.test(s))
      throw new Error('字体必须是 [italic] [bold] 14px Verdana 这种形式或不填');
    return s;
  },
  
  // ========== 特殊转换类 ==========
  
  /**
   * 步骤字符串 → 方向数组
   * - 输入："上右3下2左"
   * - 输出：["up", "right", "right", "right", "down", "down", "left"]
   */
  StepString: (s) => {
    const route = s
      .replace(/上/g, 'U').replace(/下/g, 'D')
      .replace(/左/g, 'L').replace(/右/g, 'R')
      .replace(/前/g, 'F').replace(/后/g, 'B');
    
    const ans: string[] = [];
    let index = 0;
    
    const getNumber = () => {
      let num = '';
      while (index < route.length && !isNaN(Number(route.charAt(index)))) {
        num += route.charAt(index++);
      }
      return num.length === 0 ? 1 : parseInt(num);
    };
    
    while (index < route.length) {
      const c = route.charAt(index++);
      const number = getNumber();
      const dir = { U: 'up', D: 'down', L: 'left', R: 'right', F: 'forward', B: 'backward' }[c];
      if (dir) {
        for (let i = 0; i < number; i++) ans.push(dir);
      }
    }
    return JSON.stringify(ans);
  },
  
  /**
   * 移动方向数组压缩
   * - 输入：["up", "up", "right", "right", "right"]
   * - 输出：["up:2", "right:3"]
   */
  processMoveDirections: (steps: string[]) => {
    let curr: string | null = null;
    let num = 0;
    const result: string[] = [];
    
    steps.forEach((one) => {
      const v = one.split(':');
      if (v.length === 1) v.push('1');
      if (v[0] !== curr) {
        if (curr !== null) result.push(curr + ':' + num);
        curr = v[0];
        num = parseInt(v[1]);
      } else {
        num += parseInt(v[1]);
      }
    });
    if (curr !== null) result.push(curr + ':' + num);
    return result;
  },
  
  /**
   * 多点坐标处理
   * - 输入：x="1,2,3", y="4,5,6"
   * - 输出：", \"loc\": [[1,4],[2,5],[3,6]]"
   */
  processMultiLoc: (x: string, y: string) => {
    if (!x || !y) return '';
    const pattern = /^([+-]?\d+)(, ?[+-]?\d+)*$/;
    if (pattern.test(x) && pattern.test(y)) {
      const xs = x.split(',').map(s => s.trim());
      const ys = y.split(',').map(s => s.trim());
      if (xs.length === ys.length) {
        const locs = xs.map((xi, i) => `[${xi},${ys[i]}]`);
        return `, "loc": [${locs.join(',')}]`;
      }
    }
    return `, "loc": ["${x}","${y}"]`;
  },
};
```

### 3. 名称转换函数

在预处理器中使用的名称转换函数：

```typescript
// src/blockly/schema/nameReplace.ts

/**
 * 友好名称 → 原始 ID（保存时）
 * "状态：生命"     → "status:hp"
 * "物品：黄钥匙"   → "item:yellowKey"
 * "变量：visited"  → "flag:visited"
 */
export function replaceFromName(str: string): string {
  // ... 实现见 MotaActionFunctions.replaceFromName
}

/**
 * 原始 ID → 友好名称（加载/显示时）
 * "status:hp"      → "状态：生命"
 * "item:yellowKey" → "物品：黄钥匙"
 */
export function replaceToName(str: string): string {
  // ... 实现见 MotaActionFunctions.replaceToName
}

/**
 * 单个 token 的名称转换
 * "hp" → "生命"（在 status: 上下文中）
 */
export function replaceFromName_token(str: string): string;
export function replaceToName_token(str: string): string;
```

### 4. 示例：text_0_s 积木

```json
{
  "type": "text_0_s",
  "category": "action",
  "message0": "显示文章 : %1",
  "args0": [
    {
      "type": "field_multilinetext",
      "name": "EvalString_Multi_0",
      "text": "欢迎使用事件编辑器"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 70,
  "tooltip": "text：显示一段文字（剧情）",
  "helpUrl": "/_docs/#/instruction",
  "codeGen": {
    "type": "template",
    "template": "\"${EvalString_Multi_0}\"",
    "preprocess": {
      "EvalString_Multi_0": "EvalString_Multi"
    }
  },
  "features": {
    "previewBlock": true,
    "collapsible": true,
    "disableable": true
  }
}
```

### 4. 示例：if_s 积木

```json
{
  "type": "if_s",
  "category": "action",
  "message0": "如果 : %1 %2 %3 否则 : %4 %5",
  "args0": [
    { "type": "input_value", "name": "expression_0", "check": "expression" },
    { "type": "input_dummy" },
    { "type": "input_statement", "name": "action_0", "check": "action" },
    { "type": "input_dummy" },
    { "type": "input_statement", "name": "action_1", "check": "action" }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 220,
  "tooltip": "if: 条件判断",
  "helpUrl": "/_docs/#/instruction",
  "codeGen": {
    "type": "template",
    "template": "{\"type\":\"if\",\"condition\":\"${expression_0}\",\"true\":[${action_0}],\"false\":[${action_1}]}"
  },
  "features": {
    "collapsible": true,
    "disableable": true
  }
}
```

### 5. 示例：event_m 入口 (带简化规则)

```json
{
  "type": "event_m",
  "category": "entry",
  "message0": "事件 %1 覆盖触发器 %2 启用 %3 ...",
  "args0": [
    { "type": "input_dummy" },
    { "type": "field_checkbox", "name": "Bool_0", "checked": false },
    { "type": "field_checkbox", "name": "Bool_1", "checked": true }
  ],
  "colour": 250,
  "codeGen": {
    "type": "template",
    "template": "{\"trigger\":${Bool_0},\"enable\":${Bool_1},\"data\":[${action_0}]}",
    "simplify": [{
      "when": { "Bool_0": false, "Bool_1": true },
      "output": "[${action_0}]"
    }]
  }
}
```

## 验收标准

- [ ] 类型定义能覆盖所有现有积木的配置
- [ ] 类型定义包含代码生成所需信息 (template/function)
- [ ] 类型定义包含预处理器映射
- [ ] 类型定义包含简化规则
- [ ] 类型定义包含扩展特性（预览、选点等）
- [ ] 有示例 JSON 验证格式可行

## 后续步骤

完成类型定义后，进入 [02-schema-conversion.md](./02-schema-extraction.md) 从 export.js 转换积木定义。

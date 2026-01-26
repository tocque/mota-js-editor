# 02 - 从 export.js 转换到 JSON Schema

## 目标

将运行时抓取的 `export.js` 转换为 JSON Schema 文件。

## 输入

```
docs/blockly-refactor/export.js   # 运行时抓取，约 16700 行
```

## 输出

```
src/blockly/schema/
├── entry/           # 入口块
├── actions/         # 语句块
├── values/          # 表达式块
├── context/         # 上下文块
└── fields/          # 字段类型定义
```

## export.js 结构分析

### 数据结构

```javascript
MotaActionBlocks = {
  // 1. 分类数组 - 定义哪些块属于哪个类型
  "action": ["text_0_s", "if_s", "setValue_s", ...],
  "expression": ["expression_arithmetic_0", "idString_e", ...],
  
  // 2. 字段类型定义
  "EvalString": { "type": "field_input", "text": "..." },
  "Bool": { "type": "field_checkbox", "checked": false },
  "Floor_List": { "type": "field_dropdown", "options": [...] },
  
  // 3. 完整的块定义
  "text_0_s": {
    "type": "statement",
    "json": { /* Blockly JSON 定义 */ },
    "generFunc": function(block) { /* 代码生成 */ },
    "args": ["EvalString_Multi_0"],
    "argsType": ["field"],
    "argsGrammarName": ["EvalString_Multi"],
    "fieldDefault": function(key) { ... },
    "xmlText": function(inputs, ...) { ... },
    "previewBlock": "true",  // 可选特性
  }
}
```

### 字段映射

| export.js 字段 | Schema 字段 |
|---------------|-------------|
| `json.type` | `type` |
| `json.message0` | `message0` |
| `json.args0` | `args0` |
| `json.colour` | `colour` |
| `json.tooltip` | `tooltip` |
| `json.helpUrl` | `helpUrl` |
| `json.output` | `output` |
| `json.previousStatement` | `previousStatement` |
| `json.nextStatement` | `nextStatement` |
| `type` ("statement"/"value") | `category` |
| `generFunc` | `codeGen` (需解析) |
| `argsGrammarName` | 字段预处理器映射 |
| `previewBlock` | `features.previewBlock` |
| `allIds` | `features.allIds` |

## 转换脚本

### 主转换逻辑

```typescript
// scripts/convertExportJs.ts
interface ExportBlockDef {
  type: 'statement' | 'value';
  json: BlocklyJsonDef;
  generFunc: Function;
  args: string[];
  argsType: ('field' | 'value' | 'statement')[];
  argsGrammarName: string[];
  previewBlock?: string;
  allIds?: string;
  allEnemys?: string;
}

function convertBlock(name: string, def: ExportBlockDef): BlockSchema {
  return {
    type: name,
    category: getCategoryFromType(def.type, name),
    ...def.json,  // message0, args0, colour, tooltip 等直接复制
    codeGen: analyzeGenerFunc(def.generFunc, def.argsGrammarName),
    features: extractFeatures(def),
  };
}

function getCategoryFromType(type: string, name: string): BlockCategory {
  if (name.endsWith('_m')) return 'entry';
  if (type === 'value') return 'value';
  // 检查是否是上下文块
  const contextTypes = ['choicesContext', 'switchCase', 'waitContext'];
  if (contextTypes.some(c => name.startsWith(c))) return 'context';
  return 'action';
}
```

### generFunc 解析

代码生成函数有三种复杂度：

**简单模板型** (约 60%)：
```javascript
// 可直接转为 template
generFunc: function(block) {
  var EvalString_Multi_0 = block.getFieldValue('...');
  EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
  var code = '"'+EvalString_Multi_0+'"';
  return code+',\n';
}
// → template: '"${EvalString_Multi_0}"'
```

**条件逻辑型** (约 30%)：
```javascript
// 需要 simplify 规则
generFunc: function(block) {
  // ... 获取字段值
  var code = {"trigger": Bool_0 ? "action" : null, ...};
  // 条件简化
  if (!Bool_0 && Bool_1 && ...) code = "data_asdfefw";
  return JSON.stringify(code).replace(...);
}
// → template + simplify 规则
```

**复杂逻辑型** (约 10%)：
```javascript
// 保留为函数
generFunc: function(block) {
  // 大量条件判断、字符串拼接、验证逻辑
}
// → codeGen.type = 'function', codeGen.functionName = '...'
```

```typescript
function analyzeGenerFunc(fn: Function, grammarNames: string[]): CodeGenConfig {
  const fnStr = fn.toString();
  
  // 检测是否是简单模板
  if (isSimpleTemplate(fnStr)) {
    return {
      type: 'template',
      template: extractTemplate(fnStr),
      preprocess: buildPreprocessMap(grammarNames),
    };
  }
  
  // 检测是否有条件简化
  if (hasSimplifyLogic(fnStr)) {
    return {
      type: 'template',
      template: extractTemplate(fnStr),
      preprocess: buildPreprocessMap(grammarNames),
      simplify: extractSimplifyRules(fnStr),
    };
  }
  
  // 复杂逻辑，保留函数
  return {
    type: 'function',
    functionBody: fnStr,
  };
}
```

### 特性提取

```typescript
function extractFeatures(def: ExportBlockDef): FeatureConfig {
  const features: FeatureConfig = {};
  
  if (def.previewBlock === 'true') features.previewBlock = true;
  if (def.allIds) features.allIds = eval(def.allIds);
  if (def.allEnemys) features.allEnemys = eval(def.allEnemys);
  if (def.allItems) features.allItems = eval(def.allItems);
  // ... 其他特性
  
  return Object.keys(features).length > 0 ? features : undefined;
}
```

## 转换流程

```bash
# 1. 加载 export.js
node scripts/convertExportJs.ts

# 2. 输出结构
src/blockly/schema/
├── fields.json          # 字段类型定义
├── entry/
│   └── all.json         # 所有入口块
├── actions/
│   ├── text.json
│   ├── control.json
│   ├── data.json
│   └── ...
├── values/
│   └── all.json
└── context/
    └── all.json
```

## 验收标准

- [ ] 所有块定义已转换为 JSON Schema
- [ ] 字段类型定义完整
- [ ] 简单模板正确提取
- [ ] 复杂函数已标记
- [ ] 特性配置完整

## 后续步骤

完成 Schema 转换后，进入 [03-block-registry.md](./03-block-registry.md) 实现注册器。

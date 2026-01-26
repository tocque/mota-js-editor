# 03 - JSON Schema → Blockly 注册器

## 目标

实现将 JSON Schema 转换为 Blockly 积木定义并注册。

## 输入

```
src/blockly/schema/**/*.json   # Block Schema 文件
```

## 输出

```
src/blockly/registry/
├── blockRegistry.ts       # Block 定义注册
├── generatorRegistry.ts   # 代码生成器注册
└── index.ts
```

## 实现

### 1. Block 注册器

```typescript
// src/blockly/registry/blockRegistry.ts
import * as Blockly from 'blockly';
import type { BlockSchema } from '../schema/types';

/**
 * 将 Schema 转换为 Blockly JSON 定义
 */
function schemaToBlocklyJson(schema: BlockSchema): object {
  return {
    type: schema.type,
    message0: schema.message0,
    args0: schema.args0,
    message1: schema.message1,
    args1: schema.args1,
    // ... 其他 message/args
    output: schema.output,
    previousStatement: schema.previousStatement,
    nextStatement: schema.nextStatement,
    colour: schema.colour,
    tooltip: schema.tooltip,
    helpUrl: schema.helpUrl,
  };
}

/**
 * 注册单个 Block
 */
export function registerBlock(schema: BlockSchema): void {
  const json = schemaToBlocklyJson(schema);
  Blockly.Blocks[schema.type] = {
    init: function() {
      this.jsonInit(json);
      // 应用默认值
      if (schema.defaults) {
        for (const [field, value] of Object.entries(schema.defaults)) {
          const f = this.getField(field);
          if (f) f.setValue(value);
        }
      }
    }
  };
}

/**
 * 批量注册 Block
 */
export function registerBlocks(schemas: BlockSchema[]): void {
  for (const schema of schemas) {
    registerBlock(schema);
  }
}

/**
 * 加载并注册所有 Schema
 */
export async function loadAndRegisterAllBlocks(): Promise<void> {
  // 动态导入所有 schema 文件
  const modules = import.meta.glob('../schema/**/*.json');
  const schemas: BlockSchema[] = [];
  
  for (const path in modules) {
    const module = await modules[path]() as { default: BlockSchema | BlockSchema[] };
    const data = module.default;
    if (Array.isArray(data)) {
      schemas.push(...data);
    } else {
      schemas.push(data);
    }
  }
  
  registerBlocks(schemas);
}
```

### 2. 代码生成器注册

```typescript
// src/blockly/registry/generatorRegistry.ts
import { javascriptGenerator, Order } from 'blockly/javascript';
import type { BlockSchema } from '../schema/types';
import * as preprocessors from './preprocessors';

/**
 * 从模板生成代码
 */
function generateCode(
  block: Blockly.Block,
  schema: BlockSchema
): string | [string, Order] {
  const { codeGen } = schema;
  let code = codeGen.template;
  
  // 替换字段值
  for (const arg of [...(schema.args0 || []), ...(schema.args1 || [])]) {
    if (arg.type.startsWith('field_')) {
      let value = block.getFieldValue(arg.name);
      
      // 应用预处理
      if (codeGen.preprocess?.[arg.name]) {
        const fn = preprocessors[codeGen.preprocess[arg.name]];
        if (fn) value = fn(value);
      }
      
      code = code.replace(`\${${arg.name}}`, value);
    }
  }
  
  // 替换输入值
  for (const arg of [...(schema.args0 || []), ...(schema.args1 || [])]) {
    if (arg.type === 'input_value') {
      const value = javascriptGenerator.valueToCode(block, arg.name, Order.NONE) || '""';
      code = code.replace(`\${${arg.name}}`, value);
    }
    if (arg.type === 'input_statement') {
      const statements = javascriptGenerator.statementToCode(block, arg.name);
      code = code.replace(`\${${arg.name}}`, statements);
    }
  }
  
  // 值块返回 tuple
  if (schema.output !== undefined) {
    return [code, codeGen.order ?? Order.ATOMIC];
  }
  
  return code;
}

/**
 * 注册单个生成器
 */
export function registerGenerator(schema: BlockSchema): void {
  javascriptGenerator.forBlock[schema.type] = function(block) {
    return generateCode(block, schema);
  };
}

/**
 * 批量注册生成器
 */
export function registerGenerators(schemas: BlockSchema[]): void {
  for (const schema of schemas) {
    registerGenerator(schema);
  }
}
```

### 3. 预处理函数

```typescript
// src/blockly/registry/preprocessors.ts

/**
 * 字符串预处理 - 转义特殊字符
 */
export function EvalString_pre(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

/**
 * 多行文本预处理
 */
export function EvalString_Multi_pre(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}

/**
 * ID 预处理 - 验证格式
 */
export function IdString_pre(str: string): string {
  if (str && !/^[a-zA-Z0-9_:-]+$/.test(str)) {
    throw new Error(`无效的 ID: ${str}`);
  }
  return str;
}

/**
 * 颜色预处理 - 验证格式
 */
export function ColorString_pre(str: string): string {
  if (str && !/^[0-9 ]+,[0-9 ]+,[0-9 ]+(,[0-9. ]+)?$/.test(str)) {
    throw new Error('颜色格式错误');
  }
  return str;
}

// ... 其他预处理函数
```

### 4. 导出

```typescript
// src/blockly/registry/index.ts
export { registerBlock, registerBlocks, loadAndRegisterAllBlocks } from './blockRegistry';
export { registerGenerator, registerGenerators } from './generatorRegistry';
export * as preprocessors from './preprocessors';
```

## 验收标准

- [ ] 能从 JSON Schema 正确注册 Block 定义
- [ ] 能从 JSON Schema 正确生成代码
- [ ] 预处理函数正确处理各类输入
- [ ] 支持动态加载 Schema 文件

## 测试用例

```typescript
// 测试注册
const testSchema: BlockSchema = {
  type: 'test_block',
  category: 'action',
  message0: '测试 %1',
  args0: [{ type: 'field_input', name: 'TEXT', text: '' }],
  previousStatement: null,
  nextStatement: null,
  colour: 160,
  tooltip: '测试块',
  helpUrl: '',
  codeGen: { template: '"${TEXT}"' }
};

registerBlock(testSchema);
registerGenerator(testSchema);

// 验证
expect(Blockly.Blocks['test_block']).toBeDefined();
expect(javascriptGenerator.forBlock['test_block']).toBeDefined();
```

## 后续步骤

完成注册器后，进入 [04-state-parser.md](./04-state-parser.md) 实现状态解析器。

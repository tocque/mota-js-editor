# 05 - Blockly State → 事件 JSON 代码生成

## 目标

实现从 Blockly Workspace 生成事件 JSON 数据。

## 说明

在 v12 中，代码生成主要通过 `javascriptGenerator` 实现。03-block-registry 已经覆盖了基本的代码生成注册。

本文档补充一些特殊情况和验证逻辑。

## 输出文件

```
src/blockly/generator/
├── index.ts           # 主入口
├── validation.ts      # 验证逻辑
└── postProcess.ts     # 后处理
```

## 实现

### 1. 主入口

```typescript
// src/blockly/generator/index.ts
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * 从 Workspace 生成事件 JSON
 */
export function generateEventJson(workspace: Blockly.Workspace): unknown {
  // 验证
  const validation = validateWorkspace(workspace);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // 生成代码
  const code = javascriptGenerator.workspaceToCode(workspace);
  
  // 转义处理
  const processed = postProcessCode(code);
  
  // 解析为对象
  try {
    return eval(`(${processed})`);
  } catch (e) {
    throw new Error(`代码解析失败: ${e.message}`);
  }
}

/**
 * 获取原始代码字符串（调试用）
 */
export function getRawCode(workspace: Blockly.Workspace): string {
  return javascriptGenerator.workspaceToCode(workspace);
}
```

### 2. 验证逻辑

```typescript
// src/blockly/generator/validation.ts
import * as Blockly from 'blockly';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 验证 Workspace
 */
export function validateWorkspace(workspace: Blockly.Workspace): ValidationResult {
  const topBlocks = workspace.getTopBlocks(false);
  
  // 检查入口方块数量
  if (topBlocks.length === 0) {
    return { valid: true }; // 空 workspace 是合法的
  }
  
  if (topBlocks.length > 1) {
    return { valid: false, error: '入口方块只能有一个' };
  }
  
  // 检查入口方块类型
  const entryBlock = topBlocks[0];
  const validEntryTypes = [
    'event_m', 'autoEvent_m', 'shop_m', 'level_m',
    'changeFloor_m', 'common_m', 'beforeBattle_m',
    'afterBattle_m', 'afterGetItem_m', 'afterOpenDoor_m',
    'firstArrive_m', 'eachArrive_m', 'commonEvent_m',
    'item_m', 'levelChoose_m', 'equip_m', 'floorImage_m',
    'doorInfo_m', 'faceIds_m', 'mainStyle_m', 'nameMap_m',
    'splitImages_m', 'floorPartition_m'
  ];
  
  if (!validEntryTypes.includes(entryBlock.type)) {
    return { valid: false, error: '入口方块类型错误' };
  }
  
  return { valid: true };
}

/**
 * 检查异步事件
 */
export function checkAsyncEvents(events: unknown[]): boolean {
  if (!Array.isArray(events)) return false;
  
  let hasAsync = false;
  
  for (const event of events) {
    if (typeof event !== 'object' || !event) continue;
    
    const obj = event as Record<string, unknown>;
    
    // 递归检查
    if (obj.type === 'if') {
      if (checkAsyncEvents(obj.true as unknown[]) || 
          checkAsyncEvents(obj.false as unknown[])) {
        return true;
      }
    }
    
    if (obj.type === 'while' || obj.type === 'dowhile') {
      if (checkAsyncEvents(obj.data as unknown[])) {
        return true;
      }
    }
    
    if (obj.type === 'choices') {
      const choices = obj.choices as Array<{ action: unknown[] }>;
      for (const choice of choices || []) {
        if (checkAsyncEvents(choice.action)) return true;
      }
    }
    
    // 检查 async 标记
    if (obj.async && 
        obj.type !== 'animate' && 
        obj.type !== 'function' && 
        obj.type !== 'text') {
      hasAsync = true;
    }
    
    // 等待事件会清除 async 标记
    if (obj.type === 'waitAsync' || obj.type === 'stopAsync') {
      hasAsync = false;
    }
  }
  
  return hasAsync;
}
```

### 3. 后处理

```typescript
// src/blockly/generator/postProcess.ts

/**
 * 后处理生成的代码
 */
export function postProcessCode(code: string): string {
  // 转义特殊字符
  code = code.replace(/\\(i|c|d|e|g|z)/g, '\\\\$1');
  
  // 移除尾部逗号
  code = code.replace(/,(\s*[}\]])/g, '$1');
  
  return code;
}

/**
 * 格式化输出
 */
export function formatOutput(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}
```

### 4. 特殊块处理

某些块需要特殊的代码生成逻辑：

```typescript
// src/blockly/generator/specialBlocks.ts
import { javascriptGenerator, Order } from 'blockly/javascript';

/**
 * 折叠/禁用块的处理
 */
export function registerCollapsedBlockHandler(): void {
  // 重写 blockToCode 以支持折叠块
  const originalBlockToCode = javascriptGenerator.blockToCode.bind(javascriptGenerator);
  
  javascriptGenerator.blockToCode = function(block, opt_thisOnly) {
    if (!block) return '';
    
    // 禁用的块：生成带 _disabled 标记的代码
    if (!block.isEnabled() && isCollapsibleBlock(block)) {
      const code = originalBlockToCode(block, true);
      if (typeof code === 'string') {
        // 在输出中添加 _disabled 标记
        return code.replace('{', '{"_disabled":true,');
      }
    }
    
    // 折叠的块：生成带 _collapsed 标记的代码
    if (block.isCollapsed() && isCollapsibleBlock(block)) {
      const code = originalBlockToCode(block, true);
      if (typeof code === 'string') {
        return code.replace('{', '{"_collapsed":true,');
      }
    }
    
    return originalBlockToCode(block, opt_thisOnly);
  };
}

function isCollapsibleBlock(block: Blockly.Block): boolean {
  const collapsibleTypes = [
    'text_0_s', 'text_1_s', 'text_2_s',
    'if_s', 'if_1_s', 'confirm_s', 'switch_s', 'choices_s',
    'for_s', 'forEach_s', 'while_s', 'dowhile_s',
    'wait_s', 'previewUI_s'
  ];
  return collapsibleTypes.includes(block.type);
}
```

## 验收标准

- [ ] 能从 Workspace 正确生成事件 JSON
- [ ] 验证逻辑正确检测错误情况
- [ ] 支持折叠/禁用块的特殊处理
- [ ] 异步事件检查正确

## 测试用例

```typescript
// 创建 workspace 并添加块
const workspace = new Blockly.Workspace();
const state = {
  type: 'event_m',
  inputs: {
    action_0: {
      block: {
        type: 'text_0_s',
        fields: { EvalString_0: '测试' }
      }
    }
  }
};
Blockly.serialization.workspaces.load({ blocks: { languageVersion: 0, blocks: [state] } }, workspace);

// 生成代码
const result = generateEventJson(workspace);

// 验证
expect(result).toEqual({
  data: ["测试"]
});
```

## 后续步骤

完成代码生成后，进入 [06-react-component.md](./06-react-component.md) 实现 React 组件。

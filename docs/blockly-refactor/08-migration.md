# 08 - 迁移和清理

## 目标

完成从旧系统到新系统的切换，清理旧代码。

## 迁移步骤

### 1. 验证功能对齐

在正式迁移前，需要验证新系统与旧系统功能对齐：

```typescript
// scripts/validateMigration.ts

/**
 * 对比测试
 * 用相同的事件数据，验证新旧系统生成的结果一致
 */
async function validateMigration() {
  const testCases = [
    // 简单文本
    [{ type: 'text', text: '你好世界' }],
    
    // 条件判断
    [{ type: 'if', condition: 'status:hp > 100', true: ['成功'], false: [] }],
    
    // 复杂嵌套
    [{
      type: 'choices',
      text: '选择',
      choices: [
        { text: '选项1', action: [{ type: 'setValue', name: 'flag:a', value: '1' }] }
      ]
    }],
    
    // ... 更多测试用例
  ];
  
  for (const testCase of testCases) {
    // 旧系统
    const oldXml = MotaActionFunctions.actionParser.parse(testCase, 'event');
    
    // 新系统
    const newState = parseEventEntry({ data: testCase });
    
    // 加载到 workspace 并生成代码
    const oldCode = generateWithOldSystem(oldXml);
    const newCode = generateWithNewSystem(newState);
    
    // 比较
    if (!deepEqual(oldCode, newCode)) {
      console.error('不一致:', testCase);
    }
  }
}
```

### 2. 更新 EventsEditor 组件

```tsx
// src/Workbench/EventsEditor/index.tsx
import { useRef, useCallback, useState } from 'react';
import { BlocklyWorkspace, BlocklyWorkspaceRef } from '@/blockly/components';
import { parseEventEntry } from '@/blockly/parser';
import { generateEventJson, validateWorkspace } from '@/blockly/generator';
import { useDoubleClick } from '@/blockly/features';

export function EventsEditor() {
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  const [code, setCode] = useState('');
  const [entryType, setEntryType] = useState('event');
  
  // 双击处理
  const { handleDoubleClick } = useDoubleClick(workspaceRef.current?.getWorkspace() || null);
  
  // 导入事件数据
  const handleImport = useCallback((id: string, data: unknown, type: string) => {
    setEntryType(type);
    const state = parseEventEntry(data, type);
    workspaceRef.current?.loadState(state);
  }, []);
  
  // 确认保存
  const handleConfirm = useCallback((keep?: boolean) => {
    const workspace = workspaceRef.current?.getWorkspace();
    if (!workspace) return;
    
    // 验证
    const validation = validateWorkspace(workspace);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }
    
    // 生成代码
    try {
      const eventJson = generateEventJson(workspace);
      // 保存到目标位置
      saveEventData(eventJson);
      
      if (!keep) {
        hide();
      } else {
        alert('保存成功！');
      }
    } catch (e) {
      alert('生成失败: ' + e.message);
    }
  }, []);
  
  // 代码变更
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);
  
  return (
    <div className="events-editor">
      <div className="toolbar">
        <button onClick={() => handleConfirm()}>确认</button>
        <button onClick={() => handleConfirm(true)}>应用</button>
        <button onClick={() => workspaceRef.current?.clear()}>取消</button>
        <input 
          type="text" 
          placeholder="搜索事件块..." 
          className="search-input"
        />
      </div>
      
      <div className="workspace-container">
        <BlocklyWorkspace
          ref={workspaceRef}
          entryType={entryType}
          onChange={handleCodeChange}
          onDoubleClick={handleDoubleClick}
        />
      </div>
      
      <textarea 
        className="code-area"
        value={code}
        readOnly
      />
    </div>
  );
}
```

### 3. 更新引用

更新所有引用旧 API 的地方：

| 旧 API | 新 API |
|--------|--------|
| `editor_blockly.import()` | `EventsEditor.import()` |
| `editor_blockly.confirm()` | 组件内部处理 |
| `editor_blockly.parse()` | `parseEventEntry()` |
| `MotaActionFunctions.actionParser.parse()` | `parseEventEntry()` |
| `MotaActionBlocks[type].xmlText()` | 不再需要 |

### 4. 清理旧代码

完成迁移后，删除以下文件：

```bash
# 旧 Blockly 相关
rm src/scripts/blockly.ts
rm src/scripts/editor_blockly.ts
rm src/scripts/editor_blocklyconfig.js
rm src/scripts/MotaActionParser.ts

# 旧 Converter 和 G4
rm public/_server/blockly/Converter.bundle.min.js
rm public/_server/MotaAction.g4

# 旧 Blockly 静态资源
rm -rf public/_server/blockly/

# 旧依赖
pnpm remove blockly-legacy
```

### 5. 更新 package.json

```json
{
  "dependencies": {
    "blockly": "12",
    // 移除 "blockly-legacy"
  }
}
```

### 6. 更新类型定义

```typescript
// src/vite-env.d.ts
// 移除旧的 editor_blockly 类型声明
// 添加新的类型声明
```

## 回滚计划

如果迁移出现问题，可以快速回滚：

```bash
# 恢复旧依赖
git checkout -- package.json
pnpm install

# 恢复旧代码
git checkout -- src/scripts/blockly.ts
git checkout -- src/scripts/editor_blockly.ts
git checkout -- src/scripts/editor_blocklyconfig.js
git checkout -- src/scripts/MotaActionParser.ts
```

## 验收标准

- [ ] 所有事件类型都能正确加载和保存
- [ ] 所有交互功能正常工作
- [ ] 性能没有明显下降
- [ ] 旧代码完全清理
- [ ] 无 TypeScript 错误
- [ ] 无控制台错误

## 注意事项

1. **数据兼容性**：事件 JSON 数据格式不变，只是内部表示变了
2. **渐进式切换**：可以先让新旧系统并行运行一段时间
3. **用户习惯**：UI 变化要最小化，避免影响用户使用

## 完成标志

当以下条件满足时，迁移完成：

- 新系统在生产环境稳定运行
- 旧代码已完全删除
- 文档已更新
- 无已知 bug

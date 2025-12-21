# Design Document: Table DataStore Refactor

## Overview

本设计重构 Table 组件的 DataStore 使用方式，解决以下问题：
1. DataStore 未被正确使用 - 仅在 TableBody 中调用一次，然后通过 props 传递
2. TableRowWrapper 导致组件层级复杂化
3. 外部编辑器绕过 checkRange 验证

重构后，TableRow 将直接访问 DataStore，TableRowWrapper 将被合并到 TableRow 中，checkRange 验证将在 TableRow 中统一处理。

## Architecture

### 当前架构（问题）

```
TableBody
  └── DataStore.useStore() ← 仅在这里调用一次
  └── renderNodes()
        └── TableRowWrapper (props: node, callbacks)
              └── 创建 handleChange, handleOpenExternalEditor, handleDoubleClick
              └── TableRow (props: 所有数据 + 回调)
                    └── handleValueChange (包含 checkRange)
```

问题：
- TableRowWrapper 中的 `setValue` 直接调用 `onValueChange`，绕过了 TableRow 的 `checkRange`
- DataStore 的 Context 优势未被利用

### 重构后架构

```
TableBody
  └── renderNodes()
        └── TableRow (props: node 数据)
              └── DataStore.useStore() ← 每个 TableRow 直接访问
              └── handleValueChange (统一的 checkRange 验证)
              └── handleDoubleClick
              └── handleOpenExternalEditor
```

优势：
- 每个 TableRow 直接访问 DataStore，无需 props 传递回调
- checkRange 验证在 TableRow 中统一处理，无论值来自直接输入还是外部编辑器
- 组件层级简化，移除 TableRowWrapper

## Components and Interfaces

### TableRow 组件（重构后）

```typescript
interface TableRowProps {
  /** 节点数据 */
  node: TableNode;
}

const TableRow: FC<TableRowProps> = ({ node }) => {
  // 直接从 DataStore 获取回调
  const { data, onValueChange, onAddItem, onDeleteItem, onOpenExternalEditor, editMode } = DataStore.useStore();
  
  // 统一的值变更处理（包含 checkRange 验证）
  const handleValueChange = useCallback((newValue: unknown) => {
    if (!checkRange(node.config, newValue)) {
      printe?.(node.field + ' : 输入的值不合要求');
      return;
    }
    onValueChange(node.field, newValue);
  }, [node.field, node.config, onValueChange]);
  
  // 打开外部编辑器 - 使用 handleValueChange 确保验证
  const handleOpenExternalEditor = useCallback((guid: string) => {
    if (onOpenExternalEditor !== noop) {
      onOpenExternalEditor(node.field, node.config._type, node.config, guid);
    } else {
      const getValue = (field: string) => getByFieldPath(data, field);
      // 关键：使用 handleValueChange 而不是直接调用 onValueChange
      const setValue = (field: string, value: unknown) => {
        if (!checkRange(node.config, value)) {
          printe?.(field + ' : 输入的值不合要求');
          return;
        }
        onValueChange(field, value);
      };
      openExternalEditor(node.field, node.config._type, node.config, guid, getValue, setValue);
    }
  }, [node, data, onValueChange, onOpenExternalEditor]);
  
  // 双击处理
  const handleDoubleClick = useCallback((guid: string) => {
    // ... editMode 逻辑
  }, [editMode, node, handleOpenExternalEditor, onAddItem, onDeleteItem]);
  
  // 渲染 UI
  return (
    <tr>
      {/* ... */}
    </tr>
  );
};
```

### TableBody 组件（简化后）

```typescript
const TableBody: FC = () => {
  const { rootNodes } = DataStore.useStore();
  return <>{renderNodes(rootNodes)}</>;
};

function renderNodes(nodes: TableNode[]): React.ReactNode {
  return nodes.map((node) => renderNode(node));
}

function renderNode(node: TableNode): React.ReactNode {
  if (node.isGap) {
    return (
      <GapRow key={node.id} field={node.field} shortField={node.shortField}>
        {node.children && renderNodes(node.children)}
      </GapRow>
    );
  }
  // 直接渲染 TableRow，不需要 Wrapper
  return <TableRow key={node.id} node={node} />;
}
```

### DataStore 接口（保持不变）

DataStore 的接口保持不变，继续提供：
- `rootNodes`: 表格节点树
- `gapFields`: 可折叠字段
- `data`: 数据对象
- `onValueChange`: 值变更回调
- `onAddItem`: 添加项回调
- `onDeleteItem`: 删除项回调
- `onOpenExternalEditor`: 外部编辑器回调
- `editMode`: 编辑模式

## Data Models

### TableNode（保持不变）

```typescript
interface TableNode {
  id: string;
  field: string;
  shortField: string;
  isGap: boolean;
  value?: unknown;
  config: FieldConfig;
  comment: string;
  shortComment?: string;
  children?: TableNode[];
}
```

### TableRowProps（简化）

```typescript
// 重构前
interface TableRowProps {
  field: string;
  shortField: string;
  value: unknown;
  config: FieldConfig;
  comment: string;
  shortComment?: string;
  onChange: (value: unknown) => void;
  onOpenExternalEditor?: (guid: string) => void;
  onDoubleClick?: (guid: string) => void;
}

// 重构后
interface TableRowProps {
  node: TableNode;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Unified checkRange Validation

*For any* value change attempt (whether from direct input or external editor), if `checkRange(config, value)` returns false, the value SHALL NOT be saved and an error message SHALL be displayed.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 2: Valid Values Are Saved

*For any* value change attempt where `checkRange(config, value)` returns true, the value SHALL be saved via the onChange callback.

**Validates: Requirements 3.1, 3.2**

## Error Handling

### Validation Errors

当 checkRange 验证失败时：
1. 调用全局 `printe()` 函数显示错误消息
2. 不调用 `onValueChange` 回调
3. 保持原有值不变

### External Editor Errors

当外部编辑器不可用时：
1. 在控制台输出警告
2. 不执行任何操作

## Testing Strategy

### Unit Tests

1. **TableRow 渲染测试**
   - 验证 TableRow 正确渲染节点数据
   - 验证不同字段类型的输入组件选择

2. **checkRange 验证测试**
   - 验证 _range 表达式正确执行
   - 验证 _select 值列表验证
   - 验证无验证规则时通过

### Property-Based Tests

使用 fast-check 进行属性测试：

1. **Property 1: Unified Validation**
   - 生成随机的 FieldConfig（包含 _range）
   - 生成随机值
   - 验证 checkRange 结果决定值是否被保存

2. **Property 2: Valid Values Saved**
   - 生成满足 _range 的值
   - 验证值被正确保存

### Integration Tests

1. **外部编辑器集成测试**
   - 模拟 editor_multi.open 回调
   - 验证 checkRange 被调用
   - 验证无效值被拒绝

2. **双击行为测试**
   - 验证不同 editMode 下的双击行为

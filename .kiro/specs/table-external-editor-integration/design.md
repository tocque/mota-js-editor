# Design Document

## Overview

本设计重构 CodeEditor 的对外接口，提供一个简洁现代化的 `open` 函数。核心思想是将业务逻辑（值解析、DOM 操作等）从 CodeEditor 中移出，让 CodeEditor 只关注编辑功能本身。

**设计原则：**
1. CodeEditor 提供简洁的 `open(initialValue, config, callbacks)` 接口
2. 调用方负责准备初始值和处理回调
3. 原有的 `editor_multi.import` 等 API 作为兼容层保留

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        调用方                                    │
├─────────────────────────────────────────────────────────────────┤
│  Table/openExternalEditor    │  Legacy (editor_table.ts)        │
│  - 准备 initialValue         │  - 通过 DOM 获取值                │
│  - 提供 onConfirm 回调       │  - 调用 editor_multi.import       │
│  - 调用 editor_multi.open    │                                   │
└─────────────────┬────────────┴──────────────────┬───────────────┘
                  │                               │
                  ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     editor_multi API                             │
├─────────────────────────────────────────────────────────────────┤
│  open(value, config, callbacks)  │  import(guid, args) [兼容层] │
│  - 新的简洁接口                   │  - 内部调用 open              │
│  - 纯回调驱动                     │  - 处理 DOM 读写              │
└─────────────────────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CodeEditor 组件                              │
├─────────────────────────────────────────────────────────────────┤
│  - 管理编辑器状态                                                │
│  - 处理用户交互（确认/取消/格式化）                              │
│  - 调用回调通知调用方                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. OpenConfig 接口

编辑器配置选项：

```typescript
interface OpenConfig {
  /** 是否启用语法检查 */
  lint?: boolean;
  /** 是否为字符串编辑模式 */
  isString?: boolean;
  /** 预览数据 */
  preview?: unknown;
  /** 滚动位置（用于恢复） */
  scrollTop?: number;
  /** 上下文标识（用于 legacy API 兼容） */
  contextId?: string;
}
```

### 2. OpenCallbacks 接口

编辑器回调函数：

```typescript
interface OpenCallbacks {
  /** 确认编辑时调用，传入编辑后的值 */
  onConfirm: (value: string) => void;
  /** 取消编辑时调用（可选） */
  onCancel?: () => void;
}
```

### 3. 新增 open 函数

CodeEditor 暴露的新接口：

```typescript
interface EditorMultiApi {
  // 新增：简洁的 open 接口
  open: (initialValue: string, config: OpenConfig, callbacks: OpenCallbacks) => void;
  
  // 保留：兼容层
  readonly id: string;
  import: (id: string, args: ImportArgs) => boolean;
  confirm: (keep?: boolean) => void;
  multiLineEdit: (...) => void;
  editCommentJs: (mod: string) => void;
}
```

### 4. 统一的 EditContext

`open` 函数内部创建一个通用的 `EditContext`，存储回调并在 confirm/cancel 时调用：

```typescript
// 在 CodeEditor 组件内部，open 函数的实现
function open(initialValue: string, config: OpenConfig, callbacks: OpenCallbacks): void {
  // 创建通用的 EditContext
  const context: EditContext = {
    id: config.contextId ?? 'open',
    confirm(keep?: boolean) {
      format();
      const value = getValue() || "";
      callbacks.onConfirm(value);
      if (!keep) {
        hide();
      } else {
        alert("写入成功！");
      }
    },
    cancel() {
      callbacks.onCancel?.();
      hide();
    },
  };

  // 设置上下文并打开编辑器
  contextRef.current = context;
  // ... 设置状态、显示编辑器等
}
```

### 5. Legacy API 通过 open 实现

所有 legacy 入口函数都通过调用 `open` 实现：

```typescript
// import (表格编辑)
function importFromTable(guid: string, args: ImportArgs): boolean {
  // 从 DOM 读取初始值
  const { initialValue, isString } = readFromDOM(guid, args);
  
  open(initialValue, { lint: args.lint, isString, contextId: guid }, {
    onConfirm: (value) => writeToDOM(guid, value, isString),
  });
  return true;
}

// multiLineEdit (Blockly 编辑)
function multiLineEdit(value: string, b: unknown, f: unknown, args: MultiLineArgs, callback: MultiLineCallback): void {
  const initialValue = value.split("\\n").join("\n");
  
  open(initialValue, { lint: args.lint, contextId: 'callFromBlockly' }, {
    onConfirm: (newValue) => callback(newValue, b, f),
  });
}

// editCommentJs (文件编辑)
function editCommentJs(mod: string): void {
  const filePath = COMMENT_FILE_PATHS[mod];
  
  // 先显示 loading，异步加载文件后更新
  open('loading', { lint: true, contextId: 'importFile' }, {
    onConfirm: (content) => writeFile(filePath, content),
  });
  
  // 异步加载文件内容
  loadFile(filePath).then(setValue);
}
```

### 5. 更新 openExternalEditor

## Data Models

### 编辑器状态

CodeEditor 内部状态保持不变：

```typescript
// React State
const [visible, setVisible] = useState(false);
const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
const [fontBold, setFontBold] = useState(false);
const [lintEnabled, setLintEnabled] = useState(false);
const [showPreview, setShowPreview] = useState(false);

// Refs
const contextRef = useRef<EditContext | null>(null);
const stateRef = useRef({
  isString: false,
  lintAutocomplete: false,
  preview: null as unknown,
});
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Open-Confirm Round Trip

*For any* initial value passed to `open`, if the user confirms without editing, the `onConfirm` callback SHALL receive the same value.

**Validates: Requirements 1.2, 1.3**

### Property 2: Value Transformation Consistency

*For any* value passed to `openExternalEditor`, the transformation to initial string and back to value on confirm SHALL preserve the semantic meaning (round-trip consistency for JSON values).

**Validates: Requirements 3.2, 3.3**

### Property 3: Cancel Does Not Trigger Confirm

*For any* edit session, if the user cancels, the `onConfirm` callback SHALL NOT be called.

**Validates: Requirements 1.4**

## Error Handling

1. **语法错误处理**: 当 `lint` 启用且代码有语法错误时，`confirm` 应显示警告并阻止保存
2. **回调缺失处理**: 当 `onCancel` 未提供时，取消操作应正常关闭编辑器而不报错
3. **值解析错误**: 当 JSON 解析失败时，应保持原始字符串值

## Testing Strategy

### 单元测试

1. **CallbackEditContext 测试**
   - 测试 confirm 调用 onConfirm 回调
   - 测试 cancel 调用 onCancel 回调
   - 测试 cancel 时 onCancel 未提供的情况

2. **openExternalEditor 测试**
   - 测试 textarea 类型调用 editor_multi.open
   - 测试值转换逻辑（字符串模式 vs 对象模式）

### 属性测试

使用 fast-check 进行属性测试：

1. **Round Trip Property**: 对于任意字符串值，open → confirm 应返回相同值
2. **Value Transformation Property**: 对于任意 JSON 值，转换为字符串再解析应得到等价值

### 集成测试

1. 测试 Table 组件与 CodeEditor 的完整交互流程
2. 测试 legacy API 的向后兼容性


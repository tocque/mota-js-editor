# Design Document: Table Fixes

## Overview

本文档描述 Table 组件和 TowerPanel 集成问题的修复设计。修复分为两部分：
1. **Part A**: Table 组件内部修复 - 样式、验证、工具函数
2. **Part B**: TowerPanel 集成修复 - 外部编辑器、即时保存、结构优化

## Architecture

### 修改文件清单

```
src/
├── components/
│   └── Table/
│       ├── components/
│       │   ├── Table.tsx              # 添加 etable 包装器
│       │   ├── TableRow.tsx           # 集成 _range 验证
│       │   └── inputs/
│       │       └── CheckboxInput.tsx  # 添加 checkbox class
│       └── utils/
│           ├── fieldPath.ts           # 新增：安全路径访问工具
│           └── index.ts               # 导出新工具
├── Workbench/
│   ├── TowerPanel/
│   │   └── index.tsx                  # 重构：即时保存、外部编辑器
│   └── components/
│       └── LeftTab.tsx                # 新增：可复用的 leftTab 组件
└── hooks/
    └── useActionList.ts               # 调整：用于防竞态而非批量保存
```

## Part A: Table 组件内部修复

### A1. 输入控件样式修复

**问题**: CheckboxInput 缺少 `checkbox` class

**修复**: 在 CheckboxInput 组件中添加 className

```tsx
// src/components/Table/components/inputs/CheckboxInput.tsx
export const CheckboxInput: FC<CheckboxInputProps> = (props) => {
  const { value, onChange, disabled = false } = props;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  }, [onChange]);

  return (
    <input
      type="checkbox"
      className="checkbox"  // 添加 class
      checked={value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
```

### A2. _range 验证集成到 Table 内部

**问题**: _range 验证在外部 handler 中，验证失败仍会触发 onChange

**设计**: 在 TableRow 组件内部进行验证，验证失败时：
1. 不触发 onValueChange 回调
2. 调用 printe 显示错误信息
3. 恢复输入框为原始值

**修改 TableRow.tsx**:

```tsx
// 在 TableRow 组件中添加验证逻辑
const handleValueChange = useCallback((newValue: unknown) => {
  // 验证 _range
  if (!checkRange(config, newValue)) {
    printe?.(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
    return; // 不触发 onChange
  }
  onChange(newValue);
}, [config, field, onChange]);
```

### A3. 安全的字段路径访问工具

**问题**: TowerPanel 使用 `new Function` 访问嵌套值，存在安全风险

**设计**: 创建 `getByFieldPath` 工具函数，使用 es-toolkit 的 `get` 函数

```typescript
// src/components/Table/utils/fieldPath.ts
import { get } from 'es-toolkit/compat';

/**
 * 将 field path 格式转换为 lodash path 格式
 * "['main']['floorIds']" => "main.floorIds"
 * "['autoEvent']['1,2']" => ["autoEvent", "1,2"]
 */
export function parseFieldPath(fieldPath: string): string | string[] {
  // 移除开头的 ['
  const trimmed = fieldPath.replace(/^\['/, '').replace(/'\]$/, '');
  // 按 '][' 分割
  const parts = trimmed.split("']['");
  
  // 如果所有部分都是合法的标识符，返回点分隔的字符串
  const isSimplePath = parts.every(p => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(p));
  if (isSimplePath) {
    return parts.join('.');
  }
  
  // 否则返回数组形式（支持特殊字符如 "1,2"）
  return parts;
}

/**
 * 根据 field path 从对象中获取值
 * @param obj 数据对象
 * @param fieldPath 字段路径，如 "['main']['floorIds']"
 * @returns 字段值
 */
export function getByFieldPath(obj: unknown, fieldPath: string): unknown {
  if (!fieldPath) return obj;
  const path = parseFieldPath(fieldPath);
  return get(obj, path);
}

/**
 * 获取父路径
 * "['main']['floorIds']" => "['main']"
 */
export function getParentFieldPath(fieldPath: string): string {
  return fieldPath.replace(/\[[^\[]*\]$/, '');
}
```

### A4. etable 包装器移入 Table 组件

**问题**: 外部代码需要手动包装 `div.etable`

**设计**: 在 Table 组件内部添加包装器

```tsx
// src/components/Table/components/Table.tsx
export const Table: FC<TableProps> = (props) => {
  // ...
  return (
    <div className="etable">
      <FoldStore.Provider>
        <DataStore.Provider argument={...}>
          <table>
            <thead><TableHeader /></thead>
            <tbody><TableBody /></tbody>
          </table>
        </DataStore.Provider>
      </FoldStore.Provider>
    </div>
  );
};
```

## Part B: TowerPanel 集成修复

### B1. 双击打开外部编辑器

**问题**: 双击功能丢失，guid 传递不正确

**分析原始代码**:
```javascript
// editor_table.js
editor_table.prototype.dblclickfunc = function (guid, obj, commentObj, thisTr, input, field, cobj, modeNode) {
    if (editor_mode.doubleClickMode === 'change') {
        if (cobj._type === 'event') editor_blockly.import(guid, { type: cobj._event });
        if (cobj._type === 'textarea') editor_multi.import(guid, { lint: cobj._lint, string: cobj._string, template: cobj._template, preview: cobj._preview });
        // ...
    }
}
```

**关键发现**: 
1. `guid` 是 DOM 元素的 id，由 `editor.util.guid()` 生成
2. 外部编辑器（editor_blockly, editor_multi）需要 guid 来定位 DOM 元素
3. `doubleClickMode` 由 Panel 中的按钮修改，可以从 `editor_mode` 中提取到 Panel 层维护

**设计**: 
1. TableRow 组件生成唯一 id 并设置到 tr 元素
2. 双击处理逻辑内部化到 Table 组件
3. 对外只暴露 `onValueChange`、`onAddItem`、`onDeleteItem` 接口
4. **在 Panel 层维护 `doubleClickMode` 状态**，使用 antd Segmented 组件切换

**修改 TableRow.tsx**:
```tsx
import { generateGuid } from '@/utils/json';

export const TableRow: FC<TableRowProps> = (props) => {
  // 使用 utils 中的 guid 生成函数
  const guid = useMemo(() => generateGuid(), []);
  
  // ...
  
  return (
    <tr id={guid} data-field={dataField} onClick={handleClick}>
      {/* ... */}
    </tr>
  );
};
```

**修改 Table 类型** - 简化 doubleClickMode 接口：
```typescript
export interface TableProps {
  data: Record<string, unknown>;
  commentObj: CommentObject;
  onValueChange?: (field: string, value: unknown) => void;
  onAddItem?: (field: string, id: string) => void;
  onDeleteItem?: (field: string) => void;
  /** 编辑按钮点击回调，传递 guid 用于外部编辑器 */
  onEditClick?: (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void;
  /** 双击模式：'change' 编辑 | 'add' 添加 | 'delete' 删除，受控属性 */
  doubleClickMode?: 'change' | 'add' | 'delete';
}
```

**双击处理逻辑** - 不再自动重置 mode：
```tsx
// 在 TableRowWrapper 中处理双击
const handleDoubleClick = useCallback(() => {
  const mode = doubleClickMode ?? 'change';
  
  if (mode === 'change') {
    // 正常编辑模式：调用编辑处理函数
    onEditClick(node.field, node.config._type, node.config, guid);
  } else if (mode === 'add') {
    // 添加模式：不再自动重置，由外部控制
    const parentPath = getParentFieldPath(node.field);
    const id = prompt('请输入新项的 ID');
    if (id) {
      onAddItem?.(parentPath, id);
    }
  } else if (mode === 'delete') {
    // 删除模式：不再自动重置，由外部控制
    if (!checkRange(node.config, null)) {
      printe?.(node.field + ' : 该值不允许为null，无法删除');
      return;
    }
    if (confirm('确定要删除吗？')) {
      onDeleteItem?.(node.field);
    }
  }
}, [node, doubleClickMode, onEditClick, onAddItem, onDeleteItem, guid]);
```
```

### B2. 修改后即时保存

**问题**: 当前设计需要手动点击保存按钮

**分析 actionList 的工作原理**:

```javascript
// editor_mode.js
editor_mode.prototype.addAction = function (action) {
    editor_mode.actionList.push(action);  // 入队
}

editor_mode.prototype.onmode = function (mode, callback) {
    if (editor_mode.mode != mode) {
        if (mode === 'save') editor_mode.doActionList(editor_mode.mode, editor_mode.actionList, callback);
        // ...
        editor_mode.actionList = [];  // 清空队列
    }
}

// editor_table.js - 值变更时
if (editor.table.checkRange(cobj, thiseval)) {
    editor_mode.addAction(['change', field, thiseval]);  // 入队
    editor_mode.onmode('save');  // 立即保存并清空队列
}
```

**actionList 的本质**:
1. 是一个修改队列
2. `addAction` 将操作入队
3. `onmode('save')` 将整个队列提交到文件系统，然后清空
4. 原始代码中每次值变更后都调用 `onmode('save')`，实现即时保存

**设计决策**: 
- 移除 `useActionList` hook，因为真正的队列机制应该在 `editor.file` 层实现，超出本方案 scope
- TowerPanel 直接调用 `save([action])` 实现即时保存

```tsx
// src/Workbench/TowerPanel/index.tsx
export const TowerPanel: FC = () => {
  const { towerData, isLoading, error, save } = TowerDataStore.useStore();

  // 值变更处理 - 即时保存
  const handleValueChange = useCallback(async (field: string, value: unknown) => {
    await save([['change', field, value]]);
  }, [save]);

  // 添加项处理 - 即时保存
  const handleAddItem = useCallback(async (field: string, id: string) => {
    // 验证 ID...
    const newField = field + "['" + id + "']";
    await save([['add', newField, null]]);
    printf?.('添加成功，刷新后生效。');
  }, [save, towerData]);

  // 删除项处理 - 即时保存
  const handleDeleteItem = useCallback(async (field: string) => {
    await save([['delete', field, undefined]]);
    printf?.('删除成功，刷新后生效。');
  }, [save]);

  // ...
};
```

### B3. TowerPanel 结构优化

**设计**: 创建可复用的 LeftTab 组件，内部集成加载和错误状态

```tsx
// src/Workbench/components/LeftTab.tsx
import type { FC, ReactNode } from 'react';

export interface LeftTabProps {
  /** 面板 ID，如 "left5" */
  id: string;
  /** 标题文本 */
  title: string;
  /** 标题栏右侧的操作按钮 */
  actions?: ReactNode;
  /** 面板内容 */
  children: ReactNode;
  /** 是否显示（控制 z-index 和 opacity） */
  visible?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 错误信息 */
  error?: string | null;
}

export const LeftTab: FC<LeftTabProps> = (props) => {
  const { id, title, actions, children, visible = false, loading = false, error = null } = props;

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return <div className="leftTabLoading">加载中...</div>;
    }
    if (error) {
      return <div className="leftTabError">加载失败: {error}</div>;
    }
    return children;
  };

  return (
    <div
      id={id}
      className="leftTab"
      style={visible ? undefined : { zIndex: -1, opacity: 0 }}
    >
      <h3 className="leftTabHeader">
        {title}
        {actions && <>&nbsp;&nbsp;{actions}</>}
      </h3>
      <div className="leftTabContent">
        {renderContent()}
      </div>
    </div>
  );
};
```

**重构后的 TowerPanel**:

```tsx
// src/Workbench/TowerPanel/index.tsx
import { useCallback, useState } from 'react';
import { Segmented } from 'antd';
import { LeftTab } from '../components/LeftTab';
import { Table, createEditClickHandler } from '@/components/Table';
import { TowerDataStore } from '@/stores/TowerDataStore';
import { getByFieldPath } from '@/components/Table/utils';
import { validateId } from '@/components/Table/utils/validation';

type DoubleClickMode = 'change' | 'add' | 'delete';

export const TowerPanel: FC = () => {
  const { towerData, isLoading, error, save } = TowerDataStore.useStore();
  
  // 在 Panel 层维护 doubleClickMode
  const [doubleClickMode, setDoubleClickMode] = useState<DoubleClickMode>('change');

  // 值变更处理 - 即时保存
  const handleValueChange = useCallback(async (field: string, value: unknown) => {
    await save([['change', field, value]]);
  }, [save]);

  // 添加项处理
  const handleAddItem = useCallback(async (field: string, id: string) => {
    // 验证 ID
    let existingKeys: string[] = [];
    if (towerData?.data) {
      const parentObj = getByFieldPath(towerData.data, field);
      if (parentObj && typeof parentObj === 'object') {
        existingKeys = Object.keys(parentObj);
      }
    }
    const validation = validateId(id, existingKeys, false);
    if (!validation.valid) {
      printe?.(validation.error || 'ID 无效');
      return;
    }
    
    const newField = field + "['" + id + "']";
    await save([['add', newField, null]]);
    printf?.('添加成功，刷新后生效。');
  }, [save, towerData]);

  // 删除项处理
  const handleDeleteItem = useCallback(async (field: string) => {
    await save([['delete', field, undefined]]);
    printf?.('删除成功，刷新后生效。');
  }, [save]);

  // 使用 createEditClickHandler 创建编辑处理函数
  const handleEditClick = createEditClickHandler({
    getValue: (field) => towerData?.data ? getByFieldPath(towerData.data, field) : undefined,
    setValue: handleValueChange,
  });

  const handleConfigure = () => {
    editor_multi?.editCommentJs?.('tower');
  };

  const actions = (
    <>
      <Segmented
        size="small"
        value={doubleClickMode}
        onChange={(value) => setDoubleClickMode(value as DoubleClickMode)}
        options={[
          { label: '编辑', value: 'change' },
          { label: '添加', value: 'add' },
          { label: '删除', value: 'delete' },
        ]}
      />
      &nbsp;&nbsp;
      <button onClick={handleConfigure}>配置表格</button>
    </>
  );

  return (
    <LeftTab
      id="left5"
      title="全塔属性"
      actions={actions}
      loading={isLoading && !towerData}
      error={error ? String(error) : null}
    >
      {towerData && (
        <Table
          data={towerData.data}
          commentObj={towerData.commentObj}
          onValueChange={handleValueChange}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onEditClick={handleEditClick}
          doubleClickMode={doubleClickMode}
        />
      )}
    </LeftTab>
  );
};
```

### 调整 createEditClickHandler

现有的 `createEditClickHandler` 实现与原始 `editor_table` 等效，只需要调整签名以支持 guid 参数：

**当前签名**:
```typescript
(field: string, type: FieldType | undefined, config: FieldConfig) => void
```

**调整后签名**:
```typescript
(field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void
```

**变更点**:
1. 返回函数增加 `guid` 参数
2. `event` 和 `textarea` 类型使用传入的 `guid` 而不是通过 `getGuid(field)` 获取
3. 移除 `getGuid` 选项（不再需要）

```typescript
// 调整后的实现
export function createEditClickHandler(
  options: EditClickHandlerOptions = {},
): (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void {
  const { getValue, setValue, getBoundingRect } = options;

  return (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => {
    switch (type) {
      case 'event': {
        const editorBlockly = getEditorBlockly();
        if (editorBlockly) {
          editorBlockly.import(guid, { type: config._event }); // 使用传入的 guid
        }
        break;
      }
      case 'textarea': {
        const editorMulti = getEditorMulti();
        if (editorMulti) {
          editorMulti.import(guid, { /* ... */ }); // 使用传入的 guid
        }
        break;
      }
      // material, color, point, popCheckboxSet 保持不变
      // 它们使用 getValue/setValue，不需要 guid
      // ...
    }
  };
}
```

**注意**: `material`, `color`, `point`, `popCheckboxSet` 的实现保持不变，它们通过 `getValue`/`setValue` 回调与数据交互，不需要直接操作 DOM。

## Data Models

### TableProps 更新

```typescript
export interface TableProps {
  data: Record<string, unknown>;
  commentObj: CommentObject;
  /** 值变更回调 - 仅在验证通过后触发 */
  onValueChange?: (field: string, value: unknown) => void;
  /** 添加项回调 */
  onAddItem?: (field: string, id: string) => void;
  /** 删除项回调 */
  onDeleteItem?: (field: string) => void;
  /** 编辑按钮点击回调，增加 guid 参数 */
  onEditClick?: (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void;
  /** 双击模式：'change' 编辑 | 'add' 添加 | 'delete' 删除，受控属性 */
  doubleClickMode?: 'change' | 'add' | 'delete';
}
```

### LeftTabProps

```typescript
export interface LeftTabProps {
  /** 面板 ID，如 "left5" */
  id: string;
  /** 标题文本 */
  title: string;
  /** 标题栏右侧的操作按钮 */
  actions?: ReactNode;
  /** 面板内容 */
  children: ReactNode;
  /** 是否显示（控制 z-index 和 opacity） */
  visible?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 错误信息 */
  error?: string | null;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do.*

### Property 1: 路径访问器正确性

*For any* 有效的嵌套对象和 field path，`getByFieldPath(obj, path)` 应返回与 `new Function('data', 'return data' + path)(obj)` 相同的值。

**Validates: Requirements 3.2**

### Property 2: _range 验证阻止无效值

*For any* 带有 `_range` 配置的字段，当输入值不满足 `_range` 表达式时，`onValueChange` 回调不应被调用。

**Validates: Requirements 2.1**

## Error Handling

1. **路径访问失败**: `getByFieldPath` 返回 `undefined`，不抛出异常
2. **_range 验证失败**: 调用 `printe` 显示错误，不触发 onChange
3. **外部编辑器不可用**: 在 console 输出警告，不影响其他功能

## Testing Strategy

### 单元测试

1. **fieldPath.ts 测试**
   - 测试 `parseFieldPath` 各种格式转换
   - 测试 `getByFieldPath` 嵌套访问
   - 测试特殊字符路径（如 `"1,2"`）

2. **checkRange 测试**
   - 测试各种 _range 表达式
   - 测试 _select 验证
   - 测试边界情况

### 属性测试

1. **Property 1**: 生成随机嵌套对象和路径，验证 `getByFieldPath` 结果正确
2. **Property 2**: 生成随机 _range 表达式和值，验证验证逻辑正确

### 集成测试

1. 验证 CheckboxInput 渲染正确的 class
2. 验证双击触发外部编辑器
3. 验证即时保存功能

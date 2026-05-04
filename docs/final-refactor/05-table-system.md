# 表格渲染系统迁移计划

## 现状

表格系统位于 `editor_table.ts`，负责将数据对象渲染为可编辑表格。

**注意**: 此模块已被 React Table 组件替代，以下记录仅供参考。

## 原有功能 (`editor_table.ts`)

**位置**: `src/scripts/editor_table.ts` (602 行)

### HTML 模板生成

| 函数 | 说明 |
|------|------|
| `select` | 下拉选择框 |
| `option` | 选项 |
| `text` | 文本输入 |
| `checkbox` | 复选框 |
| `textarea` | 文本域 |
| `checkboxSet` | 复选框组 |
| `editGrid` | 编辑按钮组 |
| `tr`, `title`, `gap` | 表格行结构 |

### 核心渲染逻辑

| 函数 | 说明 |
|------|------|
| `objToTable` | 对象转表格 HTML |
| `defaultcobj` | 默认注释对象 |
| `recursionParse` | 递归解析对象结构 |

### 事件绑定

| 函数 | 说明 |
|------|------|
| `listen` | 绑定表格事件 |
| `onFoldBtnClick` | 折叠按钮 |
| `onEditBtnClick` | 编辑按钮 |
| `onCommentBtnClick` | 注释按钮 |

## 已完成迁移

现使用 `src/components/Table/` 组件:

```
src/components/Table/
├── index.tsx
├── TableRow.tsx
├── editors/
│   ├── TextEditor.tsx
│   ├── NumberEditor.tsx
│   ├── BooleanEditor.tsx
│   ├── SelectEditor.tsx
│   ├── ArrayEditor.tsx
│   └── ObjectEditor.tsx
└── hooks/
    └── useTableData.ts
```

### 使用示例

```tsx
<DataTable
  data={floorData}
  schema={floorSchema}
  onChange={handleChange}
/>
```

## 遗留问题

1. `tokenPool` 折叠状态管理待优化
2. 复杂嵌套对象编辑体验待改进
3. 事件编辑器集成需完善

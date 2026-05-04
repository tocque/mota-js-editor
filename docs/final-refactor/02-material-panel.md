# 素材面板迁移计划

## 现状

素材面板逻辑位于 `editor_materialpanel.ts`，UI 仍使用原始 HTML。

## 待迁移功能清单

### 核心功能 (`editor_materialpanel.ts`)

**位置**: `src/scripts/editor_materialpanel.ts` (243 行)

| 功能 | 函数 | 说明 |
|------|------|------|
| 素材选择 | `material_ondown/move/up` | 点击选择素材 |
| 框选素材 | 拖拽逻辑 | tileset 框选 |
| 素材折叠 | `fold_material_click` | 折叠/展开模式 |
| 滚动条处理 | `getScrollBarHeight` | 兼容性处理 |

### 相关全局状态

```typescript
// 当前选中状态
selectBox: {
  _isSelected: boolean,
  isSelected(value?: boolean): boolean
}

// 素材信息
editor.info: {
  idnum: number,
  id: string,
  images: string,
  y: number,
  x?: number  // tileset
}
```

### 素材绘制初始化 (`editor.ts`)

| 功能 | 函数 | 说明 |
|------|------|------|
| 素材绘制 | `drawInitData` | 初始化素材区 canvas |
| 素材宽度记录 | `editor.widthsX` | 各素材类型位置映射 |

## 迁移策略

### 目标组件结构

```
src/Workbench/MaterialPanel/
├── index.tsx          # 主容器
├── MaterialCanvas.tsx # 素材渲染 canvas
├── SelectionBox.tsx   # 选中框组件
└── hooks/
    ├── useMaterialSelection.ts
    └── useMaterialDraw.ts
```

### Phase 1: 状态管理
创建 `stores/materialState.ts`:
- `selectedMaterial`: 当前选中素材
- `selectionBox`: 选择框状态
- `foldedMode`: 折叠状态

### Phase 2: Canvas 迁移
1. 将 `drawInitData` 迁移为独立渲染函数
2. 创建 `MaterialCanvas` 组件

### Phase 3: 交互迁移
1. 实现 `useMaterialSelection` hook
2. 处理素材选择、框选逻辑

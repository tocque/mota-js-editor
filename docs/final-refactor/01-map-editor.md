# 地图编辑区迁移计划

## 现状

地图编辑区 UI 框架已存在于 `src/MapEditor/index.tsx`，但核心逻辑仍在 legacy 代码中。

## 待迁移功能清单

### 1. 地图绘制核心 (`editor_mappanel.ts`)

**位置**: `src/scripts/editor_mappanel.ts` (1190 行)

| 功能 | 函数 | 优先级 |
|------|------|--------|
| 地图位置转换 | `eToLoc`, `locToPos` | P0 |
| 双击选中素材 | `map_doubleClick` | P1 |
| 绘制交互 | `map_ondown`, `map_onmove`, `map_onup` | P0 |
| 拖拽/框选 | 右键拖拽选区、左键画箭头 | P1 |
| 平铺绘制 | tileset 平铺模式 | P2 |
| 大地图模式 | `bigmap` 相关逻辑 | P2 |
| 视口控制 | `setViewport`, `viewportButtons_func` | P1 |
| 撤销/重做 | `undoFloor_click` | P1 |

### 2. 地图渲染 (`editor.ts`)

**位置**: `src/scripts/editor.ts` (1046 行)

| 功能 | 函数 | 说明 |
|------|------|------|
| 事件块渲染 | `drawEventBlock` | 显示事件标记 |
| 位置选择框 | `drawPosSelection` | 选中位置高亮 |
| 地图更新 | `updateMap` | 重绘地图 |
| 坐标标尺 | `buildMark` | 行列编号 |

### 3. 右键菜单 (`editor_mappanel.ts`)

| 功能 | 函数 |
|------|------|
| 显示菜单 | `showMidMenu` |
| 选择当前 | `chooseThis_click` |
| 复制/粘贴 | `copyLoc_click`, `pasteLoc_click` |
| 清除事件 | `clearEvent_click`, `clearLoc_click` |
| 绑定机关门 | `extraEvent_bindSpecialDoor` |

## 迁移策略

### Phase 1: 状态抽离
1. 创建 `stores/mapEditorState.ts`
2. 抽离 `brushMod`, `layerMod`, `pos`, `bigmap` 等状态

### Phase 2: Canvas 组件化
1. 创建 `MapCanvas` 组件封装 canvas 操作
2. 使用 React ref 管理 canvas context
3. 实现 `useMapInteraction` hook 处理交互

### Phase 3: 逻辑迁移
1. 将绘制函数迁移为 service 方法
2. 使用事件委托处理交互

# 地图编辑器重构概览

## 重构目标

将 `src/scripts/editor_mappanel.ts` 和 `src/scripts/editor_materialpanel.ts` 重构为 React 控制的组件形式。

## 现有代码结构

### 文件清单

| 文件 | 行数 | 职责 |
|------|------|------|
| `editor_mappanel.ts` | 1190 | 地图绘制区域交互 |
| `editor_materialpanel.ts` | 243 | 素材选择区域交互 |
| `src/MapEditor/index.tsx` | 208 | 已有的 React 组件骨架 |

### 架构关系

```
editor (全局对象)
├── dom.*           // DOM 元素引用
├── uifunctions.*   // UI 交互函数
├── uivalues.*      // 状态变量
├── info            // 当前选中素材
├── pos             // 当前选中坐标
├── layerMod        // 当前编辑层 (map/bgmap/fgmap)
├── brushMod        // 画笔模式 (line/rectangle/tileset/fill)
└── map/bgmap/fgmap // 三层地图数据
```

## 核心功能模块

### 地图绘制区 (MapPanel)

1. **绘图操作** - 线性/矩形/tileset平铺/填充
2. **选择操作** - 单点选中、区域选中、拖拽交换
3. **右键菜单** - 复制/粘贴/清除/绑定事件
4. **视口控制** - 大地图滚动、楼层切换

### 素材选择区 (MaterialPanel)

1. **素材展示** - 分类显示、折叠/展开
2. **选择交互** - 单选、拖拽多选
3. **最近使用** - 记录/显示常用素材

## 全局状态依赖

- `selectBox` - 全局变量，控制选择状态
- `editor_mode` - 模式切换
- `core.*` - 游戏核心数据

## 重构策略建议

1. **状态提升** - `uivalues.*` 用 src/utils/store 封装
2. **事件封装** - 鼠标交互转为 React 事件处理
3. **Canvas 管理** - 使用 useNode 管理 Canvas 元素
4. **渐进迁移** - 保持与旧代码的兼容层

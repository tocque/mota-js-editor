# 重构难点分析

## 1. 全局状态耦合

### 问题
- `selectBox` 作为 `window` 全局变量，在两个模块间共享
- `editor.info` / `editor.pos` 被多处读写
- `editor_mode.onmode()` 在各处调用触发模式切换

### 位置
- `editor_materialpanel.ts` L6-14: selectBox 初始化
- `editor_mappanel.ts` L110-114: 依赖 selectBox.isSelected()
- 随处: `editor.info = ...` 直接赋值

### 建议
- 创建 `MapEditorStore` (基于src/utils/store) 统一管理状态
- `selectBox.isSelected` → `useSelectedMaterial()`

---

## 2. 复杂的坐标转换

### 问题
- 大地图/普通模式下计算逻辑不同
- 折叠/展开模式下素材坐标映射不同
- 依赖 DOM offset、scroll 等动态值

### 位置
- `editor_mappanel.ts` L16-49: eToLoc, locToPos
- `editor_materialpanel.ts` L68-82: material_ondown 坐标计算
- `editor_materialpanel.ts` L120-158: widthsX 索引计算

### 建议
- 提取纯函数坐标转换模块 (考虑 src/utils/coordinate)
- 使用 ResizeObserver 监听容器尺寸变化

---

## 3. Canvas 绑定

### 问题
- 多个 Canvas 层 (ebm, efg, eui) 相互配合
- 直接操作 `editor.dom.euiCtx` 进行绘制
- 需要与 core 的 Canvas 系统兼容

### 位置
- `editor_mappanel.ts` L8-11: fillPos 绘制
- `editor_mappanel.ts` L180-200: 绘制箭头/选区
- `src/MapEditor/index.tsx` L35-37: Canvas 元素

### 建议
- 使用 `useRef` 管理 Canvas
- 抽取 `useMapCanvas` hook 封装绑定逻辑

---

## 4. 事件处理的副作用链

### 问题
- 一个事件触发多个副作用 (保存、刷新、提示等)
- 异步回调嵌套 (saveFloorFile callback)
- 需要同时更新 DOM 和数据

### 位置
- `editor_mappanel.ts` L291-371: map_onup 绘图完成
- `editor_mappanel.ts` L752-763: pasteLoc_click

### 建议
- 使用 `useEffect` 响应状态变化
- 异步操作使用 `async/await` 重构

---

## 5. 素材数据结构复杂

### 问题
- `widthsX` 结构不透明，硬编码索引
- `editor.ids` / `editor.indexs` 映射关系复杂
- autotile / tileset / 普通素材处理分支多

### 位置
- `editor_materialpanel.ts` L120-199: material_onup 分支逻辑

### 建议
- 定义清晰的 TypeScript 类型
- 抽取素材查找为独立模块

---

## 6. 移动端适配

### 问题
- `editor.isMobile` 分支散布各处
- touch 事件与 mouse 事件混用
- 部分功能在移动端禁用或变化

### 位置
- `editor_mappanel.ts` L20-21: isMobile 触摸坐标
- `editor_materialpanel.ts` L201-215: 移动端右键替代

### 建议
- 使用 pointer events 统一处理
- 移动端特有逻辑集中管理

---

## 7. 兼容层需求

### 现状
- `MapEditor/index.tsx` 已定义 JSX 结构
- 旧代码通过 `editor.dom.*` 获取 DOM
- `printf/printe/printi` 全局函数

### 位置
- `src/MapEditor/index.tsx` L16-27: printf 等全局函数注入

### 建议
- 如果确认是重构中可以去除全部引用的dom，可以直接干掉
- 保持 DOM ID 不变，渐进迁移
- 提供 `useEditorDom` hook 供旧代码过渡使用

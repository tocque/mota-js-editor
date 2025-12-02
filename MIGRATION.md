# 魔塔JS编辑器 - React迁移说明

## 概述

本项目已将原有的 `editor.html` 和 `editor-mobile.html` 迁移到 React + Ant Design 架构中，同时保留了所有原有功能和第三方库（Blockly、CodeMirror等）。

## 项目结构

```
src/
├── components/
│   └── Editor/
│       ├── EditorLayout.tsx          # 桌面端编辑器组件
│       ├── EditorLayout.css          # 桌面端样式
│       ├── EditorMobileLayout.tsx    # 移动端编辑器组件
│       ├── EditorMobileLayout.css    # 移动端样式
│       └── index.ts                  # 组件导出
├── hooks/
│   ├── useEditorScripts.ts           # 编辑器脚本加载 Hook
│   └── index.ts
├── utils/
│   ├── store/
│   │   ├── editorStore.ts            # Zustand 状态管理
│   │   └── index.ts
│   └── editorTemplate.ts             # HTML 模板加载工具
├── App.tsx                           # 主应用组件（包含路由）
├── App.css                           # 应用样式
├── main.tsx                          # 应用入口
└── index.css                         # 全局样式
```

## 主要功能

### 1. 状态管理 (`src/utils/store/editorStore.ts`)

使用 Zustand 管理编辑器的全局状态：
- 画笔模式（点、线、矩形、图块集）
- 图层模式（前景、事件、背景）
- 当前选择的楼层和图块
- 面板显示状态
- 移动端/桌面端标识

### 2. 脚本加载 (`src/hooks/useEditorScripts.ts`)

自动按顺序加载所有编辑器所需的脚本：
- 编辑器核心脚本（fs.js、editor_*.js）
- 游戏运行时库（lz-string、localforage、zip.js）
- Blockly 库及配置
- CodeMirror 编辑器
- 第三方工具（color picker、awesomplete等）

### 3. HTML 模板加载 (`src/utils/editorTemplate.ts`)

动态从原始 HTML 文件加载编辑器结构：
- `loadEditorHTML()`: 加载桌面端编辑器 HTML
- `loadMobileEditorHTML()`: 加载移动端编辑器 HTML

这样可以保持原有的 DOM 结构不变，确保现有脚本正常工作。

### 4. 路由配置

使用 React Router 管理页面路由：
- `/editor` - 桌面端编辑器
- `/editor-mobile` - 移动端编辑器
- `/` - 默认重定向到 `/editor`

## 关键设计决策

### 保留原有实现

1. **HTML 结构**: 通过动态加载原始 HTML 保持 DOM 结构不变
2. **CSS 样式**: 直接引用原有的 CSS 文件，不做修改
3. **JavaScript 逻辑**: 保留所有 `_server/editor_*.js` 脚本，按原顺序加载
4. **第三方库**: Blockly 和 CodeMirror 等库完全保留，不替换

### React 集成方式

1. **dangerouslySetInnerHTML**: 使用此方式注入原始 HTML，避免 React 重新渲染破坏 DOM 结构
2. **脚本加载时机**: 在组件挂载后才加载脚本，确保 DOM 已准备好
3. **顺序加载**: 使用 Promise 链确保脚本按正确顺序加载
4. **编辑器初始化**: 在所有脚本加载完成后调用 `editor.init()`

## 游戏运行时集成

原项目中的 `index.html` 和相关游戏运行时（libs/）文件保持不变：
- 游戏运行时脚本通过编辑器脚本加载
- 数据存取功能通过 `_server/fs.js` 和 Vite 插件提供
- 地图显示通过 canvas 元素实现

## 开发和构建

### 开发模式
```bash
pnpm dev
```
访问 http://127.0.0.1:3001/editor

### 生产构建
```bash
pnpm build
```

### 预览构建结果
```bash
pnpm preview
```

## 技术栈

- **React 19**: UI 框架
- **TypeScript**: 类型安全
- **Ant Design**: UI 组件库
- **Zustand**: 轻量级状态管理
- **React Router**: 路由管理
- **Vite**: 构建工具
- **原有库保留**:
  - Blockly: 可视化编程
  - CodeMirror: 代码编辑器
  - lz-string、localforage、zip.js: 数据处理

## 注意事项

1. **不要直接修改原始 HTML**: `public/editor.html` 和 `public/editor-mobile.html` 作为模板文件，修改需要重启开发服务器
2. **脚本加载顺序**: 如需添加新脚本，请在 `useEditorScripts.ts` 中按正确顺序添加
3. **CSS 样式**: 优先使用原有 CSS 类名，避免样式冲突
4. **全局变量**: 编辑器脚本使用全局 `editor` 对象，React 组件可通过 `(window as any).editor` 访问

## 迁移完成的功能

✅ 桌面端编辑器布局
✅ 移动端编辑器布局
✅ 状态管理系统
✅ 脚本动态加载
✅ 路由配置
✅ Blockly 集成
✅ CodeMirror 集成
✅ 原有 CSS 样式保留
✅ 文件系统 API（通过 Vite 插件）
✅ 游戏运行时集成

## 后续优化建议

1. 逐步将部分功能改写为 React 组件（可选）
2. 添加 TypeScript 类型定义给全局 `editor` 对象
3. 优化脚本加载性能（代码分割）
4. 添加更多的 Ant Design 组件增强 UI
5. 实现更好的移动端响应式设计

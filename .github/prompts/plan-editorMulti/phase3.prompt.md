## Plan: editor_multi 重构 Phase 3 - React 状态驱动

将 DOM 操作替换为 React 状态管理，使用 Context 和 Hooks 模式重构 CodeEditor 组件。

### Background

- Phase 2 已完成服务层封装
- 当前 index.tsx 仍依赖 `window.editor_multi` 全局调用
- 需要通过 `useEditor` 访问 `editor`，通过 `useGameData` 访问 `core`

### Steps

1. **创建状态 Store** `src/Workbench/CodeEditor/store/CodeEditorStore.ts`
   - 参考 `src/stores/EditorStore.tsx` 的 `createStore` 模式
   - 状态：`visible`, `editContext: { id, isString, lintAutocomplete, preview }`, `fontSize`, `fontBold`, `scrollPositions: Record<string, number>`
   - Actions：`show()`, `hide()`, `setEditContext()`, `setFontSize()`, `saveScrollPosition(id, offset)`, `getScrollPosition(id)`

2. **创建 CodeEditor Hook** `src/Workbench/CodeEditor/hooks/useCodeEditor.ts`
   - 管理 CodeMirror 实例生命周期（useRef + useEffect）
   - 使用 `useEditor` 获取 `editor` 全局变量
   - 使用 `useGameData` 获取 `core` 全局变量
   - 初始化时调用 Phase 2 的 TernService 构建定义

3. **创建 Lint 控制 Hook** `src/Workbench/CodeEditor/hooks/useLintControl.ts`
   - 管理 lint checkbox 状态与 CodeMirror lint 选项同步
   - 提供 `toggleLint()` 方法

4. **重构 CodeEditor 组件** `src/Workbench/CodeEditor/index.tsx`
   - 使用 `CodeEditorStore.Provider` 包裹
   - `visible` 状态驱动 `#left7` 的显示隐藏（CSS className 而非 style）
   - `fontSize`/`fontBold` 状态驱动字体设置
   - 将 `onChange` 事件绑定改为 React 事件处理

5. **更新 editor_multi.ts 使用 Store**
   - `show()` / `hide()` 改为调用 Store actions
   - 保留 `window.editor_multi` 的方法签名不变
   - 内部实现改为操作 Store 状态

6. **编写 Hook 单测** `src/Workbench/CodeEditor/__tests__/hooks.test.ts`
   - 使用 `@testing-library/react-hooks` 测试 custom hooks
   - Mock Store 和全局变量

### Acceptance Criteria

- [ ] `#left7` 显示/隐藏由 React 状态控制
- [ ] 字体大小/加粗由 React 状态控制
- [ ] lint checkbox 状态与 CodeMirror 选项同步
- [ ] `window.editor_multi.show/hide/confirm/cancel` 行为不变
- [ ] 外部模块调用方式不变
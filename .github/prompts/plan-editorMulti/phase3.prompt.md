## Plan: editor_multi 重构 Phase 3 - React 状态驱动与依赖清理

将 DOM 操作替换为 React 状态管理，使用 `useCurrentFn` 将状态操作暴露给 `window.editor_multi`。

### Background

- Phase 1 已完成纯函数提取（`codeTransformers`、`ternDefinitions`、`commands`）
- Phase 2 已完成工具函数迁移（`encoding`、`createTernServer`）
- 当前 index.tsx 仍依赖 `window.editor_multi` 全局调用
- `useCurrentFn` hook 可以将 React 组件内的函数暴露出去，外部调用时能访问最新状态
- 不需要 Store（只有一个组件，无跨组件通信需求）
- 不需要单独的 hooks 文件（逻辑不复杂，直接写在组件内）

### 核心思路

使用 `useCurrentFn` 解决 `window.editor_multi` 与 React 状态的交互：

```tsx
const [visible, setVisible] = useState(false);

const show = useCurrentFn(() => setVisible(true));
const hide = useCurrentFn(() => setVisible(false));

// 初始化时暴露给 editor_multi
useEffect(() => {
  window.editor_multi.show = show;
  window.editor_multi.hide = hide;
}, []);
```

### Steps

1. **重构 CodeEditor 组件状态** `src/Workbench/CodeEditor/index.tsx`
   - 添加 `visible` 状态控制显示隐藏
   - 添加 `fontSize`、`fontBold` 状态控制字体
   - 添加 `lintEnabled` 状态控制语法检查
   - 使用 CSS className 或条件渲染控制显示（不再用 inline style `z-index:-1;opacity:0`）

2. **使用 useCurrentFn 暴露方法**
   - `show()` - 使用 `useCurrentFn` 包装，内部调用 `setVisible(true)`
   - `hide()` - 使用 `useCurrentFn` 包装，内部调用 `setVisible(false)`
   - `setFontSize()` - 使用 `useCurrentFn` 包装
   - `toggleLint()` - 使用 `useCurrentFn` 包装
   - 在 `useEffect` 中将这些方法赋值给 `window.editor_multi`

3. **精简 editor_multi.ts**
   - 移除 `show()`、`hide()` 的 DOM 操作实现（改由组件提供）
   - 保留其他业务逻辑（`import`、`confirm`、`cancel` 等）
   - 使用 Phase 2 的 `encode64`/`decode64` 替代 `editor.util.encode64`/`decode64`
   - 使用 `defaultGuidGenerator` 替代 `editor.util.guid`

4. **替换 editor.util 依赖**
   - `editor.util.encode64` → `encode64` from `@/utils/encoding`
   - `editor.util.decode64` → `decode64` from `@/utils/encoding`
   - `editor.util.guid` → `defaultGuidGenerator` from `./utils/codeTransformers`

5. **编写组件测试** `src/Workbench/CodeEditor/__tests__/CodeEditor.test.tsx`
   - 测试 visible 状态切换
   - 测试 `window.editor_multi.show/hide` 调用后组件状态变化
   - Mock CodeMirror 和全局变量

### 不做的事情（避免过度设计）

- ❌ 不创建 Store - 只有一个组件，用 useState 足够
- ❌ 不创建单独的 hooks 文件 - 逻辑简单，直接写在组件内
- ❌ 不重构所有 DOM 操作 - `import`/`confirm` 涉及外部 DOM 元素（表格行），暂时保留

### Acceptance Criteria

- [ ] `visible` 状态控制组件显示/隐藏
- [ ] `fontSize`/`fontBold` 状态控制字体设置
- [ ] `lintEnabled` 状态与 CodeMirror lint 选项同步
- [ ] `window.editor_multi.show()` 调用后组件显示
- [ ] `window.editor_multi.hide()` 调用后组件隐藏
- [ ] 不再依赖 `editor.util.encode64`/`decode64`/`guid`
- [ ] 外部模块调用 `window.editor_multi.*` 行为不变
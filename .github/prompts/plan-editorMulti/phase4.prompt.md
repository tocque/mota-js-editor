## Plan: editor_multi 重构 Phase 4 - 模块整合与兼容层

整合前三个阶段的成果，重组文件结构，创建精简的兼容层，完成最终重构。

### Background

- Phase 1-3 已完成纯函数提取、服务封装、React 状态化
- 原 `editor_multi.ts` 仍包含大量业务逻辑
- 需保留 `window.editor_multi` 供外部模块调用

### Steps

1. **拆分业务逻辑** 至独立模块
   - `src/Workbench/CodeEditor/handlers/tableHandler.ts`: `import()`, `confirm()` 处理表格编辑
   - `src/Workbench/CodeEditor/handlers/blocklyHandler.ts`: `multiLineEdit()`, `multiLineDone()` 处理 Blockly 调用
   - `src/Workbench/CodeEditor/handlers/fileHandler.ts`: `importFile()`, `writeFileDone()`, `editCommentJs()` 处理文件编辑

2. **创建兼容层** `src/Workbench/CodeEditor/legacyApi.ts`
   - 导出与原 `window.editor_multi` 完全一致的接口
   - 内部委托给 services、store、handlers
   - 包含属性：`ternServer`, `codeEditor`, `id`, `isString`, `lintAutocomplete`, `preview`

3. **精简 editor_multi.ts**
   - 改为从各模块导入并组装
   - 仅负责初始化和挂载 `window.editor_multi`
   - 代码量目标：< 50 行

4. **更新 CodeEditor/index.tsx**
   - 使用 Phase 3 的 hooks 和 store
   - 移除对 `window.editor_multi` 的直接调用
   - 改用 props 或 context 传递回调

5. **创建集成测试** `src/Workbench/CodeEditor/__tests__/integration.test.ts`
   - 模拟外部模块调用 `window.editor_multi.import()`, `confirm()`, `cancel()`
   - 验证与原有行为一致

6. **更新文档** `docs/editor-modules.md`
   - 记录新的模块结构
   - 记录迁移指南（如有外部依赖方）

### Final Structure

src/Workbench/CodeEditor/
├── index.tsx # React 组件入口
├── editor_multi.ts # 精简初始化 + window 挂载
├── legacyApi.ts # 兼容层 API
├── types/
│ └── index.ts
├── config/
│ └── commands.ts
├── utils/
│ ├── ternDefinitions.ts
│ └── codeTransformers.ts
├── services/
│ ├── index.ts
│ ├── CodeEditorService.ts
│ ├── TernService.ts
│ ├── LintService.ts
│ ├── FormatterService.ts
│ └── FileService.ts
├── store/
│ └── CodeEditorStore.ts
├── hooks/
│ ├── useCodeEditor.ts
│ └── useLintControl.ts
├── handlers/
│ ├── tableHandler.ts
│ ├── blocklyHandler.ts
│ └── fileHandler.ts
└── tests/
├── codeTransformers.test.ts
├── ternDefinitions.test.ts
├── services.test.ts
├── hooks.test.ts
└── integration.test.ts

### Acceptance Criteria

- [ ] `editor_multi.ts` 代码量 < 50 行
- [ ] 所有外部调用 `window.editor_multi.*` 行为不变
- [ ] 所有单测通过
- [ ] 代码编辑器功能完整可用
- [ ] 无 TypeScript 编译错误

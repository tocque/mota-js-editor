## Plan: 重构 CodeEditor 移除 createLegacyApi

将 `createLegacyApi` 的逻辑直接内联到 CodeEditor 组件中，解决组件内部通过 `window.editor_multi` 调用自身方法的循环依赖问题。不创建额外的 store，因为这些状态仅在编辑器内部使用。

### Steps

1. 在 [src/Workbench/CodeEditor/index.tsx](src/Workbench/CodeEditor/index.tsx) 中内联 `createLegacyApi` 的逻辑：
   - 将 `setValue`, `getValue`, `format`, `hasError`, `setLint` 等函数定义在组件内部
   - 按钮事件（confirm, cancel, format 等）直接调用内部函数，不再通过 `window.editor_multi`
   - `window.editor_multi` 仅作为对外兼容层，在 useEffect 中构建并暴露

2. 将 `EditorMultiApi`、`CodeMirrorInstance` 等类型定义移至 [src/Workbench/CodeEditor/types.ts](src/Workbench/CodeEditor/types.ts)

3. 删除 [src/Workbench/CodeEditor/createLegacyApi.ts](src/Workbench/CodeEditor/createLegacyApi.ts) 和 [src/Workbench/CodeEditor/createLegacyApi.test.ts](src/Workbench/CodeEditor/createLegacyApi.test.ts)

### Further Considerations

1. **Handler 文件处理**：三个 handler 文件 (blocklyHandler, fileHandler, tableHandler) 保持独立，修改其依赖接口以接收组件内部的函数引用。

2. **测试策略**：`createLegacyApi.test.ts` 删除后无需补充测试，因为内联的逻辑是简单的状态管理和 UI 交互，不涉及复杂业务逻辑。

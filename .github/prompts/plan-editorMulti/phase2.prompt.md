## Plan: editor_multi 重构 Phase 2 - 服务层封装

将 CodeMirror、Tern、JSHint、Beautifier 的操作封装为独立服务类，提供清晰的 API 边界。此阶段**原模块仅添加 import 语句**，逻辑保持不变。

### Background

- Phase 1 已完成纯函数提取
- CodeMirror 依赖不更换
- 需要支持 `useEditor` 和 `useGameData` 的访问模式

### Steps

1. **创建 CodeMirror 服务** `src/Workbench/CodeEditor/services/CodeEditorService.ts`
   - 封装 CodeMirror 实例的创建和配置
   - 方法：`createEditor(element, options)`, `setValue(value)`, `getValue()`, `scrollTo(x, y)`, `getScrollInfo()`, `setOption(key, value)`, `getWrapperElement()`
   - 持有 CodeMirror 实例引用，对外隐藏实现细节

2. **创建 Tern 服务** `src/Workbench/CodeEditor/services/TernService.ts`
   - 封装 TernServer 初始化和文档管理
   - 方法：`init(defs)`, `addDoc(name, doc)`, `delDoc(name)`, `complete(cm)`, `updateArgHints(cm)`, `showDocs(cm)`, `jumpToDef(cm)`, `rename(cm)`
   - 使用 Phase 1 的 `buildTernDefinitions` 构建 defs

3. **创建 Lint 服务** `src/Workbench/CodeEditor/services/LintService.ts`
   - 封装 JSHint 检查逻辑
   - 方法：`hasErrors()`, `getErrors()`, `setEnabled(enabled)`
   - 配置 esversion: 2021

4. **创建格式化服务** `src/Workbench/CodeEditor/services/FormatterService.ts`
   - 封装 beautifier.js 调用
   - 方法：`format(code, options)` 返回格式化后的代码
   - 默认选项：`brace_style: "collapse-preserve-inline"`, `indent_with_tabs: true`

5. **创建文件操作服务** `src/Workbench/CodeEditor/services/FileService.ts`
   - 封装 `fs.readFile` 和 `fs.writeFile` 的 Promise 版本
   - 方法：`readFile(path)`, `writeFile(path, content)`
   - 使用 `editor.util.encode64` / `decode64` 处理编码

6. **创建服务导出索引** `src/Workbench/CodeEditor/services/index.ts`
   - 统一导出所有服务类

7. **编写服务层单测** `src/Workbench/CodeEditor/__tests__/services.test.ts`
   - Mock CodeMirror、JSHINT、beautifier 全局对象
   - 测试各服务类的核心方法

### Acceptance Criteria

- [ ] 服务类可独立实例化和测试
- [ ] 服务类不直接访问 DOM
- [ ] `editor_multi.ts` 仅在顶部添加 import，内部逻辑不变
- [ ] `window.editor_multi` 功能不受影响
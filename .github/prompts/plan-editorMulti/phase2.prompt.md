## Plan: editor_multi 重构 Phase 2 - 工具函数迁移与 Tern 工厂

迁移 `editor.util` 依赖到独立模块，创建 Tern 初始化工厂函数。此阶段**不创建服务类**，保持简洁。

### Background

- Phase 1 已完成纯函数提取（`codeTransformers`、`ternDefinitions`、`commands`）
- `fs.promises` 已存在于 `src/services/fs`，无需再封装
- CodeMirror/JSHINT/beautifier 的 API 已足够简洁，不需要额外封装层
- `editor.util.encode64`/`decode64`/`guid` 等函数需要迁移到 `src/utils`

### Steps

1. **迁移编码工具函数** `src/utils/encoding.ts`
   - `encode64(str: string): string` - Base64 编码（UTF-8 安全）
   - `decode64(str: string): string` - Base64 解码（UTF-8 安全）
   - 从 `editor.util` 提取实现逻辑，使其成为独立纯函数
   - 编写单测 `src/utils/__tests__/encoding.test.ts`

2. **创建 Tern 工厂函数** `src/Workbench/CodeEditor/utils/createTernServer.ts`
   - `createTernServer(coredef, CodeMirror)` - 简单工厂函数，不是服务类
   - 内部调用 `buildTernDefinitions` 构建定义
   - 返回初始化好的 TernServer 实例
   - 编写单测验证初始化逻辑

3. **更新 utils/index.ts 导出**
   - 添加 `createTernServer` 导出

4. **确认 GUID 生成器** 
   - Phase 1 已有 `defaultGuidGenerator` 在 `codeTransformers.ts`
   - 如果 `editor.util.guid` 有不同实现，评估是否需要统一

### 不做的事情（避免过度设计）

- ❌ CodeEditorService - 直接使用 CodeMirror API
- ❌ LintService - 直接使用 `JSHINT.errors.filter(...)`
- ❌ FormatterService - 直接使用 `beautifier.js(code, options)`
- ❌ FileService - 使用已有的 `src/services/fs`

### Acceptance Criteria

- [ ] `encode64`/`decode64` 可独立导入使用，不依赖 `editor` 全局变量
- [ ] `createTernServer` 工厂函数可正常创建 TernServer
- [ ] 所有新增函数有单测覆盖
- [ ] `editor_multi.ts` 暂不修改（Phase 3 再整合）
- [ ] `window.editor_multi` 功能不受影响
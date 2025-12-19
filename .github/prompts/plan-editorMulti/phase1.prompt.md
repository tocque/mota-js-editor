## Plan: editor_multi 重构 Phase 1 - 提取纯函数与单测

从 editor_multi.ts 提取不依赖 DOM/全局变量的纯函数，并为其编写单元测试，为后续重构建立安全网。此阶段**只新增文件，不修改原模块**。

### Background

- 原模块位于 `src/Workbench/CodeEditor/editor_multi.ts`（515行）
- 需要保持 `window.editor_multi` 可用
- 使用 Vitest 作为测试框架（参考 `src/fs/__tests__/fs.test.ts`）

### Steps

1. **创建类型定义文件** `src/Workbench/CodeEditor/types/index.ts`
   - 定义 `TernDefinition`、`CodeTransformOptions`、`EditContext` 接口
   - 定义 `commandsName` 的类型映射

2. **提取 Tern 定义构建逻辑** 至 `src/Workbench/CodeEditor/utils/ternDefinitions.ts`
   - 将 L57-L183 的 coredef 构建逻辑提取为 `buildTernDefinitions(core, functions, dataComment)` 函数
   - 该函数接收 `core`、`functions_d6ad677b...`、`data_comment_c456ea59...` 作为参数
   - 返回构建完成的 tern definitions 数组

3. **提取代码转换工具** 至 `src/Workbench/CodeEditor/utils/codeTransformers.ts`
   - `serializeWithFunctions(obj, indent)`: 将含 Function 的对象序列化为字符串（L328-340, L385-395）
   - `deserializeWithFunctions(str)`: 反序列化含函数字符串的对象
   - `escapeNewlines(str)` / `unescapeNewlines(str)`: 处理 `\n` 转换

4. **提取命令配置** 至 `src/Workbench/CodeEditor/config/commands.ts`
   - 导出 `commandsName` 对象和 `extraKeys` 配置（需要 codeEditor 参数化）
   - 导出 `COMMENT_FILE_PATHS` 字典（L469-L476）

5. **编写单元测试** `src/Workbench/CodeEditor/__tests__/codeTransformers.test.ts`
   - 测试 `serializeWithFunctions` 处理普通对象、含函数对象、嵌套结构
   - 测试 `deserializeWithFunctions` 的往返一致性
   - 测试边界情况：null、空字符串、特殊字符

6. **编写单元测试** `src/Workbench/CodeEditor/__tests__/ternDefinitions.test.ts`
   - Mock `core` 对象，测试 `buildTernDefinitions` 输出结构
   - 验证 enemys、bgms、sounds、animates、images 等分支处理

### Acceptance Criteria

- [ ] 所有新增文件可独立编译通过
- [ ] 单测覆盖率 > 80%
- [ ] `window.editor_multi` 功能不受影响
- [ ] 原 `editor_multi.ts` 无任何修改
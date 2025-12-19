## Plan: 重构 fs.ts 添加 Promise API

将 fs.ts 重构为类型安全的模块，保持现有回调 API 兼容性，同时新增 `fs.promises` 命名空间提供 Promise 风格的 API。参考 Node.js fs 模块设计。

### Background

1. 在 src/scripts/fs.ts 中有原先的 fs 实现

### Steps
1. 在项目中增设 src/services/fs/ 文件夹，并将 fs.ts 移动到该文件夹
2. 在文件夹下创建 `__tests__/fs.test.ts` 单测文件，使用 Vitest 固定原有 fs.ts 的 API 的行为（需先安装 vitest）
3. 重构：添加 TypeScript 类型定义、提取 `httpRequest` 和 `postData` 工具函数、统一错误处理，使用 fetch 替代 XMLHttpRequest，保证重构的 API 与原有 api 等价，重构过程中不得修改单测，因为那是原有 API 的行为。
4. 实现 `fs.promises` 命名空间，提供 `readFile`、`writeFile`、`writeMultiFiles`、`readdir`、`mkdir`、`moveFile`、`deleteFile` 的 Promise 版本
5. 将内部实现改为 Promise-first，回调 API 调用 Promise 版本实现（避免代码重复）
6. 将 AppendPicPanel 中 fs 的使用改为通过 import 引入，并使用 Promise 版本 api 替换当前使用的 callback 版本。

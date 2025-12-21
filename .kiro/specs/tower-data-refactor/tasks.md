# Implementation Plan: Tower Data Service Refactor

## Overview

将 `editor.file.editTower` 函数重构为独立的服务模块，实现读写分离、竞态处理和可复用的工具函数。使用 TypeScript 实现，遵循项目现有的代码风格。

## Tasks

- [x] 1. 创建工具函数模块
  - [x] 1.1 移动并扩展 fieldPath 工具函数
    - 将 `src/components/Table/utils/fieldPath.ts` 移动到 `src/utils/fieldPath.ts`
    - 更新 Table 组件中的导入路径
    - 新增 `setByFieldPath` 函数（设置嵌套值，自动创建中间对象）
    - 新增 `deleteByFieldPath` 函数（删除嵌套字段）
    - _Requirements: 5.4_
  - [x] 1.2 编写 fieldPath 新增函数的属性测试
    - **Property 3: 嵌套路径支持**
    - **Validates: Requirements 5.4**
  - [x] 1.3 实现 `applyAction` 和 `applyActions` 函数
    - 使用 `setByFieldPath` 和 `deleteByFieldPath`
    - 支持 `change`、`add`、`delete` 操作类型
    - 当值为 `undefined` 时删除字段
    - _Requirements: 5.2, 5.3, 2.3_
  - [x] 1.4 编写 `applyAction` 属性测试
    - **Property 1: change/add 操作设置值**
    - **Property 2: delete 操作删除字段**
    - **Validates: Requirements 5.2, 5.3, 2.3**
  - [x] 1.5 实现 `serializeToJsFile` 函数
    - 生成 `var varName = \n{json}` 格式的字符串
    - 使用 tab 缩进
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 1.6 编写 `serializeToJsFile` 属性测试
    - **Property 4: 序列化输出有效性**
    - **Validates: Requirements 6.4**
  - [x] 1.7 实现 `alertWhenCompress` 函数
    - 检查 `editor.useCompress` 状态
    - 首次检测时显示提醒并设置为 `'alerted'`
    - _Requirements: 6.1.1, 6.1.2, 6.1.3, 6.1.4_

- [x] 2. Checkpoint - 确保工具函数测试通过
  - 运行 `pnpm run test`，确保所有测试通过
  - 如有问题请询问用户

- [x] 3. 实现写入同步管理
  - [x] 3.1 实现 `createWriteExecutor` 工厂函数
    - 返回包含 `isWriting` 属性和 `exec` 方法的执行器对象
    - 内部使用 `isWriting` 和 `needsRewrite` 标志位
    - 每个执行器实例独立管理自己的状态
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 3.2 编写写入同步管理单元测试
    - 测试单次写入执行
    - 测试并发写入时的 flag 机制
    - 测试多个执行器实例相互独立
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 4. 实现核心读写函数
  - [x] 4.1 实现 `readTowerData` 函数
    - 从 `data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d` 读取数据
    - 合并 `main` 字段，缺失字段设为 `null`
    - 返回数据对象和注释配置
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 4.2 实现 `getCommentObject` 函数
    - 返回 `editor.file.dataComment` 对象
    - _Requirements: 3.1, 3.2_
  - [x] 4.3 实现 `writeTowerData` 函数
    - 应用 action 列表到数据对象
    - 调用 `alertWhenCompress`
    - 序列化并写入文件
    - 使用写入同步管理处理并发
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  - [x] 4.4 编写 `readTowerData` 和 `writeTowerData` 单元测试
    - 测试数据读取和 main 字段合并
    - 测试数据写入和序列化
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Checkpoint - 确保核心函数测试通过
  - 运行 `pnpm run test`，确保所有测试通过
  - 如有问题请询问用户

- [x] 6. 更新现有 towerDataService
  - [x] 6.1 更新 `fetchTowerData` 函数
    - 使用新的 `readTowerData` 实现
    - 保持相同的外部 API 行为
    - _Requirements: 7.1, 7.3_
  - [x] 6.2 更新 `saveActions` 函数
    - 使用新的 `writeTowerData` 实现
    - 保持相同的外部 API 行为
    - _Requirements: 7.2, 7.3_
  - [x] 6.3 编写集成测试验证 API 兼容性
    - 验证 `fetchTowerData` 返回格式
    - 验证 `saveActions` 行为
    - _Requirements: 7.3_

- [x] 7. Final Checkpoint - 确保所有测试通过
  - 运行 `pnpm run test`，确保所有测试通过
  - 如有问题请询问用户

## Notes

- 所有任务（包括测试任务）都是必需的
- 每个任务引用具体的需求以便追溯
- Checkpoint 用于增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况

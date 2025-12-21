# Implementation Plan: Table External Editor Integration

## Overview

重构 CodeEditor，提供统一的 `open` 函数作为底层接口，所有 legacy API 通过调用 `open` 实现。

## Tasks

- [x] 1. 定义新的类型接口
  - [x] 1.1 在 `src/Workbench/CodeEditor/contexts/types.ts` 中添加 `OpenConfig` 和 `OpenCallbacks` 接口
    - `OpenConfig`: lint, isString, preview, scrollTop, contextId
    - `OpenCallbacks`: onConfirm, onCancel
    - _Requirements: 1.1, 2.1, 2.2, 2.3_

  - [x] 1.2 更新 `src/Workbench/CodeEditor/types.ts` 中的 `EditorMultiApi` 接口
    - 添加 `open` 方法签名
    - _Requirements: 1.1_

  - [x] 1.3 更新 `src/types/legacy.ts` 中的 `EditorMulti` 接口
    - 添加 `open` 方法签名
    - _Requirements: 1.1_

- [x] 2. 实现 open 函数
  - [x] 2.1 在 `CodeEditor/index.tsx` 中实现 `open` 函数
    - 创建通用 EditContext（内联对象，存储 callbacks）
    - 设置编辑器状态并显示
    - confirm 时调用 onConfirm 回调
    - cancel 时调用 onCancel 回调
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 2.2 暴露 `open` 到 `legacyApi`
    - _Requirements: 1.1_

- [x] 3. 重构 legacy API 使用 open
  - [x] 3.1 重构 `importFromTable` 使用 `open`
    - 保留 DOM 读写逻辑作为回调
    - 调用 `open` 传入回调
    - _Requirements: 4.1, 4.4_

  - [x] 3.2 重构 `multiLineEdit` 使用 `open`
    - 将 Blockly 回调传给 `open`
    - _Requirements: 4.2, 4.4_

  - [x] 3.3 重构 `editCommentJs` 使用 `open`
    - 将文件读写逻辑作为回调
    - _Requirements: 4.3, 4.4_

- [x] 4. Checkpoint - 验证 legacy API
  - 确保 `editor_multi.import` 仍可正常工作
  - 确保 `editor_multi.multiLineEdit` 仍可正常工作
  - 确保 `editor_multi.editCommentJs` 仍可正常工作

- [x] 5. 更新 openExternalEditor
  - [x] 5.1 重构 `src/components/Table/legacy/externalEditor.ts` 中的 textarea 处理
    - 使用 `editor_multi.open` 替代 `editor_multi.import`
    - 准备 initialValue（处理字符串模式和对象模式）
    - 提供 onConfirm 回调调用 setValue
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.2 编写 openExternalEditor 单元测试
    - 测试 textarea 类型调用 open
    - 测试值转换逻辑
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 6. Checkpoint - 集成测试
  - 确保 Table 组件双击打开 CodeEditor 正常工作
  - 确保确认后值正确写回
  - 确保取消后值不变

- [x] 7. 清理旧代码
  - [x] 7.1 移除 `createHandler.ts` 中不再需要的 EditContext 类
    - 移除 `TableEditContext`、`BlocklyEditContext`、`FileEditContext` 类定义
    - 保留辅助函数（DOM 读写、文件读写等）
    - _Requirements: 1.5_

## Notes

- `open` 是唯一的底层接口，所有入口函数都通过它实现
- 向后兼容性是关键，确保 legacy API 继续工作
- EditContext 现在是内联对象，不再需要单独的类

# Implementation Plan: TableMeta Service Refactor

## Overview

将表格元数据配置文件（`*.comment.js`）的加载、保存逻辑重构为独立的服务模块，使用 React Query 实现响应式数据管理。

## Tasks

- [x] 1. 创建 TableMeta Service 核心模块
  - [x] 1.1 创建 `src/services/tableMeta/tableMetaService.ts`
    - 定义 `MetaFileKey` 类型和 `META_FILE_CONFIG` 配置
    - 实现 `loadTableMetaFile(key)` 函数
    - 实现 `saveTableMetaFile(key, content)` 函数
    - 实现 `parseTableMetaJs(content, varName)` 函数
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3_

  - [x] 1.2 编写 parseTableMetaJs 的属性测试
    - **Property 5: Parse Isolation**
    - **Validates: Requirements 6.2**

  - [x] 1.3 编写 loadTableMetaFile 的属性测试
    - **Property 1: Meta Object Loading**
    - **Property 2: Invalid Key Error**
    - **Validates: Requirements 1.1, 1.4**

- [x] 2. 创建底层 React Query Hook
  - [x] 2.1 创建 `src/services/tableMeta/useTableMetaFile.ts`
    - 实现 `useTableMetaFile(key)` hook
    - 使用 React Query 管理加载和缓存
    - 实现 mutation 用于保存
    - _Requirements: 1.1, 2.1, 3.1, 3.4_

  - [x] 2.2 编写 useTableMetaFile 的单元测试
    - 测试加载成功和失败场景
    - 测试保存后缓存更新
    - _Requirements: 1.1, 2.1, 3.4_

- [x] 3. Checkpoint - 确保底层服务测试通过
  - 确保所有测试通过，如有问题请询问用户

- [x] 4. 创建上层 Hooks
  - [x] 4.1 创建 `src/services/tableMeta/hooks/useTowerTableMeta.ts`
    - 基于 `useTableMetaFile` 实现
    - 解析并返回 CommentObject
    - _Requirements: 1.2, 5.1_

  - [x] 4.2 创建 `src/services/tableMeta/hooks/useObjectTableMeta.ts`
    - 实现 `useObjectTableMeta()` 返回完整结构
    - 实现 `useItemTableMeta()`、`useEnemyTableMeta()` 等上层 hooks
    - _Requirements: 1.2, 1.3_

  - [x] 4.3 创建 `src/services/tableMeta/index.ts` 导出模块
    - 导出所有公共 API
    - _Requirements: 6.1, 6.3_

- [x] 5. 创建编辑器 Hook
  - [x] 5.1 创建 `src/components/Table/hooks/useTableMetaEditor.ts`
    - 实现 `useTableMetaEditor(key)` hook
    - 集成 `editor_multi.open` 打开编辑器
    - 处理保存回调
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Checkpoint - 确保所有 hooks 测试通过
  - 确保所有测试通过，如有问题请询问用户

- [x] 7. 集成到 TowerPanel
  - [x] 7.1 更新 `src/Workbench/TowerPanel/index.tsx`
    - 使用 `useTowerTableMeta()` 获取元数据
    - 使用 `useTableMetaEditor()` 打开编辑器
    - 替换原有的 `editor.multi.editCommentJs('tower')` 调用
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，如有问题请询问用户

## Notes

- 每个任务引用具体需求以便追溯
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况

# Implementation Plan: Table DataStore Refactor

## Overview

重构 Table 组件的 DataStore 使用方式，将 TableRowWrapper 合并到 TableRow，并统一 checkRange 验证逻辑。

## Tasks

- [x] 1. 重构 TableRow 组件
  - [x] 1.1 修改 TableRow 接收 node prop 而不是展开的属性
    - 将 TableRowProps 简化为只接收 `node: TableNode`
    - 在组件内部从 node 解构所需属性
    - _Requirements: 2.1, 2.2_
  - [x] 1.2 在 TableRow 中直接调用 DataStore.useStore()
    - 获取 data, onValueChange, onAddItem, onDeleteItem, onOpenExternalEditor, editMode
    - _Requirements: 1.1_
  - [x] 1.3 将 TableRowWrapper 的回调逻辑移入 TableRow
    - 移入 handleOpenExternalEditor 逻辑
    - 移入 handleDoubleClick 逻辑（包含 editMode 判断）
    - _Requirements: 2.1, 2.2, 2.3_
  - [x] 1.4 统一 checkRange 验证
    - 修改 handleValueChange 确保验证
    - 修改 handleOpenExternalEditor 中的 setValue 使用带验证的逻辑
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 2. 简化 TableBody 组件
  - [x] 2.1 移除 TableRowWrapper 组件
    - 删除 TableRowWrapper 接口和组件定义
    - _Requirements: 2.4_
  - [x] 2.2 简化 renderNode 函数
    - 直接渲染 TableRow，传递 node prop
    - 移除 RenderCallbacks 接口
    - _Requirements: 1.2, 1.3, 2.4_

- [x] 3. 更新类型定义
  - [x] 3.1 更新 TableRowProps 类型
    - 简化为只包含 node 属性
    - 保留旧类型作为内部使用（如果需要）
    - _Requirements: 4.1_

- [x] 4. Checkpoint - 确保所有测试通过
  - 运行现有测试确保重构未破坏功能
  - 手动测试外部编辑器的 checkRange 验证

- [x] 5. 编写属性测试
  - [x] 5.1 编写 Property 1 测试：统一 checkRange 验证
    - **Property 1: Unified checkRange Validation**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [x] 5.2 编写 Property 2 测试：有效值保存
    - **Property 2: Valid Values Are Saved**
    - **Validates: Requirements 3.1, 3.2**

- [x] 6. 清理和文档
  - [x] 6.1 删除 docs/issues/external-editor-checkrange-bypass.md
    - 问题已修复，移除问题文档
  - [x] 6.2 更新相关注释
    - 确保代码注释反映新架构

## Notes

- 重构保持外部 API (TableProps) 不变，确保向后兼容
- checkRange 验证现在统一在 TableRow 中处理，无论值来源

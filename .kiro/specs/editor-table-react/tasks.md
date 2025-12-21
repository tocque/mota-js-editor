# Implementation Plan: Editor Table React Component

## Overview

将 `editor_table.ts` 重构为 React 组件，放置在 `src/components/Table` 目录下。采用树形数据结构，使用 Store 管理状态和回调。

## Tasks

- [x] 1. 创建基础类型定义和工具函数
  - [x] 1.1 创建 `src/components/Table/types.ts`
    - 定义 FieldType、FieldConfig、CommentObject、FieldArgs、TableNode 等类型
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 1.2 创建 `src/components/Table/utils/fieldPath.ts`
    - 实现字段路径解析函数 `parseFieldPath`
    - 实现短字段名提取函数 `getShortField`
    - _Requirements: 1.3_
  - [x] 1.3 创建 `src/components/Table/utils/validation.ts`
    - 实现 `checkRange` 函数，验证值是否在允许范围内
    - 实现 `validateId` 函数，验证新增项的 ID 格式
    - _Requirements: 3.2, 7.2, 7.3_
  - [x] 1.4 创建 `src/components/Table/utils/traversal.ts`
    - 实现 `buildTableTree` 函数，将 data + commentObj 转换为 TableNode 树
    - 实现默认 cobj 配置 `defaultCobj`
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 2. 创建 Store
  - [x] 2.1 创建 `src/components/Table/stores/FoldStore.ts`
    - 实现 `foldedFields: Set<string>` 状态
    - 实现 `toggleFold`、`foldAll`、`unfoldAll` 方法
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 2.2 创建 `src/components/Table/stores/DataStore.ts`
    - 使用 ParameterfulStore，接收参数：`data`、`commentObj`、`onValueChange`、`onAddItem`、`onDeleteItem`
    - 实现 `rootNodes: TableNode[]` 状态
    - 实现 `gapFields: string[]` 状态
    - 暴露回调供子组件使用
    - _Requirements: 1.1, 1.2, 3.4, 3.5_
  - [x] 2.3 创建 `src/components/Table/stores/index.ts`
    - 直接导出 FoldStore 和 DataStore（不合并）
    - _Requirements: 1.1_

- [x] 3. 创建 Hooks
  - [x] 3.1 创建 `src/components/Table/hooks/useFold.ts`
    - 实现 `useFold(field)` Hook，返回 `{ isFolded, toggleFold }`
    - 从 FoldStore 读取状态
    - _Requirements: 4.2, 4.3_
  - [x] 3.2 创建 `src/components/Table/hooks/useTableCallbacks.ts`
    - 实现 `useTableCallbacks()` Hook，返回 `{ onValueChange, onAddItem, onDeleteItem }`
    - 从 DataStore 读取回调
    - _Requirements: 3.4, 3.5_
  - [x] 3.3 创建 `src/components/Table/hooks/index.ts`
    - 导出所有 hooks
    - _Requirements: 1.1_

- [x] 4. 创建输入组件
  - [x] 4.1 创建 `src/components/Table/components/inputs/TextareaInput.tsx`
    - 支持 JSON 值显示和编辑
    - 支持 indent 缩进配置
    - 支持 disabled/readonly 状态
    - _Requirements: 2.1, 2.5_
  - [x] 4.2 创建 `src/components/Table/components/inputs/SelectInput.tsx`
    - 渲染下拉选择框
    - 支持 options 配置
    - _Requirements: 2.2_
  - [x] 4.3 创建 `src/components/Table/components/inputs/CheckboxInput.tsx`
    - 渲染单个复选框
    - _Requirements: 2.3_
  - [x] 4.4 创建 `src/components/Table/components/inputs/CheckboxSet.tsx`
    - 渲染复选框组
    - 支持 keys 和 prefixStrings 配置
    - 处理动态添加未知选项
    - _Requirements: 2.4_
  - [x] 4.5 创建 `src/components/Table/components/inputs/index.ts`
    - 导出所有输入组件
    - _Requirements: 2.1_

- [x] 5. 创建表格核心组件
  - [x] 5.1 创建 `src/components/Table/components/ActionButtons.tsx`
    - 根据 type 和 showComment 条件渲染按钮
    - 实现注释、编辑、复制按钮
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [x] 5.2 创建 `src/components/Table/components/TableHeader.tsx`
    - 渲染表格头部：条目、注释、值、操作
    - _Requirements: 1.2_
  - [x] 5.3 创建 `src/components/Table/components/TableRow.tsx`
    - 渲染叶节点行
    - 根据 config._type 选择对应的输入组件
    - 处理值变更和双击事件
    - _Requirements: 1.4, 2.1-2.10, 3.1, 6.1_
  - [x] 5.4 创建 `src/components/Table/components/GapRow.tsx`
    - 渲染分隔行
    - 使用 useFold Hook 管理折叠状态
    - 条件渲染 children
    - _Requirements: 1.5, 4.2, 4.3_
  - [x] 5.5 创建 `src/components/Table/components/TableBody.tsx`
    - 递归渲染 TableNode 树
    - 对 isGap 节点渲染 GapRow，否则渲染 TableRow
    - _Requirements: 1.3_

- [x] 6. 创建主表格组件
  - [x] 6.1 创建 `src/components/Table/components/Table.tsx`
    - 嵌套 FoldStore.Provider 和 DataStore.Provider
    - 将 props 传递给 DataStore.Provider
    - 组合 TableHeader 和 TableBody
    - _Requirements: 1.1, 1.2, 3.4, 3.5_
  - [x] 6.2 创建 `src/components/Table/index.tsx`
    - 导出 Table 组件和相关类型
    - _Requirements: 8.4_

- [x] 7. 实现外部编辑器集成（解耦设计）
  - [x] 7.1 扩展 TableProps 支持外部编辑器回调
    - 添加 `onEditClick?: (field: string, type: FieldType, config: FieldConfig) => void` prop
    - 添加 `onDoubleClick?: (field: string, type: FieldType, config: FieldConfig) => void` prop
    - 在 DataStore 中暴露这些回调
    - 在 TableRow 中调用这些回调
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [x] 7.2 创建外部集成辅助函数（组件外部使用）
    - 创建 `src/components/Table/legacy/valueChangeHandler.ts` 和 `src/components/Table/legacy/editClickHandler.ts`
    - 实现 `createValueChangeHandler` 函数，封装 `editor_mode.addAction` 和自动保存逻辑
    - 实现 `createEditClickHandler` 函数，根据类型调用对应编辑器
    - 这些函数在使用 Table 组件时传入，不耦合在组件内部
    - _Requirements: 3.2, 3.4, 9.1_

- [x] 8. Checkpoint - 确保所有组件可正常渲染
  - 确保所有组件无 TypeScript 错误
  - 如有问题请询问用户

- [x] 9. 编写测试
  - [x] 9.1 创建 `src/components/Table/utils/__tests__/traversal.test.ts`
    - **Property 1: Recursive Traversal Correctness**
    - **Validates: Requirements 1.3, 1.4, 1.5**
  - [x] 9.2 创建 `src/components/Table/utils/__tests__/validation.test.ts`
    - **Property 4: Validation Enforcement**
    - **Validates: Requirements 3.2, 3.3**
    - **Property 7: ID Validation for Add Operation**
    - **Validates: Requirements 7.2, 7.3**
    - **Property 8: Delete Validation**
    - **Validates: Requirements 7.4, 7.5**
  - [x] 9.3 创建 `src/components/Table/stores/__tests__/FoldStore.test.ts`
    - **Property 5: Fold State Consistency**
    - **Validates: Requirements 4.2, 4.3, 4.4**
  - [x] 9.4 额外测试（已完成）
    - `utils/__tests__/fieldPath.test.ts` - 字段路径解析测试
    - `components/inputs/__tests__/*.test.tsx` - 输入组件测试

- [x] 10. Final Checkpoint
  - 所有 233 个测试通过
  - Table 组件重构完成

## Notes

- 原有的 `editor_table.ts` 保留不动，后续再逐步替换引用
- 使用项目现有的 `src/utils/store` 中的 `mergeStore` 组合 Store

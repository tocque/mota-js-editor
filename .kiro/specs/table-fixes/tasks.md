# Implementation Plan: Table Fixes

## Overview

修复 Table 组件和 TowerPanel 集成问题，包括样式修复、验证集成、外部编辑器支持、即时保存和结构优化。

## Tasks

- [x] 1. Part A: Table 组件内部修复
  - [x] 1.1 修复 CheckboxInput 样式
    - 在 `src/components/Table/components/inputs/CheckboxInput.tsx` 添加 `className="checkbox"`
    - _Requirements: 1.1_
  
  - [x] 1.2 创建安全的字段路径访问工具
    - 在 `src/components/Table/utils/fieldPath.ts` 创建 `parseFieldPath` 和 `getByFieldPath` 函数
    - 使用 es-toolkit/compat 的 `get` 函数
    - 创建 `getParentFieldPath` 辅助函数
    - 更新 `src/components/Table/utils/index.ts` 导出新工具
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 1.3 集成 _range 验证到 TableRow
    - 修改 `src/components/Table/components/TableRow.tsx`
    - 在 onChange 回调前调用 `checkRange` 验证
    - 验证失败时调用 `printe` 显示错误，不触发 onChange
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 1.4 添加 etable 包装器到 Table 组件
    - 修改 `src/components/Table/components/Table.tsx`
    - 在最外层添加 `<div className="etable">` 包装器
    - _Requirements: 4.1_
  
  - [x] 1.5 为 TableRow 生成 guid
    - 修改 `src/components/Table/components/TableRow.tsx`
    - 使用 `generateGuid()` 生成唯一 id
    - 将 id 设置到 tr 元素
    - _Requirements: 5.7_

- [x] 2. 调整 Table 接口和双击处理
  - [x] 2.1 更新 TableProps 类型
    - 修改 `src/components/Table/types.ts`
    - 更新 `onEditClick` 签名增加 `guid` 参数
    - 添加 `doubleClickMode` prop
    - 移除 `onDoubleClick` prop
    - _Requirements: 5.1-5.6_
  
  - [x] 2.2 内部化双击处理逻辑
    - 修改 `src/components/Table/components/TableBody.tsx`
    - 在 TableRowWrapper 中实现双击处理
    - 根据 `doubleClickMode` 调用 `onEditClick`、`onAddItem` 或 `onDeleteItem`
    - _Requirements: 5.1-5.6_
  
  - [x] 2.3 更新 DataStore 传递新 props
    - 修改 `src/components/Table/stores/DataStore.ts`
    - 添加 `doubleClickMode` 到 store
    - _Requirements: 5.1-5.6_

- [x] 3. 调整 createEditClickHandler
  - [x] 3.1 更新函数签名
    - 修改 `src/components/Table/legacy/editClickHandler.ts`
    - 返回函数签名增加 `guid` 参数
    - 移除 `getGuid` 选项
    - _Requirements: 5.1-5.6_
  
  - [x] 3.2 移除 createDoubleClickHandler
    - 从 `src/components/Table/legacy/editClickHandler.ts` 移除
    - 更新 `src/components/Table/legacy/index.ts` 导出
    - 更新 `src/components/Table/index.tsx` 导出
    - _Requirements: 5.1-5.6_

- [x] 4. Checkpoint - 验证 Table 组件修复
  - 确保所有测试通过
  - 验证 CheckboxInput 样式正确
  - 验证 _range 验证生效
  - 如有问题请询问用户

- [x] 5. Part B: TowerPanel 集成修复
  - [x] 5.1 创建 LeftTab 可复用组件
    - 创建 `src/Workbench/components/LeftTab.tsx`
    - 实现 `loading` 和 `error` 状态处理
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 5.2 重构 TowerPanel
    - 修改 `src/Workbench/TowerPanel/index.tsx`
    - 使用 LeftTab 组件
    - 使用 Segmented 组件管理 doubleClickMode
    - 实现即时保存（直接调用 save）
    - 使用 createEditClickHandler
    - 移除 useActionList 使用
    - _Requirements: 5.1-5.6, 6.1, 6.2, 6.3, 7.1, 7.2_

- [x] 6. 清理和移除
  - [x] 6.1 移除 useActionList hook
    - 删除 `src/hooks/useActionList.ts`
    - 删除 `src/hooks/__tests__/useActionList.test.ts`
    - 更新相关导入
    - _Requirements: 6.2_
  
  - [x] 6.2 移除 TowerPanel 中的 etable 包装
    - 确认 Table 组件已包含 etable 包装器
    - 移除 TowerPanel 中的 `<div className="etable">` 包装
    - _Requirements: 4.2_

- [x] 7. Final Checkpoint - 验证完整功能
  - 验证 TowerPanel 正确显示数据
  - 验证即时保存功能
  - 验证双击编辑功能
  - 验证添加/删除功能
  - 验证 Segmented 模式切换
  - 如有问题请询问用户

## Notes

- 使用 `generateGuid()` 从 `src/utils/json` 生成唯一 id
- `doubleClickMode` 完全受控，不再自动重置
- 移除 `useActionList`，直接调用 `save([action])` 实现即时保存
- `createEditClickHandler` 已实现与原始 `editor_table` 等效的逻辑

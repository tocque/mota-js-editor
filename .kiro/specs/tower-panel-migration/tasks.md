# Implementation Plan: TowerPanel Migration

## Overview

将 TowerPanel 从 DOM 操作方式迁移为使用 `src/components/Table` React 组件。采用 React Query + Store + useActionList 架构，保持批量保存体验。

## Tasks

- [x] 1. 创建共享 QueryClient 模块
  - [x] 1.1 创建 `src/queryClient.ts`
    - 导出 `queryClient` 实例
    - 导出 `TOWER_QUERY_KEY` 常量
    - _Requirements: 4.1_
  - [x] 1.2 更新 `src/main.tsx`
    - 从 `queryClient.ts` 导入 `queryClient`
    - 添加 `QueryClientProvider`
    - _Requirements: 1.1_

- [x] 2. 创建 useActionList 公共 Hook
  - [x] 2.1 创建 `src/hooks/useActionList.ts`
    - 实现 `Action` 类型定义
    - 实现 `addChange`、`addAdd`、`addDelete`、`clear` 方法
    - 实现 `hasChanges` 计算属性
    - _Requirements: 2.1_
  - [x] 2.2 编写 useActionList 单元测试
    - 创建 `src/hooks/__tests__/useActionList.test.ts`
    - 测试 addChange 正确添加变更
    - 测试 addAdd 正确构建字段路径
    - 测试 clear 清空列表
    - _Requirements: 2.1_

- [x] 3. 创建 TowerDataService
  - [x] 3.1 创建 `src/services/tower/towerDataService.ts`
    - 实现 `TowerData` 类型定义
    - 实现 `fetchTowerData` 函数
    - 实现 `saveActions` 函数
    - _Requirements: 1.2, 2.2_
  - [x] 3.2 创建 `src/services/tower/index.ts`
    - 导出 service 函数和类型
    - _Requirements: 1.2_

- [x] 4. 创建 TowerDataStore
  - [x] 4.1 创建 `src/stores/TowerDataStore.ts`
    - 使用 `useQuery` 获取数据
    - 使用 `useMutation` 实现批量保存（接收外部传入的 actionList）
    - _Requirements: 1.2, 2.2_
  - [x] 4.2 更新 `src/stores/index.ts`
    - 将 `TowerDataStore` 添加到 `GlobalStore`
    - _Requirements: 1.1_

- [x] 5. 重构 TowerPanel 组件
  - [x] 5.1 重写 `src/Workbench/TowerPanel/index.tsx`
    - 使用 `TowerDataStore` 获取数据和保存方法
    - 使用 `useActionList` 管理修改列表
    - 使用 `Table` 组件渲染表格
    - 集成 legacy 处理函数（editClick, doubleClick）
    - 实现保存按钮状态显示（有修改时显示 *）
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.3, 3.1, 3.2, 3.3, 5.1, 5.2, 5.3_

- [x] 6. 修改 editor_mode.prototype.tower
  - [x] 6.1 修改 `src/scripts/editor_mode.ts` 中的 tower 函数
    - 导入 `queryClient` 和 `TOWER_QUERY_KEY`
    - 调用 `queryClient.invalidateQueries` 触发刷新
    - 保持 callback 参数行为一致
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 7. Checkpoint - 验证和测试
  - 验证 TowerPanel 正确显示数据
  - 验证批量保存功能（修改多个字段后点击保存）
  - 验证 editor_mode.tower() 刷新功能
  - 验证添加/删除功能
  - 如有问题请询问用户

## Notes

- `useActionList` Hook 可复用于其他面板（FloorPanel、EnemyItemPanel 等）
- 保持与原有系统的批量保存体验一致
- 每次修改添加到 actionList，点击保存时统一提交

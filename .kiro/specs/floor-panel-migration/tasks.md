# Implementation Plan: FloorPanel Migration

## Overview

将 FloorPanel 从 DOM 操作方式迁移为使用 `src/components/Table` React 组件。采用 React Query + TanStack Store + Service 架构，通过 floorId 参数显式指定操作对象。

## Tasks

- [x] 1. 安装依赖和创建基础设施
  - [x] 1.1 安装 @tanstack/store 和 @tanstack/react-store
    - 执行 `pnpm add @tanstack/store @tanstack/react-store`
    - _Requirements: 设计文档中的 TanStack Store 方案_
  - [x] 1.2 更新 `src/queryClient.ts` 添加 FLOOR_QUERY_KEY
    - 添加 `FLOOR_QUERY_KEY` 函数，接受 floorId 参数
    - _Requirements: 4.2_
  - [x] 1.3 创建 `src/stores/editorState.ts`
    - 创建 `editorStateStore` 管理 currentFloorId
    - 导出 `setCurrentFloorId` 函数
    - 导出 `useCurrentFloorId` hook
    - _Requirements: 设计文档中的 currentFloorId 同步机制_

- [x] 2. 创建 FloorDataService
  - [x] 2.1 创建 `src/services/floor/floorDataService.ts`
    - 实现 `fetchFloorData(floorId, commentObj)` 函数
    - 实现数据过滤逻辑（排除 map 和 loc 字段）
    - 实现 `saveActions(floorId, actions)` 函数
    - 实现 `saveFloorWithNewId(oldFloorId, newFloorId)` 函数
    - 实现 `writeFloorFile(floorId, floorData)` 内部函数
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 6.5_
  - [x] 2.2 创建 `src/services/floor/index.ts`
    - 导出 service 函数和类型
    - _Requirements: 3.1_
  - [x] 2.3 编写 FloorDataService 单元测试
    - 创建 `src/services/floor/__tests__/floorDataService.test.ts`
    - 测试 fetchFloorData 数据过滤逻辑
    - 测试 saveActions 参数传递
    - _Requirements: 3.5, 3.6_
  - [x] 2.4 编写 Property 1: Data Filtering 属性测试
    - **Property 1: Data Filtering**
    - **Validates: Requirements 3.5, 3.6**

- [x] 3. 创建 FloorDataStore
  - [x] 3.1 创建 `src/stores/FloorDataStore.ts`
    - 实现 `useFloorDataStore(props: { floorId: string })` hook
    - 使用 `useQuery` 获取楼层数据
    - 使用 `useFloorTableMeta` 获取 commentObj
    - 使用 `useMutation` 实现保存
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 4. Checkpoint - 验证数据层
  - 确保 FloorDataService 和 FloorDataStore 正确工作
  - 如有问题请询问用户

- [x] 5. 重构 FloorPanel 组件
  - [x] 5.1 重写 `src/Workbench/FloorPanel/index.tsx`
    - 使用 `useCurrentFloorId` 获取当前楼层 ID
    - 使用 `useFloorDataStore` 获取数据和保存方法
    - 使用 `Table` 组件渲染表格
    - 使用 `EditModeSegmented` 组件切换编辑模式
    - 使用 `useTableMetaEditor` 获取配置表格编辑器
    - 保留修改 floorId 功能
    - 保留修改地图大小功能
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3_
  - [x] 5.2 实现修改 floorId 功能
    - 实现 floorId 格式验证
    - 实现重复检测
    - 调用 FloorDataService.saveFloorWithNewId
    - 调用 TowerDataService 更新 floorIds
    - 更新内存状态
    - 更新 TanStack Store 状态
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8_
  - [x] 5.3 实现修改地图大小功能
    - 实现参数验证
    - 实现地图数据 resize 逻辑
    - 实现坐标转换逻辑
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 6. 修改 editor_mode.prototype.floor
  - [x] 6.1 修改 `src/scripts/editor_mode.ts` 中的 floor 函数
    - 导入 `setCurrentFloorId` 和 `queryClient`
    - 调用 `setCurrentFloorId` 更新 TanStack Store
    - 调用 `queryClient.refetchQueries` 刷新数据
    - 保持 callback 参数行为一致
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 7. Checkpoint - 集成测试
  - 验证 FloorPanel 正确显示数据
  - 验证编辑功能（修改字段值）
  - 验证 editor_mode.floor() 刷新功能
  - 验证修改 floorId 功能（无刷新）
  - 验证修改地图大小功能
  - 如有问题请询问用户

- [x] 8. 编写属性测试
  - [x] 8.1 编写 Property 2: FloorId Parameter Isolation 属性测试
    - **Property 2: FloorId Parameter Isolation**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.2, 4.5**
  - [x] 8.2 编写 Property 3: FloorId Validation 属性测试
    - **Property 3: FloorId Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [x] 8.3 编写 Property 4: Dimension Validation 属性测试
    - **Property 4: Dimension Validation**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  - [x] 8.4 编写 Property 5: Coordinate Transformation 属性测试
    - **Property 5: Coordinate Transformation**
    - **Validates: Requirements 7.4, 7.5, 7.6**

- [x] 9. Final Checkpoint
  - 确保所有测试通过
  - 如有问题请询问用户

## Notes

- FloorDataService 通过 floorId 参数显式指定操作对象，不依赖全局状态
- 使用 TanStack Store 管理 currentFloorId 同步
- 修改 floorId 功能实现无刷新更新
- 所有属性测试都是必需的，确保正确性


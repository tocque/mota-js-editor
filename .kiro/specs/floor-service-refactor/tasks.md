# Implementation Plan: Floor Service Refactor

## Overview

重构楼层服务，采用**双轨 API** 方案（命令式 API + Hooks API）：
- **FS 层**：FileHandler（内存数据源 + 异步落盘）+ FileHandlerManager（实例管理）
- **Services 层**：floorService（命令式 API，无 React 依赖）
- **Hooks 层**：useFloorData（React 绑定，位于 src/hooks/）
- **兼容层**：coreFloorsSync（保持 core.floors 同步，供遗留模块使用）

**核心理念**：
- 内存是真实数据源，文件只是持久化副本
- 命令式 API 为基底（Agent/脚本/测试可用），Hooks 为包装（React 组件用）
- 支持细粒度订阅（使用 computed 创建派生 signal）
- Hooks 层无业务逻辑，只是对 service 的包装

## Tasks

- [x] 1. FS 层基础 - FileHandler 核心
  - [x] 1.1 创建 `src/fs/FileHandler.ts`
    - 实现 FileHandler 类
    - 封装 content, isLoading, error, isDirty, isSaving 状态
    - 内置 WriteExecutor 处理写入队列
    - 使用 signal 管理状态（自动通知订阅者）
    - 实现 read(), update(), atomicUpdate(), reload(), retryPersist()
    - **关键**：update() 同步更新内存 + 异步落盘
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 1.2 创建 `src/fs/FileHandlerManager.ts`
    - 实现 FileHandlerManager 类（单例模式）
    - 实现 get(), has(), remove(), reload(), clear()
    - 确保同一文件路径只有一个 FileHandler 实例
    - _Requirements: 2.1, 2.4_

  - [x] 1.3 创建 `src/fs/useSignal.ts`
    - 实现 useSignal hook（通用 signal React 绑定）
    - 使用 useSyncExternalStore + effect
    - 支持任何 ReadonlySignal<T>
    - _Requirements: 1.1, 1.2_

  - [x] 1.4 编写 FileHandler 单元测试
    - 测试实例唯一性
    - 测试写入顺序性（并发写入串行化）
    - 测试同步更新内存 + 异步落盘
    - 测试 signal 自动通知机制
    - 使用 MemoryFileSystem（不依赖真实文件）
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 1.5* 创建 `src/fs/PersistenceMonitor.ts`（可选）
    - 实现全局落盘状态监控
    - 实现 watch(), unwatch(), getStatus(), hasUnsavedChanges()
    - 实现 onChange, onError, onAllSaved 事件
    - **可选功能**：可在后续阶段添加
    - _Requirements: 2.4_

- [x] 2. Services 层 - 命令式 API（核心）
  - [x] 2.1 创建 `src/services/floor/floorService.ts`
    - 实现 getFloor(floorId)
    - 实现 getFloorContent(floorId)
    - 实现 getHandler(floorId) - 返回 FloorDataHandler
    - 实现 saveFloor(floorId, actions)
    - 实现 batchSave(changes)
    - 实现 createFloor(floorId, options) - 创建新楼层
    - 实现 batchCreateFloors(floorIds, options) - 批量创建
    - 实现 deleteFloor(floorId) - 删除楼层
    - 实现 refetch(floorId) - 重新加载楼层数据
    - 实现 previewChanges(floorId, actions)
    - **不依赖 React**，可在任何环境使用
    - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2, 5.3_

  - [x] 2.2 创建 `src/services/floor/FloorDataHandler.ts`
    - 实现 FloorDataHandler 类（DataHandler 子类）
    - 实现 parse() 和 stringify() 方法
    - 使用 computed 自动追踪 FileHandler
    - _Requirements: 2.2_

  - [x] 2.3 实现楼层数据解析和序列化
    - 解析楼层文件内容为 FloorData
    - 序列化 FloorData 为文件内容
    - 应用 Action 到 FloorData
    - 生成初始楼层数据（createFloor 使用）
    - _Requirements: 2.2, 5.1_

  - [x] 2.4 编写 floorService 单元测试
    - 测试 getFloor, saveFloor, batchSave
    - 测试 createFloor, deleteFloor
    - 测试 getHandler 和 signal 访问
    - 测试 Action 应用逻辑
    - 使用 MemoryFileSystem
    - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.2_

- [x] 3. Hooks 层 - React 绑定
  - [x] 3.1 创建 `src/hooks/useFloor.ts`
    - 实现 useFloorData(floorId) - 返回 [Content<FloorData>, update]
    - **无业务逻辑**，只是对 floorService 的包装
    - 内部调用 floorService.getHandler()
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 编写 Hooks 集成测试
    - 测试 useFloorData 订阅和更新
    - 测试多个组件同时订阅
    - 测试细粒度订阅（手动 computed）
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Tower Service 重构
  - [x] 4.1 创建 `src/services/tower/towerService.ts`
    - 实现命令式 API（getTowerData, getHandler, saveTowerData）
    - 使用 FileHandler 读取 project/data.js
    - 实现 refetch() 重新加载
    - **不依赖 React**，可在任何环境使用
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.2 创建 `src/services/tower/TowerDataHandler.ts`
    - 实现 TowerDataHandler 类（DataHandler 子类）
    - 实现 parse() 和 stringify() 方法
    - 使用 computed 自动追踪 FileHandler
    - _Requirements: 2.2_

  - [x] 4.3 创建 `src/hooks/useTower.ts`
    - 实现 useTowerData() - 返回 [Content<TowerData>, update]
    - **无业务逻辑**，只是对 towerService 的包装
    - 内部调用 towerService.getHandler()
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 4.4 编写 towerService 单元测试
    - 测试 getTowerData, saveTowerData
    - 测试 getHandler 和 signal 访问
    - 测试 Action 应用逻辑
    - 测试 firstData.floorId 验证逻辑
    - 使用 MemoryFileSystem
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 5. TableMeta Service 重构
  - [x] 5.1 创建 `src/services/tableMeta/tableMetaService.ts`
    - 实现命令式 API（getTableMeta, getHandler）
    - 使用 FileHandler 读取元数据文件
    - _Requirements: 4.3_

  - [x] 5.2 创建 `src/hooks/useTableMeta.ts`
    - 实现 useTableMeta() - 完整元数据
    - 实现 useFloorTableMeta() - 只订阅 floor 子对象
    - 实现 useLocTableMeta() - 只订阅 loc 子对象
    - **无业务逻辑**，只是对 tableMetaService 的包装
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.3_

- [x] 6. 业务功能 - 楼层文件操作
  - [x] 6.1 实现 floorService 中的楼层管理功能
    - formatMap 函数（格式化地图数据）
    - generateInitialFloorData 函数（生成初始楼层数据）
    - addToFloorIds / removeFromFloorIds（管理楼层 ID 列表）
    - **已整合到 floorService.ts 中**
    - _Requirements: 5.1, 5.2, 5.3, 5.7_

  - [x] 6.2 编写楼层管理功能单元测试
    - 测试 formatMap 格式化正确性
    - 测试 createFloor 数据完整性
    - 测试 batchCreateFloors 批量创建
    - 测试 deleteFloor 清理逻辑
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 7. 兼容层 - core.floors 同步
  - [x] 7.1 创建 `src/services/floor/coreFloorsSync.ts`
    - 实现 setupCoreFloorsSync()
    - 实现 addFloorSync(floorId)
    - 实现 removeFloorSync(floorId)
    - 实现 stopCoreFloorsSync()
    - **关键**：订阅 FileHandler，同步更新 core.floors（无延迟）
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 7.2 编写 coreFloorsSync 集成测试
    - 测试 floorService.saveFloor() 后 core.floors 立即更新
    - 测试同步更新（不是异步）
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. 集成测试 - Agent 和 UI 同步
  - [x] 8.1 编写 Agent → UI 同步测试
    - Agent 调用 floorService.saveFloor()
    - 验证 useFloorData hook 自动收到更新
    - 验证 UI 组件重渲染
    - **验证双轨 API 状态同步**
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 8.2 编写并发写入测试
    - 测试不同楼层并行写入
    - 测试同一楼层串行写入
    - 验证写入顺序性
    - _Requirements: 2.4_

- [x] 9. UI 层适配
  - [x] 9.1 更新 FloorDataStore
    - 评估是否可以简化或移除 FloorDataStore
    - 如需保留，适配为使用 useFloorData
    - 移除 React Query 相关代码
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 9.2 更新 MapPanel 使用新的 floor service
    - 更新创建楼层功能使用 `floorService.createFloor()`
    - 更新批量创建使用 `floorService.batchCreateFloors()`
    - 更新删除楼层功能使用 `floorService.deleteFloor()`
    - _Requirements: 5.4, 5.5, 5.6_

  - [x] 9.3 更新 TowerPanel 使用新的 tower service
    - 更新全塔属性编辑功能使用 `towerService.saveTowerData()`
    - 使用 `useTowerData()` hook
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 10. 清理和迁移
  - [x] 10.1 删除 `src/fs/maps.ts`
    - 确保所有功能已迁移到 `floorService.ts`
    - _Requirements: 4.4_

  - [x] 10.2 更新导出和索引文件
    - 更新 `src/fs/index.ts`
    - 更新 `src/services/floor/index.ts`
    - 更新 `src/services/tower/index.ts`
    - 更新 `src/services/tableMeta/index.ts`
    - 更新 `src/hooks/index.ts` - 统一导出所有 hooks
    - _Requirements: 1.1, 1.2_

- [x] 11. Final Checkpoint - 确保所有测试通过
  - 运行完整测试套件：555 passed, 7 skipped
  - 确保所有功能正常工作
  - 验证 Agent 和 UI 同步
  - 验证 core.floors 同步

- [ ] 12.* Agent 工具层（未来扩展，可选）
  - [ ] 12.1* 创建 `src/agent/tools/floorTools.ts`
    - 实现 get_floor 工具
    - 实现 update_floor 工具
    - 实现 list_floors 工具
    - 实现 create_floor 工具
    - **未来扩展**：当前重构不强制要求

  - [ ] 12.2* 创建 `src/agent/tools/index.ts`
    - 实现工具注册表
    - 实现 getToolSchemas() 导出 function calling schema
    - 实现 executeTool() 执行工具调用
    - **未来扩展**：当前重构不强制要求

  - [ ] 12.3* 编写 Agent 工具集成测试
    - 测试工具调用是否正确
    - 测试 UI 是否自动同步
    - **未来扩展**：当前重构不强制要求

## Notes

### 核心架构
- **四层架构**：UI Layer → Hooks Layer → Services Layer → FS Layer
- **双轨 API**：命令式 API（floorService）为基底，Hooks API（useFloorData）为包装
- **Hooks 层无业务逻辑**：只是对 service 的包装，所有业务逻辑在 Services 层
- **内存数据源**：FileHandler.content 是真实数据，文件只是持久化副本
- **同步更新 + 异步落盘**：update() 立即更新内存并通知订阅者，然后异步写入文件
- **细粒度订阅**：使用 computed 创建派生 signal，只在关心的数据变化时触发更新

### 写入隔离
- 每个文件路径对应一个 FileHandler 实例（FileHandlerManager 保证）
- 每个 FileHandler 内置 WriteExecutor，自然实现写入隔离
- 不同楼层并行写入，同一楼层串行写入

### 兼容性
- **coreFloorsSync**：保持 core.floors 同步，供遗留模块使用（同步更新，无延迟）
- **FloorDataStore**：过渡期保留，适配新 API
- **完全重构后**：可移除 coreFloorsSync 和 FloorDataStore

### 可选功能
- **PersistenceMonitor**（任务 1.5）：全局落盘状态监控，可后续添加
- **Agent 工具层**（任务 11）：未来扩展，当前重构不强制要求

### 测试策略
- **单元测试**：FileHandler, floorService, 解析/序列化函数
- **集成测试**：Agent → UI 同步，并发写入，coreFloorsSync
- **使用 MemoryFileSystem**：不依赖真实文件系统
- **属性测试**：并发写入顺序性，数据一致性

### React 18 兼容
- 使用 useSyncExternalStore 确保并发模式兼容
- 自动处理订阅和清理

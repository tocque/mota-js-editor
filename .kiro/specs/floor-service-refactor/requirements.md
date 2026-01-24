# Requirements Document

## Introduction

当前楼层数据管理系统存在以下问题，阻碍了编辑器功能的扩展和 AI Agent 的集成：

### 问题 1: 编辑后的变更难以追踪和同步

当前系统在处理数据编辑时存在以下困难：
- 文件修改后，UI 组件无法自动感知变化，需要手动刷新
- 多个组件同时编辑同一楼层时，缺乏统一的状态管理
- 并发写入同一文件时，缺乏有效的冲突处理机制
- 不同楼层的写入操作会相互阻塞（共用 writeExecutor）

**影响：** 难以实现实时协作编辑、撤销/重做、变更历史等高级编辑功能。

### 问题 2: 无法支持 AI Agent 修改数据

当前系统的 API 设计无法满足 AI Agent 的需求：
- Agent 需要命令式 API（如 `updateFloor(id, changes)`），但当前只有 React Hooks
- Agent 修改数据后，UI 无法自动更新，需要手动触发刷新
- 缺乏统一的数据访问层，Agent 和 UI 使用不同的代码路径
- 无法在非 React 环境（如 Node.js 脚本、测试）中复用业务逻辑

**影响：** AI Agent 无法有效集成到编辑器中，限制了自动化和智能化功能的开发。

### 问题 3: 元数据订阅粒度过粗

当前 `useFloorTableMeta` 返回 floor 和 loc 两个表格的元数据：
- 只需要 floor 元数据的组件也会在 loc 变化时重新渲染
- 无法实现细粒度的性能优化
- 组件订阅了不需要的数据，增加了不必要的依赖

**影响：** 性能浪费，组件重渲染过于频繁。

### 问题 4: 代码组织混乱

- 楼层创建等业务逻辑散落在 `src/fs/maps.ts` 中，与文件操作混在一起
- 缺乏清晰的分层架构，业务逻辑和文件操作耦合
- 难以测试和维护

**影响：** 代码可维护性差，新功能开发困难。

## Glossary

- **楼层 (Floor)**: 游戏中的一个地图层级，包含地图数据、事件、属性等
- **楼层数据 (Floor Data)**: 存储在 `project/floors/{floorId}.js` 中的楼层信息
- **元数据 (Meta)**: 描述数据结构的配置信息，用于表格编辑器
- **FloorMeta**: 楼层属性的元数据配置（如 title、width、height 等字段定义）
- **LocMeta**: 楼层位置相关的元数据配置（如坐标、图块等字段定义）
- **并发写入**: 多个操作同时尝试修改同一文件
- **变更同步**: 数据修改后，所有订阅者自动收到更新通知
- **Agent**: AI 代理，通过 API 调用来自动化执行编辑任务
- **命令式 API**: 直接调用函数执行操作的 API 风格（如 `service.update()`）
- **声明式 API**: 通过 React Hooks 订阅数据的 API 风格（如 `useData()`）

## Requirements

### Requirement 1: 数据变更自动同步

**User Story:** As a developer, I want data changes to automatically propagate to all subscribers, so that UI components stay in sync without manual refresh and multiple editors can work on the same data.

**Problem:** 当前系统中，文件修改后 UI 无法自动更新，多个组件编辑同一数据时缺乏同步机制。

#### Acceptance Criteria

1. WHEN any component or service modifies floor data, ALL subscribed components SHALL automatically receive the update
2. WHEN a floor file is modified, THE change SHALL be reflected in all UI components displaying that floor within 100ms
3. WHEN multiple components subscribe to the same floor data, THE system SHALL maintain a single source of truth
4. WHEN a component unmounts, THE system SHALL automatically clean up its subscription
5. THE system SHALL support subscribing to specific parts of the data (e.g., only the title field)
6. WHEN only a subscribed field changes, THE subscriber SHALL be notified; when other fields change, the subscriber SHALL NOT be notified

### Requirement 2: 并发写入安全

**User Story:** As a developer, I want concurrent writes to be handled safely, so that data integrity is maintained and different floors can be edited in parallel without blocking.

**Problem:** 当前系统中，不同楼层的写入操作会相互阻塞，同一楼层的并发写入可能导致数据丢失。

#### Acceptance Criteria

1. WHEN multiple write operations target the same floor concurrently, THE operations SHALL be executed in order without data loss
2. WHEN multiple write operations target different floors concurrently, THE operations SHALL execute in parallel without blocking each other
3. WHEN a write operation is in progress, THE system SHALL queue subsequent writes to the same file
4. WHEN a write operation fails, THE system SHALL provide error information and allow retry
5. THE system SHALL track whether a file has unsaved changes (dirty state)
6. THE system SHALL track whether a file is currently being written to disk (saving state)

### Requirement 3: 支持 Agent 和非 React 环境

**User Story:** As an AI Agent or script developer, I want to use the same business logic as UI components through imperative APIs, so that Agent modifications automatically sync to the UI.

**Problem:** 当前系统只提供 React Hooks，Agent 无法使用，且 Agent 修改数据后 UI 无法自动更新。

#### Acceptance Criteria

1. THE system SHALL provide imperative APIs (e.g., `getFloor()`, `saveFloor()`) that work in any JavaScript environment
2. WHEN an Agent calls an imperative API to modify data, ALL UI components subscribed to that data SHALL automatically update
3. THE imperative APIs SHALL NOT depend on React or any UI framework
4. THE system SHALL provide a subscription mechanism for non-React environments to listen to data changes
5. THE imperative APIs and React Hooks SHALL share the same underlying business logic
6. THE system SHALL be usable in Node.js scripts, tests, and browser environments

### Requirement 4: 细粒度元数据订阅

**User Story:** As a developer, I want to subscribe to only the metadata I need, so that components don't re-render unnecessarily when unrelated metadata changes.

**Problem:** 当前 `useFloorTableMeta` 返回整个 `floors` 对象（包含 `floor` 和 `loc` 两个子对象），导致只需要 floor 元数据的组件在 loc 元数据变化时也会重渲染，反之亦然。

#### Acceptance Criteria

1. THE system SHALL provide `useFloorTableMeta` hook that returns only the `floor` sub-object from `floors._data.floor`
2. THE system SHALL provide `useLocTableMeta` hook that returns only the `loc` sub-object from `floors._data.loc`
3. WHEN a component uses `useFloorTableMeta`, THE component SHALL only re-render when `floors._data.floor` changes
4. WHEN a component uses `useLocTableMeta`, THE component SHALL only re-render when `floors._data.loc` changes
5. WHEN `floors._data.loc` changes, components using only `useFloorTableMeta` SHALL NOT re-render
6. WHEN `floors._data.floor` changes, components using only `useLocTableMeta` SHALL NOT re-render

### Requirement 5: 统一的业务逻辑层

**User Story:** As a developer, I want all floor-related business logic in one place, so that the code is easier to maintain and test.

**Problem:** 楼层创建等业务逻辑散落在 `src/fs/maps.ts` 中，与文件操作混在一起。

#### Acceptance Criteria

1. THE system SHALL provide a dedicated service layer for floor operations (create, read, update, delete)
2. THE service layer SHALL handle all business logic including data parsing, validation, and serialization
3. THE service layer SHALL use the file system layer only for reading and writing raw file content
4. THE system SHALL provide functions for creating single floors and batch creating multiple floors
5. THE system SHALL provide functions for formatting map arrays for display
6. WHEN floors are created, THE system SHALL automatically update the global floor ID list
7. THE business logic SHALL be testable without touching the file system

### Requirement 6: 清晰的分层架构

**User Story:** As a developer, I want a clear separation between file operations, business logic, and UI, so that each layer has a single responsibility and dependencies flow in one direction.

**Problem:** 当前代码组织混乱，业务逻辑和文件操作耦合，难以测试和维护。

#### Acceptance Criteria

1. THE system SHALL have three distinct layers: file system (fs), services, and UI
2. THE fs layer SHALL only handle file I/O and state management, without business logic
3. THE services layer SHALL handle business logic and provide APIs to the UI layer
4. THE UI layer SHALL only consume services layer APIs, not directly access the fs layer
5. THE fs layer SHALL NOT depend on services or UI layers
6. THE services layer SHALL NOT depend on the UI layer
7. THE architecture SHALL be documented for future developers

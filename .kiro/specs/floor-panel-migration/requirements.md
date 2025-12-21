# Requirements Document

## Introduction

将 `src/Workbench/FloorPanel` 迁移为使用 `src/components/Table` 组件实现。FloorPanel 是楼层属性编辑面板，用于编辑当前楼层的配置数据（如标题、颜色、事件等）。

迁移需要保证 `editor_mode.prototype.floor` 函数的对外行为一致，同时将原有的 DOM 操作方式转换为 React 组件渲染方式。FloorPanel 还包含两个特殊功能：修改 floorId 和修改地图大小，这些功能需要保留。

## Glossary

- **FloorPanel**: 楼层属性编辑面板，显示和编辑当前楼层的配置
- **Table_Component**: `src/components/Table` 中的 React 表格组件
- **editor_mode.floor**: 负责获取数据并渲染表格的函数
- **editor.file.editFloor**: 获取/保存楼层属性数据的函数
- **editor.currentFloorData**: 当前楼层的数据对象
- **commentObj**: 楼层属性的注释配置对象，定义字段类型和验证规则
- **FloorDataService**: 楼层数据服务，封装数据读写操作
- **FloorDataStore**: 楼层数据 Store，管理数据获取和保存

## Requirements

### Requirement 1: FloorPanel 组件重构

**User Story:** As a developer, I want FloorPanel to use the Table component, so that the code is more maintainable and consistent with other panels.

#### Acceptance Criteria

1. THE FloorPanel SHALL render using the Table component from `src/components/Table`
2. WHEN FloorPanel mounts, THE FloorPanel SHALL fetch floor data from `editor.currentFloorData`
3. THE FloorPanel SHALL use `useFloorTableMeta` hook to get the commentObj
4. THE FloorPanel SHALL maintain the existing header with save, add, delete, and configure buttons
5. THE FloorPanel SHALL preserve the "修改 floorId" input and button functionality
6. THE FloorPanel SHALL preserve the "修改地图大小" inputs and button functionality

### Requirement 2: 值变更处理

**User Story:** As a user, I want my changes to floor properties to be saved correctly, so that my floor configuration is updated.

#### Acceptance Criteria

1. WHEN a value is changed in the Table, THE FloorPanel SHALL call the save function immediately
2. WHEN save is triggered, THE FloorPanel SHALL write changes to the floor file via FloorDataService
3. IF validation fails, THEN THE FloorPanel SHALL display an error message using `printe`

### Requirement 3: FloorDataService 创建

**User Story:** As a developer, I want a dedicated service for floor data operations, so that the data layer is properly separated and side effects are controlled.

#### Acceptance Criteria

1. THE FloorDataService SHALL provide a `fetchFloorData(floorId: string)` function that accepts floorId as parameter
2. THE FloorDataService SHALL NOT depend on global `editor.currentFloorId` for determining which floor to read
3. THE FloorDataService SHALL provide a `saveActions(floorId: string, actions: Action[])` function that accepts floorId as parameter
4. THE FloorDataService SHALL NOT depend on global state for determining which floor to write
5. THE FloorDataService SHALL filter out map-related fields (map, bgmap, fgmap) from the returned data
6. THE FloorDataService SHALL filter out loc-related fields from the returned data based on commentObj

### Requirement 4: FloorDataStore 创建

**User Story:** As a developer, I want a Store to manage floor data state, so that data fetching and caching is handled consistently.

#### Acceptance Criteria

1. THE FloorDataStore SHALL use React Query to manage floor data fetching
2. THE FloorDataStore SHALL accept floorId as a parameter to determine which floor data to fetch
3. THE FloorDataStore SHALL use `useFloorTableMeta` to get the commentObj
4. THE FloorDataStore SHALL provide a `save` function that accepts an action list
5. THE FloorDataStore SHALL pass the current floorId to FloorDataService when saving
6. THE FloorDataStore SHALL refetch data after successful save

### Requirement 5: editor_mode.prototype.floor 行为一致性

**User Story:** As a developer, I want the floor function to maintain backward compatibility, so that existing code continues to work.

#### Acceptance Criteria

1. THE editor_mode.prototype.floor function SHALL trigger FloorPanel to refresh its data
2. WHEN editor_mode.floor is called, THE FloorPanel SHALL re-fetch data via queryClient.refetchQueries
3. THE FloorPanel SHALL support the callback parameter of editor_mode.floor

### Requirement 6: 修改 floorId 功能

**User Story:** As a user, I want to change the floor ID without page reload, so that I can rename floors seamlessly.

#### Acceptance Criteria

1. WHEN the user enters a new floorId and clicks confirm, THE FloorPanel SHALL validate the floorId format
2. IF the floorId format is invalid (not matching `/^[a-zA-Z_][a-zA-Z0-9_]*$/`), THEN THE FloorPanel SHALL display an error message
3. IF the floorId already exists in `main.floorIds`, THEN THE FloorPanel SHALL display an error message
4. WHEN validation passes, THE FloorPanel SHALL use FloorDataService to save the floor file with the new floorId
5. THE FloorDataService SHALL provide a `saveFloorWithNewId(oldFloorId: string, newFloorId: string)` function for this operation
6. WHEN floor file save succeeds, THE FloorPanel SHALL update the floorIds in tower data via TowerDataService
7. WHEN all saves succeed, THE FloorPanel SHALL update in-memory state without page reload:
   - Update `editor.currentFloorId` to the new floorId
   - Update `editor.currentFloorData.floorId` to the new floorId
   - Update `core.floorIds` array to replace old floorId with new floorId
8. WHEN in-memory state is updated, THE FloorPanel SHALL invalidate and refetch FloorDataStore query with the new floorId

### Requirement 7: 修改地图大小功能

**User Story:** As a user, I want to change the map size, so that I can resize my game floors.

#### Acceptance Criteria

1. WHEN the user enters new dimensions and clicks confirm, THE FloorPanel SHALL validate the parameters
2. IF width or height exceeds 128, THEN THE FloorPanel SHALL display an error message
3. IF offset values are negative, THEN THE FloorPanel SHALL display an error message
4. WHEN validation passes, THE FloorPanel SHALL create a new floor data with resized maps
5. THE FloorPanel SHALL update all coordinate-based fields (events, beforeBattle, afterBattle, etc.)
6. THE FloorPanel SHALL update upFloor and downFloor coordinates
7. WHEN save succeeds, THE FloorPanel SHALL reload the page


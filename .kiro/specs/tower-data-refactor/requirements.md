# Requirements Document

## Introduction

重构 `editor.file.editTower` 函数，将其从 `src/scripts/editor_file.ts` 中抽离到 `src/services/tower/towerDataService.ts`。该函数负责全塔属性数据的读取和写入操作，需要拆分为独立的读写函数，并处理竞态问题。同时需要考虑复用性，因为文件中还有多个类似的函数（如 `editItem`、`editEnemy`、`editFloor` 等）。

## Glossary

- **TowerDataService**: 全塔属性数据服务模块，封装数据读写操作
- **Action**: 数据修改操作，格式为 `[操作类型, 字段路径, 值]`，操作类型包括 `change`、`add`、`delete`
- **CommentObject**: 注释配置对象，用于描述数据字段的元信息
- **DataObject**: 全塔属性数据对象 `data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d`
- **WriteQueue**: 写入队列，用于处理多次写入调用的竞态问题
- **FieldPath**: 字段路径字符串，如 `['firstData']['version']`

## Requirements

### Requirement 1: 数据读取功能

**User Story:** As a developer, I want to read tower data separately from writing, so that I can have cleaner separation of concerns.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide a `readTowerData` function that returns tower data and comment object
2. WHEN `readTowerData` is called, THE TowerDataService SHALL return data object and comment object
3. THE TowerDataService SHALL merge data from `data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d` with main fields from `editor.main`
4. WHEN a field exists in `dataComment._data.main._data` but not in `editor.main`, THE TowerDataService SHALL set that field to `null` in the returned `main` object

### Requirement 2: 数据写入功能

**User Story:** As a developer, I want to write tower data with proper serialization, so that changes are persisted correctly.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide a `writeTowerData` function that accepts an action list
2. WHEN `writeTowerData` is called with actions, THE TowerDataService SHALL apply each action to the data object
3. WHEN an action has `undefined` as value, THE TowerDataService SHALL delete the corresponding field
4. WHEN writing data, THE TowerDataService SHALL serialize the data object to JSON with tab indentation
5. WHEN writing data, THE TowerDataService SHALL encode the content as base64 before writing to file
6. WHEN writing data, THE TowerDataService SHALL call `alertWhenCompress` to notify user about compression

### Requirement 3: CommentObject 获取功能

**User Story:** As a developer, I want to get comment object separately, so that I can use it for UI rendering without loading all data.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide a `getCommentObject` function that returns only the comment configuration
2. WHEN `getCommentObject` is called, THE TowerDataService SHALL return the `dataComment` object from `editor.file`

### Requirement 4: 竞态问题处理

**User Story:** As a developer, I want concurrent write operations to be handled properly, so that data integrity is maintained.

#### Acceptance Criteria

1. THE TowerDataService SHALL use a flag mechanism to track write operation status
2. WHEN a write operation is in progress and another write is requested, THE TowerDataService SHALL mark that a rewrite is needed
3. WHEN a write operation completes and rewrite is needed, THE TowerDataService SHALL trigger another write operation
4. WHEN a write operation fails, THE TowerDataService SHALL reject the promise with error information

### Requirement 5: Action 应用工具函数

**User Story:** As a developer, I want reusable action application logic, so that similar functions can share the same implementation.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide an `applyAction` utility function that applies a single action to an object
2. WHEN action type is `change` or `add`, THE TowerDataService SHALL set the value at the specified path
3. WHEN action type is `delete` or value is `undefined`, THE TowerDataService SHALL delete the field at the specified path
4. THE `applyAction` function SHALL support nested field paths like `['firstData']['version']`

### Requirement 6: 数据序列化工具函数

**User Story:** As a developer, I want reusable serialization logic, so that different data types can be serialized consistently.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide a `serializeToJsFile` utility function for serializing data to JS file format
2. WHEN serializing, THE TowerDataService SHALL prepend the variable declaration with the specified variable name
3. WHEN serializing, THE TowerDataService SHALL use tab indentation for JSON formatting
4. THE serialization output SHALL be valid JavaScript that can be loaded by the game engine

### Requirement 6.1: 压缩提醒功能

**User Story:** As a developer, I want to be notified when using compressed files, so that I know to recompress after modifications.

#### Acceptance Criteria

1. THE TowerDataService SHALL provide an `alertWhenCompress` utility function
2. WHEN `editor.useCompress` is `true`, THE function SHALL display an alert to the user
3. WHEN the alert is displayed, THE function SHALL set `editor.useCompress` to `'alerted'` to prevent repeated alerts
4. WHEN `editor.useCompress` is not `true`, THE function SHALL do nothing

### Requirement 7: 更新现有 towerDataService

**User Story:** As a developer, I want the existing towerDataService to use the new implementation, so that the refactoring is complete.

#### Acceptance Criteria

1. THE existing `fetchTowerData` function in towerDataService SHALL be updated to use the new `readTowerData` implementation
2. THE existing `saveActions` function in towerDataService SHALL be updated to use the new `writeTowerData` implementation
3. THE towerDataService SHALL maintain the same external API behavior after the update

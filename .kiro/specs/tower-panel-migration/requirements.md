# Requirements Document

## Introduction

将 `src/Workbench/TowerPanel` 迁移为使用 `src/components/Table` 组件实现。TowerPanel 是全塔属性编辑面板，用于编辑游戏的全局配置数据（如楼层列表、图片资源、音乐、初始数据等）。

迁移需要保证 `editor_mode.prototype.tower` 函数的对外行为一致，同时将原有的 DOM 操作方式转换为 React 组件渲染方式。

## Glossary

- **TowerPanel**: 全塔属性编辑面板，显示和编辑游戏全局配置
- **Table_Component**: `src/components/Table` 中的 React 表格组件
- **editor_mode.tower**: 负责获取数据并渲染表格的函数
- **editor.file.editTower**: 获取/保存全塔属性数据的函数
- **dataComment**: 全塔属性的注释配置对象，定义字段类型和验证规则

## Requirements

### Requirement 1: TowerPanel 组件重构

**User Story:** As a developer, I want TowerPanel to use the Table component, so that the code is more maintainable and consistent with other panels.

#### Acceptance Criteria

1. THE TowerPanel SHALL render using the Table component from `src/components/Table`
2. WHEN TowerPanel mounts, THE TowerPanel SHALL fetch tower data using `editor.file.editTower`
3. THE TowerPanel SHALL pass the fetched data and `editor.file.dataComment` to the Table component
4. THE TowerPanel SHALL maintain the existing header with save, add, and configure buttons

### Requirement 2: 值变更处理

**User Story:** As a user, I want my changes to tower properties to be saved correctly, so that my game configuration is updated.

#### Acceptance Criteria

1. WHEN a value is changed in the Table, THE TowerPanel SHALL dispatch the change action via `editor_mode.addAction`
2. WHEN auto-save is triggered, THE TowerPanel SHALL call `editor_mode.onmode('save')`
3. WHEN validation fails, THE TowerPanel SHALL display an error message using `printe`

### Requirement 3: 外部编辑器集成

**User Story:** As a user, I want to use specialized editors for complex fields, so that I can edit events, materials, and colors easily.

#### Acceptance Criteria

1. THE TowerPanel SHALL use `createEditClickHandler` from `src/components/Table/legacy` for edit button handling
2. THE TowerPanel SHALL use `createDoubleClickHandler` from `src/components/Table/legacy` for double-click handling
3. THE TowerPanel SHALL use `createValueChangeHandler` from `src/components/Table/legacy` for value change handling

### Requirement 4: editor_mode.prototype.tower 行为一致性

**User Story:** As a developer, I want the tower function to maintain backward compatibility, so that existing code continues to work.

#### Acceptance Criteria

1. THE editor_mode.prototype.tower function SHALL trigger TowerPanel to refresh its data
2. WHEN editor_mode.tower is called, THE TowerPanel SHALL re-fetch data from `editor.file.editTower`
3. THE TowerPanel SHALL support the callback parameter of editor_mode.tower

### Requirement 5: 添加和删除项

**User Story:** As a user, I want to add and delete configuration items, so that I can customize my game settings.

#### Acceptance Criteria

1. WHEN the add button is clicked, THE TowerPanel SHALL set `editor_mode.doubleClickMode` to 'add'
2. WHEN double-clicking in add mode, THE TowerPanel SHALL prompt for a new item ID
3. WHEN double-clicking in delete mode, THE TowerPanel SHALL delete the item if allowed

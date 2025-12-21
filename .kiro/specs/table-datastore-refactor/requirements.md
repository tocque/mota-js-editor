# Requirements Document

## Introduction

重构 Table 组件的 DataStore 使用方式，解决当前架构中 DataStore 未被正确使用的问题，并修复外部编辑器绕过 `checkRange` 验证的 bug。

## Glossary

- **DataStore**: 管理表格数据状态和回调的 React Context Store
- **TableRow**: 表格叶节点行组件，负责渲染单个可编辑字段
- **TableRowWrapper**: 当前存在的包装组件，用于创建回调函数
- **TableBody**: 表格主体组件，负责递归渲染节点树
- **checkRange**: 验证函数，根据 `_range` 配置验证值是否合法
- **External_Editor**: 外部编辑器，如 editor_blockly、editor_multi 等

## Requirements

### Requirement 1: DataStore 直接访问

**User Story:** As a developer, I want TableRow to directly access DataStore, so that I can avoid unnecessary prop drilling and simplify the component hierarchy.

#### Acceptance Criteria

1. WHEN TableRow renders, THE TableRow SHALL access DataStore directly via `DataStore.useStore()` hook
2. WHEN TableBody renders nodes, THE TableBody SHALL pass only node-specific data (field, config, etc.) to TableRow
3. THE TableBody SHALL NOT pass callback functions (onValueChange, onAddItem, etc.) as props to TableRow

### Requirement 2: 合并 TableRowWrapper 到 TableRow

**User Story:** As a developer, I want to eliminate TableRowWrapper, so that the component structure is simpler and easier to maintain.

#### Acceptance Criteria

1. THE TableRow SHALL contain all logic currently in TableRowWrapper
2. THE TableRow SHALL handle double-click logic internally
3. THE TableRow SHALL handle external editor opening logic internally
4. THE TableBody SHALL render TableRow directly without wrapper component

### Requirement 3: 统一 checkRange 验证

**User Story:** As a user, I want all value changes to be validated, so that invalid values cannot be saved regardless of input source.

#### Acceptance Criteria

1. WHEN a value is changed via direct input, THE System SHALL validate it with checkRange before saving
2. WHEN a value is changed via external editor, THE System SHALL validate it with checkRange before saving
3. IF checkRange validation fails, THEN THE System SHALL display an error message and reject the change
4. THE checkRange validation logic SHALL exist in a single location to avoid duplication

### Requirement 4: 保持外部 API 兼容性

**User Story:** As a developer using Table component, I want the external API to remain unchanged, so that I don't need to modify existing code.

#### Acceptance Criteria

1. THE TableProps interface SHALL remain unchanged
2. THE onChange callback signature SHALL remain unchanged
3. THE onOpenExternalEditor callback signature SHALL remain unchanged
4. WHEN external code uses Table component, THE Table SHALL behave identically to before (except for the bug fix)



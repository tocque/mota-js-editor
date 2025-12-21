# Requirements Document

## Introduction

将 `editor_table.ts` 重构为 React 组件，放置在 `src/components/Table` 目录下。该模块是一个根据定义动态生成的表格系统，定义来源于 `public/_server/table` 下的配置文件。重构需要将原有的 HTML 字符串生成方式转换为 React JSX 组件。

## Glossary

- **Table_System**: 动态表格生成系统，根据数据对象和注释对象生成可编辑的表格
- **Comment_Object**: 表格配置对象，定义每个字段的类型、验证规则、显示方式等
- **Value_Object**: 实际数据对象，包含需要编辑的值
- **Field_Path**: 字段路径，如 `['main']['floorIds']`，用于定位数据中的具体字段
- **Cell_Type**: 单元格类型，包括 textarea、select、checkbox、checkboxSet、event、material、color、point、disable 等
- **Fold_State**: 表格行的折叠状态，用于控制嵌套数据的显示/隐藏

## 函数功能分析表

| 函数名 | 功能描述 | 类别 |
|--------|----------|------|
| `select` | 生成下拉选择框 HTML | HTML 模板 |
| `option` | 生成下拉选项 HTML | HTML 模板 |
| `text` | 生成文本输入框 HTML | HTML 模板 |
| `checkbox` | 生成复选框 HTML | HTML 模板 |
| `textarea` | 生成文本域 HTML | HTML 模板 |
| `checkboxSet` | 生成复选框组 HTML | HTML 模板 |
| `checkboxSetMember` | 生成复选框组成员 HTML | HTML 模板 |
| `editGrid` | 生成操作按钮组（注释、编辑、复制） | HTML 模板 |
| `title` | 生成表格标题行 HTML | HTML 模板 |
| `gap` | 生成分隔行（用于嵌套数据的折叠标记） | HTML 模板 |
| `tr` | 生成表格数据行 HTML | HTML 模板 |
| `checkboxSetMemberOnchange` | 复选框组成员变化时的处理函数 | 事件处理 |
| `objToTable` | 将数据对象和注释对象转换为表格 | 表格生成控制 |
| `objToTr` | 将叶节点数据转换为表格行 | 表格生成控制 |
| `objToTd` | 根据类型生成对应的输入控件 | 表格生成控制 |
| `checkRange` | 检查值是否在允许范围内 | 用户交互 |
| `guidListen` | 为表格行绑定事件监听 | 用户交互 |
| `onchange` | 表格值变化时的处理函数 | 用户交互 |
| `onFoldBtnClick` | 折叠按钮点击处理 | 用户交互 |
| `onCommentBtnClick` | 注释按钮点击处理 | 用户交互 |
| `onEditBtnClick` | 编辑按钮点击处理 | 用户交互 |
| `onCopyBtnClick` | 复制按钮点击处理 | 用户交互 |
| `dblclickfunc` | 双击表格行的处理函数 | 用户交互 |
| `selectMaterial` | 选择素材的处理函数 | 用户交互 |
| `selectColor` | 选择颜色的处理函数 | 用户交互 |
| `selectPoint` | 选择坐标点的处理函数 | 用户交互 |
| `popCheckboxSet` | 弹出复选框组选择器 | 用户交互 |
| `deletefunc` | 删除表格项的处理函数 | 用户交互 |
| `addfunc` | 添加表格项的处理函数 | 用户交互 |

## Requirements

### Requirement 1: 核心表格组件

**User Story:** As a developer, I want a React Table component that renders dynamic tables based on data and comment objects, so that I can edit game configuration data in a structured way.

#### Acceptance Criteria

1. THE Table_System SHALL accept a value object and a comment object as props
2. WHEN the Table_System receives valid props, THE Table_System SHALL render a table with header row containing columns: 条目, 注释, 值, 操作
3. THE Table_System SHALL recursively traverse the value object and comment object to generate table rows
4. WHEN a field is marked as `_leaf: true` in the comment object, THE Table_System SHALL render it as an editable row
5. WHEN a field is not a leaf node, THE Table_System SHALL render a gap row with fold/unfold functionality

### Requirement 2: 输入控件组件

**User Story:** As a developer, I want different input components for different field types, so that users can edit values in the most appropriate way.

#### Acceptance Criteria

1. WHEN the field type is `textarea`, THE Table_System SHALL render a textarea input
2. WHEN the field type is `select`, THE Table_System SHALL render a dropdown select with options from `_select.values`
3. WHEN the field type is `checkbox`, THE Table_System SHALL render a checkbox input
4. WHEN the field type is `checkboxSet`, THE Table_System SHALL render a group of checkboxes
5. WHEN the field type is `disable`, THE Table_System SHALL render a readonly textarea
6. WHEN the field type is `event`, THE Table_System SHALL render a textarea with an edit button that opens the event editor
7. WHEN the field type is `material`, THE Table_System SHALL render a textarea with an edit button that opens the material selector
8. WHEN the field type is `color`, THE Table_System SHALL render a textarea with an edit button that opens the color picker
9. WHEN the field type is `point`, THE Table_System SHALL render a textarea with an edit button that opens the point selector
10. WHEN the field type is `popCheckboxSet`, THE Table_System SHALL render a textarea with an edit button that opens a popup checkbox selector

### Requirement 3: 值变更处理

**User Story:** As a developer, I want the table to handle value changes and validate them, so that only valid data is saved.

#### Acceptance Criteria

1. WHEN a user changes a value in an input, THE Table_System SHALL parse the JSON value
2. WHEN the parsed value passes the `_range` validation, THE Table_System SHALL dispatch a change action
3. IF the parsed value fails validation, THEN THE Table_System SHALL display an error message
4. WHEN a value is changed, THE Table_System SHALL trigger auto-save if configured
5. THE Table_System SHALL support undo/redo through the action system

### Requirement 4: 折叠功能

**User Story:** As a developer, I want to fold/unfold nested data sections, so that I can focus on specific parts of the configuration.

#### Acceptance Criteria

1. WHEN a gap row is rendered, THE Table_System SHALL display a fold/unfold button
2. WHEN the fold button is clicked, THE Table_System SHALL hide all child rows under that section
3. WHEN the unfold button is clicked, THE Table_System SHALL show all child rows under that section
4. THE Table_System SHALL persist fold state during the session

### Requirement 5: 操作按钮

**User Story:** As a developer, I want action buttons for each row, so that I can perform operations like viewing comments, editing, and copying.

#### Acceptance Criteria

1. WHEN a row has a short comment (`_docs`), THE Table_System SHALL display a "注释" button
2. WHEN the "注释" button is clicked, THE Table_System SHALL display the full comment text
3. WHEN the field type supports editing, THE Table_System SHALL display an "编辑" button
4. WHEN the "编辑" button is clicked, THE Table_System SHALL open the appropriate editor based on field type
5. WHEN the field type is `disable`, THE Table_System SHALL display a "复制" button instead of "编辑"
6. WHEN the "复制" button is clicked, THE Table_System SHALL copy the value to clipboard

### Requirement 6: 双击编辑

**User Story:** As a developer, I want to double-click a row to quickly edit it, so that I can work more efficiently.

#### Acceptance Criteria

1. WHEN a user double-clicks a row, THE Table_System SHALL open the appropriate editor based on field type
2. WHEN the double-click mode is set to "add", THE Table_System SHALL add a new item at the same level
3. WHEN the double-click mode is set to "delete", THE Table_System SHALL delete the current item

### Requirement 7: 添加和删除项

**User Story:** As a developer, I want to add and delete configuration items, so that I can customize the game data structure.

#### Acceptance Criteria

1. WHEN adding a new item, THE Table_System SHALL prompt for a valid ID
2. WHEN the ID contains invalid characters, THE Table_System SHALL display an error message
3. WHEN the ID already exists, THE Table_System SHALL display an error message
4. WHEN deleting an item, THE Table_System SHALL check if null is allowed for that field
5. IF null is not allowed, THEN THE Table_System SHALL display an error message and prevent deletion

### Requirement 8: TypeScript 类型定义

**User Story:** As a developer, I want proper TypeScript types for all components and functions, so that I can have type safety and better IDE support.

#### Acceptance Criteria

1. THE Table_System SHALL define TypeScript interfaces for Comment_Object structure
2. THE Table_System SHALL define TypeScript interfaces for component props
3. THE Table_System SHALL define TypeScript types for all event handlers
4. THE Table_System SHALL export all public types for external use

### Requirement 9: 与现有系统集成

**User Story:** As a developer, I want the new React components to integrate with the existing editor system for editing operations, so that users can edit events, materials, colors, and points.

#### Acceptance Criteria

1. THE Table_System SHALL call `editor_mode.addAction` to dispatch value change actions
2. THE Table_System SHALL call `editor_blockly.import` to open the event editor when editing event type fields
3. THE Table_System SHALL call `editor_multi.import` to open the multi-line text editor when editing textarea fields
4. THE Table_System SHALL call `editor.uievent.selectMaterial` to open the material selector
5. THE Table_System SHALL call `editor.uievent.selectPoint` to open the point selector
6. THE Table_System SHALL call `openColorPicker` to open the color picker
7. THE Table_System SHALL call `editor.uievent.popCheckboxSet` to open the popup checkbox selector

**Note:** 新组件不需要暴露与 `editor.table` 兼容的 API。原有实现将保留，后续会逐步替换所有引用。

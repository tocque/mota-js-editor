# Requirements Document

## Introduction

在完成 TowerPanel 迁移后，对 Table 组件进行实际测试发现了若干问题需要修复。本文档将问题分为两类：Table 组件内部问题和 TowerPanel 集成问题。

## Glossary

- **Table_Component**: `src/components/Table` 中的 React 表格组件
- **editor_table**: 原始的 `public/_server/editor_table.js` 实现
- **actionList**: 修改操作列表，用于防止并发修改竞态
- **_range**: 字段配置中的验证表达式
- **editor_blockly**: 事件编辑器
- **editor_multi**: 多行文本编辑器
- **guid**: 表格行的唯一标识符，用于外部编辑器定位

---

## Part A: Table 组件内部问题

### Requirement 1: 输入控件样式修复

**User Story:** As a user, I want the table input controls to have the same appearance as the original editor_table, so that the UI is consistent.

#### Acceptance Criteria

1. THE CheckboxInput SHALL have the class `checkbox` on the input element
2. THE CheckboxSetMember SHALL have the class `checkboxSetMember` on the input element (已实现)
3. THE TextareaInput, SelectInput, CheckboxInput SHALL match the original editor_table HTML structure

### Requirement 2: _range 验证集成到 Table 内部

**User Story:** As a developer, I want the _range validation to be handled inside the Table component, so that invalid values are rejected before triggering onChange.

#### Acceptance Criteria

1. WHEN a value fails _range validation, THE Table SHALL NOT trigger the onValueChange callback
2. WHEN a value fails _range validation, THE Table SHALL display an error message using `printe`
3. THE checkRange function SHALL be called inside the Table component's input handlers
4. THE validation SHALL occur before any onChange callback is invoked

### Requirement 3: 安全的字段路径访问工具

**User Story:** As a developer, I want to use a safe method to access nested object values, so that the code is more secure and maintainable.

#### Acceptance Criteria

1. THE Table utils SHALL provide a safe path accessor function that does NOT use `new Function` or `eval`
2. THE path accessor SHALL support field path format like `"['main']['floorIds']"`
3. THE path accessor utility SHALL be located in `src/components/Table/utils`
4. THE path accessor MAY use es-toolkit/compat 的 `get` 函数作为底层实现

### Requirement 4: etable 包装器移入 Table 组件

**User Story:** As a developer, I want the etable wrapper to be part of the Table component, so that the component is self-contained.

#### Acceptance Criteria

1. THE Table component SHALL render with a `div.etable` wrapper around the table element
2. THE external code SHALL NOT need to wrap Table in `div.etable`

---

## Part B: TowerPanel 集成问题

### Requirement 5: 双击打开外部编辑器

**User Story:** As a user, I want to double-click a table row to open the external editor, so that I can edit complex fields easily.

#### Acceptance Criteria

1. WHEN a user double-clicks a row with type `event`, THE TowerPanel SHALL call `editor_blockly.import` with the correct guid
2. WHEN a user double-clicks a row with type `textarea`, THE TowerPanel SHALL call `editor_multi.import` with the correct options
3. WHEN a user double-clicks a row with type `material`, THE TowerPanel SHALL call `editor.uievent.selectMaterial`
4. WHEN a user double-clicks a row with type `color`, THE TowerPanel SHALL call `openColorPicker`
5. WHEN a user double-clicks a row with type `point`, THE TowerPanel SHALL call `editor.uievent.selectPoint`
6. WHEN a user double-clicks a row with type `popCheckboxSet`, THE TowerPanel SHALL call `editor.uievent.popCheckboxSet`
7. THE guid passed to external editors SHALL be the DOM element's id attribute (由 Table 组件生成)

### Requirement 6: 修改后即时保存

**User Story:** As a user, I want my changes to be saved immediately after editing, so that I don't lose my work.

#### Acceptance Criteria

1. WHEN a value is changed in the Table, THE TowerPanel SHALL immediately trigger save via `editor_mode.addAction` and `editor_mode.onmode('save')`
2. THE actionList hook SHALL be used to prevent concurrent modification race conditions
3. THE TowerPanel SHALL NOT require a manual save button click to persist changes
4. THE save button MAY be removed or kept as a fallback

### Requirement 7: TowerPanel 结构优化

**User Story:** As a developer, I want the TowerPanel to have a cleaner structure, so that the code is more maintainable and reusable.

#### Acceptance Criteria

1. THE leftTab, leftTabHeader, leftTabContent structure SHALL be extracted as reusable components
2. THE TowerPanel SHALL use a cleaner JSX structure with less fragmentation
3. THE reusable components SHALL be usable by other panels (FloorPanel, etc.)


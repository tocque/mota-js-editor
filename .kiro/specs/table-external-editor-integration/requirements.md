# Requirements Document

## Introduction

重构 CodeEditor 的对外接口，提供一个简洁现代化的 `open` 函数。当前 `createHandler` 中的入口函数（`importFromTable`、`importFile` 等）混杂了太多业务逻辑（如 DOM 操作、值解析等），这些逻辑本不应该在 CodeEditor 中实现。

目标是：
1. CodeEditor 提供一个简洁的 `open(initialValue, config, callbacks)` 接口
2. 调用方负责准备初始值和处理回调
3. 原有的 `editor_multi.import` 等 API 作为兼容层保留

## Glossary

- **Table**: React 表格组件，用于渲染和编辑数据
- **CodeEditor**: 多行代码编辑器组件（原 editor_multi）
- **OpenConfig**: 打开编辑器时的配置选项（lint、isString、preview 等）
- **OpenCallbacks**: 打开编辑器时的回调函数（onConfirm、onCancel）
- **LegacyApi**: 原有的 editor_multi API，作为兼容层保留

## Requirements

### Requirement 1: 简洁的 open 接口

**User Story:** As a developer, I want CodeEditor to provide a simple open interface, so that I can easily integrate it with any component.

#### Acceptance Criteria

1. THE CodeEditor SHALL expose an `open(initialValue, config, callbacks)` function
2. WHEN `open` is called, THE CodeEditor SHALL display with the provided initial value
3. WHEN user confirms, THE CodeEditor SHALL call `callbacks.onConfirm` with the edited value
4. WHEN user cancels, THE CodeEditor SHALL call `callbacks.onCancel` (if provided)
5. THE `open` function SHALL NOT perform any DOM queries or manipulations for value handling

### Requirement 2: 配置选项

**User Story:** As a developer, I want to configure the editor behavior through options, so that I can customize it for different use cases.

#### Acceptance Criteria

1. THE OpenConfig SHALL support `lint` option to enable/disable syntax checking
2. THE OpenConfig SHALL support `isString` option to indicate string editing mode
3. THE OpenConfig SHALL support `preview` option for preview functionality
4. WHEN `lint` is true and code has syntax errors, THE CodeEditor SHALL warn before confirm

### Requirement 3: 更新 openExternalEditor 集成

**User Story:** As a developer, I want openExternalEditor to use the new open interface, so that Table component works correctly with CodeEditor.

#### Acceptance Criteria

1. WHEN openExternalEditor handles textarea type, THE function SHALL call `editor_multi.open` with current value
2. WHEN openExternalEditor handles textarea type, THE function SHALL pass `onConfirm` callback that calls Table's setValue
3. THE openExternalEditor function SHALL prepare the initial value (JSON parsing, string handling) before calling open

### Requirement 4: 保持向后兼容

**User Story:** As a developer, I want the legacy API to continue working, so that existing code doesn't break.

#### Acceptance Criteria

1. THE `editor_multi.import` function SHALL continue to work for legacy callers (editor_table.ts)
2. THE `editor_multi.multiLineEdit` function SHALL continue to work for Blockly integration
3. THE `editor_multi.editCommentJs` function SHALL continue to work for comment file editing
4. WHEN legacy API is called, THE implementation SHALL internally use the new `open` interface

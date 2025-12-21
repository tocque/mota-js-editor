# Requirements Document

## Introduction

本需求文档描述了将 comment 配置文件（如 `data.comment.js`、`functions.comment.js` 等）的加载和保存逻辑从 `editor.file` 中抽离，重构为现代化的服务层。这将允许：
1. 保存 commentJS 后即时在表单里看到修改结果
2. 提供可复用的 comment 服务，支持多种 comment 类型
3. 与现有的 TowerPanel 等组件集成

## Glossary

- **Comment_Service**: 负责加载和保存 comment 配置文件的服务模块
- **Comment_Object**: comment 配置对象，包含表格字段定义、类型、提示等信息
- **Comment_Type**: comment 类型标识符，如 'tower'、'functions'、'plugins' 等
- **Comment_File**: comment 配置文件，如 `data.comment.js`、`functions.comment.js`

## Requirements

### Requirement 1: Comment 配置加载

**User Story:** As a developer, I want to load comment configuration from files, so that I can use them to render table forms.

#### Acceptance Criteria

1. THE Comment_Service SHALL provide a function to get the current comment object for a given Comment_Type
2. WHEN a Comment_Type is requested, THE Comment_Service SHALL return the corresponding Comment_Object from `editor.file`
3. THE Comment_Service SHALL support the following Comment_Types: 'comment', 'dataComment', 'functionsComment', 'eventsComment', 'pluginsComment'
4. IF the requested Comment_Type does not exist, THEN THE Comment_Service SHALL throw a descriptive error

### Requirement 2: Comment 配置保存

**User Story:** As a developer, I want to save modified comment configuration to files, so that my changes persist.

#### Acceptance Criteria

1. THE Comment_Service SHALL provide a function to save comment content to the corresponding file
2. WHEN saving comment content, THE Comment_Service SHALL encode the content using base64
3. WHEN saving comment content, THE Comment_Service SHALL write to the correct file path based on Comment_Type
4. WHEN save completes successfully, THE Comment_Service SHALL return a Promise that resolves
5. IF save fails, THEN THE Comment_Service SHALL return a Promise that rejects with an error

### Requirement 3: Comment 配置重新加载

**User Story:** As a developer, I want to reload comment configuration after saving, so that I can see the updated configuration immediately.

#### Acceptance Criteria

1. THE Comment_Service SHALL provide a function to reload a specific Comment_Type from its file
2. WHEN reloading, THE Comment_Service SHALL read the file content and parse it
3. WHEN reloading, THE Comment_Service SHALL update the `editor.file` object with the new Comment_Object
4. WHEN reload completes, THE Comment_Service SHALL return the new Comment_Object
5. IF reload fails, THEN THE Comment_Service SHALL throw a descriptive error

### Requirement 4: Comment 编辑器集成

**User Story:** As a developer, I want to edit comment configuration through the code editor, so that I can customize table forms.

#### Acceptance Criteria

1. THE Comment_Service SHALL provide a function to open the comment editor for a given Comment_Type
2. WHEN opening the editor, THE Comment_Service SHALL load the current file content
3. WHEN the user confirms changes, THE Comment_Service SHALL save the content and reload the configuration
4. WHEN the user confirms changes, THE Comment_Service SHALL notify the caller of success with the new Comment_Object
5. WHEN the user cancels, THE Comment_Service SHALL not modify any files

### Requirement 5: TowerPanel 集成

**User Story:** As a user, I want to configure the tower table form and see changes immediately, so that I can customize the editing experience.

#### Acceptance Criteria

1. WHEN the user clicks "配置表格" in TowerPanel, THE system SHALL open the comment editor for 'tower' type
2. WHEN the user saves changes in the comment editor, THE TowerPanel SHALL refresh to show the updated configuration
3. THE TowerPanel SHALL display a success message when configuration is saved successfully
4. IF saving fails, THEN THE TowerPanel SHALL display an error message

### Requirement 6: 复用性设计

**User Story:** As a developer, I want the comment service to be reusable across different panels, so that I can easily add comment editing to other panels.

#### Acceptance Criteria

1. THE Comment_Service SHALL be designed as a standalone module in `src/services/comment`
2. THE Comment_Service SHALL not depend on specific panel implementations
3. THE Comment_Service SHALL provide TypeScript type definitions for all public APIs
4. THE Comment_Service SHALL follow the same patterns as existing services (e.g., towerDataService)

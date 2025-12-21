# Requirements Document

## Introduction

本需求文档描述了 TowerPanel 中 commentObj 数据同步问题的修复方案。当前通过 `useTableMetaEditor` 修改 `dataComment` 配置后，`TowerDataStore` 中的 `commentObj` 不会自动更新，导致表格显示的元数据配置与实际文件不一致。

## Glossary

- **TowerDataStore**: 全塔属性数据的 React Query Store，负责获取和保存全塔属性数据
- **TableMetaService**: 表格元数据服务，负责加载和保存 `*.comment.js` 配置文件
- **useTableMetaFile**: 基于 React Query 的 hook，提供元数据文件的读写能力
- **useTableMetaEditor**: 基于 `useTableMetaFile` 的 hook，提供打开代码编辑器修改元数据的能力
- **commentObj**: 表格的元数据配置对象，定义了表格的字段结构、类型、文档等
- **TOWER_QUERY_KEY**: TowerDataStore 使用的 React Query key
- **tableMetaQueryKey**: TableMetaService 使用的 React Query key

## Requirements

### Requirement 1: commentObj 数据源统一

**User Story:** As a developer, I want the TowerPanel to use the same data source for commentObj as useTableMetaFile, so that changes made through the editor are immediately reflected.

#### Acceptance Criteria

1. WHEN `useTableMetaFile('dataComment')` 的缓存更新时，THE TowerDataStore SHALL 使用更新后的 commentObj
2. WHEN TowerPanel 渲染时，THE commentObj SHALL 来自 React Query 缓存而非 `editor.file.dataComment`
3. WHEN `saveTableMetaFile` 完成保存后，THE TowerDataStore 的 query SHALL 自动 refetch 或使用新的 commentObj

### Requirement 2: 保持向后兼容

**User Story:** As a developer, I want the refactoring to maintain backward compatibility, so that existing code continues to work.

#### Acceptance Criteria

1. WHEN 旧代码调用 `getCommentObject()` 时，THE 函数 SHALL 继续返回有效的 CommentObject
2. WHEN `editor.file.dataComment` 被其他代码使用时，THE 数据 SHALL 保持同步更新
3. WHEN TowerDataStore 的 API 被调用时，THE 返回值结构 SHALL 保持不变

### Requirement 3: 缓存失效联动

**User Story:** As a developer, I want the cache invalidation to be coordinated between TableMetaService and TowerDataStore, so that data stays consistent.

#### Acceptance Criteria

1. WHEN `saveTableMetaFile('dataComment', content)` 成功后，THE TowerDataStore 的 query SHALL 被标记为 stale 或 refetch
2. WHEN tableMetaQueryKey 的缓存更新时，THE TOWER_QUERY_KEY 的缓存 SHALL 相应更新
3. IF 缓存更新失败，THEN THE System SHALL 保持原有数据并显示错误提示

### Requirement 4: 性能优化

**User Story:** As a user, I want the data synchronization to be efficient, so that the UI remains responsive.

#### Acceptance Criteria

1. WHEN commentObj 更新时，THE System SHALL 避免不必要的重复解析
2. WHEN TowerPanel 重新渲染时，THE System SHALL 使用 React Query 的缓存机制避免重复请求
3. WHEN 多个组件依赖同一 commentObj 时，THE System SHALL 共享同一份解析结果

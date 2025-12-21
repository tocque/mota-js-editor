/**
 * TableMeta Service 模块导出
 */

// ==================== 底层服务 ====================
export {
  loadTableMetaFile,
  saveTableMetaFile,
  parseTableMetaJs,
  META_FILE_CONFIG,
  VALID_META_FILE_KEYS,
  type MetaFileKey,
  type MetaFileConfig,
} from './tableMetaService';

// ==================== 底层 Hook ====================
export {
  useTableMetaFile,
  getTableMetaQueryKey,
  type UseTableMetaFileResult,
} from './useTableMetaFile';

// ==================== 单一 Meta 文件 Hooks ====================
export {
  useTowerTableMeta,
  useFunctionsTableMeta,
  useEventsTableMeta,
  usePluginsTableMeta,
  type UseTowerTableMetaResult,
  type UseFunctionsTableMetaResult,
  type UseEventsTableMetaResult,
  type UsePluginsTableMetaResult,
} from './hooks/useTowerTableMeta';

// ==================== comment.js 多 Meta Hooks ====================
export {
  useObjectTableMeta,
  useItemTableMeta,
  useEnemyTableMeta,
  useMapTableMeta,
  useFloorTableMeta,
  type FullCommentMeta,
  type UseObjectTableMetaResult,
  type UseSubObjectTableMetaResult,
} from './hooks/useObjectTableMeta';

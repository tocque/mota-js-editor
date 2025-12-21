import { useCallback, type FC } from 'react';
import type { FieldConfig, FieldType, TableNode } from '../types';
import { TableRow } from './TableRow';
import { GapRow } from './GapRow';
import { DataStore } from '../stores';
import { getParentFieldPath, checkRange, getByFieldPath } from '../utils';
import { openExternalEditor } from '../legacy/externalEditor';

/**
 * 获取全局 printe 函数
 */
const getPrinte = (): ((msg: string) => void) | undefined => {
  if (typeof window !== 'undefined' && 'printe' in window) {
    return (window as unknown as { printe: (msg: string) => void }).printe;
  }
  return undefined;
};

/** 渲染节点所需的回调函数 */
interface RenderCallbacks {
  data: Record<string, unknown>;
  onValueChange: (field: string, value: unknown) => void;
  onAddItem: (field: string, id: string) => void;
  onDeleteItem: (field: string) => void;
  onOpenExternalEditor: (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void;
  editMode: 'change' | 'add' | 'delete';
}

/**
 * TableBody 组件
 *
 * 递归渲染 TableNode 树结构：
 * - 对 isGap 节点渲染 GapRow（分隔行，可折叠）
 * - 对非 isGap 节点渲染 TableRow（叶节点，可编辑）
 *
 * @example
 * ```tsx
 * <tbody>
 *   <TableBody />
 * </tbody>
 * ```
 */
export const TableBody: FC = () => {
  const { rootNodes, data, onValueChange, onAddItem, onDeleteItem, onOpenExternalEditor, editMode } = DataStore.useStore();

  const callbacks: RenderCallbacks = {
    data,
    onValueChange,
    onAddItem,
    onDeleteItem,
    onOpenExternalEditor,
    editMode,
  };

  return <>{renderNodes(rootNodes, callbacks)}</>;
};

/**
 * 递归渲染节点列表
 */
function renderNodes(
  nodes: TableNode[],
  callbacks: RenderCallbacks,
): React.ReactNode {
  return nodes.map((node) => renderNode(node, callbacks));
}

/**
 * 渲染单个节点
 * - isGap 节点渲染为 GapRow，包含递归渲染的子节点
 * - 非 isGap 节点渲染为 TableRow
 */
function renderNode(
  node: TableNode,
  callbacks: RenderCallbacks,
): React.ReactNode {
  if (node.isGap) {
    // 分隔行：渲染 GapRow，子节点作为 children
    return (
      <GapRow key={node.id} field={node.field} shortField={node.shortField}>
        {node.children && renderNodes(node.children, callbacks)}
      </GapRow>
    );
  }

  // 叶节点：渲染 TableRow
  return (
    <TableRowWrapper
      key={node.id}
      node={node}
      callbacks={callbacks}
    />
  );
}

/**
 * TableRow 包装组件
 * 用于创建稳定的回调，并实现双击处理逻辑
 */
interface TableRowWrapperProps {
  node: TableNode;
  callbacks: RenderCallbacks;
}

const TableRowWrapper: FC<TableRowWrapperProps> = ({ node, callbacks }) => {
  const { data, onValueChange, onAddItem, onDeleteItem, onOpenExternalEditor, editMode } = callbacks;

  const handleChange = useCallback(
    (value: unknown) => {
      onValueChange(node.field, value);
    },
    [node.field, onValueChange],
  );

  // 打开外部编辑器 - 如果外部提供了回调则使用，否则使用内置实现
  const handleOpenExternalEditor = useCallback((guid: string) => {
    // 检查是否有外部提供的回调（非 noop）
    if (onOpenExternalEditor !== undefined && onOpenExternalEditor.length > 0) {
      onOpenExternalEditor(node.field, node.config._type, node.config, guid);
    } else {
      // 使用内置的外部编辑器集成
      const getValue = (field: string) => getByFieldPath(data, field);
      const setValue = (field: string, value: unknown) => onValueChange(field, value);
      openExternalEditor(node.field, node.config._type, node.config, guid, getValue, setValue);
    }
  }, [node.field, node.config, data, onValueChange, onOpenExternalEditor]);

  // 双击处理 - 根据 editMode 调用不同的回调
  const handleDoubleClick = useCallback((guid: string) => {
    const mode = editMode;
    
    if (mode === 'change') {
      // 正常编辑模式：打开外部编辑器
      handleOpenExternalEditor(guid);
    } else if (mode === 'add') {
      // 添加模式：获取父路径，提示输入新 ID
      const parentPath = getParentFieldPath(node.field);
      const id = prompt('请输入新项的 ID');
      if (id) {
        onAddItem(parentPath, id);
      }
    } else if (mode === 'delete') {
      // 删除模式：检查是否允许删除（null 验证）
      if (!checkRange(node.config, null)) {
        const printe = getPrinte();
        printe?.(node.field + ' : 该值不允许为null，无法删除');
        return;
      }
      if (confirm('确定要删除吗？')) {
        onDeleteItem(node.field);
      }
    }
  }, [node.field, node.config, editMode, handleOpenExternalEditor, onAddItem, onDeleteItem]);

  return (
    <TableRow
      field={node.field}
      shortField={node.shortField}
      value={node.value}
      config={node.config}
      comment={node.comment}
      shortComment={node.shortComment}
      onChange={handleChange}
      onOpenExternalEditor={handleOpenExternalEditor}
      onDoubleClick={handleDoubleClick}
    />
  );
};

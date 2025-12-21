import { useCallback, type FC } from 'react';
import type { FieldConfig, FieldType, TableNode } from '../types';
import { TableRow } from './TableRow';
import { GapRow } from './GapRow';
import { DataStore } from '../stores';
import { getParentFieldPath, checkRange } from '../utils';

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
  onValueChange: (field: string, value: unknown) => void;
  onAddItem: (field: string, id: string) => void;
  onDeleteItem: (field: string) => void;
  onEditClick: (field: string, type: FieldType | undefined, config: FieldConfig, guid: string) => void;
  doubleClickMode: 'change' | 'add' | 'delete';
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
  const { rootNodes, onValueChange, onAddItem, onDeleteItem, onEditClick, doubleClickMode } = DataStore.useStore();

  const callbacks: RenderCallbacks = {
    onValueChange,
    onAddItem,
    onDeleteItem,
    onEditClick,
    doubleClickMode,
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
  const { onValueChange, onAddItem, onDeleteItem, onEditClick, doubleClickMode } = callbacks;

  const handleChange = useCallback(
    (value: unknown) => {
      onValueChange(node.field, value);
    },
    [node.field, onValueChange],
  );

  // 编辑按钮点击处理 - 传递 guid 给外部
  const handleEditClick = useCallback((guid: string) => {
    onEditClick(node.field, node.config._type, node.config, guid);
  }, [node.field, node.config, onEditClick]);

  // 双击处理 - 根据 doubleClickMode 调用不同的回调
  const handleDoubleClick = useCallback((guid: string) => {
    const mode = doubleClickMode;
    
    if (mode === 'change') {
      // 正常编辑模式：调用编辑处理函数
      onEditClick(node.field, node.config._type, node.config, guid);
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
  }, [node.field, node.config, doubleClickMode, onEditClick, onAddItem, onDeleteItem]);

  return (
    <TableRow
      field={node.field}
      shortField={node.shortField}
      value={node.value}
      config={node.config}
      comment={node.comment}
      shortComment={node.shortComment}
      onChange={handleChange}
      onEditClick={handleEditClick}
      onDoubleClick={handleDoubleClick}
    />
  );
};

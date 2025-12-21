import { useCallback, type FC } from 'react';
import type { FieldConfig, FieldType, TableNode } from '../types';
import { TableRow } from './TableRow';
import { GapRow } from './GapRow';
import { DataStore } from '../stores';

/** 渲染节点所需的回调函数 */
interface RenderCallbacks {
  onValueChange: (field: string, value: unknown) => void;
  onEditClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
  onDoubleClick: (field: string, type: FieldType | undefined, config: FieldConfig) => void;
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
  const { rootNodes, onValueChange, onEditClick, onDoubleClick } = DataStore.useStore();

  const callbacks: RenderCallbacks = {
    onValueChange,
    onEditClick,
    onDoubleClick,
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
 * 用于创建稳定的回调
 */
interface TableRowWrapperProps {
  node: TableNode;
  callbacks: RenderCallbacks;
}

const TableRowWrapper: FC<TableRowWrapperProps> = ({ node, callbacks }) => {
  const { onValueChange, onEditClick, onDoubleClick } = callbacks;

  const handleChange = useCallback(
    (value: unknown) => {
      onValueChange(node.field, value);
    },
    [node.field, onValueChange],
  );

  // 编辑按钮点击处理
  const handleEditClick = useCallback(() => {
    onEditClick(node.field, node.config._type, node.config);
  }, [node.field, node.config, onEditClick]);

  // 双击处理
  const handleDoubleClick = useCallback(() => {
    onDoubleClick(node.field, node.config._type, node.config);
  }, [node.field, node.config, onDoubleClick]);

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

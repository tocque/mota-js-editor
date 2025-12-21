/**
 * TowerPanel - 全塔属性编辑面板
 *
 * 使用 Table 组件渲染表格，通过 TowerDataStore 获取数据，
 * 实现即时保存（每次修改直接调用 save）。
 */

import { useCallback, useState, type FC } from 'react';
import { Segmented } from 'antd';
import { LeftTab } from '../components/LeftTab';
import {
  Table,
  createEditClickHandler,
} from '@/components/Table';
import { getByFieldPath } from '@/components/Table/utils/fieldPath';
import { validateId } from '@/components/Table/utils/validation';
import { TowerDataStore } from '@/stores/TowerDataStore';
import type { DoubleClickMode } from '@/components/Table/types';
import type { Action } from '@/services/tower';

export const TowerPanel: FC = () => {
  // 从 Store 获取数据和保存方法
  const { towerData, isLoading, error, save } = TowerDataStore.useStore();

  // 在 Panel 层维护 doubleClickMode
  const [doubleClickMode, setDoubleClickMode] = useState<DoubleClickMode>('change');

  // 值变更处理 - 即时保存
  const handleValueChange = useCallback(
    async (field: string, value: unknown) => {
      const action: Action = ['change', field, value];
      await save([action]);
    },
    [save],
  );

  // 添加项处理 - 即时保存
  const handleAddItem = useCallback(
    async (field: string, id: string) => {
      // 验证 ID
      let existingKeys: string[] = [];
      if (towerData?.data) {
        const parentObj = getByFieldPath(towerData.data, field);
        if (parentObj && typeof parentObj === 'object') {
          existingKeys = Object.keys(parentObj as Record<string, unknown>);
        }
      }
      const validation = validateId(id, existingKeys, false);
      if (!validation.valid) {
        printe?.(validation.error || 'ID 无效');
        return;
      }

      const newField = field + "['" + id + "']";
      const action: Action = ['add', newField, null];
      await save([action]);
      printf?.('添加成功，刷新后生效。');
    },
    [save, towerData],
  );

  // 删除项处理 - 即时保存
  const handleDeleteItem = useCallback(
    async (field: string) => {
      const action: Action = ['delete', field, undefined];
      await save([action]);
      printf?.('删除成功，刷新后生效。');
    },
    [save],
  );

  // 创建编辑按钮点击处理函数
  const handleEditClick = createEditClickHandler({
    getValue: (field: string) => {
      if (!towerData?.data) return undefined;
      return getByFieldPath(towerData.data, field);
    },
    setValue: handleValueChange,
  });

  // 配置表格按钮点击处理
  const handleConfigure = () => {
    editor_multi?.editCommentJs?.('tower');
  };

  // 操作按钮区域
  const actions = (
    <>
      <Segmented
        size="small"
        value={doubleClickMode}
        onChange={(value) => setDoubleClickMode(value as DoubleClickMode)}
        options={[
          { label: '编辑', value: 'change' },
          { label: '添加', value: 'add' },
          { label: '删除', value: 'delete' },
        ]}
      />
      &nbsp;&nbsp;
      <button onClick={handleConfigure}>配置表格</button>
    </>
  );

  return (
    <LeftTab
      id="left5"
      title="全塔属性"
      actions={actions}
      loading={isLoading && !towerData}
      error={error ? String(error) : null}
    >
      {towerData && (
        <Table
          data={towerData.data}
          commentObj={towerData.commentObj}
          onValueChange={handleValueChange}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          onEditClick={handleEditClick}
          doubleClickMode={doubleClickMode}
        />
      )}
    </LeftTab>
  );
};

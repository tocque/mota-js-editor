/**
 * TowerPanel - 全塔属性编辑面板
 *
 * 使用 Table 组件渲染表格，通过 TowerDataStore 获取数据，
 * 实现即时保存（每次修改直接调用 save）。
 */

import { useCallback, useState, type FC } from 'react';
import { LeftTab } from '../components/LeftTab';
import { Table, EditModeSegmented } from '@/components/Table';
import { useTableMetaEditor } from '@/components/Table/hooks';
import { TowerDataStore } from '@/stores/TowerDataStore';
import type { EditMode, TableAction } from '@/components/Table/types';

export const TowerPanel: FC = () => {
  // 从 Store 获取数据和保存方法
  const { data, commentObj, isLoading, error, save } = TowerDataStore.useStore();

  // 使用 useTableMetaEditor 获取编辑器打开函数
  const { openEditor } = useTableMetaEditor('dataComment');

  // 在 Panel 层维护 editMode
  const [editMode, setEditMode] = useState<EditMode>('change');

  // 统一的变更处理 - 即时保存
  const handleChange = useCallback(
    async (action: TableAction) => {
      await save([action]);
    },
    [save],
  );

  // 配置表格按钮点击处理 - 使用 useTableMetaEditor 打开编辑器
  const handleConfigure = useCallback(() => {
    openEditor();
  }, [openEditor]);

  // 操作按钮区域
  const actions = (
    <>
      <EditModeSegmented value={editMode} onChange={setEditMode} />
      &nbsp;&nbsp;
      <button onClick={handleConfigure}>配置表格</button>
    </>
  );

  return (
    <LeftTab
      id="left5"
      title="全塔属性"
      actions={actions}
      loading={isLoading && !data}
      error={error ? String(error) : null}
    >
      {data && commentObj && (
        <Table
          data={data}
          commentObj={commentObj}
          onChange={handleChange}
          editMode={editMode}
        />
      )}
    </LeftTab>
  );
};

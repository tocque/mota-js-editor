/**
 * TowerPanel - 全塔属性编辑面板
 *
 * 使用 Table 组件渲染表格，通过 TowerDataStore 获取数据，
 * 使用 useActionList 管理修改列表，实现批量保存体验。
 */

import type { FC } from 'react';
import {
  Table,
  createEditClickHandler,
  createDoubleClickHandler,
} from '@/components/Table';
import { TowerDataStore } from '@/stores/TowerDataStore';
import { useActionList } from '@/hooks/useActionList';
import { checkRange, validateId } from '@/components/Table/utils/validation';

export const TowerPanel: FC = () => {
  // 从 Store 获取数据和保存方法
  const { towerData, isLoading, error, save, isSaving } = TowerDataStore.useStore();

  // Panel 层管理自己的 actionList
  const { actionList, hasChanges, addChange, addAdd, addDelete, clear } = useActionList();

  // 创建编辑按钮点击处理函数
  const handleEditClick = createEditClickHandler({
    getValue: (field) => {
      // 从 towerData.data 中获取值
      if (!towerData?.data) return undefined;
      try {
        // field 格式如 "['main']['floorIds']"，需要解析并获取值
        const getter = new Function('data', `return data${field}`);
        return getter(towerData.data);
      } catch {
        return undefined;
      }
    },
    setValue: (field, value) => {
      addChange(field, value);
    },
  });

  // 创建双击处理函数
  const handleDoubleClick = createDoubleClickHandler({
    getValue: (field) => {
      if (!towerData?.data) return undefined;
      try {
        const getter = new Function('data', `return data${field}`);
        return getter(towerData.data);
      } catch {
        return undefined;
      }
    },
    setValue: (field, value) => {
      addChange(field, value);
    },
    onAdd: (field) => {
      // 获取父对象的现有键
      let existingKeys: string[] = [];
      if (towerData?.data) {
        try {
          const getter = new Function('data', `return data${field}`);
          const parentObj = getter(towerData.data);
          if (parentObj && typeof parentObj === 'object') {
            existingKeys = Object.keys(parentObj);
          }
        } catch {
          // 忽略错误
        }
      }

      // 提示用户输入新项 ID
      const id = prompt('请输入新项的 ID');
      if (id == null) return;

      // 验证 ID
      const validation = validateId(id, existingKeys, false);
      if (!validation.valid) {
        printe?.(validation.error || 'ID 无效');
        return;
      }

      addAdd(field, id);
    },
    onDelete: (field, config) => {
      // 检查是否允许删除（null 是否在范围内）
      if (!checkRange(config, null)) {
        printe?.(field + ' : 该值不允许为null，无法删除');
        return;
      }

      if (confirm('确定要删除吗？')) {
        addDelete(field);
      }
    },
  });

  // 值变更处理
  const handleValueChange = (field: string, value: unknown) => {
    addChange(field, value);
  };

  // 添加项处理
  const handleAddItem = (field: string, id: string) => {
    addAdd(field, id);
  };

  // 删除项处理
  const handleDeleteItem = (field: string) => {
    addDelete(field);
  };

  // 保存时传入 actionList，成功后清空
  const handleSave = async () => {
    if (actionList.length === 0) return;
    try {
      await save(actionList);
      clear();
    } catch {
      // 错误已在 TowerDataStore 中处理
    }
  };

  // 添加按钮点击处理
  const handleAdd = () => {
    editor?.mode?.changeDoubleClickModeByButton?.('add');
  };

  // 配置表格按钮点击处理
  const handleConfigure = () => {
    editor_multi?.editCommentJs?.('tower');
  };

  // 加载中状态
  if (isLoading && !towerData) {
    return (
      <div id="left5" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
        <h3 className="leftTabHeader">全塔属性</h3>
        <div className="leftTabContent">加载中...</div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div id="left5" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
        <h3 className="leftTabHeader">全塔属性</h3>
        <div className="leftTabContent">加载失败: {String(error)}</div>
      </div>
    );
  }

  return (
    <div id="left5" className="leftTab" style={{ zIndex: -1, opacity: 0 }}>
      <h3 className="leftTabHeader">
        全塔属性&nbsp;&nbsp;
        <button onClick={handleSave} disabled={!hasChanges || isSaving}>
          {isSaving ? '保存中...' : '保存'}
          {hasChanges && !isSaving && ' *'}
        </button>
        &nbsp;&nbsp;
        <button onClick={handleAdd}>添加</button>
        &nbsp;&nbsp;
        <button onClick={handleConfigure}>配置表格</button>
      </h3>
      <div className="leftTabContent">
        <div className="etable">
          {towerData && (
            <Table
              data={towerData.data}
              commentObj={towerData.commentObj}
              onValueChange={handleValueChange}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onEditClick={handleEditClick}
              onDoubleClick={handleDoubleClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

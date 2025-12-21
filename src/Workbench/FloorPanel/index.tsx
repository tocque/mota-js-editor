/**
 * FloorPanel - 楼层属性编辑面板
 *
 * 使用 Table 组件渲染表格，通过 FloorDataStore 获取数据，
 * 实现即时保存（每次修改直接调用 save）。
 *
 * 包含两个特殊功能：
 * 1. 修改 floorId - 重命名楼层，无需刷新页面
 * 2. 修改地图大小 - 调整地图尺寸和偏移
 */

import { useCallback, useState, type FC } from 'react';
import { LeftTab } from '../components/LeftTab';
import { Table, EditModeSegmented } from '@/components/Table';
import { useTableMetaEditor } from '@/components/Table/hooks';
import { useFloorDataStore } from '@/stores/FloorDataStore';
import { useCurrentFloorId, setCurrentFloorId } from '@/stores/editorState';
import { saveFloorWithNewId } from '@/services/floor';
import { saveActions as saveTowerActions } from '@/services/tower';
import { queryClient, FLOOR_QUERY_KEY } from '@/queryClient';
import { isValidFloorId } from '@/utils/string';
import type { EditMode, TableAction } from '@/components/Table/types';
import type { FloorData } from '@/types';

// Legacy 编辑器类型扩展（未在类型定义中的属性）
interface LegacyEditor {
  currentFloorId: string;
  currentFloorData: FloorData;
  dom: {
    maps: string[];
  };
  file: {
    saveFloor: (floorData: FloorData, callback: (err: string | null) => void) => void;
  };
}

// Legacy main 对象类型
interface LegacyMain {
  floorIds: string[];
}

export const FloorPanel: FC = () => {
  // 使用 TanStack Store 获取当前楼层 ID
  const currentFloorId = useCurrentFloorId();

  // 从 Store 获取数据和保存方法
  const { data, commentObj, isLoading, error, save } = useFloorDataStore({
    floorId: currentFloorId,
  });

  // 使用 useTableMetaEditor 获取编辑器打开函数
  const { openEditor } = useTableMetaEditor('comment');

  // 在 Panel 层维护 editMode
  const [editMode, setEditMode] = useState<EditMode>('change');

  // 修改 floorId 相关状态
  const [floorIdValue, setFloorIdValue] = useState('');

  // 修改地图大小相关状态
  const [newWidth, setNewWidth] = useState('13');
  const [newHeight, setNewHeight] = useState('13');
  const [offsetX, setOffsetX] = useState('0');
  const [offsetY, setOffsetY] = useState('0');

  // 统一的变更处理 - 即时保存
  const handleChange = useCallback(
    async (action: TableAction) => {
      await save([action]);
    },
    [save],
  );

  // 配置表格按钮点击处理
  const handleConfigure = useCallback(() => {
    openEditor();
  }, [openEditor]);

  // 修改 floorId
  const handleChangeFloorId = useCallback(async () => {
    const newFloorId = floorIdValue.trim();
    if (!newFloorId) {
      printe('请输入要修改到的 floorId');
      return;
    }

    // 验证格式
    if (!isValidFloorId(newFloorId)) {
      printe(`楼层名 ${newFloorId} 不合法！请使用字母、数字、下划线，且不能以数字开头！`);
      return;
    }

    // 检查是否已存在
    const legacyMain = (window as unknown as { main: LegacyMain }).main;
    if (legacyMain.floorIds.includes(newFloorId)) {
      printe(`楼层名 ${newFloorId} 已存在！`);
      return;
    }

    try {
      // 1. 保存新文件
      await saveFloorWithNewId(currentFloorId, newFloorId);

      // 2. 更新全塔属性中的 floorIds
      const newFloorIds = [...core.floorIds];
      const index = newFloorIds.indexOf(currentFloorId);
      if (index >= 0) {
        newFloorIds[index] = newFloorId;
      }
      await saveTowerActions([
        ['change', "['main']['floorIds']", newFloorIds],
      ]);

      // 3. 更新内存状态（全局状态）
      const legacyEditor = editor as unknown as LegacyEditor;
      core.floorIds[index] = newFloorId;
      legacyEditor.currentFloorId = newFloorId;
      legacyEditor.currentFloorData.floorId = newFloorId;

      // 4. 更新 core.floors 引用
      core.floors[newFloorId] = core.floors[currentFloorId];
      delete core.floors[currentFloorId];

      // 5. 更新 TanStack Store 状态
      setCurrentFloorId(newFloorId);

      // 6. 刷新 React Query 缓存
      queryClient.invalidateQueries({ queryKey: FLOOR_QUERY_KEY(newFloorId) });

      printf('修改 floorId 成功！');
      setFloorIdValue('');
    } catch (err) {
      printe(String(err));
    }
  }, [currentFloorId, floorIdValue]);

  // 修改地图大小
  const handleChangeFloorSize = useCallback(async () => {
    const width = parseInt(newWidth);
    const height = parseInt(newHeight);
    let x = parseInt(offsetX);
    let y = parseInt(offsetY);

    // 参数验证
    if (!(width <= 128 && height <= 128 && x >= 0 && y >= 0)) {
      printe('参数错误！宽高不得大于128，偏移量不得小于0');
      return;
    }

    const legacyEditor = editor as unknown as LegacyEditor;
    const currentFloorData = legacyEditor.currentFloorData;
    const currWidth = currentFloorData.width ?? 13;
    const currHeight = currentFloorData.height ?? 13;

    if (width < currWidth) x = -x;
    if (height < currHeight) y = -y;

    // Step 1: 创建一个新的地图
    const cloneFn = core.clone as <T>(obj: T) => T;
    const newFloorData = cloneFn(currentFloorData) as FloorData & Record<string, unknown>;
    newFloorData.width = width;
    newFloorData.height = height;

    // Step 2: 更新 map, bgmap 和 fgmap
    legacyEditor.dom.maps.forEach((name: string) => {
      newFloorData[name] = [];
      const currentMap = currentFloorData[name] as number[][] | undefined;
      if (currentMap && currentMap.length > 0) {
        for (let j = 0; j < height; ++j) {
          (newFloorData[name] as number[][])[j] = [];
          for (let i = 0; i < width; ++i) {
            const oi = i - x;
            const oj = j - y;
            if (oi >= 0 && oi < currWidth && oj >= 0 && oj < currHeight) {
              (newFloorData[name] as number[][])[j].push(currentMap[oj][oi]);
            } else {
              (newFloorData[name] as number[][])[j].push(0);
            }
          }
        }
      }
    });

    // Step 3: 更新所有坐标
    const coordFields = [
      'events',
      'beforeBattle',
      'afterBattle',
      'afterGetItem',
      'afterOpenDoor',
      'changeFloor',
      'autoEvent',
      'cannotMove',
    ];
    coordFields.forEach((name) => {
      newFloorData[name] = {};
      const currentField = currentFloorData[name] as Record<string, unknown> | undefined;
      if (!currentField) return;
      for (const loc in currentField) {
        const oxy = loc.split(',');
        const ox = parseInt(oxy[0]);
        const oy = parseInt(oxy[1]);
        const nx = ox + x;
        const ny = oy + y;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          (newFloorData[name] as Record<string, unknown>)[nx + ',' + ny] = cloneFn(currentField[loc]);
        }
      }
    });

    // Step 4: 上楼点 & 下楼点
    (['upFloor', 'downFloor'] as const).forEach((name) => {
      const coord = newFloorData[name];
      if (coord && Array.isArray(coord) && coord.length === 2) {
        coord[0] += x;
        coord[1] += y;
      }
    });

    // 保存并刷新
    legacyEditor.file.saveFloor(newFloorData, (err: string | null) => {
      if (err) {
        printe(err);
        throw err;
      }
      alert('地图更改大小成功，即将刷新地图...\n请检查所有点的事件是否存在问题。');
      window.location.reload();
    });
  }, [newWidth, newHeight, offsetX, offsetY]);

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
      id="left4"
      title="楼层属性"
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

      {/* 修改 floorId */}
      <div id="changeFloorId">
        <input
          value={floorIdValue}
          onChange={(e) => setFloorIdValue(e.target.value)}
          placeholder="修改 floorId 为"
        />
        <button onClick={handleChangeFloorId}>确定</button>
      </div>

      {/* 修改地图大小 */}
      <div id="changeFloorSize" style={{ fontSize: 13 }}>
        修改地图大小：宽
        <input
          style={{ width: 25 }}
          value={newWidth}
          onChange={(e) => setNewWidth(e.target.value)}
        />
        ，高
        <input
          style={{ width: 25 }}
          value={newHeight}
          onChange={(e) => setNewHeight(e.target.value)}
        />
        ，偏移 x
        <input
          style={{ width: 25 }}
          value={offsetX}
          onChange={(e) => setOffsetX(e.target.value)}
        />
        y
        <input
          style={{ width: 25 }}
          value={offsetY}
          onChange={(e) => setOffsetY(e.target.value)}
        />
        <button onClick={handleChangeFloorSize}>确定</button>
      </div>
    </LeftTab>
  );
};

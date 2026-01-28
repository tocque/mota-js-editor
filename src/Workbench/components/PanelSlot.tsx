/**
 * PanelSlot - 面板插槽组件
 *
 * 使用 React 19 的 Activity 组件控制面板的显示/隐藏：
 * - 激活时：mode="visible"，正常渲染，effects 运行
 * - 未激活时：mode="hidden"，display:none 隐藏，effects unmount（停止数据订阅），但保留状态
 *
 * 使用方式：
 * <PanelSlot panelId="tower">
 *   <TowerPanel />
 * </PanelSlot>
 */

import { Activity, type ReactNode } from 'react';
import { useIsPanelActive, type PanelId } from '@/stores/PanelStore';

export interface PanelSlotProps {
  /** 面板 ID */
  panelId: PanelId;
  /** 子组件 */
  children: ReactNode;
}

export function PanelSlot({ panelId, children }: PanelSlotProps) {
  const isActive = useIsPanelActive(panelId);

  return (
    <Activity mode={isActive ? 'visible' : 'hidden'}>
      {children}
    </Activity>
  );
}

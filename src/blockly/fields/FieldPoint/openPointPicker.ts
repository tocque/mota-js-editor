/**
 * 弹窗桥接 - 调用 SelectPoint 弹窗
 *
 * 通过全局 API editor.uievent.selectPoint() 调用 React 弹窗
 */

import { isRelativeFloor } from './types';

export interface OpenPointPickerOptions {
  x: number;
  y: number;
  floorId?: string;
  /** 是否包含楼层字段 */
  includeFloor: boolean;
  /**
   * 是否允许选择相对楼层（:now / :before / :next）
   * - true: 选点器显示"当前楼/前一楼/后一楼"选项
   * - false: 只能选择具体楼层
   *
   * 注意：当前旧版选点器不支持相对楼层选择，此参数预留给未来 React 版选点器使用
   */
  allowRelativeFloor: boolean;
  onSelect: (x: number, y: number, floorId?: string) => void;
  onCancel?: () => void;
}

/**
 * 获取当前编辑的楼层 ID
 */
function getCurrentEditingFloorId(): string {
  if (typeof editor !== 'undefined' && editor.currentFloorId) {
    return editor.currentFloorId;
  }
  return '';
}

/**
 * 打开地图选点器
 *
 * 通过全局 API 调用已有的 SelectPoint 弹窗
 *
 * 相对楼层处理：
 * - 如果当前值是相对楼层（:now / :before / :next），地图预览显示当前编辑楼层
 * - 选点器返回的具体楼层会保留，不会自动转换为相对楼层
 * - 未来 React 版选点器将支持直接选择相对楼层
 */
export function openPointPicker(options: OpenPointPickerOptions): void {
  // 检查全局 API 是否可用
  if (typeof editor === 'undefined' || !editor.uievent?.selectPoint) {
    console.warn('[FieldPoint] editor.uievent.selectPoint not available');
    options.onCancel?.();
    return;
  }

  // 获取当前编辑的楼层
  const currentEditingFloorId = getCurrentEditingFloorId();

  // 计算地图预览使用的楼层
  // 如果当前值是相对楼层，地图预览显示当前编辑楼层
  const previewFloorId = isRelativeFloor(options.floorId)
    ? currentEditingFloorId
    : options.floorId || currentEditingFloorId || '';

  editor.uievent.selectPoint(
    previewFloorId,
    options.x,
    options.y,
    false, // bigmap
    (selectedFloorId: string, x: number | string, y: number | string) => {
      // 转换返回值为数字
      const numX = typeof x === 'number' ? x : parseInt(x, 10) || 0;
      const numY = typeof y === 'number' ? y : parseInt(y, 10) || 0;

      // 如果不包含楼层，直接返回 undefined
      if (!options.includeFloor) {
        options.onSelect(numX, numY, undefined);
        return;
      }

      // 返回选中的楼层 ID
      // 注意：当前旧版选点器只能返回具体楼层，相对楼层需要用户通过其他方式设置
      // 或等待未来 React 版选点器支持
      options.onSelect(numX, numY, selectedFloorId);
    },
  );
}

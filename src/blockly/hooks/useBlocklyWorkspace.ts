/**
 * Blockly Workspace 管理 Hook
 *
 * 封装 Blockly V12 Workspace 的初始化、销毁和常用操作
 */

import { useEffect, useRef, useCallback, useSyncExternalStore, useMemo } from 'react';
import type { RefObject } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import * as Zh from 'blockly/msg/zh-hans'; 

import { registerAllBlocks } from '../blocks';
import { dataToWorkspaceStateWithEntry, eventsToWorkspaceState } from '../parser';
import type { EventData } from '../parser/types';
import { generateToolboxConfig } from '../toolbox';
import { registerToolboxCallbacks } from '../toolbox/callbacks';

/**
 * Workspace 配置选项
 */
export interface WorkspaceOptions {
  /** 是否只读模式 */
  readOnly?: boolean;
  /** 是否显示工具箱 */
  showToolbox?: boolean;
  /** Blockly 媒体资源路径 */
  mediaPath?: string;
  /** 当前编辑的入口类型（用于动态筛选入口块） */
  entryType?: string;
}

/**
 * 校验结果
 */
export interface ValidationResult {
  /** 是否通过校验 */
  valid: boolean;
  /** 错误信息列表 */
  errors: string[];
  /** 未连接的块数量 */
  disconnectedBlockCount: number;
}

/**
 * Workspace API
 */
export interface WorkspaceAPI {
  /** 获取 Blockly Workspace 实例（在回调/Effect中调用） */
  getWorkspace: () => Blockly.WorkspaceSvg | null;
  /** 是否已初始化 */
  isReady: boolean;
  /** 加载 JSON 状态到工作区 */
  loadState: (state: object) => void;
  /** 保存工作区状态为 JSON */
  saveState: () => object;
  /** 生成代码（只生成与入口块相连的块） */
  generateCode: () => string;
  /** 清空工作区 */
  clear: () => void;
  /** 加载事件数据到工作区（解析为细粒度块） */
  loadEventData: (events: EventData[]) => void;
  /** 加载带入口块的数据到工作区 */
  loadEntryData: (data: unknown, entryType: string) => void;
  /** 获取顶层入口块类型 */
  getTopBlockType: () => string | null;
  /** 校验工作区（检查是否有未连接的块） */
  validate: () => ValidationResult;
}

// 用于追踪积木块是否已注册
let blocksRegistered = false;

/**
 * 检查块是否为入口块（_m 后缀的顶级块）
 */
function isEntryBlock(block: Blockly.Block): boolean {
  return block.type.endsWith('_m');
}

/**
 * 获取所有入口块
 */
function getEntryBlocks(workspace: Blockly.WorkspaceSvg): Blockly.Block[] {
  const topBlocks = workspace.getTopBlocks(false);
  return topBlocks.filter(isEntryBlock);
}

/**
 * 获取未连接到入口块的顶级块
 */
function getDisconnectedBlocks(workspace: Blockly.WorkspaceSvg): Blockly.Block[] {
  const topBlocks = workspace.getTopBlocks(false);
  return topBlocks.filter((block) => !isEntryBlock(block));
}

// 工作区就绪状态订阅管理
type ReadyListener = () => void;
const readyListeners = new Set<ReadyListener>();
let workspaceReadyState = false;

function subscribeToReady(callback: ReadyListener) {
  readyListeners.add(callback);
  return () => {
    readyListeners.delete(callback);
  };
}

function getReadySnapshot() {
  return workspaceReadyState;
}

function setReadyState(ready: boolean) {
  workspaceReadyState = ready;
  readyListeners.forEach((listener) => listener());
}

/**
 * Blockly Workspace 管理 Hook
 *
 * @param containerRef - 容器元素的 ref
 * @param options - 配置选项
 * @returns Workspace API
 */
export function useBlocklyWorkspace(
  containerRef: RefObject<HTMLDivElement | null>,
  options: WorkspaceOptions = {},
): WorkspaceAPI {
  const {
    readOnly = false,
    showToolbox = true,
    mediaPath = '_server/blockly/media/',
    entryType,
  } = options;

  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const isReady = useSyncExternalStore(subscribeToReady, getReadySnapshot);

  // 初始化 Workspace
  useEffect(() => {
    if (!containerRef.current) return;

    // 注册积木块（只注册一次）
    if (!blocksRegistered) {
      registerAllBlocks();
      blocksRegistered = true;
      // @ts-expect-error 类型推导有问题
      Blockly.setLocale(Zh);
    }

    // 创建工具箱配置
    const toolbox = showToolbox
      ? generateToolboxConfig(options.entryType)
      : undefined;

    // 创建 Workspace
    const workspace = Blockly.inject(containerRef.current, {
      toolbox,
      media: mediaPath,
      readOnly,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: !readOnly,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });

    workspaceRef.current = workspace;
    setReadyState(true);

    // 注册工具箱动态分类回调
    if (showToolbox) {
      registerToolboxCallbacks(workspace, entryType);
    }

    // 清理函数
    return () => {
      workspace.dispose();
      workspaceRef.current = null;
      setReadyState(false);
    };
  }, [containerRef, readOnly, showToolbox, mediaPath, entryType]);

  // 加载状态
  const loadState = useCallback((state: object) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    Blockly.serialization.workspaces.load(state, workspace);
  }, []);

  // 保存状态
  const saveState = useCallback((): object => {
    const workspace = workspaceRef.current;
    if (!workspace) return {};

    return Blockly.serialization.workspaces.save(workspace);
  }, []);

  // 生成代码（只生成与入口块相连的块）
  const generateCode = useCallback((): string => {
    const workspace = workspaceRef.current;
    if (!workspace) return '';

    // 获取所有入口块
    const entryBlocks = getEntryBlocks(workspace);

    if (entryBlocks.length === 0) {
      return '';
    }

    // 只为入口块生成代码
    const codeBlocks: string[] = [];
    for (const block of entryBlocks) {
      const code = javascriptGenerator.blockToCode(block);
      if (code) {
        // blockToCode 可能返回 [code, order] 数组或字符串
        const codeStr = Array.isArray(code) ? code[0] : code;
        if (codeStr) {
          codeBlocks.push(codeStr);
        }
      }
    }

    return codeBlocks.join('\n');
  }, []);

  // 清空工作区
  const clear = useCallback(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    workspace.clear();
  }, []);

  // 加载事件数据（解析为细粒度块）
  const loadEventData = useCallback((events: EventData[]) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    // 清空工作区
    workspace.clear();

    // 使用解析器将事件转换为 Blockly State
    const state = eventsToWorkspaceState(events);

    // 加载到工作区
    Blockly.serialization.workspaces.load(state, workspace);
  }, []);

  // 加载带入口块的数据
  const loadEntryData = useCallback((data: unknown, entryType: string) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;

    // 清空工作区
    workspace.clear();

    // 使用解析器将数据转换为带入口块的 Blockly State
    const state = dataToWorkspaceStateWithEntry(data, entryType);

    // 加载到工作区
    Blockly.serialization.workspaces.load(state, workspace);
  }, []);

  // 获取顶层入口块类型
  const getTopBlockType = useCallback((): string | null => {
    const workspace = workspaceRef.current;
    if (!workspace) return null;

    const topBlocks = workspace.getTopBlocks(false);
    if (topBlocks.length === 0) return null;

    return topBlocks[0].type;
  }, []);

  // 获取 Workspace 实例（应在回调或 Effect 中调用）
  const getWorkspace = useCallback((): Blockly.WorkspaceSvg | null => workspaceRef.current, []);

  // 校验工作区（检查是否有未连接的块）
  const validate = useCallback((): ValidationResult => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return { valid: true, errors: [], disconnectedBlockCount: 0 };
    }

    const disconnectedBlocks = getDisconnectedBlocks(workspace);
    const errors: string[] = [];

    if (disconnectedBlocks.length > 0) {
      errors.push(
        `存在 ${disconnectedBlocks.length} 个未连接到入口块的块，请将它们连接到入口块或删除`,
      );

      // 添加具体的块类型信息（可选）
      const blockTypes = [...new Set(disconnectedBlocks.map((b) => b.type))];
      if (blockTypes.length <= 5) {
        errors.push(`未连接的块类型: ${blockTypes.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      disconnectedBlockCount: disconnectedBlocks.length,
    };
  }, []);

  // 使用 useMemo 稳定返回对象的引用
  return useMemo<WorkspaceAPI>(
    () => ({
      getWorkspace,
      isReady,
      loadState,
      saveState,
      generateCode,
      clear,
      loadEventData,
      loadEntryData,
      getTopBlockType,
      validate,
    }),
    [
      getWorkspace,
      isReady,
      loadState,
      saveState,
      generateCode,
      clear,
      loadEventData,
      loadEntryData,
      getTopBlockType,
      validate,
    ],
  );
}

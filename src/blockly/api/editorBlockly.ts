/**
 * EditorBlockly 兼容层 API
 *
 * 提供与旧版 editor_blockly 兼容的接口
 * 用于与现有的表格编辑器集成
 */

import type { BlocklyWorkspaceRef } from '../components/BlocklyWorkspace';
import { getEntryBlockType } from '../parser';

/**
 * 编辑回调接口
 */
export interface EditorBlocklyCallbacks {
  /** 确认回调，接收已解析的值 */
  onConfirm: (value: unknown) => void;
}

/**
 * 编辑上下文
 */
interface EditContext {
  /** 入口类型 */
  entryType: string;
  /** 原始数据 */
  originalValue: unknown;
  /** 回调函数 */
  callbacks: EditorBlocklyCallbacks;
}

/**
 * 入口类型到期望的块类型映射
 * 用于验证工作区中的入口块类型是否正确
 */
function getExpectedBlockType(entryType: string): string {
  return getEntryBlockType(entryType);
}

/**
 * 判断是否为 "common" 类入口
 * 这些入口类型可以使用 common_m 块
 */
function isCommonEntry(entryType: string): boolean {
  const commonEntries = [
    'common',
    'commonEvent',
    'item',
    'beforeBattle',
    'afterBattle',
    'afterOpenDoor',
    'firstArrive',
    'eachArrive',
  ];
  return commonEntries.includes(entryType);
}

/**
 * EditorBlockly API 接口
 */
export interface EditorBlocklyApi {
  /** 导入事件数据 */
  import: (
    initialValue: unknown,
    options: { type?: string },
    callbacks: EditorBlocklyCallbacks
  ) => void;
  /** 确认/应用编辑 */
  confirm: (apply?: boolean) => void;
  /** 取消编辑 */
  cancel: () => void;
  /** 解析代码为积木块 - 未实现 */
  parse: () => void;
  /** 从按钮选择地图点 - 未实现 */
  selectPointFromButton: () => void;
  /** 触发中文名替换 - 未实现 */
  triggerReplace: () => void;
  /** 触发展开逻辑运算 - 未实现 */
  triggerExpandCompare: () => void;
}

/**
 * 创建 EditorBlockly 兼容层 API
 *
 * @param getWorkspaceRef - 获取 BlocklyWorkspace ref 的函数
 * @param showEditor - 显示编辑器的函数
 * @param hideEditor - 隐藏编辑器的函数
 */
export function createEditorBlocklyApi(
  getWorkspaceRef: () => BlocklyWorkspaceRef | null,
  showEditor: () => void,
  hideEditor: () => void,
): EditorBlocklyApi {
  // 当前编辑上下文
  let currentContext: EditContext | null = null;

  return {
    import(
      initialValue: unknown,
      options: { type?: string } = {},
      callbacks: EditorBlocklyCallbacks
    ) {
      const entryType = options.type || 'common';

      // 保存编辑上下文
      currentContext = {
        entryType,
        originalValue: initialValue,
        callbacks,
      };

      // 加载到 Workspace（使用入口块）
      const workspaceRef = getWorkspaceRef();
      if (workspaceRef) {
        // 检查工作区是否准备好
        const api = workspaceRef.getApi();
        if (api && api.isReady) {
          // 使用 loadEntryData 方法加载带入口块的数据
          workspaceRef.loadEntryData(initialValue, entryType);
        } else {
          // 如果还没准备好，延迟加载
          const checkReady = () => {
            const checkApi = workspaceRef.getApi();
            if (checkApi && checkApi.isReady) {
              workspaceRef.loadEntryData(initialValue, entryType);
            } else {
              setTimeout(checkReady, 50);
            }
          };
          setTimeout(checkReady, 50);
        }
      }

      // 显示编辑器
      showEditor();
    },

    confirm(apply = false) {
      if (!currentContext) {
        console.warn('[EditorBlockly] 没有活动的编辑上下文');
        return;
      }

      // 从 Workspace 获取内容
      const workspaceRef = getWorkspaceRef();
      if (!workspaceRef) {
        console.warn('[EditorBlockly] Workspace 不可用');
        return;
      }

      const api = workspaceRef.getApi();
      const workspace = api?.getWorkspace();

      if (!api || !api.isReady || !workspace) {
        console.warn('[EditorBlockly] Workspace 未就绪');
        return;
      }

      // 获取顶层块
      const topBlocks = workspace.getTopBlocks(false);

      // 验证入口块数量
      if (topBlocks.length >= 2) {
        alert('入口方块只能有一个');
        return;
      }

      // 验证入口块类型
      if (topBlocks.length === 1) {
        const blockType = topBlocks[0].type;
        const expectedType = getExpectedBlockType(currentContext.entryType);
        const isCommon = isCommonEntry(currentContext.entryType);

        // 检查类型是否匹配
        if (blockType !== expectedType && !(isCommon && blockType === 'mota_common_m')) {
          alert(`入口方块类型错误，期望 ${expectedType}，实际为 ${blockType}`);
          return;
        }
      }

      let resultValue: unknown;

      try {
        // 生成代码
        const code = api.generateCode();

        if (!code || !code.trim()) {
          // 空工作区，根据入口类型返回空值
          resultValue = currentContext.entryType === 'shop' ? [] : null;
        } else {
          // 入口块的 generator 直接输出完整的 JSON 结构
          // 清理末尾换行
          const cleanedCode = code.trim();

          // 解析 JSON，失败则阻止确认
          try {
            resultValue = JSON.parse(cleanedCode);
          } catch (parseError) {
            console.warn('[EditorBlockly] JSON 解析失败:', parseError);
            alert('生成的代码不是有效的 JSON，无法保存');
            return;
          }
        }
      } catch (e) {
        console.warn('[EditorBlockly] 代码生成失败:', e);
        alert('代码生成失败: ' + (e as Error).message);
        return;
      }

      // 调用回调，传递已解析的值
      currentContext.callbacks.onConfirm(resultValue);

      // 如果是应用模式（不关闭编辑器），显示保存成功提示
      if (apply) {
        alert('保存成功！');
      } else {
        // 关闭编辑器
        currentContext = null;
        hideEditor();
      }
    },

    cancel() {
      currentContext = null;
      hideEditor();
    },

    parse() {
      throw new Error('Not implemented: parse');
    },

    selectPointFromButton() {
      throw new Error('Not implemented: selectPointFromButton');
    },

    triggerReplace() {
      throw new Error('Not implemented: triggerReplace');
    },

    triggerExpandCompare() {
      throw new Error('Not implemented: triggerExpandCompare');
    },
  };
}

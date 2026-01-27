/**
 * TernServerInitializer - Tern 服务器初始化组件
 *
 * 无 UI 的逻辑组件，用于聚合数据源并创建 TernServer 实例。
 * 使用 Suspense 实现细粒度响应，在数据未就绪时挂起。
 *
 * 职责：
 * - 从各服务获取数据（ternDefs, functions, dataComment, core）
 * - 创建 TernServer 实例
 * - 设置 CodeMirror 事件监听（cursorActivity, keyup）
 * - 在 cleanup 时移除事件监听
 */

import { useEffect, type RefObject } from "react";
import type { Editor } from "codemirror";
import { useGameCore } from "@/stores/GameDataStore";
import { useTernDefsSuspense } from "@/hooks/suspense/useTernDefsSuspense";
import { useTableMetaSuspense } from "@/hooks/suspense/useTableMetaSuspense";
import {
  createTernServer,
  type TernServerInstance,
} from "../utils/createTernServer";
import type { CodeMirrorInstance } from "../types";

/**
 * TernServerInitializer 组件属性
 */
interface TernServerInitializerProps {
  /** CodeMirror 编辑器实例 */
  codeEditor: CodeMirrorInstance;
  /** TernServer 实例的 ref，由父组件提供 */
  ref: RefObject<TernServerInstance | null>;
  /** 获取当前自动补全状态的函数 */
  getAutocomplete: () => boolean;
  /** TernServer 就绪时的回调 */
  onReady?: () => void;
}

/**
 * TernServerInitializer - Tern 服务器初始化组件
 *
 * 在 Suspense 边界内使用，当数据未就绪时会挂起。
 * 创建 TernServer 并设置 CodeMirror 事件监听。
 *
 * @example
 * ```tsx
 * <Suspense fallback={null}>
 *   <TernServerInitializer
 *     codeEditor={codeEditorRef.current}
 *     ref={ternServerRef}
 *     getAutocomplete={() => stateRef.current.lintAutocomplete}
 *   />
 * </Suspense>
 * ```
 */
export function TernServerInitializer({
  codeEditor,
  ref,
  getAutocomplete,
  onReady,
}: TernServerInitializerProps) {
  // ========== 数据源 ==========
  // core 从 GameDataStore 获取
  const core = useGameCore();

  // ternDefs 从 ternDefsService 获取（Suspense）
  const ternDefs = useTernDefsSuspense();

  // dataComment 从 tableMetaService 获取（Suspense）
  const dataComment = useTableMetaSuspense("dataComment");

  // functions 使用全局变量
  // 注意：functionsService.getFunctionsData() 返回的是 ScriptData（函数存储为字符串）
  // 但 createTernServer 需要 FunctionsType（可调用的函数对象）
  // 全局 functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a 是通过 script 标签加载的运行时对象
  const functions = functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a;

  // ========== 创建 TernServer 并设置事件 ==========
  useEffect(() => {
    // core 必须存在才能创建 TernServer
    if (!core) return;

    // 创建 TernServer 实例
    const ternServer = createTernServer({
      ternDefs,
      core,
      functions,
      dataComment,
    });
    ref.current = ternServer;

    // ========== Tern 相关事件（原 setupEditorEvents）==========
    let ctrlRelease = Date.now();

    // 光标活动事件 - 更新参数提示和文档
    const handleCursorActivity = (cm: Editor) => {
      const cursor = cm.getCursor();
      if (getAutocomplete() && !(cursor.line === 0 && cursor.ch === 0)) {
        ternServer.updateArgHints(cm);
        ternServer.showDocs(cm);
      }
    };

    // 键盘释放事件 - 触发自动补全
    const handleKeyup = (cm: Editor, event: KeyboardEvent) => {
      if (!event) return;
      const now = Date.now();

      // 记录 Ctrl/Cmd 键释放时间
      if (event.keyCode === 17 || event.keyCode === 91) {
        // 17 = Ctrl, 91 = Cmd
        ctrlRelease = now;
        return;
      }

      // 自动补全触发条件：
      // 1. 自动补全已启用
      // 2. 没有按住 Ctrl
      // 3. 距离上次 Ctrl 释放超过 1 秒
      // 4. 按下的是字母键、点号或下划线
      if (
        getAutocomplete() &&
        !event.ctrlKey &&
        now - ctrlRelease >= 1000 &&
        ((event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
          (!event.shiftKey && event.keyCode === 190) || // .
          (event.shiftKey && event.keyCode === 189)) // _
      ) {
        try {
          ternServer.complete(cm);
        } catch {
          // 忽略补全错误
        }
      }
    };

    // 注册事件监听
    codeEditor.on("cursorActivity", handleCursorActivity);
    codeEditor.on("keyup", handleKeyup);

    // 调用就绪回调
    onReady?.();

    // cleanup：移除事件监听
    return () => {
      codeEditor.off("cursorActivity", handleCursorActivity);
      codeEditor.off("keyup", handleKeyup);
      ref.current = null;
    };
  }, [ternDefs, dataComment, core, codeEditor, getAutocomplete, onReady, ref]);

  // 无 UI 的逻辑组件
  return null;
}

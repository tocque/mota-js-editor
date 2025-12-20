import { useEditor } from "@/stores/EditorStore";
import { useCurrentFn } from "@/hooks/useCurrentFn";
import { useState, useCallback, type FC, useRef } from "react";
import CodeMirror from "codemirror";
import { JSHINT } from "jshint";
import beautifier from "js-beautify";
import {
  commandsName,
  getShortcutKeys,
  DEFAULT_CODEMIRROR_OPTIONS,
  FONT_SIZE_CONFIG_KEY,
  DEFAULT_FONT_SIZE,
  API_DOCS_URL,
  PLUGINS_URL,
  JSHINT_OPTIONS,
} from "./config/commands";
import { createTernServer, type TernServerInstance } from "./utils/createTernServer";
import { setupEditorEvents } from "./handlers/editorEvents";
import { createHandler, type EditContext, type EditorConfig, type Handler } from "./contexts";
import type { CodeMirrorInstance, EditorMultiApi } from "./types";
import { isString } from "es-toolkit";

export const CodeEditor: FC = () => {
  // ========== React State ==========
  const [visible, setVisible] = useState(false);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontBold, setFontBold] = useState(false);
  const [lintEnabled, setLintEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ========== Refs ==========
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<CodeMirrorInstance>(null);
  const ternServerRef = useRef<TernServerInstance>(null);
  const extraKeysRef = useRef<CodeMirror.KeyMap>(null);

  // 当前编辑上下文
  const contextRef = useRef<EditContext | null>(null);

  // 状态 ref（供 legacy API 访问）
  const stateRef = useRef({
    isString: false,
    lintAutocomplete: false,
    preview: null as unknown,
  });

  // ========== useCurrentFn 包装的回调 ==========
  const show = useCurrentFn(() => {
    if (typeof selectBox !== "undefined") {
      selectBox.isSelected(false);
    }
    setVisible(true);
  });

  const hide = useCurrentFn(() => {
    setVisible(false);
  });

  const updateShowPreview = useCurrentFn((showValue: boolean) => {
    setShowPreview(showValue);
  });

  const updateLintEnabled = useCurrentFn((enabled: boolean) => {
    setLintEnabled(enabled);
  });

  const openUrl = useCurrentFn((url: string) => {
    if (editor?.isMobile && !confirm("你确定要离开本页面么？")) return;
    window.open(url, "_blank");
  });

  const getIndent = useCurrentFn((field: string) => {
    if (editor?.mode?.indent) {
      return editor.mode.indent(field);
    }
    return "\t";
  });

  const getEditorMode = useCurrentFn(() => {
    return editor_mode?.mode || "";
  });

  // ========== 编辑器核心函数 ==========

  /**
   * 设置编辑器值并更新 Tern 文档
   */
  const setValue = useCurrentFn((val: string) => {
    const codeEditor = codeEditorRef.current;
    const ternServer = ternServerRef.current;
    if (!codeEditor) return;

    codeEditor.setValue(val || "");
    if (ternServer) {
      ternServer.delDoc("doc");
      ternServer.addDoc("doc", new CodeMirror.Doc(val || "", "javascript"));
    }
  });

  /**
   * 获取编辑器值
   */
  const getValue = useCurrentFn(() => {
    return codeEditorRef.current?.getValue() || "";
  });

  /**
   * 格式化代码
   */
  const format = useCurrentFn(() => {
    if (!stateRef.current.lintAutocomplete) return;
    const codeEditor = codeEditorRef.current;
    if (!codeEditor) return;

    const offset = codeEditor.getScrollInfo().top || 0;
    setValue(beautifier.js(getValue(), {
      brace_style: "collapse" as const,
      indent_with_tabs: true,
      jslint_happy: true,
    }));
    codeEditor.scrollTo(0, offset);
  });

  /**
   * 检查是否有严重语法错误
   */
  const hasError = useCurrentFn(() => {
    if (!stateRef.current.lintAutocomplete) return false;
    return (
      JSHINT.errors?.filter((e) => e?.code?.startsWith("E")).length > 0
    );
  });

  /**
   * 设置 lint 状态
   */
  const setLint = useCurrentFn((enabled?: boolean) => {
    const codeEditor = codeEditorRef.current;
    if (!codeEditor) return;

    if (typeof enabled === "boolean") {
      stateRef.current.lintAutocomplete = enabled;
    }

    if (stateRef.current.lintAutocomplete) {
      codeEditor.setOption("lint", JSHINT_OPTIONS);
    } else {
      codeEditor.setOption("lint", false);
    }
    // autocomplete 是插件添加的配置项
    (codeEditor as { setOption: (name: string, value: unknown) => void }).setOption("autocomplete", stateRef.current.lintAutocomplete);
    updateLintEnabled(stateRef.current.lintAutocomplete);
  });

  // ========== Event Handlers ==========
  const handleLintToggle = useCallback(() => {
    const newValue = !lintEnabled;
    setLintEnabled(newValue);
    stateRef.current.lintAutocomplete = newValue;
    setLint(newValue);
  }, [lintEnabled, setLint]);

  const handleFontSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setFontSize(value);
      editor?.config?.set?.(FONT_SIZE_CONFIG_KEY, value);
      if (codeEditorRef.current) {
        const wrapper = codeEditorRef.current.getWrapperElement();
        if (wrapper) {
          wrapper.style.fontSize = `${value}px`;
          wrapper.style.fontWeight = fontBold ? "bold" : "normal";
        }
      }
    },
    [fontBold]
  );

  const handleFontBoldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setFontBold(checked);
      if (codeEditorRef.current) {
        const wrapper = codeEditorRef.current.getWrapperElement();
        if (wrapper) {
          wrapper.style.fontSize = `${fontSize}px`;
          wrapper.style.fontWeight = checked ? "bold" : "normal";
        }
      }
    },
    [fontSize]
  );

  const handleCommandChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      e.target.selectedIndex = 0;
      if (!extraKeysRef.current || !codeEditorRef.current) return;
      const extraKeys = extraKeysRef.current;
      if (extraKeys[value]) {
        if (isString(extraKeys[value])) {
          codeEditorRef.current.execCommand(extraKeys[value]);
        } else {
          extraKeys[value](codeEditorRef.current);
        }
      }
    },
    []
  );

  // ========== Handler ref（在 useEditor 中初始化）==========
  const handlerRef = useRef<Handler | null>(null);

  const handleConfirm = useCallback((keep?: boolean) => {
    const context = contextRef.current;
    if (!context) return;

    // 统一的错误检查
    if (stateRef.current.lintAutocomplete) {
      const hasErrors = JSHINT.errors?.filter((e) => e?.code?.startsWith("E")).length > 0;
      if (hasErrors) {
        alert("当前好像存在严重的语法错误，请处理后再保存。\n严重的语法错误可能会导致整个编辑器的崩溃。");
        return;
      }
    }

    context.confirm(keep);
    if (!keep) {
      contextRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    const context = contextRef.current;
    if (!context) return;

    context.cancel();
    contextRef.current = null;
  }, []);

  const handleFormat = useCallback(() => {
    if (!stateRef.current.lintAutocomplete) {
      alert("只有代码才能进行格式化操作！");
      return;
    }
    format();
  }, [format]);

  const handlePreview = useCallback(() => {
    const preview = stateRef.current.preview;
    const value = codeEditorRef.current?.getValue() ?? "";
    if (preview) {
      editor?.uievent?.previewEditorMulti?.(preview, value);
    }
  }, []);

  // ========== 初始化 ==========
  useEditor(() => {
    if (!textareaRef.current) return;

    // 从配置加载字体大小
    const savedFontSize =
      editor?.config?.get?.(FONT_SIZE_CONFIG_KEY, DEFAULT_FONT_SIZE) ??
      DEFAULT_FONT_SIZE;
    setFontSize(savedFontSize);

    // 创建 extraKeys 配置
    const extraKeys: CodeMirror.KeyMap = {
      "Ctrl-/": (cm: unknown) => {
        (cm as CodeMirrorInstance & { toggleComment: () => void }).toggleComment();
      },
      "Ctrl-B": (cm: unknown) => {
        ternServerRef.current?.jumpToDef(cm as CodeMirror.Editor);
      },
      "Ctrl-Q": (cm: unknown) => {
        ternServerRef.current?.rename(cm as CodeMirror.Editor);
      },
      "Cmd-F": CodeMirror.commands.findPersistent,
      "Ctrl-F": CodeMirror.commands.findPersistent,
      "Ctrl-R": CodeMirror.commands.replaceAll,
      "Ctrl-D": (cm: unknown) => {
        const cursor = (cm as CodeMirrorInstance).getCursor();
        (cm as CodeMirrorInstance).foldCode(cursor);
      },
      "Ctrl-O": () => openUrl(API_DOCS_URL),
      "Ctrl-P": () => openUrl(PLUGINS_URL),
    };
    extraKeysRef.current = extraKeys;

    // 创建 CodeMirror 实例
    const codeEditor = CodeMirror.fromTextArea(textareaRef.current, {
      ...DEFAULT_CODEMIRROR_OPTIONS,
      extraKeys,
    });
    codeEditorRef.current = codeEditor as unknown as CodeMirrorInstance;

    // 应用保存的字体大小
    const wrapper = codeEditor.getWrapperElement();
    if (wrapper) {
      wrapper.style.fontSize = `${savedFontSize}px`;
    }

    // 创建 Tern Server
    const ternServer = createTernServer({
      ternDefs: terndefs_f6783a0a_522d_417e_8407_94c67b692e50,
      core,
      functions: functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a,
      dataComment: data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc,
    });
    ternServerRef.current = ternServer;

    // 设置编辑器事件
    setupEditorEvents(codeEditor, ternServer, () => stateRef.current.lintAutocomplete);

    // ========== 创建 Handler ==========

    /**
     * 打开编辑器并设置上下文
     */
    const open = (context: EditContext, config: EditorConfig) => {
      // 设置上下文
      contextRef.current = context;

      // 设置状态
      stateRef.current.isString = config.isString ?? false;
      stateRef.current.lintAutocomplete = config.lint ?? false;
      stateRef.current.preview = config.preview ?? null;

      // 设置编辑器值
      setValue(config.initialValue);

      // 更新 UI 状态
      updateShowPreview(!!config.preview);

      // 检查是否为函数代码
      if (config.initialValue.slice(0, 8) === "function") {
        stateRef.current.lintAutocomplete = true;
      }

      // 应用 lint 设置
      setLint();

      // 显示编辑器
      show();

      // 恢复滚动位置
      if (config.scrollTop) {
        codeEditorRef.current?.scrollTo(0, config.scrollTop);
      }
    };

    const handler = createHandler({
      // CodeEditorAPI
      getValue,
      setValue,
      format,
      hide,
      getScrollInfo: () => codeEditorRef.current?.getScrollInfo() || { top: 0 },
      scrollTo: (x, y) => codeEditorRef.current?.scrollTo(x, y),
      getIsString: () => stateRef.current.isString,
      printf,
      printe,
      // HandlerDeps
      open,
      getIndent,
      getEditorMode,
      setLint,
    });

    // 保存 handler 引用
    handlerRef.current = handler;

    // ========== 构建 Legacy API ==========
    // 仅暴露实际被外部使用的 API
    const legacyApi: EditorMultiApi = {
      // 属性 (editor_ui.ts 检查状态)
      get id() {
        return contextRef.current?.id ?? "";
      },

      // Table handler (editor_table.ts)
      import: handler.importFromTable,
      confirm: (keep?: boolean) => {
        handleConfirm(keep);
      },

      // Blockly handler (editor_blockly.ts)
      multiLineEdit: handler.multiLineEdit,

      // File handler (各面板组件)
      editCommentJs: handler.editCommentJs,
    };

    // 暴露到全局
    (window as unknown as { editor_multi: EditorMultiApi }).editor_multi = legacyApi;
  });

  return (
    <div
      id="left7"
      className={visible ? "" : "hidden-panel"}
      style={visible ? undefined : { zIndex: -1, opacity: 0 }}
    >
      {/* 多行文本编辑器 */}
      <div>
        <button onClick={() => handleConfirm()}>确认</button>
        <button onClick={() => handleCancel()}>取消</button>
        <button onClick={() => handleConfirm(true)}>应用</button>
        <button onClick={() => handleFormat()}>格式化</button>
        <button
          id="editor_multi_preview"
          style={{ display: showPreview ? "inline" : "none" }}
          onClick={handlePreview}
        >
          预览
        </button>
        <input
          type="checkbox"
          checked={lintEnabled}
          onChange={handleLintToggle}
          id="lintCheckbox"
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        />
        <span style={{ verticalAlign: "middle", marginLeft: "-3px" }}>
          语法检查
        </span>
        <select
          id="codemirrorCommands"
          onChange={handleCommandChange}
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        >
          <option value="">常用命令</option>
          {getShortcutKeys().map((key) => (
            <option key={key} value={key}>
              {commandsName[key]}
            </option>
          ))}
        </select>
        <span>字体大小</span>
        <input
          style={{ width: 40 }}
          type="number"
          value={fontSize}
          onChange={handleFontSizeChange}
          id="editor_multi_fontsize"
        />
        <span>字体加粗</span>
        <input
          type="checkbox"
          checked={fontBold}
          onChange={handleFontBoldChange}
          id="editor_multi_fontweight"
        />
      </div>
      <textarea
        ref={textareaRef}
        id="multiLineCode"
        name="multiLineCode"
        defaultValue={""}
      />
    </div>
  );
}

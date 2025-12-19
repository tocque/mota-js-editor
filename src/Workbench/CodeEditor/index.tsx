import { useEditor } from "@/stores/EditorStore";
import { useCurrentFn } from "@/hooks/useCurrentFn";
import { useState, useCallback, type FC, useRef } from "react";
import {
  commandsName,
  getShortcutKeys,
  createExtraKeys,
  DEFAULT_CODEMIRROR_OPTIONS,
  FONT_SIZE_CONFIG_KEY,
  DEFAULT_FONT_SIZE,
  API_DOCS_URL,
  PLUGINS_URL,
} from "./config/commands";
import { createTernServer, type TernServerInstance } from "./utils/createTernServer";
import { setupEditorEvents } from "./handlers/editorEvents";
import { createLegacyApi, type CodeMirrorInstance } from "./createLegacyApi";

// 声明全局 CodeMirror 和游戏对象
declare const CodeMirror: {
  fromTextArea: (
    textarea: HTMLTextAreaElement,
    options: Record<string, unknown>
  ) => CodeMirrorInstance & {
    on: (event: string, handler: (cm: unknown, event?: KeyboardEvent) => void) => void;
    getCursor: () => { line: number; ch: number };
    getOption: (name: string) => unknown;
  };
  commands: {
    findPersistent: unknown;
    replaceAll: unknown;
  };
  TernServer: new (options: {
    defs: unknown[];
    plugins: Record<string, boolean>;
    useWorker: boolean;
  }) => TernServerInstance;
  Doc: new (value: string, mode: string) => unknown;
};

declare const core: import("./types").CoreType;
declare const functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a: import("./types").FunctionsType;
declare const data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc: import("./types").DataCommentType;
declare const terndefs_f6783a0a_522d_417e_8407_94c67b692e50: unknown[];
declare const selectBox: { isSelected: (value: boolean) => void } | undefined;
declare const editor_mode: { mode: string } | undefined;
declare const editor: {
  isMobile?: boolean;
  mode?: { indent?: (field: string) => string };
  config?: {
    get?: (key: string, defaultValue: number) => number;
    set?: (key: string, value: number) => void;
  };
  uievent?: {
    previewEditorMulti?: (preview: unknown, value: string) => void;
  };
} | undefined;
declare const fs: {
  readFile: (path: string, encoding: string, callback: (err: Error | null, data?: string) => void) => void;
  writeFile: (path: string, data: string, encoding: string, callback: (err: Error | null, data?: unknown) => void) => void;
};
declare function printf(message: string): void;
declare function printe(message: string): void;

export const CodeEditor: FC = () => {
  // ========== React State ==========
  const [visible, setVisible] = useState(false);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontBold, setFontBold] = useState(false);
  const [lintEnabled, setLintEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ========== Refs ==========
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<CodeMirrorInstance | null>(null);
  const ternServerRef = useRef<TernServerInstance | null>(null);
  const extraKeysRef = useRef<Record<string, (cm: unknown) => void> | null>(null);

  // 状态 ref（供 handlers 访问）
  const stateRef = useRef({
    id: "",
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

  // ========== Event Handlers ==========
  const handleLintToggle = useCallback(() => {
    const newValue = !lintEnabled;
    setLintEnabled(newValue);
    stateRef.current.lintAutocomplete = newValue;
    // 同步到 window.editor_multi
    if (window.editor_multi) {
      window.editor_multi.setLint?.(newValue);
    }
  }, [lintEnabled]);

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
      window.editor_multi?.doCommand?.(e.target);
    },
    []
  );

  const handleConfirm = useCallback((keep?: boolean) => {
    window.editor_multi?.confirm?.(keep);
  }, []);

  const handleCancel = useCallback(() => {
    window.editor_multi?.cancel?.();
  }, []);

  const handleFormat = useCallback(() => {
    window.editor_multi?.format?.();
  }, []);

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
    const extraKeys = createExtraKeys({
      toggleComment: (cm) => {
        (cm as CodeMirrorInstance & { toggleComment: () => void }).toggleComment();
      },
      jumpToDef: (cm) => {
        ternServerRef.current?.jumpToDef(cm);
      },
      rename: (cm) => {
        ternServerRef.current?.rename(cm);
      },
      findPersistent: CodeMirror.commands.findPersistent,
      replaceAll: CodeMirror.commands.replaceAll,
      foldCode: (cm) => {
        const cursor = (cm as CodeMirrorInstance).getCursor();
        (cm as CodeMirrorInstance).foldCode(cursor);
      },
      openApiDocs: () => openUrl(API_DOCS_URL),
      openPlugins: () => openUrl(PLUGINS_URL),
    });
    extraKeysRef.current = extraKeys as Record<string, (cm: unknown) => void>;

    // 创建 CodeMirror 实例
    const codeEditor = CodeMirror.fromTextArea(textareaRef.current, {
      ...DEFAULT_CODEMIRROR_OPTIONS,
      extraKeys,
    });
    codeEditorRef.current = codeEditor;

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
      CodeMirror: {
        TernServer: CodeMirror.TernServer,
        Doc: CodeMirror.Doc,
      },
    });
    ternServerRef.current = ternServer;

    // 设置编辑器事件
    setupEditorEvents(codeEditor, ternServer, () => stateRef.current.lintAutocomplete);

    // 创建 Legacy API
    const legacyApi = createLegacyApi({
      codeEditorRef,
      ternServerRef,
      stateRef,
      extraKeysRef,
      show,
      hide,
      updateShowPreview,
      updateLintEnabled,
      openUrl,
      getIndent,
      getEditorMode,
      fs,
      printf,
      printe,
    });

    // 暴露到全局
    (window as unknown as { editor_multi: typeof legacyApi }).editor_multi = legacyApi;
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

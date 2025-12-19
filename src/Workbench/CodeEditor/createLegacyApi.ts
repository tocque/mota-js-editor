/**
 * Legacy API 工厂
 *
 * 创建 window.editor_multi 兼容层，将 React 组件的功能暴露为全局 API。
 * 外部模块（editor_ui.js, editor_table.js, editor_blockly.js）通过此 API 与编辑器交互。
 */

import { JSHINT } from "jshint";
import beautifier from "js-beautify";
import type { TernServerInstance } from "./utils/createTernServer";
import {
  createTableHandler,
  type TableHandlerDeps,
  type ImportArgs,
} from "./handlers/tableHandler";
import {
  createBlocklyHandler,
  type BlocklyHandlerDeps,
  type MultiLineCallback,
} from "./handlers/blocklyHandler";
import {
  createFileHandler,
  type FileHandlerDeps,
  type FileSystem,
} from "./handlers/fileHandler";
import { JSHINT_OPTIONS } from "./config/commands";

/**
 * CodeMirror 编辑器实例接口
 */
export interface CodeMirrorInstance {
  getValue: () => string;
  setValue: (value: string) => void;
  getWrapperElement: () => HTMLElement;
  getScrollInfo: () => { top: number; left: number; width: number; height: number };
  scrollTo: (x: number, y: number) => void;
  setOption: (name: string, value: unknown) => void;
  getOption: (name: string) => unknown;
  toggleComment: () => void;
  foldCode: (pos: unknown) => void;
  getCursor: () => { line: number; ch: number };
}

/**
 * Legacy API 依赖接口
 */
export interface LegacyApiDeps {
  /** CodeMirror 编辑器引用 */
  codeEditorRef: React.RefObject<CodeMirrorInstance | null>;
  /** Tern 服务器引用 */
  ternServerRef: React.RefObject<TernServerInstance | null>;
  /** 状态引用 */
  stateRef: React.MutableRefObject<{
    id: string;
    isString: boolean;
    lintAutocomplete: boolean;
    preview: unknown;
  }>;
  /** ExtraKeys 配置 */
  extraKeysRef: React.RefObject<Record<string, (cm: unknown) => void> | null>;
  /** 显示编辑器 */
  show: () => void;
  /** 隐藏编辑器 */
  hide: () => void;
  /** 更新预览按钮可见性 */
  updateShowPreview: (show: boolean) => void;
  /** 更新 lint 状态 */
  updateLintEnabled: (enabled: boolean) => void;
  /** 打开 URL */
  openUrl: (url: string) => void;
  /** 获取缩进 */
  getIndent: (field: string) => string;
  /** 获取编辑器模式 */
  getEditorMode: () => string;
  /** 文件系统 */
  fs: FileSystem;
  /** 打印成功消息 */
  printf: (message: string) => void;
  /** 打印错误消息 */
  printe: (message: string) => void;
}

/**
 * Legacy API 接口
 * 与原 editor_multi 对象保持兼容
 */
export interface EditorMultiApi {
  // 属性
  id: string;
  isString: boolean;
  lintAutocomplete: boolean;
  preview: unknown;
  codeEditor: CodeMirrorInstance | null;
  ternServer: TernServerInstance | null;

  // 基础方法
  show: () => void;
  hide: () => void;
  format: () => void;
  hasError: () => boolean;
  setLint: (enabled?: boolean) => void;
  toggerLint: () => void;
  indent: (field: string) => string;
  getValue: () => string;
  getWrapperElement: () => HTMLElement | null;
  doCommand: (select: HTMLSelectElement) => void;
  openUrl: (url: string) => void;

  // Table handler (editor_table.js)
  import: (id: string, args: ImportArgs) => boolean;
  confirm: (keep?: boolean) => void;
  cancel: () => void;

  // Blockly handler (editor_blockly.js)
  multiLineEdit: (
    value: string,
    b: unknown,
    f: unknown,
    args: { lint?: boolean },
    callback: MultiLineCallback
  ) => void;
  multiLineDone: (keep?: boolean) => void;

  // File handler
  importFile: (filename: string) => void;
  writeFileDone: (keep?: boolean) => void;
  editCommentJs: (mod: string) => void;
}

/**
 * 创建 Legacy API
 *
 * @param deps - 依赖注入
 * @returns EditorMultiApi 对象
 */
export function createLegacyApi(deps: LegacyApiDeps): EditorMultiApi {
  const {
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
  } = deps;

  // ========== 内部工具函数 ==========

  /**
   * 设置编辑器值并更新 Tern 文档
   */
  function setValue(val: string): void {
    const codeEditor = codeEditorRef.current;
    const ternServer = ternServerRef.current;
    if (!codeEditor) return;

    codeEditor.setValue(val || "");
    if (ternServer) {
      ternServer.delDoc("doc");
      // 需要从 CodeMirror 全局获取 Doc 构造函数
      const CodeMirror = (window as unknown as { CodeMirror: { Doc: new (val: string, mode: string) => unknown } }).CodeMirror;
      if (CodeMirror?.Doc) {
        ternServer.addDoc("doc", new CodeMirror.Doc(val || "", "javascript"));
      }
    }
  }

  /**
   * 获取编辑器值
   */
  function getValue(): string {
    return codeEditorRef.current?.getValue() || "";
  }

  /**
   * 格式化代码
   */
  function format(): void {
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
  }

  /**
   * 检查是否有严重语法错误
   */
  function hasError(): boolean {
    if (!stateRef.current.lintAutocomplete) return false;
    return (
      JSHINT.errors?.filter((e) => e?.code?.startsWith("E")).length > 0
    );
  }

  /**
   * 设置 lint 状态
   */
  function setLint(enabled?: boolean): void {
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
    codeEditor.setOption("autocomplete", stateRef.current.lintAutocomplete);
    updateLintEnabled(stateRef.current.lintAutocomplete);
  }

  /**
   * 切换 lint 状态（从 DOM checkbox）
   */
  function toggerLint(): void {
    const checkbox = document.getElementById("lintCheckbox") as HTMLInputElement | null;
    if (checkbox) {
      stateRef.current.lintAutocomplete = checkbox.checked;
      setLint();
    }
  }

  // ========== 创建 Handlers ==========

  // Blockly handler（需要先创建，因为 tableHandler 可能引用）
  const blocklyHandlerDeps: BlocklyHandlerDeps = {
    setValue,
    getValue,
    show,
    hide,
    getId: () => stateRef.current.id,
    setId: (id) => { stateRef.current.id = id; },
    setLintAutocomplete: (value) => { stateRef.current.lintAutocomplete = value; },
  };
  const blocklyHandler = createBlocklyHandler(blocklyHandlerDeps);

  // File handler（需要先创建，因为 tableHandler 可能引用）
  const fileHandlerDeps: FileHandlerDeps = {
    fs,
    setValue,
    getValue,
    show,
    hide,
    getId: () => stateRef.current.id,
    setId: (id) => { stateRef.current.id = id; },
    setLintAutocomplete: (value) => { stateRef.current.lintAutocomplete = value; },
    setLint,
    printf,
    printe,
  };
  const fileHandler = createFileHandler(fileHandlerDeps);

  // Table handler
  const tableHandlerDeps: TableHandlerDeps = {
    getValue,
    setValue,
    show,
    hide,
    format,
    hasError,
    getScrollInfo: () => codeEditorRef.current?.getScrollInfo() || { top: 0 },
    scrollTo: (x, y) => codeEditorRef.current?.scrollTo(x, y),
    indent: getIndent,
    getId: () => stateRef.current.id,
    setId: (id) => { stateRef.current.id = id; },
    getIsString: () => stateRef.current.isString,
    setIsString: (value) => { stateRef.current.isString = value; },
    getLintAutocomplete: () => stateRef.current.lintAutocomplete,
    setLintAutocomplete: (value) => { stateRef.current.lintAutocomplete = value; },
    getPreview: () => stateRef.current.preview,
    setPreview: (value) => { stateRef.current.preview = value; },
    updateShowPreview,
    getEditorMode,
    multiLineDone: blocklyHandler.multiLineDone,
    writeFileDone: fileHandler.writeFileDone,
  };
  const tableHandler = createTableHandler(tableHandlerDeps);

  // ========== 构建 API 对象 ==========

  const api: EditorMultiApi = {
    // 属性 (使用 getter/setter)
    get id() {
      return stateRef.current.id;
    },
    set id(value: string) {
      stateRef.current.id = value;
    },
    get isString() {
      return stateRef.current.isString;
    },
    set isString(value: boolean) {
      stateRef.current.isString = value;
    },
    get lintAutocomplete() {
      return stateRef.current.lintAutocomplete;
    },
    set lintAutocomplete(value: boolean) {
      stateRef.current.lintAutocomplete = value;
    },
    get preview() {
      return stateRef.current.preview;
    },
    set preview(value: unknown) {
      stateRef.current.preview = value;
    },
    get codeEditor() {
      return codeEditorRef.current;
    },
    get ternServer() {
      return ternServerRef.current;
    },

    // 基础方法
    show: () => {
      // 检查是否为函数代码
      const valueNow = getValue();
      if (valueNow.slice(0, 8) === "function") {
        stateRef.current.lintAutocomplete = true;
      }
      setLint();
      show();
    },
    hide,
    format: () => {
      if (!stateRef.current.lintAutocomplete) {
        alert("只有代码才能进行格式化操作！");
        return;
      }
      format();
    },
    hasError,
    setLint,
    toggerLint,
    indent: getIndent,
    getValue,
    getWrapperElement: () => codeEditorRef.current?.getWrapperElement() || null,
    doCommand: (select: HTMLSelectElement) => {
      const value = select.value;
      select.selectedIndex = 0;
      const extraKeys = extraKeysRef.current;
      if (extraKeys && extraKeys[value]) {
        extraKeys[value](codeEditorRef.current);
      }
    },
    openUrl,

    // Table handler methods
    import: tableHandler.import,
    confirm: tableHandler.confirm,
    cancel: () => {
      tableHandler.cancel();
      blocklyHandler.reset();
    },

    // Blockly handler methods
    multiLineEdit: blocklyHandler.multiLineEdit,
    multiLineDone: blocklyHandler.multiLineDone,

    // File handler methods
    importFile: fileHandler.importFile,
    writeFileDone: fileHandler.writeFileDone,
    editCommentJs: fileHandler.editCommentJs,
  };

  return api;
}

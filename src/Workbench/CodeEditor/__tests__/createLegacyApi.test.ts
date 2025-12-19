/**
 * createLegacyApi 集成测试
 *
 * 测试 Legacy API 与 handlers 的集成
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLegacyApi, type LegacyApiDeps, type CodeMirrorInstance } from "../createLegacyApi";
import type { TernServerInstance } from "../utils/createTernServer";

// Mock JSHINT
vi.mock("jshint", () => ({
  JSHINT: {
    errors: [],
  },
}));

// Mock js-beautify
vi.mock("js-beautify", () => ({
  default: {
    js: vi.fn((code: string) => code),
  },
}));

// Setup global CodeMirror mock
const mockCodeMirrorDoc = vi.fn();
(globalThis as unknown as { CodeMirror: { Doc: typeof mockCodeMirrorDoc } }).CodeMirror = {
  Doc: mockCodeMirrorDoc,
};

describe("createLegacyApi", () => {
  let mockCodeEditor: CodeMirrorInstance;
  let mockTernServer: TernServerInstance;
  let mockDeps: LegacyApiDeps;
  let codeEditorRef: { current: CodeMirrorInstance | null };
  let ternServerRef: { current: TernServerInstance | null };
  let stateRef: { current: { id: string; isString: boolean; lintAutocomplete: boolean; preview: unknown } };
  let extraKeysRef: { current: Record<string, (cm: unknown) => void> | null };

  beforeEach(() => {
    // Mock CodeMirror instance
    mockCodeEditor = {
      getValue: vi.fn(() => ""),
      setValue: vi.fn(),
      getWrapperElement: vi.fn(() => document.createElement("div")),
      getScrollInfo: vi.fn(() => ({ top: 0, left: 0, width: 100, height: 100 })),
      scrollTo: vi.fn(),
      setOption: vi.fn(),
      getOption: vi.fn(),
      toggleComment: vi.fn(),
      foldCode: vi.fn(),
      getCursor: vi.fn(() => ({ line: 0, ch: 0 })),
    };

    // Mock TernServer instance
    mockTernServer = {
      addDoc: vi.fn(),
      delDoc: vi.fn(),
      complete: vi.fn(),
      updateArgHints: vi.fn(),
      showDocs: vi.fn(),
      jumpToDef: vi.fn(),
      rename: vi.fn(),
    };

    // Create refs
    codeEditorRef = { current: mockCodeEditor };
    ternServerRef = { current: mockTernServer };
    stateRef = { current: { id: "", isString: false, lintAutocomplete: false, preview: null } };
    extraKeysRef = { current: { "Ctrl-/": vi.fn() } };

    // Create mock deps
    mockDeps = {
      codeEditorRef,
      ternServerRef,
      stateRef,
      extraKeysRef,
      show: vi.fn(),
      hide: vi.fn(),
      updateShowPreview: vi.fn(),
      updateLintEnabled: vi.fn(),
      openUrl: vi.fn(),
      getIndent: vi.fn(() => "\t"),
      getEditorMode: vi.fn(() => ""),
      fs: {
        readFile: vi.fn(),
        writeFile: vi.fn(),
      },
      printf: vi.fn(),
      printe: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Property getters/setters", () => {
    it("should provide id getter and setter", () => {
      const api = createLegacyApi(mockDeps);
      
      expect(api.id).toBe("");
      api.id = "test-id";
      expect(api.id).toBe("test-id");
      expect(stateRef.current.id).toBe("test-id");
    });

    it("should provide isString getter and setter", () => {
      const api = createLegacyApi(mockDeps);
      
      expect(api.isString).toBe(false);
      api.isString = true;
      expect(api.isString).toBe(true);
    });

    it("should provide lintAutocomplete getter and setter", () => {
      const api = createLegacyApi(mockDeps);
      
      expect(api.lintAutocomplete).toBe(false);
      api.lintAutocomplete = true;
      expect(api.lintAutocomplete).toBe(true);
    });

    it("should provide preview getter and setter", () => {
      const api = createLegacyApi(mockDeps);
      
      expect(api.preview).toBe(null);
      api.preview = "test-preview";
      expect(api.preview).toBe("test-preview");
    });

    it("should provide codeEditor getter", () => {
      const api = createLegacyApi(mockDeps);
      expect(api.codeEditor).toBe(mockCodeEditor);
    });

    it("should provide ternServer getter", () => {
      const api = createLegacyApi(mockDeps);
      expect(api.ternServer).toBe(mockTernServer);
    });
  });

  describe("Basic methods", () => {
    it("should call show dependency and set lint", () => {
      const api = createLegacyApi(mockDeps);
      api.show();
      expect(mockDeps.show).toHaveBeenCalled();
    });

    it("should call hide dependency", () => {
      const api = createLegacyApi(mockDeps);
      api.hide();
      expect(mockDeps.hide).toHaveBeenCalled();
    });

    it("should format code when lint is enabled", () => {
      const api = createLegacyApi(mockDeps);
      stateRef.current.lintAutocomplete = true;
      
      // Should not throw
      api.format();
    });

    it("should alert when formatting non-code", () => {
      globalThis.alert = vi.fn();
      const api = createLegacyApi(mockDeps);
      stateRef.current.lintAutocomplete = false;
      
      api.format();
      expect(globalThis.alert).toHaveBeenCalledWith("只有代码才能进行格式化操作！");
    });

    it("should return false for hasError when lint disabled", () => {
      const api = createLegacyApi(mockDeps);
      stateRef.current.lintAutocomplete = false;
      expect(api.hasError()).toBe(false);
    });

    it("should get value from codeEditor", () => {
      const api = createLegacyApi(mockDeps);
      vi.mocked(mockCodeEditor.getValue).mockReturnValue("test code");
      expect(api.getValue()).toBe("test code");
    });

    it("should get wrapper element from codeEditor", () => {
      const api = createLegacyApi(mockDeps);
      const wrapper = document.createElement("div");
      vi.mocked(mockCodeEditor.getWrapperElement).mockReturnValue(wrapper);
      expect(api.getWrapperElement()).toBe(wrapper);
    });

    it("should call getIndent dependency", () => {
      const api = createLegacyApi(mockDeps);
      expect(api.indent("test")).toBe("\t");
      expect(mockDeps.getIndent).toHaveBeenCalledWith("test");
    });

    it("should call openUrl dependency", () => {
      const api = createLegacyApi(mockDeps);
      api.openUrl("https://test.com");
      expect(mockDeps.openUrl).toHaveBeenCalledWith("https://test.com");
    });
  });

  describe("setLint", () => {
    it("should enable lint and autocomplete", () => {
      const api = createLegacyApi(mockDeps);
      api.setLint(true);
      
      expect(stateRef.current.lintAutocomplete).toBe(true);
      expect(mockCodeEditor.setOption).toHaveBeenCalledWith("lint", expect.any(Object));
      expect(mockCodeEditor.setOption).toHaveBeenCalledWith("autocomplete", true);
      expect(mockDeps.updateLintEnabled).toHaveBeenCalledWith(true);
    });

    it("should disable lint and autocomplete", () => {
      const api = createLegacyApi(mockDeps);
      api.setLint(false);
      
      expect(stateRef.current.lintAutocomplete).toBe(false);
      expect(mockCodeEditor.setOption).toHaveBeenCalledWith("lint", false);
      expect(mockCodeEditor.setOption).toHaveBeenCalledWith("autocomplete", false);
    });
  });

  describe("doCommand", () => {
    it("should execute command from extraKeys", () => {
      const commandFn = vi.fn();
      extraKeysRef.current = { "Ctrl-/": commandFn };
      
      const api = createLegacyApi(mockDeps);
      const mockSelect = {
        value: "Ctrl-/",
        selectedIndex: 1,
      } as unknown as HTMLSelectElement;
      
      api.doCommand(mockSelect);
      
      expect(commandFn).toHaveBeenCalledWith(mockCodeEditor);
      expect(mockSelect.selectedIndex).toBe(0);
    });

    it("should not throw for unknown command", () => {
      const api = createLegacyApi(mockDeps);
      const mockSelect = {
        value: "unknown",
        selectedIndex: 1,
      } as unknown as HTMLSelectElement;
      
      expect(() => api.doCommand(mockSelect)).not.toThrow();
    });
  });

  describe("Table handler integration", () => {
    it("should return false for import when element not found", () => {
      const api = createLegacyApi(mockDeps);
      expect(api.import("non-existent", {})).toBe(false);
    });

    it("should call cancel and reset blockly args", () => {
      const api = createLegacyApi(mockDeps);
      stateRef.current.id = "test-id";
      
      api.cancel();
      
      expect(mockDeps.hide).toHaveBeenCalled();
    });
  });

  describe("Blockly handler integration", () => {
    it("should call multiLineEdit with converted newlines", () => {
      const api = createLegacyApi(mockDeps);
      const callback = vi.fn();
      
      api.multiLineEdit("line1\\nline2", "b", "f", { lint: true }, callback);
      
      expect(stateRef.current.id).toBe("callFromBlockly");
      expect(mockCodeEditor.setValue).toHaveBeenCalledWith("line1\nline2");
      expect(stateRef.current.lintAutocomplete).toBe(true);
      expect(mockDeps.show).toHaveBeenCalled();
    });
  });

  describe("File handler integration", () => {
    it("should call importFile and show editor", () => {
      const api = createLegacyApi(mockDeps);
      
      api.importFile("test.js");
      
      expect(stateRef.current.id).toBe("importFile");
      expect(mockCodeEditor.setValue).toHaveBeenCalledWith("loading");
      expect(mockDeps.show).toHaveBeenCalled();
      expect(mockDeps.fs.readFile).toHaveBeenCalled();
    });

    it("should call editCommentJs with correct file path", () => {
      const api = createLegacyApi(mockDeps);
      
      api.editCommentJs("tower");
      
      expect(stateRef.current.lintAutocomplete).toBe(true);
      expect(mockDeps.fs.readFile).toHaveBeenCalledWith(
        "_server/table/data.comment.js",
        "base64",
        expect.any(Function)
      );
    });
  });
});

describe("EditorMultiApi external interface", () => {
  it("should have all required external API methods", () => {
    const mockDeps: LegacyApiDeps = {
      codeEditorRef: { current: null },
      ternServerRef: { current: null },
      stateRef: { current: { id: "", isString: false, lintAutocomplete: false, preview: null } },
      extraKeysRef: { current: null },
      show: vi.fn(),
      hide: vi.fn(),
      updateShowPreview: vi.fn(),
      updateLintEnabled: vi.fn(),
      openUrl: vi.fn(),
      getIndent: vi.fn(),
      getEditorMode: vi.fn(),
      fs: { readFile: vi.fn(), writeFile: vi.fn() },
      printf: vi.fn(),
      printe: vi.fn(),
    };

    const api = createLegacyApi(mockDeps);

    // Check external API used by editor_ui.js, editor_table.js, editor_blockly.js
    expect(typeof api.id).toBe("string");
    expect(typeof api.confirm).toBe("function");
    expect(typeof api.import).toBe("function");
    expect(typeof api.multiLineEdit).toBe("function");

    // Additional internal methods
    expect(typeof api.show).toBe("function");
    expect(typeof api.hide).toBe("function");
    expect(typeof api.cancel).toBe("function");
    expect(typeof api.format).toBe("function");
    expect(typeof api.setLint).toBe("function");
    expect(typeof api.hasError).toBe("function");
    expect(typeof api.getValue).toBe("function");
  });
});

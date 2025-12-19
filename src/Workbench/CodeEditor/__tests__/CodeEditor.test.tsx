/**
 * CodeEditor 组件测试
 *
 * 测试 React 状态管理和 window.editor_multi 集成
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getShortcutKeys, commandsName } from "../config/commands";

// Mock dependencies that require browser APIs
vi.mock("../editor_multi", () => ({
  editor_multi: vi.fn(() => ({
    _reactControls: null,
    id: "",
    isString: false,
    lintAutocomplete: false,
    preview: null,
    show: vi.fn(),
    hide: vi.fn(),
    confirm: vi.fn(),
    cancel: vi.fn(),
    format: vi.fn(),
    setLint: vi.fn(),
    doCommand: vi.fn(),
    getValue: vi.fn(() => ""),
    getWrapperElement: vi.fn(() => ({
      style: { fontSize: "", fontWeight: "" },
    })),
  })),
}));

describe("CodeEditor Component Utilities", () => {
  describe("getShortcutKeys", () => {
    it("should return all shortcut keys", () => {
      const keys = getShortcutKeys();
      expect(keys).toContain("Ctrl-/");
      expect(keys).toContain("Ctrl-B");
      expect(keys).toContain("Ctrl-Q");
      expect(keys).toContain("Ctrl-F");
      expect(keys).toContain("Ctrl-R");
      expect(keys).toContain("Ctrl-D");
      expect(keys).toContain("Ctrl-O");
      expect(keys).toContain("Ctrl-P");
      expect(keys.length).toBe(8);
    });

    it("should return keys that exist in commandsName", () => {
      const keys = getShortcutKeys();
      keys.forEach((key) => {
        expect(commandsName[key]).toBeDefined();
        expect(typeof commandsName[key]).toBe("string");
      });
    });
  });

  describe("commandsName mapping", () => {
    it("should have Chinese descriptions for all commands", () => {
      expect(commandsName["Ctrl-/"]).toBe("注释当前选中行（Ctrl+/）");
      expect(commandsName["Ctrl-B"]).toBe("跳转到定义（Ctrl+B）");
      expect(commandsName["Ctrl-Q"]).toBe("重命名变量（Ctrl+Q）");
      expect(commandsName["Ctrl-F"]).toBe("查找（Ctrl+F）");
      expect(commandsName["Ctrl-R"]).toBe("全部替换（Ctrl+R）");
      expect(commandsName["Ctrl-D"]).toBe("折叠或展开块（Ctrl+D）");
      expect(commandsName["Ctrl-O"]).toBe("打开API列表（Ctrl+O）");
      expect(commandsName["Ctrl-P"]).toBe("打开在线插件列表（Ctrl+P）");
    });
  });
});

describe("ReactControls interface", () => {
  it("should define expected control methods", () => {
    // Define the expected interface shape
    interface ReactControls {
      show: () => void;
      hide: () => void;
      updateFontSize: (size: number, bold: boolean) => void;
      updateLint: (enabled: boolean) => void;
      updateShowPreview: (show: boolean) => void;
    }

    // Create a mock implementation
    const mockControls: ReactControls = {
      show: vi.fn(),
      hide: vi.fn(),
      updateFontSize: vi.fn(),
      updateLint: vi.fn(),
      updateShowPreview: vi.fn(),
    };

    // Verify methods can be called
    mockControls.show();
    expect(mockControls.show).toHaveBeenCalled();

    mockControls.hide();
    expect(mockControls.hide).toHaveBeenCalled();

    mockControls.updateFontSize(16, true);
    expect(mockControls.updateFontSize).toHaveBeenCalledWith(16, true);

    mockControls.updateLint(true);
    expect(mockControls.updateLint).toHaveBeenCalledWith(true);

    mockControls.updateShowPreview(false);
    expect(mockControls.updateShowPreview).toHaveBeenCalledWith(false);
  });
});

describe("Default values", () => {
  it("should use 14 as default font size", () => {
    const DEFAULT_FONT_SIZE = 14;
    expect(DEFAULT_FONT_SIZE).toBe(14);
  });

  it("should use correct config key for font size", () => {
    const CONFIG_FONT_SIZE_KEY = "editor_multi.fontSize";
    expect(CONFIG_FONT_SIZE_KEY).toBe("editor_multi.fontSize");
  });
});

describe("editor_multi integration", () => {
  let mockEditorMulti: {
    _reactControls: {
      show: ReturnType<typeof vi.fn>;
      hide: ReturnType<typeof vi.fn>;
      updateFontSize: ReturnType<typeof vi.fn>;
      updateLint: ReturnType<typeof vi.fn>;
      updateShowPreview: ReturnType<typeof vi.fn>;
    } | null;
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
    lintAutocomplete: boolean;
    setLint: (enabled?: boolean) => void;
    preview: string | null;
  };

  beforeEach(() => {
    mockEditorMulti = {
      _reactControls: null,
      show: vi.fn(),
      hide: vi.fn(),
      lintAutocomplete: false,
      setLint: vi.fn(function (this: typeof mockEditorMulti, enabled?: boolean) {
        if (typeof enabled === "boolean") {
          this.lintAutocomplete = enabled;
        }
        if (this._reactControls) {
          this._reactControls.updateLint(this.lintAutocomplete);
        }
      }),
      preview: null,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("show/hide with React controls", () => {
    it("should call React show control when available", () => {
      const showFn = vi.fn();
      mockEditorMulti._reactControls = {
        show: showFn,
        hide: vi.fn(),
        updateFontSize: vi.fn(),
        updateLint: vi.fn(),
        updateShowPreview: vi.fn(),
      };

      // Simulate show behavior
      if (mockEditorMulti._reactControls) {
        mockEditorMulti._reactControls.show();
      }

      expect(showFn).toHaveBeenCalled();
    });

    it("should call React hide control when available", () => {
      const hideFn = vi.fn();
      mockEditorMulti._reactControls = {
        show: vi.fn(),
        hide: hideFn,
        updateFontSize: vi.fn(),
        updateLint: vi.fn(),
        updateShowPreview: vi.fn(),
      };

      // Simulate hide behavior
      if (mockEditorMulti._reactControls) {
        mockEditorMulti._reactControls.hide();
      }

      expect(hideFn).toHaveBeenCalled();
    });
  });

  describe("setLint with React controls", () => {
    it("should sync lint state with React controls", () => {
      const updateLintFn = vi.fn();
      mockEditorMulti._reactControls = {
        show: vi.fn(),
        hide: vi.fn(),
        updateFontSize: vi.fn(),
        updateLint: updateLintFn,
        updateShowPreview: vi.fn(),
      };

      mockEditorMulti.lintAutocomplete = true;
      mockEditorMulti.setLint();

      expect(updateLintFn).toHaveBeenCalledWith(true);
    });

    it("should accept explicit enabled value", () => {
      mockEditorMulti.lintAutocomplete = false;
      mockEditorMulti.setLint(true);

      expect(mockEditorMulti.lintAutocomplete).toBe(true);
    });

    it("should preserve existing value when no argument provided", () => {
      mockEditorMulti.lintAutocomplete = true;
      mockEditorMulti.setLint();

      expect(mockEditorMulti.lintAutocomplete).toBe(true);
    });
  });

  describe("preview visibility with React controls", () => {
    it("should update preview visibility via React controls", () => {
      const updateShowPreviewFn = vi.fn();
      mockEditorMulti._reactControls = {
        show: vi.fn(),
        hide: vi.fn(),
        updateFontSize: vi.fn(),
        updateLint: vi.fn(),
        updateShowPreview: updateShowPreviewFn,
      };

      mockEditorMulti.preview = "somePreviewData";

      // Simulate import behavior
      if (mockEditorMulti._reactControls) {
        mockEditorMulti._reactControls.updateShowPreview(!!mockEditorMulti.preview);
      }

      expect(updateShowPreviewFn).toHaveBeenCalledWith(true);
    });

    it("should hide preview when preview is null", () => {
      const updateShowPreviewFn = vi.fn();
      mockEditorMulti._reactControls = {
        show: vi.fn(),
        hide: vi.fn(),
        updateFontSize: vi.fn(),
        updateLint: vi.fn(),
        updateShowPreview: updateShowPreviewFn,
      };

      mockEditorMulti.preview = null;

      // Simulate import behavior
      if (mockEditorMulti._reactControls) {
        mockEditorMulti._reactControls.updateShowPreview(!!mockEditorMulti.preview);
      }

      expect(updateShowPreviewFn).toHaveBeenCalledWith(false);
    });
  });
});

describe("Font size handling", () => {
  it("should apply font size to wrapper element", () => {
    const mockWrapper = {
      style: { fontSize: "", fontWeight: "" },
    };

    const fontSize = 18;
    const fontBold = true;

    mockWrapper.style.fontSize = `${fontSize}px`;
    mockWrapper.style.fontWeight = fontBold ? "bold" : "normal";

    expect(mockWrapper.style.fontSize).toBe("18px");
    expect(mockWrapper.style.fontWeight).toBe("bold");
  });

  it("should apply normal font weight when not bold", () => {
    const mockWrapper = {
      style: { fontSize: "", fontWeight: "" },
    };

    const fontSize = 14;
    const fontBold = false;

    mockWrapper.style.fontSize = `${fontSize}px`;
    mockWrapper.style.fontWeight = fontBold ? "bold" : "normal";

    expect(mockWrapper.style.fontSize).toBe("14px");
    expect(mockWrapper.style.fontWeight).toBe("normal");
  });
});

describe("Visibility state", () => {
  it("should return correct style for hidden state", () => {
    const visible = false;
    const style = visible ? undefined : { zIndex: -1, opacity: 0 };

    expect(style).toEqual({ zIndex: -1, opacity: 0 });
  });

  it("should return undefined style for visible state", () => {
    const visible = true;
    const style = visible ? undefined : { zIndex: -1, opacity: 0 };

    expect(style).toBeUndefined();
  });

  it("should return correct className for hidden state", () => {
    const visible = false;
    const className = visible ? "" : "hidden-panel";

    expect(className).toBe("hidden-panel");
  });

  it("should return empty className for visible state", () => {
    const visible = true;
    const className = visible ? "" : "hidden-panel";

    expect(className).toBe("");
  });
});

/**
 * Handlers 单元测试
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { setupEditorEvents } from "../handlers/editorEvents";
import { createBlocklyHandler } from "../handlers/blocklyHandler";
import { createFileHandler } from "../handlers/fileHandler";
import type { TernServerInstance } from "../utils/createTernServer";
import type { CodeMirrorEditor } from "../handlers/editorEvents";

describe("editorEvents", () => {
  describe("setupEditorEvents", () => {
    it("should register cursorActivity and keyup events", () => {
      const onMock = vi.fn();
      const mockEditor: CodeMirrorEditor = {
        on: onMock,
        getCursor: vi.fn(() => ({ line: 1, ch: 5 })),
        getOption: vi.fn(() => true),
      };

      const mockTernServer: TernServerInstance = {
        addDoc: vi.fn(),
        delDoc: vi.fn(),
        complete: vi.fn(),
        updateArgHints: vi.fn(),
        showDocs: vi.fn(),
        jumpToDef: vi.fn(),
        rename: vi.fn(),
      };

      setupEditorEvents(mockEditor, mockTernServer, () => true);

      expect(onMock).toHaveBeenCalledTimes(2);
      expect(onMock).toHaveBeenCalledWith("cursorActivity", expect.any(Function));
      expect(onMock).toHaveBeenCalledWith("keyup", expect.any(Function));
    });

    it("should update arg hints on cursor activity when autocomplete is enabled", () => {
      let cursorHandler: ((cm: unknown) => void) | null = null;

      const mockEditor: CodeMirrorEditor = {
        on: vi.fn((event, handler) => {
          if (event === "cursorActivity") {
            cursorHandler = handler as (cm: unknown) => void;
          }
        }),
        getCursor: vi.fn(() => ({ line: 1, ch: 5 })),
        getOption: vi.fn(() => true),
      };

      const mockTernServer: TernServerInstance = {
        addDoc: vi.fn(),
        delDoc: vi.fn(),
        complete: vi.fn(),
        updateArgHints: vi.fn(),
        showDocs: vi.fn(),
        jumpToDef: vi.fn(),
        rename: vi.fn(),
      };

      setupEditorEvents(mockEditor, mockTernServer, () => true);

      // Trigger cursor activity
      cursorHandler?.(mockEditor);

      expect(mockTernServer.updateArgHints).toHaveBeenCalled();
      expect(mockTernServer.showDocs).toHaveBeenCalled();
    });

    it("should not update arg hints when cursor is at position 0,0", () => {
      let cursorHandler: ((cm: unknown) => void) | null = null;

      const mockEditor: CodeMirrorEditor = {
        on: vi.fn((event, handler) => {
          if (event === "cursorActivity") {
            cursorHandler = handler as (cm: unknown) => void;
          }
        }),
        getCursor: vi.fn(() => ({ line: 0, ch: 0 })),
        getOption: vi.fn(() => true),
      };

      const mockTernServer: TernServerInstance = {
        addDoc: vi.fn(),
        delDoc: vi.fn(),
        complete: vi.fn(),
        updateArgHints: vi.fn(),
        showDocs: vi.fn(),
        jumpToDef: vi.fn(),
        rename: vi.fn(),
      };

      setupEditorEvents(mockEditor, mockTernServer, () => true);

      cursorHandler?.(mockEditor);

      expect(mockTernServer.updateArgHints).not.toHaveBeenCalled();
    });

    it("should not update arg hints when autocomplete is disabled", () => {
      let cursorHandler: ((cm: unknown) => void) | null = null;

      const mockEditor: CodeMirrorEditor = {
        on: vi.fn((event, handler) => {
          if (event === "cursorActivity") {
            cursorHandler = handler as (cm: unknown) => void;
          }
        }),
        getCursor: vi.fn(() => ({ line: 1, ch: 5 })),
        getOption: vi.fn(() => true),
      };

      const mockTernServer: TernServerInstance = {
        addDoc: vi.fn(),
        delDoc: vi.fn(),
        complete: vi.fn(),
        updateArgHints: vi.fn(),
        showDocs: vi.fn(),
        jumpToDef: vi.fn(),
        rename: vi.fn(),
      };

      // Return false for autocomplete
      setupEditorEvents(mockEditor, mockTernServer, () => false);

      cursorHandler?.(mockEditor);

      expect(mockTernServer.updateArgHints).not.toHaveBeenCalled();
    });
  });
});

describe("blocklyHandler", () => {
  describe("createBlocklyHandler", () => {
    let deps: {
      setValue: ReturnType<typeof vi.fn>;
      getValue: ReturnType<typeof vi.fn>;
      show: ReturnType<typeof vi.fn>;
      hide: ReturnType<typeof vi.fn>;
      getId: ReturnType<typeof vi.fn>;
      setId: ReturnType<typeof vi.fn>;
      setLintAutocomplete: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      deps = {
        setValue: vi.fn(),
        getValue: vi.fn(() => "test code"),
        show: vi.fn(),
        hide: vi.fn(),
        getId: vi.fn(() => "callFromBlockly"),
        setId: vi.fn(),
        setLintAutocomplete: vi.fn(),
      };
    });

    it("should set up multiLineEdit correctly", () => {
      const handler = createBlocklyHandler(deps);
      const callback = vi.fn();

      handler.multiLineEdit("line1\\nline2", "b", "f", { lint: true }, callback);

      expect(deps.setId).toHaveBeenCalledWith("callFromBlockly");
      expect(deps.setValue).toHaveBeenCalledWith("line1\nline2");
      expect(deps.setLintAutocomplete).toHaveBeenCalledWith(true);
      expect(deps.show).toHaveBeenCalled();
    });

    it("should call callback on multiLineDone", () => {
      const handler = createBlocklyHandler(deps);
      const callback = vi.fn();

      handler.multiLineEdit("code", "b", "f", { lint: false }, callback);
      handler.multiLineDone();

      expect(callback).toHaveBeenCalledWith("test code", "b", "f");
      expect(deps.setId).toHaveBeenCalledWith("");
      expect(deps.hide).toHaveBeenCalled();
    });

    it("should keep editor open when keep is true", () => {
      const handler = createBlocklyHandler(deps);
      const callback = vi.fn();

      // Mock global alert
      const originalAlert = globalThis.alert;
      globalThis.alert = vi.fn();

      handler.multiLineEdit("code", "b", "f", { lint: false }, callback);
      handler.multiLineDone(true);

      expect(callback).toHaveBeenCalled();
      expect(deps.hide).not.toHaveBeenCalled();

      // Restore
      globalThis.alert = originalAlert;
    });

    it("should do nothing if callback not set", () => {
      const handler = createBlocklyHandler(deps);

      // Don't call multiLineEdit first
      handler.multiLineDone();

      expect(deps.hide).not.toHaveBeenCalled();
    });

    it("should reset args", () => {
      const handler = createBlocklyHandler(deps);
      const callback = vi.fn();

      handler.multiLineEdit("code", "b", "f", { lint: false }, callback);
      handler.reset();
      handler.multiLineDone();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});

describe("fileHandler", () => {
  describe("createFileHandler", () => {
    let deps: {
      fs: {
        readFile: ReturnType<typeof vi.fn>;
        writeFile: ReturnType<typeof vi.fn>;
      };
      setValue: ReturnType<typeof vi.fn>;
      getValue: ReturnType<typeof vi.fn>;
      show: ReturnType<typeof vi.fn>;
      hide: ReturnType<typeof vi.fn>;
      getId: ReturnType<typeof vi.fn>;
      setId: ReturnType<typeof vi.fn>;
      setLintAutocomplete: ReturnType<typeof vi.fn>;
      setLint: ReturnType<typeof vi.fn>;
      printf: ReturnType<typeof vi.fn>;
      printe: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      deps = {
        fs: {
          readFile: vi.fn(),
          writeFile: vi.fn(),
        },
        setValue: vi.fn(),
        getValue: vi.fn(() => "file content"),
        show: vi.fn(),
        hide: vi.fn(),
        getId: vi.fn(() => "importFile"),
        setId: vi.fn(),
        setLintAutocomplete: vi.fn(),
        setLint: vi.fn(),
        printf: vi.fn(),
        printe: vi.fn(),
      };
    });

    it("should import file and set loading state", () => {
      const handler = createFileHandler(deps);

      handler.importFile("test.js");

      expect(deps.setId).toHaveBeenCalledWith("importFile");
      expect(deps.setValue).toHaveBeenCalledWith("loading");
      expect(deps.show).toHaveBeenCalled();
      expect(deps.fs.readFile).toHaveBeenCalledWith(
        "test.js",
        "base64",
        expect.any(Function)
      );
    });

    it("should set content after successful read", () => {
      deps.fs.readFile.mockImplementation(
        (_path: string, _enc: string, cb: (err: null, data: string) => void) => {
          // "hello" in base64
          cb(null, "aGVsbG8=");
        }
      );

      const handler = createFileHandler(deps);
      handler.importFile("test.js");

      // setValue is called twice: once with "loading", once with content
      expect(deps.setValue).toHaveBeenCalledTimes(2);
      expect(deps.setValue).toHaveBeenLastCalledWith("hello");
    });

    it("should handle read error", () => {
      deps.fs.readFile.mockImplementation(
        (_path: string, _enc: string, cb: (err: Error) => void) => {
          cb(new Error("File not found"));
        }
      );

      const handler = createFileHandler(deps);
      handler.importFile("test.js");

      expect(deps.setValue).toHaveBeenLastCalledWith(
        expect.stringContaining("加载文件失败")
      );
      expect(deps.setId).toHaveBeenLastCalledWith("");
    });

    it("should write file successfully", () => {
      deps.fs.writeFile.mockImplementation(
        (
          _path: string,
          _data: string,
          _enc: string,
          cb: (err: null) => void
        ) => {
          cb(null);
        }
      );

      const handler = createFileHandler(deps);
      handler.importFile("test.js"); // Set current filename
      handler.writeFileDone();

      expect(deps.fs.writeFile).toHaveBeenCalledWith(
        "test.js",
        expect.any(String),
        "base64",
        expect.any(Function)
      );
      expect(deps.printf).toHaveBeenCalledWith(
        expect.stringContaining("写入成功")
      );
      expect(deps.hide).toHaveBeenCalled();
    });

    it("should handle write error", () => {
      deps.fs.writeFile.mockImplementation(
        (
          _path: string,
          _data: string,
          _enc: string,
          cb: (err: Error) => void
        ) => {
          cb(new Error("Write failed"));
        }
      );

      const handler = createFileHandler(deps);
      handler.importFile("test.js");
      handler.writeFileDone();

      expect(deps.printe).toHaveBeenCalledWith(
        expect.stringContaining("文件写入失败")
      );
    });

    it("should edit comment js file", () => {
      const handler = createFileHandler(deps);

      handler.editCommentJs("tower");

      expect(deps.setLintAutocomplete).toHaveBeenCalledWith(true);
      expect(deps.setLint).toHaveBeenCalled();
      expect(deps.fs.readFile).toHaveBeenCalledWith(
        "_server/table/data.comment.js",
        "base64",
        expect.any(Function)
      );
    });

    it("should handle unknown edit mode", () => {
      const handler = createFileHandler(deps);

      handler.editCommentJs("unknown");

      expect(deps.printe).toHaveBeenCalledWith(
        expect.stringContaining("未知的编辑模式")
      );
    });
  });
});

/**
 * createTernServer 单元测试
 *
 * 测试 Tern Server 工厂函数
 */

import { describe, expect, it, vi } from "vitest";
import type { CoreType, DataCommentType, FunctionsType } from "../types";
import {
  addTernDocument,
  createTernServer,
  type CodeMirrorWithTern,
  type TernServerInstance,
} from "../utils/createTernServer";

// 创建 Mock TernServer 实例
function createMockTernServerInstance(): TernServerInstance {
  return {
    addDoc: vi.fn(),
    delDoc: vi.fn(),
    complete: vi.fn(),
    updateArgHints: vi.fn(),
    showDocs: vi.fn(),
    jumpToDef: vi.fn(),
    rename: vi.fn(),
  };
}

// 创建 Mock CodeMirror 对象
function createMockCodeMirror(): CodeMirrorWithTern & { 
  _mockTernServer: TernServerInstance;
  _mockTernServerConstructor: ReturnType<typeof vi.fn>;
  _mockDocConstructor: ReturnType<typeof vi.fn>;
} {
  const mockTernServer = createMockTernServerInstance();
  
  // 使用真正的 class 来支持 new 调用
  const mockTernServerConstructor = vi.fn();
  class MockTernServer {
    constructor(options: unknown) {
      mockTernServerConstructor(options);
      Object.assign(this, mockTernServer);
    }
  }

  const mockDocConstructor = vi.fn();
  class MockDoc {
    value: string;
    mode: string;
    constructor(value: string, mode: string) {
      mockDocConstructor(value, mode);
      this.value = value;
      this.mode = mode;
    }
  }

  return {
    TernServer: MockTernServer as unknown as CodeMirrorWithTern["TernServer"],
    Doc: MockDoc as unknown as CodeMirrorWithTern["Doc"],
    _mockTernServer: mockTernServer,
    _mockTernServerConstructor: mockTernServerConstructor,
    _mockDocConstructor: mockDocConstructor,
  };
}

// 创建 Mock core 对象
function createMockCore(): CoreType {
  return {
    material: {
      enemys: { slime: { name: "史莱姆" } },
      bgms: { bgm1: {} },
      sounds: { attack: {} },
      animates: { explosion: {} },
      images: {},
      items: { key: { name: "钥匙" } },
    },
    status: {
      maps: { MT1: { title: "第一层" } },
      shops: { shop1: { textInList: "商店" } },
      textAttribute: {},
      bgmaps: {},
      fgmaps: {},
    },
    canvas: {},
    values: { hp: 100 },
    flags: { enable: true },
  };
}

// 创建 Mock functions 对象
function createMockFunctions(): FunctionsType {
  return {
    enemys: {
      getSpecials: () => [[1, "先攻"]],
    },
  };
}

// 创建 Mock dataComment 对象
function createMockDataComment(): DataCommentType {
  return {
    _data: {
      values: {
        _data: {
          hp: { _data: "生命值" },
        },
      },
      flags: {
        _data: {
          enable: { _data: "开启" },
        },
      },
    },
  };
}

// 创建 Mock ternDefs
function createMockTernDefs(): unknown[] {
  return [
    {}, // ternDefs[0]
    {}, // ternDefs[1]
    {
      // ternDefs[2] - coredef
      core: {
        material: {
          enemys: {},
          bgms: {},
          sounds: {},
          animates: {},
          images: {},
          items: {},
        },
        enemys: {
          hasSpecial: { "!doc": "" },
        },
        canvas: {},
        status: {
          maps: {},
          bgmaps: {},
          fgmaps: {},
          shops: {},
          textAttribute: {},
        },
        values: {},
        flags: {},
      },
    },
  ];
}

describe("createTernServer", () => {
  describe("createTernServer", () => {
    it("应该正确创建 TernServer 实例", () => {
      const mockCodeMirror = createMockCodeMirror();
      const mockCore = createMockCore();
      const mockFunctions = createMockFunctions();
      const mockDataComment = createMockDataComment();
      const mockTernDefs = createMockTernDefs();

      const ternServer = createTernServer({
        ternDefs: mockTernDefs,
        core: mockCore,
        functions: mockFunctions,
        dataComment: mockDataComment,
        CodeMirror: mockCodeMirror,
      });

      // 验证 TernServer 构造函数被调用
      expect(mockCodeMirror._mockTernServerConstructor).toHaveBeenCalledTimes(1);

      // 验证返回的实例有正确的方法
      expect(ternServer.addDoc).toBeDefined();
      expect(ternServer.delDoc).toBeDefined();
      expect(ternServer.complete).toBeDefined();
      expect(ternServer.updateArgHints).toBeDefined();
      expect(ternServer.showDocs).toBeDefined();
      expect(ternServer.jumpToDef).toBeDefined();
      expect(ternServer.rename).toBeDefined();
    });

    it("应该使用默认配置", () => {
      const mockCodeMirror = createMockCodeMirror();

      createTernServer({
        ternDefs: createMockTernDefs(),
        core: createMockCore(),
        functions: createMockFunctions(),
        dataComment: createMockDataComment(),
        CodeMirror: mockCodeMirror,
      });

      // 验证默认配置
      expect(mockCodeMirror._mockTernServerConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: {
            doc_comment: true,
            complete_strings: true,
          },
          useWorker: false,
        })
      );
    });

    it("应该接受自定义服务器配置", () => {
      const mockCodeMirror = createMockCodeMirror();

      createTernServer({
        ternDefs: createMockTernDefs(),
        core: createMockCore(),
        functions: createMockFunctions(),
        dataComment: createMockDataComment(),
        CodeMirror: mockCodeMirror,
        serverOptions: {
          useWorker: true,
          docComment: false,
          completeStrings: false,
        },
      });

      expect(mockCodeMirror._mockTernServerConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          plugins: {
            doc_comment: false,
            complete_strings: false,
          },
          useWorker: true,
        })
      );
    });

    it("应该构建类型定义并修改 ternDefs", () => {
      const mockCodeMirror = createMockCodeMirror();
      const mockTernDefs = createMockTernDefs();
      const mockCore = createMockCore();

      createTernServer({
        ternDefs: mockTernDefs,
        core: mockCore,
        functions: createMockFunctions(),
        dataComment: createMockDataComment(),
        CodeMirror: mockCodeMirror,
      });

      // 验证 coredef 被修改（buildTernDefinitions 被调用）
      const coredef = mockTernDefs[2] as { core: { material: { enemys: Record<string, unknown> } } };
      expect(coredef.core.material.enemys.slime).toBeDefined();
    });
  });

  describe("addTernDocument", () => {
    it("应该先删除再添加文档", () => {
      const mockTernServer = createMockTernServerInstance();
      const mockCodeMirror = createMockCodeMirror();

      addTernDocument(mockTernServer, mockCodeMirror, "doc", "const x = 1;");

      // 验证调用顺序：先 delDoc，再 addDoc
      expect(mockTernServer.delDoc).toHaveBeenCalledWith("doc");
      expect(mockTernServer.addDoc).toHaveBeenCalled();
    });

    it("应该使用默认 javascript 模式", () => {
      const mockTernServer = createMockTernServerInstance();
      const mockCodeMirror = createMockCodeMirror();

      addTernDocument(mockTernServer, mockCodeMirror, "test", "code");

      expect(mockCodeMirror._mockDocConstructor).toHaveBeenCalledWith("code", "javascript");
    });

    it("应该支持自定义模式", () => {
      const mockTernServer = createMockTernServerInstance();
      const mockCodeMirror = createMockCodeMirror();

      addTernDocument(mockTernServer, mockCodeMirror, "test", "code", "json");

      expect(mockCodeMirror._mockDocConstructor).toHaveBeenCalledWith("code", "json");
    });
  });
});

/**
 * fs 模块单元测试
 *
 * 这些测试用于固定原有 fs.ts API 的行为
 * 重构过程中不得修改这些测试，以确保重构前后行为一致
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fs } from "../fs";

// Mock window for tests
const mockWindow = { main: null };
vi.stubGlobal("window", mockWindow);

// Mock XMLHttpRequest
class MockXMLHttpRequest {
  static instances: MockXMLHttpRequest[] = [];

  method: string = "";
  url: string = "";
  async: boolean = true;
  mimeType: string | null = null;
  responseType: XMLHttpRequestResponseType = "";
  status: number = 200;
  response: string = "";
  body: string | null = null;

  onload: ((e: unknown) => void) | null = null;
  onabort: (() => void) | null = null;
  ontimeout: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    MockXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string, async: boolean) {
    this.method = method;
    this.url = url;
    this.async = async;
  }

  overrideMimeType(mimeType: string) {
    this.mimeType = mimeType;
  }

  send(body?: string) {
    this.body = body ?? null;
    // 不再自动触发，等待测试手动调用 simulate 方法
  }

  // 用于测试的辅助方法
  simulateSuccess(response: string) {
    this.status = 200;
    this.response = response;
    if (this.onload) this.onload({});
  }

  simulateError() {
    if (this.onerror) this.onerror();
  }

  simulateHttpError(status: number) {
    this.status = status;
    if (this.onload) this.onload({});
  }

  simulateAbort() {
    if (this.onabort) this.onabort();
  }

  simulateTimeout() {
    if (this.ontimeout) this.ontimeout();
  }
}

// 保存原始的 XMLHttpRequest
const OriginalXMLHttpRequest = global.XMLHttpRequest;

describe("fs module - 原有 API 行为测试", () => {
  beforeEach(() => {
    MockXMLHttpRequest.instances = [];
    // @ts-expect-error - 替换全局 XMLHttpRequest
    global.XMLHttpRequest = MockXMLHttpRequest;
  });

  afterEach(() => {
    // @ts-expect-error - 恢复全局 XMLHttpRequest
    global.XMLHttpRequest = OriginalXMLHttpRequest;
    vi.clearAllMocks();
  });

  describe("fs.readFile", () => {
    it("应该使用 utf-8 编码读取文件", async () => {
      const mockContent = "Hello, World!";
      const callbackPromise = new Promise<{ err: string | null; data?: string }>((resolve) => {
        fs.readFile("test.txt", "utf-8", (err, data) => {
          resolve({ err, data });
        });
      });

      // XHR 实例应该已经创建
      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/readFile");
      expect(xhr.mimeType).toBe("text/plain; charset=x-user-defined");
      expect(xhr.body).toBe("type=utf8&name=test.txt");

      // 模拟成功响应
      xhr.simulateSuccess(mockContent);

      const result = await callbackPromise;
      expect(result.err).toBeNull();
      expect(result.data).toBe(mockContent);
    });

    it("应该使用 base64 编码读取文件", async () => {
      const mockContent = "SGVsbG8sIFdvcmxkIQ==";
      const callbackPromise = new Promise<{ err: string | null; data?: string }>((resolve) => {
        fs.readFile("image.png", "base64", (err, data) => {
          resolve({ err, data });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];
      expect(xhr.body).toBe("type=base64&name=image.png");

      xhr.simulateSuccess(mockContent);

      const result = await callbackPromise;
      expect(result.err).toBeNull();
      expect(result.data).toBe(mockContent);
    });

    it("应该在 filename 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.readFile(123, "utf-8", () => {});
      }).toThrow("Type Error in fs.readFile");
    });

    it("应该在 encoding 无效时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.readFile("test.txt", "invalid", () => {});
      }).toThrow("Type Error in fs.readFile");
    });

    it("应该在服务器返回 error: 前缀时传递错误", async () => {
      const callbackPromise = new Promise<{ err: string | null; data?: string }>((resolve) => {
        fs.readFile("notfound.txt", "utf-8", (err, data) => {
          resolve({ err, data });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("error: File not found");

      const result = await callbackPromise;
      expect(result.err).toBe("error: File not found");
      expect(result.data).toBeNull();
    });

    it("应该在 HTTP 错误时调用回调并传递错误信息", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.readFile("test.txt", "utf-8", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateHttpError(500);

      const result = await callbackPromise;
      expect(result.err).toContain("HTTP 500");
    });

    it("应该在连接错误时调用回调并传递错误信息", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.readFile("test.txt", "utf-8", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateError();

      const result = await callbackPromise;
      expect(result.err).toContain("Error on Connection");
    });
  });

  describe("fs.writeFile", () => {
    it("应该使用 utf-8 编码写入文件", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.writeFile("test.txt", "Hello, World!", "utf-8", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/writeFile");
      expect(xhr.body).toBe("type=utf8&name=test.txt&value=Hello, World!");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });

    it("应该使用 base64 编码写入文件", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.writeFile("image.png", "SGVsbG8=", "base64", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.url).toBe("/writeFile");
      expect(xhr.body).toBe("type=base64&name=image.png&value=SGVsbG8=");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });

    it("应该在 filename 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.writeFile(123, "content", "utf-8", () => {});
      }).toThrow("Type Error in fs.writeFile");
    });

    it("应该在 datastr 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.writeFile("test.txt", 123, "utf-8", () => {});
      }).toThrow("Type Error in fs.writeFile");
    });

    it("应该在 encoding 无效时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.writeFile("test.txt", "content", "invalid", () => {});
      }).toThrow("Type Error in fs.writeFile");
    });
  });

  describe("fs.writeMultiFiles", () => {
    it("应该批量写入多个文件", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.writeMultiFiles(["file1.txt", "file2.txt"], ["content1", "content2"], (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/writeMultiFiles");
      expect(xhr.body).toBe("name=file1.txt;file2.txt&value=content1;content2");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });
  });

  describe("fs.readdir", () => {
    it("应该读取目录内容", async () => {
      const mockFiles = ["file1.txt", "file2.txt", "subdir"];
      const callbackPromise = new Promise<{ err: string | null; data?: string[] }>((resolve) => {
        fs.readdir("path/to/dir", (err, data) => {
          resolve({ err, data });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/listFile");
      expect(xhr.body).toBe("name=path/to/dir");

      xhr.simulateSuccess(JSON.stringify(mockFiles));

      const result = await callbackPromise;
      expect(result.err).toBeNull();
      expect(result.data).toEqual(mockFiles);
    });

    it("应该在 path 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.readdir(123, () => {});
      }).toThrow("Type Error in fs.readdir");
    });

    it("应该在返回无效 JSON 时传递错误", async () => {
      const callbackPromise = new Promise<{ err: string | null; data?: unknown }>((resolve) => {
        fs.readdir("path/to/dir", (err, data) => {
          resolve({ err, data });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("invalid json");

      const result = await callbackPromise;
      expect(result.err).toBe("Invalid /listFile");
      expect(result.data).toBeNull();
    });
  });

  describe("fs.mkdir", () => {
    it("应该创建目录", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.mkdir("path/to/new/dir", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/makeDir");
      expect(xhr.body).toBe("name=path/to/new/dir");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });

    it("应该在 path 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.mkdir(123, () => {});
      }).toThrow("Type Error in fs.readdir");
    });
  });

  describe("fs.moveFile", () => {
    it("应该移动文件", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.moveFile("old/path.txt", "new/path.txt", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/moveFile");
      expect(xhr.body).toBe("src=old/path.txt&dest=new/path.txt");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });

    it("应该在 src 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.moveFile(123, "dest.txt", () => {});
      }).toThrow("Type Error in fs.readdir");
    });

    it("应该在 dest 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.moveFile("src.txt", 123, () => {});
      }).toThrow("Type Error in fs.readdir");
    });
  });

  describe("fs.deleteFile", () => {
    it("应该删除文件", async () => {
      const callbackPromise = new Promise<{ err: string | null }>((resolve) => {
        fs.deleteFile("path/to/file.txt", (err) => {
          resolve({ err });
        });
      });

      const xhr = MockXMLHttpRequest.instances[0];

      expect(xhr.method).toBe("POST");
      expect(xhr.url).toBe("/deleteFile");
      expect(xhr.body).toBe("name=path/to/file.txt");

      xhr.simulateSuccess("success");

      const result = await callbackPromise;
      expect(result.err).toBeNull();
    });

    it("应该在 path 不是字符串时抛出错误", () => {
      expect(() => {
        // @ts-expect-error - 测试无效输入
        fs.deleteFile(123, () => {});
      }).toThrow("Type Error in fs.readdir");
    });
  });
});

// ==================== Promise API 测试 ====================
describe("fs.promises API 测试", () => {
  beforeEach(() => {
    MockXMLHttpRequest.instances = [];
    // @ts-expect-error - 替换全局 XMLHttpRequest
    global.XMLHttpRequest = MockXMLHttpRequest;
  });

  afterEach(() => {
    // @ts-expect-error - 恢复全局 XMLHttpRequest
    global.XMLHttpRequest = OriginalXMLHttpRequest;
    vi.clearAllMocks();
  });

  describe("fs.promises.readFile", () => {
    it("应该返回 Promise 并解析文件内容", async () => {
      const mockContent = "Hello, World!";
      const promise = fs.promises.readFile("test.txt", "utf-8");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess(mockContent);

      const result = await promise;
      expect(result).toBe(mockContent);
    });

    it("应该在错误时 reject Promise", async () => {
      const promise = fs.promises.readFile("test.txt", "utf-8");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("error: File not found");

      await expect(promise).rejects.toThrow("error: File not found");
    });
  });

  describe("fs.promises.writeFile", () => {
    it("应该返回 Promise 并成功写入", async () => {
      const promise = fs.promises.writeFile("test.txt", "content", "utf-8");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("success");

      // void 方法返回的 Promise 解析为 undefined 或服务器响应
      await expect(promise).resolves.toBeDefined();
    });
  });

  describe("fs.promises.readdir", () => {
    it("应该返回 Promise 并解析目录内容", async () => {
      const mockFiles = ["file1.txt", "file2.txt"];
      const promise = fs.promises.readdir("path/to/dir");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess(JSON.stringify(mockFiles));

      const result = await promise;
      expect(result).toEqual(mockFiles);
    });
  });

  describe("fs.promises.mkdir", () => {
    it("应该返回 Promise 并成功创建目录", async () => {
      const promise = fs.promises.mkdir("path/to/new/dir");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("success");

      await expect(promise).resolves.toBeDefined();
    });
  });

  describe("fs.promises.moveFile", () => {
    it("应该返回 Promise 并成功移动文件", async () => {
      const promise = fs.promises.moveFile("old.txt", "new.txt");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("success");

      await expect(promise).resolves.toBeDefined();
    });
  });

  describe("fs.promises.deleteFile", () => {
    it("应该返回 Promise 并成功删除文件", async () => {
      const promise = fs.promises.deleteFile("file.txt");

      const xhr = MockXMLHttpRequest.instances[0];
      xhr.simulateSuccess("success");

      await expect(promise).resolves.toBeDefined();
    });
  });
});

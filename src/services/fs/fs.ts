/**
 * fs 模块 - 文件系统操作
 *
 * 提供文件系统操作的两种 API 风格：
 * - 回调风格 API（兼容原有代码）
 * - Promise 风格 API（fs.promises 命名空间）
 */

// ==================== 类型定义 ====================

/** 文件编码类型 */
export type FileEncoding = "utf-8" | "base64";

/** 标准回调函数类型 */
export type Callback<T = string> = (err: string | null, data?: T | null) => void;

/** 无返回值回调函数类型 */
export type VoidCallback = (err: string | null) => void;

/** fs.promises 模块接口 */
export interface FsPromiseApi {
  readFile(filename: string, encoding: FileEncoding): Promise<string>;
  writeFile(filename: string, data: string, encoding: FileEncoding): Promise<void>;
  writeMultiFiles(filenames: string[], dataList: string[]): Promise<void>;
  readdir(path: string): Promise<string[]>;
  mkdir(path: string): Promise<void>;
  moveFile(src: string, dest: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
}

/** 完整的 fs 模块接口 */
export interface Fs {
  readFile(filename: string, encoding: FileEncoding, callback: Callback<string>): void;
  writeFile(filename: string, data: string, encoding: FileEncoding, callback: VoidCallback): void;
  writeMultiFiles(filenames: string[], dataList: string[], callback: VoidCallback): void;
  readdir(path: string, callback: Callback<string[]>): void;
  mkdir(path: string, callback: VoidCallback): void;
  moveFile(src: string, dest: string, callback: VoidCallback): void;
  deleteFile(path: string, callback: VoidCallback): void;
  promises: FsPromiseApi;
}

// ==================== 工具函数 ====================

/**
 * 检查值是否已设置（非 undefined、null、NaN）
 */
function isset<T>(val: T | undefined | null): val is T {
  if (val === undefined || val === null) {
    return false;
  }
  if (typeof val === "number" && isNaN(val)) {
    return false;
  }
  return true;
}

/**
 * 发送 HTTP 请求 (使用 XMLHttpRequest 保持兼容性)
 */
function httpRequest(
  type: string,
  url: string,
  formData: string | null,
  success: ((data: string) => void) | null,
  error: ((msg: string) => void) | null,
  mimeType?: string,
  responseType?: XMLHttpRequestResponseType,
): void {
  const xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  if (isset(mimeType)) {
    xhr.overrideMimeType(mimeType);
  }
  if (isset(responseType)) {
    xhr.responseType = responseType;
  }
  xhr.onload = function () {
    if (xhr.status === 200) {
      if (isset(success)) {
        success(xhr.response as string);
      }
    } else {
      if (isset(error)) {
        error("HTTP " + xhr.status);
      }
    }
  };
  xhr.onabort = function () {
    if (isset(error)) {
      error("Abort");
    }
  };
  xhr.ontimeout = function () {
    if (isset(error)) {
      error("Timeout");
    }
  };
  xhr.onerror = function () {
    if (isset(error)) {
      error("Error on Connection");
    }
  };
  if (isset(formData)) {
    xhr.send(formData);
  } else {
    xhr.send();
  }
}

/**
 * 向服务器发送 POST 请求并处理响应
 */
function postData(data: string | null, endpoint: string, callback: Callback): void {
  if (typeof data === "undefined" || data === null) {
    data = JSON.stringify({ 1: 2 });
  }

  httpRequest(
    "POST",
    endpoint,
    data,
    function (response) {
      if (response.slice(0, 6) === "error:") {
        callback(response, null);
      } else {
        callback(null, response);
      }
    },
    function (e) {
      if ((window as unknown as { main: unknown }).main != null) {
        console.log(e);
      } else {
        console.log(e);
      }
      callback(e + "：请检查启动服务是否处于正常运行状态。");
    },
    "text/plain; charset=x-user-defined",
  );
}

// ==================== Promise API ====================

/**
 * 将回调函数转换为 Promise
 */
function promisify<T>(
  fn: (callback: Callback<T>) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, data) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(data as T);
      }
    });
  });
}

const promises: FsPromiseApi = {
  readFile(filename: string, encoding: FileEncoding): Promise<string> {
    return promisify<string>((callback) => {
      fs.readFile(filename, encoding, callback);
    });
  },

  writeFile(filename: string, data: string, encoding: FileEncoding): Promise<void> {
    return promisify<void>((callback) => {
      fs.writeFile(filename, data, encoding, callback as VoidCallback);
    });
  },

  writeMultiFiles(filenames: string[], dataList: string[]): Promise<void> {
    return promisify<void>((callback) => {
      fs.writeMultiFiles(filenames, dataList, callback as VoidCallback);
    });
  },

  readdir(path: string): Promise<string[]> {
    return promisify<string[]>((callback) => {
      fs.readdir(path, callback);
    });
  },

  mkdir(path: string): Promise<void> {
    return promisify<void>((callback) => {
      fs.mkdir(path, callback as VoidCallback);
    });
  },

  moveFile(src: string, dest: string): Promise<void> {
    return promisify<void>((callback) => {
      fs.moveFile(src, dest, callback as VoidCallback);
    });
  },

  deleteFile(path: string): Promise<void> {
    return promisify<void>((callback) => {
      fs.deleteFile(path, callback as VoidCallback);
    });
  },
};

// ==================== 回调 API ====================

export const fs: Fs = {
  readFile(filename: string, encoding: FileEncoding, callback: Callback<string>): void {
    if (typeof filename !== "string") {
      throw "Type Error in fs.readFile";
    }
    if (encoding === "utf-8") {
      const data = "type=utf8&name=" + filename;
      postData(data, "/readFile", callback);
      return;
    }
    if (encoding === "base64") {
      const data = "type=base64&name=" + filename;
      postData(data, "/readFile", callback);
      return;
    }
    throw "Type Error in fs.readFile";
  },

  writeFile(filename: string, datastr: string, encoding: FileEncoding, callback: VoidCallback): void {
    if (typeof filename !== "string" || typeof datastr !== "string") {
      throw "Type Error in fs.writeFile";
    }
    if (encoding === "utf-8") {
      const data = "type=utf8&name=" + filename + "&value=" + datastr;
      postData(data, "/writeFile", callback);
      return;
    }
    if (encoding === "base64") {
      const data = "type=base64&name=" + filename + "&value=" + datastr;
      postData(data, "/writeFile", callback);
      return;
    }
    throw "Type Error in fs.writeFile";
  },

  writeMultiFiles(filenames: string[], datastrs: string[], callback: VoidCallback): void {
    postData("name=" + filenames.join(";") + "&value=" + datastrs.join(";"), "/writeMultiFiles", callback);
  },

  readdir(path: string, callback: Callback<string[]>): void {
    if (typeof path !== "string") {
      throw "Type Error in fs.readdir";
    }
    const data = "name=" + path;
    postData(data, "/listFile", function (err, response) {
      let parsedData: string[] | null = null;
      try {
        parsedData = JSON.parse(response as string);
      } catch {
        err = "Invalid /listFile";
        parsedData = null;
      }
      callback(err, parsedData);
    });
  },

  mkdir(path: string, callback: VoidCallback): void {
    if (typeof path !== "string") {
      throw "Type Error in fs.readdir";
    }
    const data = "name=" + path;
    postData(data, "/makeDir", callback);
  },

  moveFile(src: string, dest: string, callback: VoidCallback): void {
    if (typeof src !== "string" || typeof dest !== "string") {
      throw "Type Error in fs.readdir";
    }
    const data = "src=" + src + "&dest=" + dest;
    postData(data, "/moveFile", callback);
  },

  deleteFile(path: string, callback: VoidCallback): void {
    if (typeof path !== "string") {
      throw "Type Error in fs.readdir";
    }
    const data = "name=" + path;
    postData(data, "/deleteFile", callback);
  },

  promises,
};

export default fs;

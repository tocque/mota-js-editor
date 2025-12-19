/**
 * 文件编辑处理器
 *
 * 处理文件的导入、保存和注释文件编辑。
 */

import { encode64, decode64 } from "@/utils/encoding";
import { COMMENT_FILE_PATHS } from "../config/commands";

/**
 * 文件系统接口
 */
export interface FileSystem {
  readFile: (
    path: string,
    encoding: string,
    callback: (err: Error | null, data?: string) => void
  ) => void;
  writeFile: (
    path: string,
    data: string,
    encoding: string,
    callback: (err: Error | null, data?: unknown) => void
  ) => void;
}

/**
 * 文件处理器依赖接口
 */
export interface FileHandlerDeps {
  /** 文件系统实例 */
  fs: FileSystem;
  /** 设置编辑器值 */
  setValue: (val: string) => void;
  /** 获取编辑器当前值 */
  getValue: () => string;
  /** 显示编辑器 */
  show: () => void;
  /** 隐藏编辑器 */
  hide: () => void;
  /** 获取/设置当前编辑 ID */
  getId: () => string;
  setId: (id: string) => void;
  /** 设置是否启用 lint */
  setLintAutocomplete: (value: boolean) => void;
  /** 应用 lint 设置 */
  setLint: () => void;
  /** 打印成功消息 */
  printf: (message: string) => void;
  /** 打印错误消息 */
  printe: (message: string) => void;
}

/**
 * 创建文件处理器
 *
 * @param deps - 依赖注入
 * @returns 文件处理器对象
 */
export function createFileHandler(deps: FileHandlerDeps) {
  // 存储当前文件信息
  let currentFilename = "";
  let originalContent = "";

  /**
   * 导入文件到编辑器
   *
   * @param filename - 文件路径
   */
  function importFile(filename: string): void {
    deps.setId("importFile");
    currentFilename = filename;
    deps.setValue("loading");
    deps.show();

    deps.fs.readFile(filename, "base64", (err, data) => {
      if (err) {
        deps.setValue("加载文件失败:\n" + err);
        deps.setId("");
        return;
      }

      const str = decode64(data || "");
      deps.setValue(str);
      originalContent = str;
    });
  }

  /**
   * 保存文件
   *
   * @param keep - 是否保持编辑器打开
   */
  function writeFileDone(keep?: boolean): void {
    const content = deps.getValue() || "";
    const encodedContent = encode64(content);

    deps.fs.writeFile(currentFilename, encodedContent, "base64", (err) => {
      if (err) {
        deps.printe("文件写入失败,请手动粘贴至" + currentFilename + "\n" + err);
      } else {
        if (!keep) {
          deps.setId("");
          deps.hide();
        } else {
          alert("写入成功！");
        }
        deps.printf(currentFilename + " 写入成功，F5刷新后生效");
      }
    });
  }

  /**
   * 编辑注释文件
   *
   * @param mod - 编辑模式（loc, enemyitem, floor, tower, functions, commonevent, plugins）
   */
  function editCommentJs(mod: string): void {
    const filePath = COMMENT_FILE_PATHS[mod];
    if (!filePath) {
      deps.printe("未知的编辑模式: " + mod);
      return;
    }

    deps.setLintAutocomplete(true);
    deps.setLint();
    importFile(filePath);
  }

  /**
   * 获取当前文件名（用于测试）
   */
  function getCurrentFilename(): string {
    return currentFilename;
  }

  /**
   * 获取原始内容（用于测试）
   */
  function getOriginalContent(): string {
    return originalContent;
  }

  return {
    importFile,
    writeFileDone,
    editCommentJs,
    getCurrentFilename,
    getOriginalContent,
  };
}

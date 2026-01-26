/**
 * Handler 工厂
 *
 * 创建代码编辑器的入口函数，每个入口函数通过调用 open 接口实现。
 */

import { encode64, decode64 } from "@/utils/encoding";
import { fs } from "@/services/fs";
import { COMMENT_FILE_PATHS } from "../config/commands";
import type {
  CodeEditorAPI,
  MultiLineArgs,
  MultiLineCallback,
  OpenConfig,
  OpenCallbacks,
} from "./types";

/**
 * Handler 依赖接口
 */
export interface HandlerDeps extends CodeEditorAPI {
  /** 新的简洁 open 接口 */
  open(initialValue: string, config: OpenConfig, callbacks: OpenCallbacks): void;
  /** 设置 lint */
  setLint(): void;
}

/**
 * Handler 返回类型
 */
export interface Handler {
  /** 从文件导入 */
  importFile(filename: string): void;
  /** 编辑注释文件 */
  editCommentJs(mod: string): void;
  /** Blockly 多行编辑 */
  multiLineEdit(
    value: string,
    b: unknown,
    f: unknown,
    args: MultiLineArgs,
    callback: MultiLineCallback
  ): void;
}

/**
 * 创建 Handler 工厂
 *
 * @param deps - 编辑器依赖
 * @returns 3 个入口函数
 */
export function createHandler(deps: HandlerDeps): Handler {
  /**
   * 导入文件到编辑器
   * 通过 open 接口实现
   */
  function importFile(filename: string): void {
    // 先显示 loading 状态
    deps.open(
      "loading",
      {
        lint: true,
        contextId: "importFile",
      },
      {
        onConfirm: (content) => {
          // 将内容写回文件
          const encodedContent = encode64(content);
          fs.writeFile(filename, encodedContent, "base64", (err) => {
            if (err) {
              deps.printe("文件写入失败,请手动粘贴至" + filename + "\n" + err);
            } else {
              deps.printf(filename + " 写入成功，F5刷新后生效");
            }
          });
        },
      }
    );

    // 异步加载文件内容
    fs.readFile(filename, "base64", (err, data) => {
      if (err) {
        deps.setValue("加载文件失败:\n" + err);
        return;
      }

      const str = decode64(data || "");
      deps.setValue(str);
    });
  }

  /**
   * 编辑注释文件
   */
  function editCommentJs(mod: string): void {
    const filePath = COMMENT_FILE_PATHS[mod];
    if (!filePath) {
      deps.printe("未知的编辑模式: " + mod);
      return;
    }

    deps.setLint();
    importFile(filePath);
  }

  /**
   * Blockly 多行编辑
   * 通过 open 接口实现
   */
  function multiLineEdit(
    value: string,
    b: unknown,
    f: unknown,
    args: MultiLineArgs,
    callback: MultiLineCallback
  ): void {
    // 将 \\n 转换为实际换行符
    const initialValue = value.split("\\n").join("\n") || "";

    deps.open(
      initialValue,
      {
        lint: args.lint,
        contextId: "callFromBlockly",
      },
      {
        onConfirm: (newValue) => {
          callback(newValue, b, f);
        },
      }
    );
  }

  return {
    importFile,
    editCommentJs,
    multiLineEdit,
  };
}

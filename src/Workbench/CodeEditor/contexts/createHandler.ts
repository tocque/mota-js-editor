/**
 * Handler 工厂
 *
 * 创建代码编辑器的入口函数，每个入口函数通过调用 open 接口实现。
 */

import { encode64, decode64 } from "@/utils/encoding";
import { fs } from "@/services/fs";
import { defaultGuidGenerator } from "../utils/codeTransformers";
import { COMMENT_FILE_PATHS, PLUGIN_DEFAULT_TEMPLATE } from "../config/commands";
import type {
  CodeEditorAPI,
  ImportArgs,
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
  /** 获取缩进字符 */
  getIndent(field: string): string;
  /** 获取编辑器模式 */
  getEditorMode(): string;
  /** 设置 lint */
  setLint(): void;
}

/**
 * Handler 返回类型
 */
export interface Handler {
  /** 从表格导入 */
  importFromTable(id: string, args: ImportArgs): boolean;
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
 * 滚动位置缓存（表格编辑用）
 */
const lastOffset: Record<string, number> = {};

/**
 * 创建 Handler 工厂
 *
 * @param deps - 编辑器依赖
 * @returns 4 个入口函数
 */
export function createHandler(deps: HandlerDeps): Handler {
  // ========== DOM 读写辅助函数 ==========

  /**
   * 从 DOM 读取表格值
   */
  function readFromDOM(
    id: string,
    args: ImportArgs
  ): { initialValue: string; isString: boolean; input: HTMLTextAreaElement } | null {
    const thisTr = document.getElementById(id);
    if (!thisTr) return null;

    const input = thisTr.children[2]?.children[0]?.children[0] as HTMLTextAreaElement | undefined;
    const field = thisTr.children[0]?.getAttribute("title") || "";

    if (!input || input.type !== "textarea") return null;

    // 处理默认值
    if ((!input.value || input.value === "null") && args.template) {
      input.value = '"' + args.template + '"';
    }
    if ((!input.value || input.value === "null") && deps.getEditorMode() === "plugins") {
      input.value = PLUGIN_DEFAULT_TEMPLATE;
    }

    // 解析值和判断模式
    let initialValue: string;
    let isString = false;

    if (input.value.slice(0, 1) === '"' || args.string) {
      isString = true;
      initialValue = JSON.parse(input.value) || "";
    } else {
      const indent = deps.getIndent(field);
      const tobj = eval(`(${input.value || "null"})`);
      const tmap: Record<string, string> = {};

      let tstr = JSON.stringify(
        tobj,
        (_k, v) => {
          if (typeof v === "string" && v.slice(0, 8) === "function") {
            const guid = defaultGuidGenerator();
            tmap[guid] = v.toString();
            return guid;
          }
          return v;
        },
        indent
      );

      for (const guid in tmap) {
        tstr = tstr.replace('"' + guid + '"', tmap[guid]);
      }

      initialValue = tstr || "";
    }

    return { initialValue, isString, input };
  }

  /**
   * 将值写回 DOM
   */
  function writeToDOM(input: HTMLTextAreaElement, value: string, isString: boolean): void {
    if (isString) {
      input.value = JSON.stringify(value);
    } else {
      const tobj = eval(`(${value || "null"})`);
      const tmap: Record<string, string> = {};

      let tstr = JSON.stringify(
        tobj,
        (_k, v) => {
          if (v instanceof Function) {
            const guid = defaultGuidGenerator();
            tmap[guid] = v.toString();
            return guid;
          }
          return v;
        },
        4
      );

      for (const guid in tmap) {
        tstr = tstr.replace('"' + guid + '"', JSON.stringify(tmap[guid]));
      }

      input.value = tstr;
    }

    // 触发 onchange 事件
    input.onchange?.(new Event("change"));
  }

  // ========== 入口函数 ==========

  /**
   * 从表格 textarea 导入内容到编辑器
   * 通过 open 接口实现
   */
  function importFromTable(id: string, args: ImportArgs): boolean {
    const result = readFromDOM(id, args);
    if (!result) return false;

    const { initialValue, isString, input } = result;

    deps.open(
      initialValue,
      {
        lint: args.lint,
        preview: args.preview,
        scrollTop: lastOffset[id] || 0,
        contextId: id,
      },
      {
        onConfirm: (value) => {
          // 保存滚动位置
          lastOffset[id] = deps.getScrollInfo().top;
          // 写回 DOM
          writeToDOM(input, value, isString);
        },
        onCancel: () => {
          // 保存滚动位置
          lastOffset[id] = deps.getScrollInfo().top;
        },
      }
    );

    return true;
  }

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
    importFromTable,
    importFile,
    editCommentJs,
    multiLineEdit,
  };
}

/**
 * Handler 工厂
 *
 * 创建代码编辑器的入口函数，每个入口函数会创建对应的 EditContext 并打开编辑器。
 */

import { encode64, decode64 } from "@/utils/encoding";
import { fs } from "@/services/fs";
import { defaultGuidGenerator } from "../utils/codeTransformers";
import { COMMENT_FILE_PATHS, PLUGIN_DEFAULT_TEMPLATE } from "../config/commands";
import type {
  EditContext,
  EditorConfig,
  CodeEditorAPI,
  ImportArgs,
  MultiLineArgs,
  MultiLineCallback,
} from "./types";

/**
 * Handler 依赖接口
 */
export interface HandlerDeps extends CodeEditorAPI {
  /** 显示编辑器并设置上下文 */
  open(context: EditContext, config: EditorConfig): void;
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
  // ========== TableEditContext ==========
  class TableEditContext implements EditContext {
    readonly id: string;
    private readonly isString: boolean;

    constructor(id: string, isString: boolean) {
      this.id = id;
      this.isString = isString;
    }

    confirm(keep?: boolean): void {
      // 保存滚动位置
      lastOffset[this.id] = deps.getScrollInfo().top;

      // 格式化代码
      deps.format();

      // 将值写回表格
      const value = deps.getValue() || "";
      const thisTr = document.getElementById(this.id);
      if (!thisTr) return;

      const input = thisTr.children[2]?.children[0]?.children[0] as HTMLTextAreaElement | undefined;
      if (!input) return;

      if (this.isString) {
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

      if (!keep) {
        deps.hide();
      } else {
        alert("写入成功！");
      }

      // 触发 onchange 事件
      input.onchange?.(new Event("change"));
    }

    cancel(): void {
      // 保存滚动位置
      lastOffset[this.id] = deps.getScrollInfo().top;
      deps.hide();
    }
  }

  // ========== BlocklyEditContext ==========
  class BlocklyEditContext implements EditContext {
    readonly id = "callFromBlockly";
    private readonly b: unknown;
    private readonly f: unknown;
    private readonly callback: MultiLineCallback;

    constructor(b: unknown, f: unknown, callback: MultiLineCallback) {
      this.b = b;
      this.f = f;
      this.callback = callback;
    }

    confirm(keep?: boolean): void {
      deps.format();
      const newValue = deps.getValue() || "";
      this.callback(newValue, this.b, this.f);

      if (!keep) {
        deps.hide();
      } else {
        alert("写入成功！");
      }
    }

    cancel(): void {
      deps.hide();
    }
  }

  // ========== FileEditContext ==========
  class FileEditContext implements EditContext {
    readonly id = "importFile";
    private readonly filename: string;

    constructor(filename: string) {
      this.filename = filename;
    }

    confirm(keep?: boolean): void {
      deps.format();
      const content = deps.getValue() || "";
      const encodedContent = encode64(content);

      fs.writeFile(this.filename, encodedContent, "base64", (err) => {
        if (err) {
          deps.printe("文件写入失败,请手动粘贴至" + this.filename + "\n" + err);
        } else {
          if (!keep) {
            deps.hide();
          } else {
            alert("写入成功！");
          }
          deps.printf(this.filename + " 写入成功，F5刷新后生效");
        }
      });
    }

    cancel(): void {
      deps.hide();
    }
  }

  // ========== 入口函数 ==========

  /**
   * 从表格 textarea 导入内容到编辑器
   */
  function importFromTable(id: string, args: ImportArgs): boolean {
    const thisTr = document.getElementById(id);
    if (!thisTr) return false;

    const input = thisTr.children[2]?.children[0]?.children[0] as HTMLTextAreaElement | undefined;
    const field = thisTr.children[0]?.getAttribute("title") || "";

    if (!input || input.type !== "textarea") return false;

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

    // 创建上下文并打开编辑器
    const context = new TableEditContext(id, isString);
    deps.open(context, {
      initialValue,
      lint: args.lint,
      isString,
      preview: args.preview,
      scrollTop: lastOffset[id] || 0,
    });

    return true;
  }

  /**
   * 导入文件到编辑器
   */
  function importFile(filename: string): void {
    const context = new FileEditContext(filename);

    // 先显示 loading 状态
    deps.open(context, {
      initialValue: "loading",
      lint: true,
    });

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
   */
  function multiLineEdit(
    value: string,
    b: unknown,
    f: unknown,
    args: MultiLineArgs,
    callback: MultiLineCallback
  ): void {
    const context = new BlocklyEditContext(b, f, callback);

    // 将 \\n 转换为实际换行符
    const initialValue = value.split("\\n").join("\n") || "";

    deps.open(context, {
      initialValue,
      lint: args.lint,
    });
  }

  return {
    importFromTable,
    importFile,
    editCommentJs,
    multiLineEdit,
  };
}

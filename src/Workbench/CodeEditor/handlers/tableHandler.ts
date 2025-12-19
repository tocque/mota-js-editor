/**
 * 表格编辑处理器
 *
 * 处理从数据表格 textarea 导入和确认编辑的逻辑。
 */

import { defaultGuidGenerator } from "../utils/codeTransformers";
import { PLUGIN_DEFAULT_TEMPLATE } from "../config/commands";

/**
 * 表格处理器依赖接口
 */
export interface TableHandlerDeps {
  /** 获取编辑器当前值 */
  getValue: () => string;
  /** 设置编辑器值 */
  setValue: (val: string) => void;
  /** 显示编辑器 */
  show: () => void;
  /** 隐藏编辑器 */
  hide: () => void;
  /** 格式化代码 */
  format: () => void;
  /** 检查是否有语法错误 */
  hasError: () => boolean;
  /** 获取滚动信息 */
  getScrollInfo: () => { top: number };
  /** 滚动到指定位置 */
  scrollTo: (x: number, y: number) => void;
  /** 获取缩进 */
  indent: (field: string) => string;
  /** 获取/设置当前编辑 ID */
  getId: () => string;
  setId: (id: string) => void;
  /** 获取/设置是否为字符串模式 */
  getIsString: () => boolean;
  setIsString: (value: boolean) => void;
  /** 获取/设置是否启用 lint */
  getLintAutocomplete: () => boolean;
  setLintAutocomplete: (value: boolean) => void;
  /** 获取/设置预览数据 */
  getPreview: () => unknown;
  setPreview: (value: unknown) => void;
  /** 更新预览按钮可见性 */
  updateShowPreview: (show: boolean) => void;
  /** 获取编辑器模式 */
  getEditorMode: () => string;
  /** Blockly 相关回调 */
  multiLineDone?: (keep?: boolean) => void;
  /** 文件写入回调 */
  writeFileDone?: (keep?: boolean) => void;
}

/**
 * 导入参数接口
 */
export interface ImportArgs {
  /** 是否启用语法检查 */
  lint?: boolean;
  /** 是否为字符串模式 */
  string?: boolean;
  /** 默认模板 */
  template?: string;
  /** 预览数据 */
  preview?: unknown;
}

/**
 * 滚动位置缓存
 */
const lastOffset: Record<string, number> = {};

/**
 * 创建表格处理器
 *
 * @param deps - 依赖注入
 * @returns 表格处理器对象
 */
export function createTableHandler(deps: TableHandlerDeps) {
  /**
   * 从表格 textarea 导入内容到编辑器
   *
   * @param id - 表格行元素 ID
   * @param args - 导入参数
   * @returns 是否导入成功
   */
  function importFromTable(id: string, args: ImportArgs): boolean {
    const thisTr = document.getElementById(id);
    if (!thisTr) return false;

    const input = thisTr.children[2]?.children[0]?.children[0] as HTMLTextAreaElement | undefined;
    const field = thisTr.children[0]?.getAttribute("title") || "";

    if (!input || input.type !== "textarea") return false;

    // 设置状态
    deps.setId(id);
    deps.setIsString(false);
    deps.setLintAutocomplete(false);
    deps.setPreview(args.preview);
    deps.updateShowPreview(!!args.preview);

    if (args.lint === true) {
      deps.setLintAutocomplete(true);
    }

    // 处理默认值
    if ((!input.value || input.value === "null") && args.template) {
      input.value = '"' + args.template + '"';
    }
    if ((!input.value || input.value === "null") && deps.getEditorMode() === "plugins") {
      input.value = PLUGIN_DEFAULT_TEMPLATE;
    }

    // 解析并设置值
    if (input.value.slice(0, 1) === '"' || args.string) {
      deps.setIsString(true);
      deps.setValue(JSON.parse(input.value) || "");
    } else {
      const indent = deps.indent(field);
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

      deps.setValue(tstr || "");
    }

    deps.show();
    deps.scrollTo(0, lastOffset[id] || 0);
    return true;
  }

  /**
   * 确认编辑并保存到表格
   *
   * @param keep - 是否保持编辑器打开
   */
  function confirm(keep?: boolean): void {
    if (deps.hasError()) {
      alert("当前好像存在严重的语法错误，请处理后再保存。\n严重的语法错误可能会导致整个编辑器的崩溃。");
      return;
    }

    const currentId = deps.getId();
    if (!currentId) {
      deps.setId("");
      return;
    }

    // 处理 Blockly 调用
    if (currentId === "callFromBlockly") {
      deps.format();
      deps.multiLineDone?.(keep);
      return;
    }

    // 处理文件导入
    if (currentId === "importFile") {
      deps.format();
      deps.writeFileDone?.(keep);
      return;
    }

    // 保存滚动位置
    lastOffset[currentId] = deps.getScrollInfo().top;

    // 格式化代码
    deps.format();

    // 将值写回表格
    const value = deps.getValue() || "";
    const thisTr = document.getElementById(currentId);
    if (!thisTr) return;

    const input = thisTr.children[2]?.children[0]?.children[0] as HTMLTextAreaElement | undefined;
    if (!input) return;

    if (deps.getIsString()) {
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
      deps.setId("");
      deps.hide();
    } else {
      alert("写入成功！");
    }

    // 触发 onchange 事件
    input.onchange?.(new Event("change"));
  }

  /**
   * 取消编辑
   */
  function cancel(): void {
    const currentId = deps.getId();
    if (currentId && currentId !== "callFromBlockly" && currentId !== "importFile") {
      lastOffset[currentId] = deps.getScrollInfo().top;
    }
    deps.hide();
    deps.setId("");
  }

  return {
    import: importFromTable,
    confirm,
    cancel,
    /** 暴露 lastOffset 用于测试 */
    _lastOffset: lastOffset,
  };
}

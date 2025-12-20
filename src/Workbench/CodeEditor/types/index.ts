/**
 * editor_multi 模块类型定义
 */

// ============== 重新导出游戏数据类型（保持向后兼容） ==============
export type {
  CoreMaterial,
  CoreStatus,
  CoreType,
  FunctionsType,
  DataCommentType,
} from "@/types/game";

// ============== Tern 相关类型 ==============

/** Tern 定义中的单个条目 */
export interface TernTypeEntry {
  "!type"?: string;
  "!doc"?: string;
  "!url"?: string;
  [key: string]: TernTypeEntry | string | undefined;
}

/** Tern definitions 的 core 部分结构 */
export interface TernCoreDef {
  core: {
    material: {
      enemys: Record<string, TernTypeEntry>;
      bgms: Record<string, TernTypeEntry>;
      sounds: Record<string, TernTypeEntry>;
      animates: Record<string, TernTypeEntry>;
      images: Record<string, TernTypeEntry>;
      items: Record<string, TernTypeEntry>;
    };
    enemys: {
      hasSpecial: TernTypeEntry;
      [key: string]: TernTypeEntry;
    };
    canvas: Record<string, TernTypeEntry>;
    status: {
      maps: Record<string, TernTypeEntry>;
      bgmaps: Record<string, TernTypeEntry>;
      fgmaps: Record<string, TernTypeEntry>;
      shops: Record<string, TernTypeEntry>;
      textAttribute: Record<string, TernTypeEntry>;
      [key: string]: Record<string, TernTypeEntry> | TernTypeEntry;
    };
    values: Record<string, TernTypeEntry>;
    flags: Record<string, TernTypeEntry>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ============== 编辑器状态类型 ==============

/** 编辑上下文 */
export interface EditContext {
  /** 编辑的目标ID，可能是表格行ID、'callFromBlockly'、'importFile' */
  id: string;
  /** 是否以字符串模式编辑 */
  isString: boolean;
  /** 是否启用 lint 和自动补全 */
  lintAutocomplete: boolean;
  /** 预览回调标识 */
  preview?: string;
}

/** 代码转换选项 */
export interface CodeTransformOptions {
  /** 缩进字符，默认 '\t' */
  indent?: string | number;
  /** GUID 生成函数 */
  guidGenerator?: () => string;
}

/** 导入参数 */
export interface ImportArgs {
  /** 是否启用 lint */
  lint?: boolean;
  /** 是否以字符串模式 */
  string?: boolean;
  /** 默认模板 */
  template?: string;
  /** 预览标识 */
  preview?: string;
}

// ============== 命令配置类型 ==============

/** 快捷键名称 */
export type ShortcutKey =
  | "Ctrl-/"
  | "Ctrl-B"
  | "Ctrl-Q"
  | "Ctrl-F"
  | "Ctrl-R"
  | "Ctrl-D"
  | "Ctrl-O"
  | "Ctrl-P";

/** 命令名称映射 */
export type CommandsNameMap = Record<ShortcutKey, string>;

/** 注释文件路径映射 */
export type CommentFilePathMap = Record<string, string>;

// ============== 多行编辑回调类型 ==============

/** Blockly 多行编辑回调 */
export type MultiLineCallback = (
  newValue: string,
  block: unknown,
  field: unknown
) => void;

/** 多行编辑参数 */
export type MultiLineArgs = [
  block: unknown | null,
  field: unknown | null,
  callback: MultiLineCallback | null,
];

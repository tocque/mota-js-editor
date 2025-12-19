/**
 * editor_multi 模块类型定义
 */

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

/** 编辑上下文类型 */
export type EditContextType = "table" | "blockly" | "file";

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

// ============== 游戏数据类型（简化版，用于类型推断） ==============

/** 简化的 core.material 类型 */
export interface CoreMaterial {
  enemys: Record<string, { name?: string }>;
  bgms: Record<string, unknown>;
  sounds: Record<string, unknown>;
  animates: Record<string, unknown>;
  images: Record<string, unknown>;
  items: Record<string, { name?: string }>;
}

/** 简化的 core.status 类型 */
export interface CoreStatus {
  maps: Record<string, { title?: string }>;
  shops: Record<string, { textInList?: string }>;
  textAttribute: Record<string, unknown>;
  bgmaps: Record<string, unknown>;
  fgmaps: Record<string, unknown>;
}

/** 简化的 core 类型 */
export interface CoreType {
  material: CoreMaterial;
  status: CoreStatus;
  canvas: Record<string, CanvasRenderingContext2D>;
  values: Record<string, unknown>;
  flags: Record<string, unknown>;
  [key: string]: unknown;
}

/** 简化的 functions 类型 */
export interface FunctionsType {
  enemys: {
    getSpecials: () => Array<[number, string | ((arg: unknown) => string)]>;
  };
  [key: string]: unknown;
}

/** 简化的 data_comment 类型 */
export interface DataCommentType {
  _data: {
    values: {
      _data: Record<string, { _data: string } | undefined>;
    };
    flags: {
      _data: Record<string, { _data: string } | undefined>;
    };
  };
}

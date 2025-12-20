/**
 * EditContext 类型定义
 *
 * 用于代码编辑器的多态编辑上下文。
 */

/**
 * 编辑上下文接口
 *
 * 每次打开编辑器时创建一个 EditContext 实例，
 * 负责处理该次编辑的确认和取消逻辑。
 */
export interface EditContext {
  /** 上下文标识：表格元素 ID | "callFromBlockly" | "importFile" */
  readonly id: string;

  /**
   * 确认编辑，保存数据到目标
   * @param keep - 是否保持编辑器打开
   */
  confirm(keep?: boolean): void;

  /**
   * 取消编辑，执行必要的清理
   */
  cancel(): void;
}

/**
 * 编辑器配置
 * 用于打开编辑器时的初始配置
 */
export interface EditorConfig {
  /** 初始值 */
  initialValue: string;
  /** 是否启用 lint 检查 */
  lint?: boolean;
  /** 是否为字符串模式 */
  isString?: boolean;
  /** 预览数据 */
  preview?: unknown;
  /** 滚动位置 */
  scrollTop?: number;
}

/**
 * 代码编辑器 API
 * 提供给 EditContext 使用的编辑器操作接口
 */
export interface CodeEditorAPI {
  /** 获取编辑器值 */
  getValue(): string;
  /** 设置编辑器值 */
  setValue(value: string): void;
  /** 格式化代码 */
  format(): void;
  /** 隐藏编辑器 */
  hide(): void;
  /** 获取滚动信息 */
  getScrollInfo(): { top: number };
  /** 滚动到指定位置 */
  scrollTo(x: number, y: number): void;
  /** 获取是否为字符串模式 */
  getIsString(): boolean;
  /** 打印成功消息 */
  printf(message: string): void;
  /** 打印错误消息 */
  printe(message: string): void;
}

/**
 * 表格导入参数
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
 * 多行编辑参数
 */
export interface MultiLineArgs {
  /** 是否启用 lint */
  lint?: boolean;
}

/**
 * 多行编辑回调
 */
export type MultiLineCallback = (newValue: string, b: unknown, f: unknown) => void;

/**
 * Blockly 多行编辑处理器
 *
 * 处理从 Blockly 编辑器调用的多行代码编辑。
 */

/**
 * Blockly 处理器依赖接口
 */
export interface BlocklyHandlerDeps {
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
  /** 获取/设置是否启用 lint */
  setLintAutocomplete: (value: boolean) => void;
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

/**
 * 创建 Blockly 处理器
 *
 * @param deps - 依赖注入
 * @returns Blockly 处理器对象
 */
export function createBlocklyHandler(deps: BlocklyHandlerDeps) {
  // 存储 Blockly 调用的参数
  let multiLineArgs: [unknown, unknown, MultiLineCallback | null] = [null, null, null];

  /**
   * 开始多行编辑
   *
   * @param value - 初始值（使用 \\n 作为换行符）
   * @param b - Blockly 参数 b
   * @param f - Blockly 参数 f
   * @param args - 编辑参数
   * @param callback - 完成回调
   */
  function multiLineEdit(
    value: string,
    b: unknown,
    f: unknown,
    args: MultiLineArgs,
    callback: MultiLineCallback
  ): void {
    deps.setId("callFromBlockly");
    // 将 \\n 转换为实际换行符
    deps.setValue(value.split("\\n").join("\n") || "");
    multiLineArgs = [b, f, callback];
    deps.setLintAutocomplete(Boolean(args.lint));
    deps.show();
  }

  /**
   * 完成多行编辑
   *
   * @param keep - 是否保持编辑器打开
   */
  function multiLineDone(keep?: boolean): void {
    const [b, f, callback] = multiLineArgs;
    if (!b || !f || !callback) return;

    const newValue = deps.getValue() || "";
    callback(newValue, b, f);

    if (!keep) {
      deps.setId("");
      deps.hide();
    } else {
      alert("写入成功！");
    }
  }

  /**
   * 重置 Blockly 参数（用于取消操作）
   */
  function reset(): void {
    multiLineArgs = [null, null, null];
  }

  return {
    multiLineEdit,
    multiLineDone,
    reset,
  };
}

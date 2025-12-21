import { useCallback, useMemo, useRef, type FC } from 'react';
import type { TableRowProps, FieldType, CheckboxSetConfig } from '../types';
import { ActionButtons } from './ActionButtons';
import {
  TextareaInput,
  SelectInput,
  CheckboxInput,
  CheckboxSet,
} from './inputs';
import { checkRange } from '../utils/validation';
import { generateGuid } from '@/utils/json';

/**
 * 获取全局 printe 函数
 */
const getPrinte = (): ((msg: string) => void) | undefined => {
  if (typeof window !== 'undefined' && 'printe' in window) {
    return (window as unknown as { printe: (msg: string) => void }).printe;
  }
  return undefined;
};

/**
 * 根据字段类型渲染对应的输入组件
 */
const renderInput = (
  type: FieldType | undefined,
  value: unknown,
  config: TableRowProps['config'],
  onChange: (value: unknown) => void,
): React.ReactNode => {
  switch (type) {
    case 'select':
      return (
        <SelectInput
          value={value}
          options={config._select?.values ?? []}
          onChange={onChange}
        />
      );

    case 'checkbox':
      return (
        <CheckboxInput
          value={Boolean(value)}
          onChange={onChange}
        />
      );

    case 'checkboxSet': {
      // 获取 checkboxSet 配置，支持函数形式
      const checkboxSetConfig: CheckboxSetConfig | undefined =
        typeof config._checkboxSet === 'function'
          ? config._checkboxSet()
          : config._checkboxSet;

      return (
        <CheckboxSet
          value={value}
          keys={checkboxSetConfig?.key ?? []}
          prefixStrings={checkboxSetConfig?.prefix ?? []}
          onChange={onChange}
        />
      );
    }

    case 'disable':
      return (
        <TextareaInput
          value={value}
          indent={config.indent}
          disabled
          readonly
          onChange={onChange}
        />
      );

    // textarea, event, material, color, point, popCheckboxSet 都使用 TextareaInput
    // 它们的特殊编辑功能通过编辑按钮触发
    default:
      return (
        <TextareaInput
          value={value}
          indent={config.indent}
          onChange={onChange}
        />
      );
  }
};

/**
 * HTML 转义函数
 * 用于在 title 属性中安全显示内容
 */
const htmlEscape = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

/**
 * TableRow 组件
 *
 * 渲染表格的叶节点行，包含：
 * - 字段名称列
 * - 注释列
 * - 值输入列（根据 config._type 选择对应的输入组件）
 * - 操作按钮列
 *
 * 支持双击事件和值变更处理。
 */
export const TableRow: FC<TableRowProps> = (props) => {
  const {
    field,
    shortField,
    value,
    config,
    comment,
    shortComment,
    onChange,
    onEditClick,
    onDoubleClick,
  } = props;

  const type = config._type;

  // 生成唯一 id，用于外部编辑器定位
  const guid = useMemo(() => generateGuid(), []);

  // 生成用于 data-field 属性的值
  // "['main']['floorIds']" => "main-floorIds"
  const dataField = useMemo(
    () => field.slice(2, -2).split("']['").join('-'),
    [field],
  );

  // 转义后的注释，用于 title 属性
  const commentEscaped = useMemo(() => htmlEscape(comment), [comment]);

  // 序列化 config 用于存储（排除 _data 字段）
  const cobjStr = useMemo(() => {
    const configCopy = { ...config };
    delete (configCopy as Record<string, unknown>)._data;
    return htmlEscape(JSON.stringify(configCopy));
  }, [config]);

  // 处理注释按钮点击
  const handleCommentClick = useCallback(() => {
    // 调用全局 printf 显示完整注释
    if (typeof window !== 'undefined' && 'printf' in window) {
      (window as unknown as { printf: (msg: string) => void }).printf(comment);
    }
  }, [comment]);

  // 处理编辑按钮点击 - 调用外部传入的回调，传递 guid
  const handleEditClick = useCallback(() => {
    onEditClick?.(guid);
  }, [onEditClick, guid]);

  // 处理复制按钮点击
  const handleCopyClick = useCallback(() => {
    if (value == null) {
      if (typeof window !== 'undefined' && 'printe' in window) {
        (window as unknown as { printe: (msg: string) => void }).printe('没有赋值的内容');
      }
      return;
    }

    const textToCopy = String(value);
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        if (typeof window !== 'undefined' && 'printf' in window) {
          (window as unknown as { printf: (msg: string) => void }).printf('复制成功！');
        }
      },
      () => {
        if (typeof window !== 'undefined' && 'printe' in window) {
          (window as unknown as { printe: (msg: string) => void }).printe('无法复制此内容，请手动选择复制');
        }
      },
    );
  }, [value]);

  // 处理双击事件
  // 使用两次单击检测实现双击（支持移动端）
  const lastClickRef = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickRef.current < 500) {
      // 双击触发，传递 guid
      onDoubleClick?.(guid);
      lastClickRef.current = 0; // 重置，避免连续触发
    } else {
      lastClickRef.current = now;
    }
  }, [onDoubleClick, guid]);

  // 包装 onChange，在调用前进行 _range 验证
  const handleValueChange = useCallback((newValue: unknown) => {
    // 验证 _range
    if (!checkRange(config, newValue)) {
      const printe = getPrinte();
      printe?.(field + ' : 输入的值不合要求,请鼠标放置在注释上查看说明');
      return; // 不触发 onChange
    }
    onChange(newValue);
  }, [config, field, onChange]);

  return (
    <tr id={guid} data-field={dataField} onClick={handleClick}>
      {/* 字段名称列 */}
      <td title={field}>{shortField}</td>

      {/* 注释列 */}
      <td title={commentEscaped} data-cobj={cobjStr}>
        {shortComment || commentEscaped}
      </td>

      {/* 值输入列 */}
      <td>
        <div className={`etableInputDiv ${type || ''}`}>
          {renderInput(type, value, config, handleValueChange)}
        </div>
      </td>

      {/* 操作按钮列 */}
      <td>
        <ActionButtons
          showComment={!!shortComment}
          type={type}
          onCommentClick={handleCommentClick}
          onEditClick={handleEditClick}
          onCopyClick={handleCopyClick}
        />
      </td>
    </tr>
  );
};

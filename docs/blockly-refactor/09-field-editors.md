# 09 - 字段级编辑器架构

## 概述

本文档描述如何将现有的块级双击行为重构为字段级自定义编辑器，解决一个块只能有一种编辑行为的局限性。

## 现有问题分析

### 当前实现的局限性

现有 `doubleClickBlock` 是块级别的，四种行为互斥：

```javascript
// editor_blockly.js 中的实现
editor_blockly.doubleClickBlock = function (blockId) {
    var b = editor_blockly.workspace.getBlockById(blockId);
    
    // 四选一，互斥！
    if (b && MotaActionBlocks[b.type].previewBlock) {
        editor_blockly.previewBlock(b, ...);
        return;
    }
    if (b && MotaActionBlocks[b.type].selectPoint) {
        editor_blockly.selectPoint(b, ...);
        return;
    }
    if (b && MotaActionBlocks[b.type].material) {
        editor_blockly.selectMaterial(b, ...);
        return;
    }
    if (b && MotaActionBlocks[b.type].doubleclicktext) {
        editor_blockly.doubleclicktext(b, ...);
        return;
    }
}
```

### 问题场景

例如 `text_2_s`（显示文章含立绘）块，理论上需要：
- 文本字段 → 多行编辑器
- 立绘字段 → 素材选择器
- 位置字段 → 地图选点

但目前只能选择其中一种作为双击行为。

## export.js 中的现有标记统计

从 export.js 中提取的字段编辑器标记（共 87 处）：

| 标记类型 | 数量 | 用途 |
|---------|------|------|
| `selectPoint` | ~35 | 地图选点 |
| `material` | ~20 | 素材选择器 |
| `previewBlock` | ~15 | UI 预览 |
| `doubleclicktext` | ~10 | 多行文本编辑 |
| 其他（menu 中的 selectPoint）| ~7 | 右键菜单选点 |

## 现有编辑器组件清单

### 1. 地图选点器 (selectPoint)

**位置**: `editor_uievent.js` → `uievent.selectPoint()`

**功能**:
- 打开地图缩略图
- 支持点击选择坐标 (x, y)
- 支持切换楼层
- 支持多点选择（右键）
- 支持大地图模式切换
- WASD 键盘导航

**当前调用方式**:
```javascript
// export.js 中的标记
"selectPoint": "[\"PosString_0\", \"PosString_1\", \"IdString_0\", true]"

// 解析: [x字段, y字段, 楼层字段, 是否总是设置楼层]
```

**涉及块类型** (部分):
- `changeFloor_s` - 楼层切换
- `setBlock_s` - 设置图块
- `showImage_s` - 显示图片
- `moveAction_0_s` - 移动事件
- `battle_s` - 强制战斗
- `openDoor_s` - 开门
- `jump_s` - 跳跃

---

### 2. 素材选择器 (material)

**位置**: `editor_uievent.js` → `uievent.selectMaterial()`

**功能**:
- 读取指定目录下的文件列表
- 显示复选框列表
- 支持图片预览
- 支持音频试听（含音调调节）
- 支持动画预览
- 全选/全不选

**当前调用方式**:
```javascript
// export.js 中的标记
"material": "[\"./project/bgms/\", \"EvalString_1\"]"
"material": "[\"./project/images/:images\", \"EvalString_0\"]"

// 解析: [目录路径, 字段名]
// :images 表示附加 core.material.images.images
```

**支持的素材类型**:
| 目录 | 类型 |
|------|------|
| `./project/bgms/` | 背景音乐 |
| `./project/sounds/` | 音效 |
| `./project/images/` | 图片 |
| `./project/animates/` | 动画 |

**涉及块类型**:
- `playBgm_s` - 播放背景音乐
- `playSound_s` - 播放音效
- `showImage_s` - 显示图片
- `animate_s` - 显示动画

---

### 3. UI 预览器 (previewBlock)

**位置**: `editor_blockly.js` → `editor_blockly.previewBlock()`

**功能**:
- 将块生成的代码转换为 UI 指令
- 在 canvas 上绘制预览
- 支持多种预览类型的特殊处理

**预览类型处理**:
```javascript
switch (b.type) {
    case 'text_0_s':
    case 'text_1_s':
    case 'text_2_s':
    case 'choices_s':
    case 'confirm_s':
        // 文本类预览
        break;
    case 'setText_s':
        // 设置文本属性
        break;
    case 'showImage_s':
    case 'showImage_1_s':
        // 图片预览
        break;
    case 'setCurtain_0_s':
        // 色调预览
        break;
    case 'floorOneImage':
        // 楼层贴图预览
        break;
    case 'previewUI_s':
        // 通用 UI 预览
        break;
}
```

**涉及块类型**:
- `text_0_s`, `text_1_s`, `text_2_s` - 显示文章
- `choices_s` - 选项
- `confirm_s` - 确认框
- `showImage_s` - 显示图片
- `setCurtain_0_s` - 更改色调

---

### 4. 多行文本编辑器 (doubleclicktext)

**位置**: `editor_multi.js` → `editor_multi.multiLineEdit()`

**功能**:
- CodeMirror 编辑器
- JavaScript 语法高亮
- 自动补全 (Tern.js)
- 代码折叠
- 查找替换
- Lint 检查（可选）

**当前调用方式**:
```javascript
// export.js 中的标记
"doubleclicktext": "EvalString_Multi_0"

// 解析: 字段名
```

**涉及块类型**:
- `function_s` - 执行脚本
- `if_s` 的条件表达式
- 其他需要编写表达式的块

---

### 5. 颜色选择器 (colour)

**位置**: `editor_blockly.js` 中覆写的 `Blockly.FieldColour.prototype.showEditor_`

**功能**:
- 打开自定义颜色选择器
- 同步更新相邻的文本字段（rgba 值）

**特殊处理**:
```javascript
// 颜色块和文本框是成对出现的
// args: [..., "EvalString_0", "Colour_0", ...]
// 点击 Colour_0 时会更新 EvalString_0
```

---

### 6. 文本自动补全 (autocomplete)

**位置**: `editor_blockly.js` → `editor_blockly.onTextFieldCreate()` + Awesomplete

**功能**:
- 嵌入到普通文本输入框
- 上下文感知补全
- 支持多种补全类型

**补全类型**:
| 前缀/上下文 | 补全内容 |
|------------|---------|
| `status:` / `状态:` | 勇士属性 |
| `item:` / `物品:` | 道具 ID |
| `flag:` / `变量:` | 已使用变量 |
| `enemy:` / `怪物:` | 怪物 ID |
| `core.` | core API |
| `flags.` | 变量名 |
| `hero.` | 勇士属性 |
| `\f[` | 图片名 |
| `\i[` | 图标 ID |
| `\r[` | 颜色名 |
| `\g[` | 字体名 |
| `\` | 转义符提示 |

---

## 新架构设计：字段级编辑器

### 核心思想

将编辑器能力从"块级行为"下沉到"字段级组件"：

```
旧: Block → doubleClickBlock → 四选一行为
新: Block → Field1(编辑器A) + Field2(编辑器B) + Field3(编辑器C)
```

### 渲染与性能

#### Blockly 的渲染机制

Blockly **不会**自动卸载不可见块的控件。其设计是：

```
所有块 → 全部渲染成 SVG → 滚动时只改变 viewBox
```

- SVG 不支持"虚拟滚动"
- 浏览器会跳过屏幕外元素的绑和栅格化（GPU 层面优化）
- 但 DOM 节点、事件监听器、JavaScript 对象都保留在内存中

#### 原生 Field 的渲染模式

Blockly 原生字段采用"静态 SVG + 按需创建 HTML"的模式：

| 字段类型 | 静态显示 | 交互时 |
|---------|---------|--------|
| `FieldLabel` | SVG `<text>` | 无 |
| `FieldTextInput` | SVG `<text>` | 创建 `<input>` |
| `FieldDropdown` | SVG `<text>` | 创建下拉菜单 |
| `FieldColour` | SVG `<rect>` | 创建颜色选择器 |

关键点：**原生字段只在交互时才创建 HTML 控件**，平时只是 SVG 图形。

#### 自定义 Field 的实现原则

遵循 Blockly 原生模式，避免 foreignObject + React 的性能问题：

```
✅ 推荐：
   字段显示: SVG 文字/图形（如 "📍 (3, 5, MT1)"）
   字段交互: 点击 → React Modal（复用已有的 SelectPoint 等）

❌ 避免：
   字段显示: foreignObject + React 组件
   问题: 大量块时会有明显性能问题
```

#### 已有的 React 弹窗组件

项目中已实现以下 Modal 组件（`src/Workbench/modals/`）：

| 组件 | 用途 | 对应的 Field 类型 |
|------|------|------------------|
| `SelectPoint` | 地图选点 | `FieldPoint` |
| `SelectMaterial` | 素材选择 | `FieldMaterial` |
| `SelectFloor` | 楼层选择 | `FieldFloor` |
| `PreviewUI` | UI 预览 | 块级预览功能 |
| `CheckboxSet` | 复选框组 | `FieldCheckboxSet` |
| `SearchFlags` | 变量搜索 | 自动补全辅助 |
| `StatusBarPreview` | 状态栏预览 | 块级预览功能 |

这些组件可直接被自定义 Field 调用。

### 保留双击快捷方式

为保持用户习惯，双击块时自动触发第一个可弹出字段的编辑器：

```typescript
// 新的 doubleClickBlock 实现
function doubleClickBlock(block: Blockly.Block) {
  // 遍历所有字段，找到第一个支持弹出编辑器的
  for (const input of block.inputList) {
    for (const field of input.fieldRow) {
      if (isPopupField(field)) {
        field.showEditor_();
        return;
      }
    }
  }
}

function isPopupField(field: Blockly.Field): boolean {
  return field instanceof FieldLargeText
      || field instanceof FieldPoint
      || field instanceof FieldMaterial
      || field instanceof FieldExpression;
}
```

这样：
- 用户双击块 → 自动打开第一个可编辑字段
- 用户点击特定字段 → 打开该字段的编辑器
- 两种交互方式共存，不冲突

### 自定义 Field 类型设计

#### 类型注册表

```typescript
// src/blockly/fields/index.ts
import * as Blockly from 'blockly';

// 注册所有自定义字段
export function registerCustomFields() {
  Blockly.fieldRegistry.register('field_largeText', FieldLargeText);
  Blockly.fieldRegistry.register('field_point', FieldPoint);
  Blockly.fieldRegistry.register('field_material', FieldMaterial);
  Blockly.fieldRegistry.register('field_colorRgba', FieldColorRgba);
  Blockly.fieldRegistry.register('field_expression', FieldExpression);
}
```

#### FieldLargeText - 多行文本

```typescript
// src/blockly/fields/FieldLargeText.ts
import * as Blockly from 'blockly';

export class FieldLargeText extends Blockly.FieldTextInput {
  // 显示展开图标
  protected override initView(): void {
    super.initView();
    this.createExpandIcon_();
  }

  // 单击: 内联编辑
  // 展开图标或快捷键: 打开大编辑器
  protected override showEditor_(e?: Event): void {
    if (this.shouldOpenLargeEditor_(e)) {
      this.openLargeEditor_();
    } else {
      super.showEditor_(e);
    }
  }

  private openLargeEditor_(): void {
    // 打开 CodeMirror 编辑器弹窗
    openMultilineEditor({
      value: this.getValue(),
      lint: this.config_.lint,
      onSave: (newValue) => {
        this.setValue(newValue);
      }
    });
  }
}
```

#### FieldPoint - 地图选点（合并字段设计）

**关键改进**: 将原来分散的 `PosString_0`、`PosString_1`、`IdString_0` 三个字段合并为一个结构化的 `FieldPoint`。

**对比**:
```
旧: [x输入框] [y输入框] [楼层下拉] → 三个独立字段，选点器需要同时更新三个
新: [(3, 5, MT1)] → 一个字段，显示为可点击的坐标文本，带有浅色背景
```

**优势**:
1. **更直观的显示** - 用户看到 `(3, 5, MT1)` 而不是三个分散的输入框
2. **更简单的编辑** - 点击一次打开选点器，一次性修改所有值
3. **更清晰的语义** - 代码生成时直接从一个字段获取完整坐标
4. **减少状态同步** - 不需要 `onchange` 去同步多个字段

##### 底色样式实现

FieldPoint 需要像 FieldDropdown 一样有底色，以区分于普通文本标签：

```typescript
// initView 中创建带底色的背景矩形
protected override initView(): void {
  // 创建背景矩形（Blockly 内置方法）
  this.createBorderRect_();
  
  // 关键：设置背景不透明（默认是透明的）
  if (this.borderRect_) {
    this.borderRect_.style.fillOpacity = '1';
    // 添加 CSS 类用于样式控制
    Blockly.utils.dom.addClass(this.borderRect_, 'blocklyPointFieldRect');
  }
  
  // 创建文本元素
  this.textElement_ = Blockly.utils.dom.createSvgElement(
    Blockly.utils.Svg.TEXT,
    { class: 'blocklyText' },
    this.fieldGroup_,
  );
}

// 应用颜色（响应块颜色变化）
protected override applyColour(): void {
  const sourceBlock = this.getSourceBlock();
  if (!sourceBlock || !this.borderRect_) return;
  
  // 使用块的次级颜色作为背景
  if (sourceBlock.isShadow()) {
    this.borderRect_.style.fill = sourceBlock.style.colourSecondary;
  } else {
    // 使用半透明的主色调
    this.borderRect_.style.fill = this.getConstants()?.FIELD_BORDER_RECT_COLOUR ?? '#fff';
  }
}
```

CSS 样式（可选，用于更精细的控制）：
```css
/* src/blockly/styles/fields.css */
.blocklyPointFieldRect {
  cursor: pointer;
}

.blocklyPointFieldRect:hover {
  fill-opacity: 0.8;
}
```

##### 楼层选择的多种模式

**业务场景分析**：

在 Mota 的事件系统中，楼层参数有多种语义：

| 值 | 含义 | 使用场景 |
|----|------|---------|
| 具体楼层 ID（如 `"MT1"`） | 绝对楼层 | 明确指定目标楼层 |
| `:now` | 当前楼 | 在当前楼层执行操作 |
| `:before` | 前一楼 | 相对于当前楼层的上一层 |
| `:next` | 后一楼 | 相对于当前楼层的下一层 |
| `undefined` | 不指定 | 某些块不需要楼层参数 |

原有实现使用两个独立字段：
- `Floor_List` 下拉框选择模式（floorId / :before / :next / :now）
- `IdString` 输入框填写具体楼层 ID（仅当选择 floorId 时有效）

**新设计目标**：将这两个字段的语义合并到 FieldPoint 中。

**类型定义**：

```typescript
// src/blockly/fields/FieldPoint/types.ts

/** 相对楼层标识 */
export type RelativeFloor = ':now' | ':before' | ':next';

/** 检查是否为相对楼层 */
export function isRelativeFloor(value: string | undefined): value is RelativeFloor {
  return value === ':now' || value === ':before' || value === ':next';
}

export interface PointValue {
  x: number;
  y: number;
  /** 
   * 楼层标识
   * - undefined: 不指定楼层（某些块不需要）
   * - RelativeFloor: 相对楼层（:now / :before / :next）
   * - string: 具体楼层 ID（如 "MT1"）
   */
  floorId?: string | RelativeFloor;
}

export interface FieldPointConfig {
  /** 是否包含楼层字段，默认 true */
  includeFloor?: boolean;
  
  /** 
   * 是否允许选择相对楼层（:now / :before / :next），默认 false
   * - true: 选点器显示"当前楼/前一楼/后一楼"选项
   * - false: 只能选择具体楼层
   */
  allowRelativeFloor?: boolean;
  
  /** 是否支持多选，默认 false */
  multiSelect?: boolean;
}
```

**使用场景举例**：

| 块类型 | allowRelativeFloor | 原因 |
|--------|-------------------|------|
| `changeFloor_s` (楼层切换) | `true` | 支持传送到前一楼/后一楼 |
| `setBlock_s` (设置图块) | `false` | 通常指定具体楼层或不指定 |
| `battle_s` (强制战斗) | `false` | 通常在当前楼层，不需要相对楼层 |

**选点器 UI 设计**：

当 `allowRelativeFloor=true` 时，选点器需要提供楼层选择模式：

```
┌─────────────────────────────────────────┐
│ 地图选点                                 │
├─────────────────────────────────────────┤
│                                         │
│  楼层: [▼ 具体楼层 ]  [MT1      ▼]      │
│        ○ 具体楼层                        │
│        ○ 当前楼                          │
│        ○ 前一楼                          │
│        ○ 后一楼                          │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │       (地图缩略图)               │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  坐标: x [  3  ]  y [  5  ]            │
│                                         │
│           [ 取消 ]  [ 确定 ]            │
└─────────────────────────────────────────┘
```

**注意**：选择"当前楼/前一楼/后一楼"时，地图预览仍显示当前编辑的楼层，但返回的 floorId 是对应的相对值。

**显示逻辑**：

```typescript
/** 相对楼层的显示文本 */
const RELATIVE_FLOOR_DISPLAY: Record<RelativeFloor, string> = {
  ':now': '当前',
  ':before': '前一楼',
  ':next': '后一楼',
};

protected override getText_(): string {
  const val = this.getValue();
  if (!val) return '(?, ?)';
  
  if (!this.config_.includeFloor) {
    return `(${val.x}, ${val.y})`;
  }
  
  if (!val.floorId) {
    return `(${val.x}, ${val.y})`;
  }
  
  // 相对楼层显示友好文本
  if (isRelativeFloor(val.floorId)) {
    return `(${val.x}, ${val.y}, ${RELATIVE_FLOOR_DISPLAY[val.floorId]})`;
  }
  
  // 具体楼层直接显示 ID
  return `(${val.x}, ${val.y}, ${val.floorId})`;
}
```

**代码生成时的处理**：

```typescript
// 代码生成器中
const point = block.getFieldValue('position') as PointValue;

// changeFloor 块的生成逻辑
const result: any = {
  type: 'changeFloor',
  loc: [point.x, point.y],
};

// 处理楼层
if (point.floorId) {
  // 相对楼层和具体楼层都直接输出
  result.floorId = point.floorId;
}

// 输出示例:
// {"type": "changeFloor", "loc": [3, 5], "floorId": "MT1"}     // 具体楼层
// {"type": "changeFloor", "loc": [3, 5], "floorId": ":next"}   // 后一楼
// {"type": "changeFloor", "loc": [3, 5], "floorId": ":now"}    // 当前楼
```

**选点器实现**：

```typescript
// src/blockly/fields/FieldPoint/openPointPicker.ts
export interface PointPickerOptions {
  x: number;
  y: number;
  floorId?: string;
  includeFloor: boolean;
  allowRelativeFloor: boolean;  // 是否显示相对楼层选项
  onSelect: (x: number, y: number, floorId?: string) => void;
  onCancel: () => void;
}

export function openPointPicker(options: PointPickerOptions): void {
  // 获取当前编辑楼层用于地图预览
  const currentFloorId = getCurrentEditingFloorId();
  
  // 计算初始显示的楼层（用于地图预览）
  // 如果当前值是相对楼层，地图预览显示当前编辑楼层
  const previewFloorId = isRelativeFloor(options.floorId) 
    ? currentFloorId 
    : (options.floorId ?? currentFloorId);
  
  showPointPickerDialog({
    initialX: options.x,
    initialY: options.y,
    initialFloorId: options.floorId,  // 保留原始值（可能是相对楼层）
    previewFloorId,                    // 地图预览使用的楼层
    showRelativeOptions: options.allowRelativeFloor,
    onConfirm: (x, y, selectedFloorId) => {
      options.onSelect(x, y, selectedFloorId);
    },
    onCancel: options.onCancel,
  });
}
```

**注意**: 不需要 Blockly 的 XML/JSON 序列化（toXml/fromXml/saveState/loadState），因为编辑器的持久化格式是 Mota Action JSON，不是 Blockly 状态。

#### FieldMaterial - 素材选择

```typescript
// src/blockly/fields/FieldMaterial.ts
export class FieldMaterial extends Blockly.FieldTextInput {
  private materialType_: 'images' | 'bgms' | 'sounds' | 'animates';
  private directory_: string;

  constructor(value: string, config: MaterialFieldConfig) {
    super(value);
    this.materialType_ = config.materialType;
    this.directory_ = config.directory;
  }

  // 显示选择按钮
  protected override initView(): void {
    super.initView();
    this.createBrowseButton_();
  }

  private openMaterialBrowser_(): void {
    openMaterialSelector({
      directory: this.directory_,
      currentValue: this.getValue(),
      materialType: this.materialType_,
      onSelect: (value) => {
        this.setValue(value);
      }
    });
  }
}
```

#### FieldFont - 字体选择（结构化字段）

**旧方案**: 文本输入 `"bold 14px Verdana"`，用正则验证格式

**新方案**: 结构化字段，提供可视化编辑器

```typescript
// src/blockly/fields/FieldFont.ts
export interface FontValue {
  italic: boolean;
  bold: boolean;
  size: number;
  family: string;
}

export class FieldFont extends Blockly.Field<FontValue> {
  // 显示: "bold 14px Verdana"
  protected override getText_(): string {
    const { italic, bold, size, family } = this.getValue();
    let text = '';
    if (italic) text += 'italic ';
    if (bold) text += 'bold ';
    text += `${size}px ${family}`;
    return text;
  }

  // 使用 tspan 实现预览效果
  protected override initView(): void {
    this.createBorderRect_();
    this.textElement_ = Blockly.utils.dom.createSvgElement(
      'text', { class: 'blocklyText' }, this.fieldGroup_
    );
    this.renderPreview_();
  }

  private renderPreview_(): void {
    const { italic, bold, size, family } = this.getValue();
    this.textElement_.textContent = this.getText_();
    // 应用样式预览（缩放显示）
    this.textElement_.style.fontStyle = italic ? 'italic' : 'normal';
    this.textElement_.style.fontWeight = bold ? 'bold' : 'normal';
  }

  // 编辑器: 复选框 + 数字输入 + 字体下拉
  protected override showEditor_(): void {
    openFontEditor({
      value: this.getValue(),
      onConfirm: (v) => this.setValue(v)
    });
  }
}
```

**代码生成**: 直接拼接为字符串格式

```typescript
// 生成器
const font = block.getFieldValue('font') as FontValue;
const fontStr = `${font.italic ? 'italic ' : ''}${font.bold ? 'bold ' : ''}${font.size}px ${font.family}`;
```

#### FieldMultiPoint - 多点坐标（替代 processMultiLoc）

**旧方案**: 
```javascript
// 两个独立的文本字段
x: "1, 2, 3"
y: "4, 5, 6"
// 由 processMultiLoc 转换为 [[1,4],[2,5],[3,6]]
```

**新方案**: 一个结构化数组字段

```typescript
// src/blockly/fields/FieldMultiPoint.ts
export interface Point { x: number; y: number; }

export class FieldMultiPoint extends Blockly.Field<Point[]> {
  // 显示: "(1,4), (2,5), (3,6)" 或 "3 个点"
  protected override getText_(): string {
    const points = this.getValue();
    if (!points || points.length === 0) return '(无)';
    if (points.length <= 3) {
      return points.map(p => `(${p.x},${p.y})`).join(', ');
    }
    return `${points.length} 个点`;
  }

  // 编辑器: 地图上多点选择
  protected override showEditor_(): void {
    openMultiPointPicker({
      points: this.getValue() || [],
      onConfirm: (points) => this.setValue(points)
    });
  }
}
```

**代码生成**: 直接输出数组

```typescript
const points = block.getFieldValue('loc') as Point[];
// 输出: "loc": [[1,4],[2,5],[3,6]]
const locStr = JSON.stringify(points.map(p => [p.x, p.y]));
```

#### FieldSteps - 步骤路径（可视化编辑）

**旧方案**: 文本输入 `"上右3下2左"`，由 `StepString_pre` 转换

**新方案**: 结构化数组 + SVG 高亮显示 + 可视化编辑器

```typescript
// src/blockly/fields/FieldSteps.ts
type Direction = 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';

export class FieldSteps extends Blockly.Field<Direction[]> {
  private static readonly ICONS: Record<Direction, string> = {
    up: '↑', down: '↓', left: '←', right: '→',
    forward: '▲', backward: '▼'
  };
  
  private static readonly COLORS: Record<Direction, string> = {
    up: '#4CAF50',     // 绿
    down: '#F44336',   // 红
    left: '#2196F3',   // 蓝
    right: '#FF9800',  // 橙
    forward: '#9C27B0', // 紫
    backward: '#795548' // 棕
  };

  // 压缩显示: "↑ →3 ↓2 ←"
  protected override getText_(): string {
    const steps = this.getValue();
    if (!steps || steps.length === 0) return '(无)';
    return this.compressSteps_(steps);
  }

  // 使用 tspan 实现彩色高亮
  protected override initView(): void {
    this.createBorderRect_();
    this.textElement_ = Blockly.utils.dom.createSvgElement(
      'text', { class: 'blocklyText' }, this.fieldGroup_
    );
    this.renderHighlighted_();
  }

  private renderHighlighted_(): void {
    this.textElement_.textContent = '';
    const compressed = this.compressStepsWithCount_(this.getValue() || []);
    
    for (const { dir, count } of compressed) {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = FieldSteps.ICONS[dir] + (count > 1 ? count : '') + ' ';
      tspan.style.fill = FieldSteps.COLORS[dir];
      this.textElement_.appendChild(tspan);
    }
  }

  // 压缩: ["up","up","right","right","right"] → [{dir:"up",count:2},{dir:"right",count:3}]
  private compressStepsWithCount_(steps: Direction[]): { dir: Direction; count: number }[] {
    const result: { dir: Direction; count: number }[] = [];
    for (const step of steps) {
      if (result.length > 0 && result[result.length - 1].dir === step) {
        result[result.length - 1].count++;
      } else {
        result.push({ dir: step, count: 1 });
      }
    }
    return result;
  }

  // 编辑器: 
  // 1. 文本模式: 输入 "上右3下2左"
  // 2. 可视化模式: 在迷你地图上点击绘制路径
  // 3. 键盘模式: 方向键录入
  protected override showEditor_(): void {
    openStepsEditor({
      steps: this.getValue() || [],
      onConfirm: (steps) => this.setValue(steps)
    });
  }
}
```

**显示效果**:
```
┌──────────────────────────────────┐
│ ↑2 →3 ↓ ← ←                      │
│ 绿  橙 红 蓝蓝                    │
└──────────────────────────────────┘
```

---

## 业务逻辑检查的处理

### `__door__` 占位符问题

**现状**: 在 `EvalString_pre` 等预处理器中检查 `__door__` 占位符：

```javascript
if (EvalString.indexOf('__door__')!==-1) 
  throw new Error('请修改开门变量__door__...');
```

**问题**: 这是业务逻辑，不应该在预处理器层面处理。

**推荐方案**:

#### 方案 1: 模板系统自动生成唯一变量名

```typescript
// 创建开门事件时，自动生成唯一变量名
function createDoorEvent(): MotaAction[] {
  const doorVar = `door_${generateId()}`; // door_a7x9k2
  return [
    { "type": "if", "condition": `flag:${doorVar}`, ... }
  ];
}
```

#### 方案 2: Workspace 级别的 Lint 检查

```typescript
// src/blockly/lint/doorVariableChecker.ts
export function checkDoorVariables(workspace: Blockly.Workspace): LintWarning[] {
  const warnings: LintWarning[] = [];
  const doorVars = new Set<string>();
  
  for (const block of workspace.getAllBlocks()) {
    // 检查是否存在 __door__ 占位符
    for (const field of block.inputList.flatMap(i => i.fieldRow)) {
      const value = field.getValue();
      if (typeof value === 'string' && value.includes('__door__')) {
        warnings.push({
          blockId: block.id,
          message: '请将 __door__ 替换为唯一的变量名（如 door1, door2）',
          severity: 'error'
        });
      }
    }
    
    // 检查是否有重复的开门变量
    // ...
  }
  
  return warnings;
}
```

#### 方案 3: 专用的 FieldDoorVariable 字段

```typescript
class FieldDoorVariable extends Blockly.FieldTextInput {
  protected override doClassValidation_(value: string): string | null {
    if (value === '__door__') {
      // 自动建议一个新名称
      return `door_${this.getSourceBlock()?.id?.slice(0, 4)}`;
    }
    return value;
  }
}
```

**推荐**: 方案 1 + 方案 2 结合，从源头避免问题 + 提供检查保底。

---

## Schema 设计：字段编辑器配置

### JSON Block Definition 中的字段配置

```json5
{
  "type": "text_2_s",
  "message0": "图像: %1 %2 名称: %3 位置: %4",
  "args0": [
    {
      "type": "field_material",
      "name": "image",
      "materialType": "images",
      "directory": "./project/images/"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "name"
    },
    {
      "type": "field_point",
      "name": "position",
      "includeFloor": false
    }
  ]
}
```

### 字段配置映射

从 export.js 标记到 JSON Schema 的映射规则：

| export.js 标记 | JSON 字段类型 | 配置项 |
|----------------|---------------|--------|
| `selectPoint: [x, y, floor, setFloor]` | `field_point` | `includeFloor: setFloor` |
| `material: [dir, field]` | `field_material` | `directory: dir` |
| `doubleclicktext: field` | `field_largeText` | `lint?: boolean` |
| `previewBlock: true` | 块级 `preview: true` | - |

### 合并字段的代码生成与解析

对于 FieldPoint，需要在两个方向处理转换：

#### 1. Mota Action JSON → Blockly Blocks（加载时）

```typescript
// 原始 JSON（如 changeFloor）
{
  "type": "changeFloor",
  "loc": [3, 5],
  "floorId": "MT1"
}

// 解析器需要将分散的值组装成 PointValue
function parseChangeFloor(json: any): BlockState {
  return {
    type: 'changeFloor_s',
    fields: {
      position: {  // FieldPoint 的值
        x: json.loc[0],
        y: json.loc[1],
        floorId: json.floorId
      }
    }
  };
}
```

#### 2. Blockly Blocks → Mota Action JSON（保存时）

```typescript
// 生成器从合并字段取值，拆分成 JSON 格式
Blockly.JavaScript.forBlock['changeFloor_s'] = function(block) {
  const pos = block.getFieldValue('position') as PointValue;
  return JSON.stringify({
    type: "changeFloor",
    loc: [pos.x, pos.y],
    floorId: pos.floorId
  });
};
```

更简洁，且类型安全。

### 处理复合场景

某些块需要多个编辑器协同工作：

```json5
// text_2_s: 文字、图像、位置
{
  "type": "text_2_s",
  "editorFields": {
    "text": { "type": "field_largeText" },
    "image": { "type": "field_material", "materialType": "images" },
    "px": { "type": "field_point", "linkedFields": ["py"] }
  }
}
```

---

## 迁移策略

### 阶段一：基础设施

1. 实现自定义 Field 基类和注册系统
2. 创建通用弹窗组件（复用现有 UI）
3. 编写字段类型检测工具

### 阶段二：逐类型迁移

按使用频率和复杂度排序：

| 优先级 | 字段类型 | 涉及块数 | 复杂度 |
|--------|----------|----------|--------|
| P0 | FieldLargeText | ~10 | 低 |
| P0 | FieldPoint | ~35 | 中 |
| P1 | FieldMaterial | ~20 | 中 |
| P2 | FieldColorRgba | ~5 | 低 |
| P3 | FieldExpression | ~15 | 高 |
| P3 | Preview (块级) | ~15 | 高 |

### 阶段三：移除旧代码

1. 删除 `doubleClickBlock` 逻辑
2. 删除块级 `selectPoint`/`material`/`doubleclicktext` 标记
3. 更新文档和测试

---

## 难点与边界情况

### 1. 关联字段同步（已通过合并字段解决）

**旧问题**: selectPoint 需要同时更新 x, y, floor 三个字段

```javascript
// 旧方案：三个独立字段 + 复杂的同步逻辑
selectPoint: ["PosString_0", "PosString_1", "IdString_0", true]
```

**新方案**: 合并为一个 FieldPoint，问题自然消失

```typescript
// 新方案：一个结构化字段，无需同步
{
  "type": "field_point",
  "name": "position",
  "includeFloor": true
}
// getValue() 直接返回 { x, y, floorId }
```

### 2. 上下文感知

**问题**: 某些编辑器需要访问其他字段的值

```javascript
// previewUI 需要知道完整的 UI 配置
// selectMaterial 的目录可能依赖另一个字段
```

**解决方案**: Field 可访问所属 Block：

```typescript
class FieldMaterial extends Blockly.FieldTextInput {
  protected override showEditor_(): void {
    const block = this.getSourceBlock();
    const dynamicDir = block?.getFieldValue('directory');
    // ...
  }
}
```

### 3. Preview 的特殊性

**问题**: Preview 不是单字段编辑，而是整块预览

**解决方案**: 保留为块级功能，但改进触发方式：

```typescript
// 块工具栏添加预览按钮
// 或使用 Blockly 12 的 Block Menu
class TextBlock extends Blockly.Block {
  customContextMenu(options: Blockly.ContextMenuRegistry.ContextMenuOption[]) {
    options.push({
      text: '预览',
      enabled: true,
      callback: () => this.preview()
    });
  }
}
```

### 4. Awesomplete 自动补全

**问题**: 需要在 Blockly Field 的内联编辑器中启用补全

**解决方案**: 覆写 FieldTextInput 的 DOM 创建：

```typescript
class FieldAutocomplete extends Blockly.FieldTextInput {
  protected override widgetCreate_(): HTMLElement {
    const input = super.widgetCreate_();
    this.awesomplete_ = new Awesomplete(input, {
      list: this.getCompletionList_()
    });
    return input;
  }
}
```

### 5. 资源 ID 的友好名称显示

**背景**: 现有代码使用 `replaceToName`/`replaceFromName` 在字符串层面做替换：

```javascript
// 存储值 → 显示值
"status:hp"      → "状态：生命"
"item:yellowKey" → "物品：黄钥匙"
"enemy:greenSlime:hp" → "怪物：绿史莱姆：生命"
```

**方案**: 使用 SVG `<tspan>` 实现表达式语法高亮，替换发生在显示层而非数据层：

```typescript
class FieldHighlightedExpression extends Blockly.FieldTextInput {
  // 内部存储原始 ID
  private value_: string = 'status:hp > 100';

  protected override initView(): void {
    this.createBorderRect_();
    this.textElement_ = Blockly.utils.dom.createSvgElement(
      'text',
      { class: 'blocklyText' },
      this.fieldGroup_
    );
    this.renderHighlighted_();
  }

  private renderHighlighted_(): void {
    this.textElement_.textContent = '';
    
    // 显示时：ID → 友好名称 + 分词着色
    const displayText = replaceToName(this.value_);
    const tokens = tokenize(displayText);
    
    for (const token of tokens) {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = token.text;
      tspan.style.fill = TOKEN_COLORS[token.type];
      this.textElement_.appendChild(tspan);
    }
  }

  // getValue 返回原始 ID，代码生成直接使用
  override getValue(): string {
    return this.value_;  // "status:hp > 100"
  }
}

const TOKEN_COLORS: Record<string, string> = {
  status: '#4CAF50',   // 绿色 - 状态
  item: '#FFC107',     // 黄色 - 物品
  flag: '#2196F3',     // 蓝色 - 变量
  enemy: '#F44336',    // 红色 - 怪物
  number: '#9C27B0',   // 紫色 - 数字
  operator: '#757575', // 灰色 - 运算符
  default: '#000000',
};
```

**效果示例**:
```
┌─────────────────────────────────────────────────┐
│ 状态：生命 > 100 && 物品：黄钥匙 >= 3           │
│ ─────────   ───    ───────────    ─            │
│   绿色     紫色       黄色       紫色           │
└─────────────────────────────────────────────────┘
```

**优势**:
- 纯 SVG 渲染，性能好（无 foreignObject）
- 数据流清晰：存储 ID，显示友好名称
- 消除 parse/generate 时的字符串替换
- 视觉上更易读

---

## 参考资料

- [Blockly 12 Custom Fields](https://developers.google.com/blockly/guides/create-custom-blocks/fields/customizing-fields)
- [Blockly Field Registry](https://developers.google.com/blockly/guides/create-custom-blocks/fields/field-registry)
- 现有实现: `public/_server/editor_blockly.js`, `public/_server/editor_uievent.js`
- 已有 React 弹窗: `src/Workbench/modals/`

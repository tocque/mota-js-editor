# Left7 面板 - 多行文本/代码编辑面板

## 面板标识
- **DOM ID**: `left7`
- **模式名称**: 无（特殊面板，不在mode.ids中注册）
- **对应模块**: `editor_multi.js`

## 功能概述

多行文本/代码编辑面板是一个基于 CodeMirror 的高级代码编辑器。用于编辑较长的文本内容或 JavaScript 代码。支持语法高亮、代码补全、语法检查、代码格式化等专业编辑功能。主要用于编辑脚本函数、长文本字符串、JSON配置等。

## UI组件结构

### 1. 顶部工具栏

```
[确认] [取消] [应用] [格式化] [预览] ☑语法检查 [执行操作▼] 字体大小[14] 字体加粗☐
```

**组件**:
- `[确认]` 按钮: 保存并关闭编辑器
- `[取消]` 按钮: 放弃修改并关闭
- `[应用]` 按钮: 保存但不关闭
- `[格式化]` 按钮: 格式化代码（仅代码模式）
- `#editor_multi_preview` `[预览]` 按钮: 预览效果（仅特定内容）
- `#lintCheckbox` 语法检查复选框: 开启/关闭语法检查
- `#codemirrorCommands` 操作下拉框: 执行编辑器命令
- `#editor_multi_fontsize` 字体大小输入框
- `#editor_multi_fontweight` 字体加粗复选框

### 2. 代码编辑区 (`#multiLineCode`)

```
┌────────────────────────────────────────────┐
│ 1│ function myFunction() {                 │
│ 2│     // 这是一段示例代码                  │
│ 3│     var x = core.status.hero.hp;        │
│ 4│     return x > 100;                     │
│ 5│ }                                        │
└────────────────────────────────────────────┘
```

**特性**:
- 行号显示
- 语法高亮（JavaScript）
- 括号匹配
- 代码折叠
- 自动缩进
- 自动补全

## 核心功能

### 1. 代码编辑模式

当编辑代码类型的内容时（函数、脚本等）：

- **语法高亮**: JavaScript 语法着色
- **语法检查**: 使用 JSHint 检测语法错误
- **代码补全**: 基于 Tern.js 的智能补全
- **参数提示**: 函数参数自动提示
- **跳转定义**: Ctrl+B 跳转到定义
- **重命名变量**: Ctrl+Q 批量重命名变量

**CodeMirror 配置**:
```javascript
{
  lineNumbers: true,
  matchBrackets: true,
  indentUnit: 4,
  tabSize: 4,
  indentWithTabs: true,
  smartIndent: true,
  mode: { name: "javascript", globalVars: true, localVars: true },
  lineWrapping: true,
  continueComments: "Enter",
  gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  lint: true,
  autocomplete: true,
  autoCloseBrackets: true,
  styleActiveLine: true,
  foldGutter: true,
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
}
```

### 2. 文本编辑模式

当编辑纯文本内容时：

- 不启用语法检查
- 不启用代码补全
- 保留基本编辑功能

### 3. 快捷命令

通过下拉菜单或快捷键执行：

| 快捷键 | 功能 |
|--------|------|
| Ctrl+/ | 注释/取消注释当前行 |
| Ctrl+B | 跳转到定义 |
| Ctrl+Q | 重命名变量 |
| Ctrl+F | 查找 |
| Ctrl+R | 全部替换 |
| Ctrl+D | 折叠/展开代码块 |
| Ctrl+O | 打开 API 列表 |
| Ctrl+P | 打开在线插件列表 |

### 4. 代码格式化

点击 `[格式化]` 按钮，使用 beautifier.js 格式化代码：

```javascript
beautifier.js(codeEditor.getValue(), {
  brace_style: "collapse-preserve-inline",
  indent_with_tabs: true,
  jslint_happy: true
})
```

### 5. 语法检查

基于 JSHint 的实时语法检查：

- 在行号栏显示警告/错误标记
- 鼠标悬停显示详细错误信息
- 阻止保存严重语法错误的代码

**错误检测**:
```javascript
editor_multi.hasError = function () {
  if (!editor_multi.lintAutocomplete) return false;
  return JSHINT.errors.filter(function (e) {
    return e.code.startsWith("E")  // E开头为严重错误
  }).length > 0;
}
```

### 6. 智能补全

基于 Tern.js 提供的智能补全：

**补全内容**:
- `core.xxx` - 核心 API
- `core.material.enemys.xxx` - 怪物信息
- `core.material.items.xxx` - 道具信息
- `core.material.bgms.xxx` - 背景音乐
- `core.material.sounds.xxx` - 音效
- `core.material.animates.xxx` - 动画
- `core.material.images.xxx` - 图片
- `core.status.xxx` - 游戏状态
- `core.values.xxx` - 全局数值
- `core.flags.xxx` - 系统开关

**类型定义**:
- 从 `public/_server/CodeMirror/defs.js` 加载
- 包含完整的 core API 类型定义和文档

### 7. 从 Blockly 调用

当在 Blockly 中双击多行文本字段时：

```javascript
editor_multi.multiLineEdit(value, b, f, args, callback)
```

保存时通过回调将内容写回 Blockly 积木块。

### 8. 编辑配置文件

用于编辑表格配置文件：

```javascript
editor_multi.editCommentJs(mod)
// mod: 'loc', 'enemyitem', 'floor', 'tower', 'functions', 'commonevent', 'plugins'
```

**配置文件对应**:
| 模式 | 配置文件 |
|------|----------|
| loc | `_server/table/comment.js` |
| enemyitem | `_server/table/comment.js` |
| floor | `_server/table/comment.js` |
| tower | `_server/table/data.comment.js` |
| functions | `_server/table/functions.comment.js` |
| commonevent | `_server/table/events.comment.js` |
| plugins | `_server/table/plugins.comment.js` |

### 9. 导入文件编辑

支持直接编辑外部文件：

```javascript
editor_multi.importFile(filename)
```

- 从服务器读取文件内容
- 编辑完成后写回服务器

## 数据流

### 从表格编辑

```
双击表格中的代码字段
       ↓
editor_multi.import(id, args)
       ↓
读取字段值
       ↓
判断是字符串还是代码对象
       ↓
显示编辑器
       ↓
用户编辑内容
       ↓
点击确认
       ↓
editor_multi.confirm()
       ↓
检查语法错误
       ↓
格式化（如果是代码）
       ↓
写入表格字段
       ↓
触发 onchange 保存
```

### 从 Blockly 调用

```
双击 Blockly 多行文本字段
       ↓
editor_blockly.doubleclicktext(b, f)
       ↓
editor_multi.multiLineEdit(value, b, f, args, callback)
       ↓
用户编辑内容
       ↓
点击确认
       ↓
callback(newvalue, b, f)
       ↓
写回 Blockly 积木块
```

## 相关文件

**HTML**: `public/editor.html` (第240-257行)

**JavaScript**:
- `public/_server/editor_multi.js` - 多行编辑器主逻辑 (515行)

**CodeMirror 库**:
- `public/_server/CodeMirror/codeMirror.bundle.min.js` - 核心库
- `public/_server/CodeMirror/beautify.min.js` - 格式化
- `public/_server/CodeMirror/jshint.min.js` - 语法检查
- `public/_server/CodeMirror/codeMirror.plugin.min.js` - 插件
- `public/_server/CodeMirror/acorn.min.js` - JS 解析器
- `public/_server/CodeMirror/defs.js` - 类型定义
- `public/_server/CodeMirror/tern.min.js` - 补全引擎

**样式文件**:
- `public/_server/CodeMirror/codemirror.css` - 编辑器样式

## 使用场景

1. **编辑脚本函数**: 在脚本编辑面板中编辑自定义函数
2. **编辑长文本**: 编辑较长的对话文本或描述
3. **编辑 JSON 配置**: 编辑复杂的配置对象
4. **编辑配置表格**: 自定义表格显示字段
5. **编辑插件代码**: 在插件面板中编写插件逻辑

## 注意事项

1. **语法错误**: 严重语法错误会阻止保存
2. **格式化限制**: 只有代码模式支持格式化
3. **换行处理**: 从 Blockly 调用时，`\n` 会被转换为实际换行
4. **编码保存**: 文件以 Base64 编码传输
5. **刷新生效**: 修改配置文件后需要刷新才能生效

## 字体设置

```javascript
editor_multi.setFontSize = function () {
  const value = Number(input.value);
  editor.config.set(CONFIG_KEY, value);
  const ele = codeEditor.getWrapperElement();
  ele.style.fontSize = `${value}px`;
  ele.style.fontWeight = `${check.checked ? 'bold' : 'normal'}`;
}
```

## API 文档

点击 Ctrl+O 或执行操作中选择可以打开 API 文档：

```
/_docs/#/api
```

## 在线插件

点击 Ctrl+P 可以打开在线插件列表：

```
https://h5mota.com/plugins/
```

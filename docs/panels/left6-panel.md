# Left6 面板 - Blockly事件编辑面板

## 面板标识
- **DOM ID**: `left6`
- **模式名称**: 无（特殊面板，不在mode.ids中注册）
- **对应模块**: `editor_blockly.js`, `editor_blocklyconfig.js`

## 功能概述

Blockly事件编辑面板是一个基于 Google Blockly 的可视化事件编程面板。通过拖拽和连接积木块的方式，可以无需编写代码就能创建复杂的游戏事件。支持显示文本、条件判断、循环、变量操作、战斗控制等丰富的事件类型。

## UI组件结构

### 1. 顶部工具栏

```
事件编辑器  [确认] [应用] [解析] [取消] [🔍搜索事件块...]
            [地图选点] [变量出现位置搜索] ☑开启中文名替换 ☑展开值块逻辑运算
```

**组件**:
- `[确认]` 按钮: 保存并关闭 Blockly 编辑器
- `[应用]` 按钮: 保存但不关闭，用于预览效果
- `#blocklyParse` `[解析]` 按钮: 将代码区文本解析为积木块
- `[取消]` 按钮: 放弃修改并关闭
- `#searchBlock` 搜索框: 搜索事件块
- `[地图选点]` 按钮: 打开地图选点对话框
- `[变量出现位置搜索]` 按钮: 搜索变量的使用位置
- `#blocklyReplace` 复选框: 开启/关闭中文名替换
- `#blocklyExpandCompare` 复选框: 展开值块逻辑运算

### 2. Blockly工作区 (`#blocklyArea`)

```
┌────────────────────────────────────────────┐
│ [分类工具箱]  │        积木工作区           │
│ ──────────── │                            │
│ □ 显示文字   │    ┌──────────────┐        │
│ □ 条件判断   │    │ 显示文章     │        │
│ □ 循环      │    │ 文字: "..."  │        │
│ □ 数值操作   │    └──────────────┘        │
│ □ 变量操作   │           │                │
│ □ 事件控制   │    ┌──────────────┐        │
│ □ 地图操作   │    │ 等待 500 ms  │        │
│ □ UI绘制    │    └──────────────┘        │
│ □ 音效控制   │                            │
│ □ 特殊操作   │                            │
│ □ 原生代码   │                            │
│ □ 最近使用   │                            │
└────────────────────────────────────────────┘
```

**组件**:
- `#blocklyDiv`: Blockly 工作区容器
- `#toolbox`: 工具箱 XML 定义

### 3. 代码显示区 (`#codeArea`)

```
┌────────────────────────────────────────────┐
│ [                                          │
│   {"type": "text", "text": "...", ...},   │
│   {"type": "sleep", "time": 500},         │
│ ]                                          │
└────────────────────────────────────────────┘
```

**组件**:
- `#codeArea`: CodeMirror 代码编辑器，显示积木块对应的JSON代码

### 4. 颜色选择器 (`#colorPanel`)

```
┌─────────────────┐
│ [颜色选择器]     │
│ [确定]          │
└─────────────────┘
```

用于选择颜色相关的事件参数（如色调、文字颜色等）

## 核心功能

### 1. 可视化事件编程

**积木块类型**:

| 分类 | 功能 | 示例积木 |
|------|------|----------|
| 显示文字 | 文本显示相关 | 显示文章、显示选项、确认对话框 |
| 条件判断 | 条件控制 | 如果...那么、多重条件、选择分支 |
| 循环 | 循环控制 | 循环...次、当...时循环、遍历 |
| 数值操作 | 数学计算 | 设置数值、增加数值、计算表达式 |
| 变量操作 | 变量读写 | 设置flag、获取flag、状态值 |
| 事件控制 | 流程控制 | 等待、结束事件、触发公共事件 |
| 地图操作 | 地图修改 | 设置图块、显示/隐藏图块、开门 |
| UI绘制 | 界面绘制 | 绘制图片、绘制文字、绘制矩形 |
| 音效控制 | 声音相关 | 播放音效、播放背景音乐 |
| 特殊操作 | 其他功能 | 播放动画、移动事件、注释 |
| 原生代码 | 代码嵌入 | 执行JS代码、评估表达式 |
| 最近使用 | 常用积木 | 动态显示最近使用的15个积木 |

### 2. 入口类型

不同的事件编辑入口有不同的入口积木：

| 入口类型 | 说明 | 对应属性 |
|----------|------|----------|
| event | 普通事件 | events, autoEvent.data |
| commonEvent | 公共事件 | commonEvent |
| beforeBattle | 战前事件 | beforeBattle |
| afterBattle | 战后事件 | afterBattle |
| afterGetItem | 获取道具后 | afterGetItem |
| afterOpenDoor | 开门后 | afterOpenDoor |
| firstArrive | 首次到达 | firstArrive |
| eachArrive | 每次到达 | eachArrive |
| choices | 选项内容 | choices[].action |
| shop | 商店选项 | shops.choices[].action |

### 3. 代码同步

**积木 → 代码**:
- 拖拽积木时，实时生成对应的 JSON 代码
- 代码显示在底部的 CodeMirror 编辑器中

**代码 → 积木**:
- 修改代码后，点击 `[解析]` 按钮
- 自动将 JSON 代码解析为对应的积木块

### 4. 搜索功能

**事件块搜索**:
- 在搜索框输入关键词
- 实时过滤工具箱显示匹配的积木块
- 支持按类型名、描述文字搜索

**最近使用**:
```javascript
editor_blockly.lastUsedType = [
  'text_0_s', 'comment_s', 'show_s', 'hide_s', 'setValue_s',
  'if_s', 'while_s', 'battle_s', 'openDoor_s', 'choices_s',
  'setText_s', 'exit_s', 'sleep_s', 'setBlock_s', 'insert_1_s'
];
```

### 5. 地图选点

**功能**: 在编辑坐标参数时快速选择地图位置

**操作**:
1. 选中需要坐标的积木块
2. 点击 `[地图选点]` 按钮
3. 在弹出的地图中点击选择位置
4. 坐标自动填入积木块

**实现**: `editor_blockly.selectPoint(block, arr)`

### 6. 预览功能

**双击预览**:
- 双击某些积木块可以预览效果
- 支持：显示文章、显示选项、显示图片、更改色调等

**实现**: `editor_blockly.previewBlock(b, args)`

### 7. 自动补全

输入积木参数时，提供智能自动补全：

- `flag:xxx` → 显示已使用的变量名列表
- `status:xxx` → 显示勇士状态属性列表
- `item:xxx` → 显示道具ID列表
- `enemy:xxx` → 显示怪物ID列表
- `core.xxx` → 显示 core API 列表
- `flags.xxx` → 显示 flag 变量列表
- `\f[` → 显示图片名列表
- `\i[` → 显示图标ID列表

**实现**: `editor_blockly.getAutoCompletions(content, type, name, pb)`

### 8. 中文名替换

开启后，变量名会自动替换为中文：

```javascript
// 关闭时
flag:visited_MT1

// 开启时
变量:已访问主塔1层
```

**配置**: `editor.uivalues.disableBlocklyReplace`

## 数据流

```
双击事件属性值（如 events["5,5"]）
       ↓
editor_blockly.import(id, args)
       ↓
读取事件 JSON 数据
       ↓
editor_blockly.parse() - 解析为积木块
       ↓
显示 Blockly 工作区
       ↓
用户拖拽编辑积木块
       ↓
实时生成 JSON 代码
       ↓
点击确认
       ↓
editor_blockly.confirm()
       ↓
Blockly.JavaScript.workspaceToCode() - 生成代码
       ↓
检查异步事件警告
       ↓
写入到表格输入框
       ↓
触发 input.onchange() 保存
```

## 相关文件

**HTML**: `public/editor.html` (第204-235行)

**JavaScript**:
- `public/_server/editor_blockly.js` - Blockly 集成主逻辑 (1214行)
- `public/_server/editor_blocklyconfig.js` - Blockly 配置和自定义积木定义
- `public/_server/MotaActionParser.js` - 事件解析器

**Blockly库**:
- `public/_server/blockly/blockly_compressed.js` - Blockly 核心
- `public/_server/blockly/blocks_compressed.js` - 标准积木定义
- `public/_server/blockly/javascript_compressed.js` - JavaScript 生成器
- `public/_server/blockly/zh-hans.js` - 中文翻译

**语法定义**:
- `public/_server/MotaAction.g4` - 事件语法定义文件

## 积木块右键菜单

| 选项 | 功能 |
|------|------|
| 复制 | 复制当前积木块 |
| 折叠/展开 | 折叠或展开复杂积木块 |
| 禁用/启用 | 禁用积木块（生成时跳过） |
| 删除 | 删除当前积木块 |
| 帮助 | 显示积木块帮助信息 |

## 异步事件检查

保存时会检查是否存在未等待的异步事件：

```javascript
editor_blockly.checkAsync(obj)
```

如果检测到异步事件但没有使用"等待所有异步事件处理完毕"，会弹出警告。

## 使用场景

1. **编辑NPC对话**: 使用"显示文章"积木创建对话
2. **创建剧情选项**: 使用"显示选项"积木创建分支剧情
3. **条件触发事件**: 使用"如果...那么"积木创建条件事件
4. **操作变量**: 使用"设置flag"积木存储游戏状态
5. **控制地图**: 使用"设置图块"积木动态修改地图
6. **播放动画**: 使用"播放动画"积木添加视觉效果

## 注意事项

1. **入口积木**: 每个事件只能有一个入口积木
2. **积木连接**: 注意积木的连接类型（语句/值）
3. **代码同步**: 修改代码后必须点击"解析"才能更新积木
4. **异步处理**: 使用异步事件时注意添加等待
5. **预览限制**: 不是所有积木都支持双击预览
6. **保存时机**: 确认后会立即保存到对应的表格字段

## 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+C | 复制选中积木 |
| Ctrl+V | 粘贴积木 |
| Delete | 删除选中积木 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |
| 1-9 | 打开对应分类工具箱 |

## 工具箱分类快捷键

| 数字键 | 分类 |
|--------|------|
| 1 | 显示文字 |
| 2 | 条件判断 |
| 3 | 循环 |
| 4 | 数值操作 |
| 5 | 变量操作 |
| 6 | 事件控制 |
| 7 | 地图操作 |
| 8 | UI绘制 |
| 9 | 音效控制 |
| 0/-1 | 最近使用 |

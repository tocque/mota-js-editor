# 魔塔编辑器 - 整体架构与技术栈

## 概述

魔塔编辑器（mota-js-editor）是一个基于 Web 技术的游戏关卡编辑器，专为 HTML5 魔塔样板设计。采用传统的 JavaScript 架构，使用原生 DOM 操作和模块化的 JS 文件组织代码。

## 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| JavaScript | ES5/ES6 | 核心编程语言 |
| HTML5 Canvas | - | 地图渲染、素材显示 |
| DOM API | - | UI 交互和操作 |

### 第三方库

| 库名 | 用途 | 位置 |
|------|------|------|
| Google Blockly | 可视化事件编程 | `_server/blockly/` |
| CodeMirror | 代码编辑器 | `_server/CodeMirror/` |
| Tern.js | 代码智能补全 | `_server/CodeMirror/tern.min.js` |
| JSHint | JavaScript 语法检查 | `_server/CodeMirror/jshint.min.js` |
| beautifier.js | 代码格式化 | `_server/CodeMirror/beautify.min.js` |
| localforage | 浏览器存储封装 | `libs/thirdparty/localforage.min.js` |
| lz-string | 字符串压缩 | `libs/thirdparty/lz-string.min.js` |
| zip.js | ZIP 文件处理 | `libs/thirdparty/zip.min.js` |
| jsColor | 颜色选择器 | `_server/thirdparty/jsColor.js` |
| Awesomplete | 自动完成 | `_server/thirdparty/awesomplete.min.js` |

## 目录结构

```
public/
├── _server/                    # 编辑器服务端和核心代码
│   ├── editor.js              # 编辑器主入口 (~1054行)
│   ├── editor_mode.js         # 面板模式管理 (~371行)
│   ├── editor_ui.js           # UI 组件生成
│   ├── editor_uievent.js      # UI 事件处理
│   ├── editor_mappanel.js     # 地图编辑面板
│   ├── editor_datapanel.js    # 数据编辑面板
│   ├── editor_materialpanel.js # 素材面板
│   ├── editor_file.js         # 文件读写操作
│   ├── editor_game.js         # 游戏数据交互
│   ├── editor_util.js         # 工具函数
│   ├── editor_table.js        # 表格编辑器
│   ├── editor_listen.js       # 事件监听
│   ├── editor_blockly.js      # Blockly 集成
│   ├── editor_blocklyconfig.js # Blockly 配置
│   ├── editor_config.js       # 编辑器配置
│   ├── editor_multi.js        # 多行编辑器
│   ├── fs.js                  # 文件系统接口
│   ├── blockly/               # Blockly 库文件
│   ├── CodeMirror/            # CodeMirror 库文件
│   ├── thirdparty/            # 其他第三方库
│   ├── table/                 # 表格配置文件
│   └── css/                   # 编辑器样式
├── editor.html                # 桌面端编辑器 HTML
├── editor-mobile.html         # 移动端编辑器 HTML
├── index.html                 # 游戏入口
├── main.js                    # 游戏主脚本
└── project/                   # 游戏项目数据
    ├── data.js                # 全塔属性
    ├── functions.js           # 脚本函数
    ├── events.js              # 公共事件
    ├── plugins.js             # 插件
    ├── enemys.js              # 怪物属性
    ├── items.js               # 道具属性
    ├── maps.js                # 图块属性
    ├── icons.js               # 图标映射
    ├── floors/                # 楼层数据
    ├── images/                # 图片资源
    ├── sounds/                # 音效资源
    ├── bgms/                  # 背景音乐
    └── autotiles/             # 自动元件
```

## 架构设计

### 1. 编辑器对象 (editor)

核心的编辑器对象，包含所有编辑器状态和方法：

```javascript
editor = {
    version: "2.0",
    brushMod: "line",      // 画笔模式
    layerMod: "map",       // 图层模式
    isMobile: false,       // 是否移动端
    
    dom: {},               // DOM 元素引用
    uivalues: {},          // UI 状态值
    uifunctions: {},       // UI 函数
    
    // 子模块
    mode: editor_mode,     // 面板模式管理
    file: editor_file,     // 文件操作
    game: editor_game,     // 游戏数据
    util: editor_util,     // 工具函数
    table: editor_table,   // 表格操作
    config: editor_config, // 配置管理
    // ...
}
```

### 2. 模块化设计

编辑器采用模块化设计，每个功能模块独立为一个 JS 文件：

```javascript
// 模块定义模式
editor_xxx_wrapper = function (editor) {
    // 模块代码
    // 可以访问 editor 对象
}
```

模块在 `editor.init()` 中初始化：

```javascript
editor_util_wrapper(editor);
editor_game_wrapper(editor, main, core);
editor_file_wrapper(editor);
// ...
```

### 3. 面板模式系统

通过 `editor_mode` 管理不同的编辑面板：

```javascript
editor_mode.ids = {
    'loc': 'left2',        // 位置选取
    'enemyitem': 'left3',  // 图块属性
    'floor': 'left4',      // 楼层属性
    'tower': 'left5',      // 全塔属性
    'functions': 'left8',  // 脚本编辑
    'map': 'left',         // 地图编辑
    'appendpic': 'left1',  // 素材追加
    'commonevent': 'left9',// 公共事件
    'plugins': 'left10',   // 插件编写
}
```

### 4. 数据流架构

```
用户操作
    ↓
editor.uifunctions (UI事件处理)
    ↓
editor.mode (面板模式管理)
    ↓
editor.file (文件读写)
    ↓
fs.js (文件系统接口)
    ↓
服务端 (启动服务.exe)
    ↓
project/ 目录文件
```

## 初始化流程

### 1. 页面加载

```javascript
// editor.html
editor.init(function () {
    editor.listen();      // 绑定事件
    editor.mode_listen(); // 模式切换监听
    editor.mobile_listen(); // 移动端监听
});
```

### 2. 编辑器初始化

```javascript
editor.prototype.init = function (callback) {
    // 1. 加载配置
    editor.config = new editor_config();
    editor.config.load(function() {
        // 2. 加载主题
        // 3. 注入游戏代码
        // 4. 初始化游戏核心
        main.init('editor', function () {
            // 5. 初始化各模块
            editor_util_wrapper(editor);
            editor_game_wrapper(editor, main, core);
            // ...
            
            // 6. 初始化文件系统
            editor_file = editor_file(editor, function () {
                // 7. 初始化面板模式
                editor_mode = editor_mode(editor);
                // 8. 重置游戏
                core.resetGame(...);
                // 9. 加载地图
                editor.game.fetchMapFromCore();
                // 10. 显示默认面板
                editor.mode.showMode('tower');
                // 11. 初始化 Blockly 和 CodeMirror
                editor_multi = editor_multi();
                editor_blockly = editor_blockly();
                // 12. 执行回调
                callback();
            });
        });
    });
}
```

## 与游戏核心的集成

### 1. 游戏代码注入

编辑器通过动态加载游戏的 `index.html` 内容到 `#gameInject` 容器中：

```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', 'index.html', true);
xhr.onload = function () {
    var str = xhr.response.split('<!-- injection -->');
    editor.dom.gameInject.innerHTML = str[1];
    // 加载 main.js
};
```

### 2. 数据同步

编辑器操作会同步更新游戏核心数据：

```javascript
// 编辑器修改 → 更新 core 数据 → 写入文件
editor.file.editXxx(actionList, function() {
    // 保存到文件后回调
});
```

### 3. Canvas 共享

编辑器复用游戏的 Canvas 画布进行渲染：

```javascript
editor.dom.bgc = document.getElementById('bg');
editor.dom.evc = document.getElementById('event');
// ...
```

## 文件系统

### 1. fs.js 接口

提供跨平台的文件系统操作：

```javascript
fs.readFile(filename, encoding, callback)
fs.writeFile(filename, data, encoding, callback)
fs.readdir(directory, callback)
```

### 2. 服务端通信

通过 HTTP 请求与本地服务端通信：

```javascript
// fs.js 内部实现
var xhr = new XMLHttpRequest();
xhr.open('POST', '/readFile', true);
// ...
```

服务端由 `启动服务.exe` 或 `node` 运行时提供。

## 状态管理

### 1. 编辑器配置

使用 `editor_config` 管理持久化配置：

```javascript
editor.config.get('key', defaultValue)
editor.config.set('key', value)
```

基于 `localStorage` 存储。

### 2. 操作记录

通过 `editor_mode.actionList` 记录用户操作：

```javascript
editor_mode.addAction(['change', "['main']['name']", newValue])
// ...
editor_mode.doActionList(mode, actionList, callback)
```

### 3. 撤销/重做

```javascript
editor.uivalues.preMapData = []  // 撤销栈
editor.uivalues.postMapData = [] // 重做栈
editor.uivalues.preMapMax = 10   // 最大记录数
```

## 事件系统

### 1. DOM 事件

通过 `editor_listen.js` 统一管理 DOM 事件：

```javascript
editor.prototype.listen = function () {
    // 键盘事件
    document.body.onkeydown = function(e) {...}
    document.body.onkeyup = function(e) {...}
    
    // 鼠标事件
    editor.dom.mapEdit.onclick = function(e) {...}
    // ...
}
```

### 2. 自定义事件

通过回调函数实现：

```javascript
editor.mode.onmode('save', function() {
    // 保存完成后执行
});
```

## 性能优化

### 1. 延迟渲染

地图更新使用批量更新：

```javascript
editor.updateMap() // 一次性更新整个地图
```

### 2. 视口裁剪

大地图只渲染可见区域：

```javascript
core.bigmap.offsetX / core.bigmap.offsetY
```

### 3. 图片缓存

素材图片加载后缓存在内存中：

```javascript
core.material.images.xxx
```

## 扩展性

### 1. 插件系统

通过 `plugins.js` 支持功能扩展。

### 2. 表格配置

通过 `table/*.comment.js` 自定义编辑器界面。

### 3. 主题支持

通过 CSS 文件切换编辑器主题：

```javascript
editor.config.get('theme', 'editor_color')
// editor_color.css 或 editor_color_dark.css
```

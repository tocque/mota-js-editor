# 魔塔编辑器 - 核心模块详解

## 模块概览

编辑器由多个核心模块组成，每个模块负责特定的功能领域：

| 模块文件 | 行数 | 功能 |
|----------|------|------|
| editor.js | ~1054 | 编辑器主入口和核心逻辑 |
| editor_mode.js | ~371 | 面板模式管理 |
| editor_file.js | - | 文件读写操作 |
| editor_game.js | - | 游戏数据交互 |
| editor_ui.js | - | UI 组件生成 |
| editor_uievent.js | - | UI 事件处理 |
| editor_table.js | - | 表格编辑器 |
| editor_listen.js | - | 事件监听绑定 |
| editor_util.js | - | 工具函数 |
| editor_mappanel.js | ~1190 | 地图编辑面板 |
| editor_datapanel.js | ~1229 | 数据编辑面板 |
| editor_materialpanel.js | - | 素材面板 |
| editor_blockly.js | ~1214 | Blockly 集成 |
| editor_blocklyconfig.js | - | Blockly 配置 |
| editor_multi.js | ~515 | 多行代码编辑器 |
| editor_config.js | - | 配置管理 |

---

## 1. editor.js - 编辑器主入口

### 核心职责
- 定义 `editor` 全局对象
- 管理 DOM 元素引用
- 维护 UI 状态值
- 协调各模块初始化
- 处理地图渲染和更新

### 主要属性

```javascript
editor.version = "2.0"        // 编辑器版本
editor.brushMod = "line"      // 画笔模式: line/rectangle/tileset/fill
editor.layerMod = "map"       // 图层模式: bgmap/map/fgmap
editor.isMobile = false       // 是否移动端

editor.dom = {...}            // DOM 元素引用集合
editor.uivalues = {...}       // UI 状态值集合
editor.uifunctions = {...}    // UI 函数集合
```

### 主要方法

```javascript
editor.init(callback)          // 初始化编辑器
editor.mapInit()               // 初始化地图数据
editor.changeFloor(floorId)    // 切换楼层
editor.updateMap()             // 更新地图渲染
editor.drawEventBlock()        // 绘制事件标记
editor.drawPosSelection()      // 绘制位置选择框
editor.setViewport(x, y)       // 设置视口位置
editor.moveViewport(x, y)      // 移动视口
editor.buildMark()             // 构建坐标标记
editor.drawInitData(icons)     // 初始化绘图数据
editor.setSelectBoxFromInfo()  // 设置选择框位置
editor.addUsedFlags(s)         // 添加使用的变量
```

### DOM 元素引用

```javascript
editor.dom = {
    body: document.body,
    eui: document.getElementById('eui'),     // UI 画布
    efg: document.getElementById('efg'),     // 前景画布
    ebm: document.getElementById('ebm'),     // 背景画布
    mid: document.getElementById('mid'),     // 中央区域
    mapEdit: document.getElementById('mapEdit'), // 地图编辑区
    selectFloor: document.getElementById('selectFloor'), // 楼层选择
    iconLib: document.getElementById('iconLib'),   // 图标库
    midMenu: document.getElementById('midMenu'),   // 右键菜单
    // ... 更多元素
}
```

### UI 状态值

```javascript
editor.uivalues = {
    holdingPath: 0,           // 拖动状态
    startPos: null,           // 起始位置
    endPos: null,             // 结束位置
    selectedArea: null,       // 选中区域
    tileSize: [1, 1],         // 图块大小
    preMapData: [],           // 撤销栈
    postMapData: [],          // 重做栈
    bigmap: false,            // 大地图模式
    bigmapInfo: {},           // 大地图信息
    lastUsed: [],             // 最近使用的图块
    showMovable: false,       // 显示通行度
    // ... 更多状态
}
```

---

## 2. editor_mode.js - 面板模式管理

### 核心职责
- 管理左侧面板切换
- 记录操作历史
- 协调面板间的数据流
- 处理双击模式（添加/删除）

### 面板 ID 映射

```javascript
editor_mode.ids = {
    'loc': 'left2',           // 位置选取
    'enemyitem': 'left3',     // 图块属性
    'floor': 'left4',         // 楼层属性
    'tower': 'left5',         // 全塔属性
    'functions': 'left8',     // 脚本编辑
    'map': 'left',            // 地图编辑
    'appendpic': 'left1',     // 素材追加
    'commonevent': 'left9',   // 公共事件
    'plugins': 'left10',      // 插件编写
}
```

### 主要方法

```javascript
editor_mode.init(callback)              // 初始化
editor_mode.init_dom_ids(callback)      // 初始化 DOM ID 映射
editor_mode.addAction(action)           // 添加操作到列表
editor_mode.doActionList(mode, list, cb) // 执行操作列表
editor_mode.onmode(mode, callback)      // 切换模式
editor_mode.showMode(mode)              // 显示指定面板
editor_mode.change(value)               // 切换面板（带确认）

// 面板显示方法
editor_mode.loc(callback)               // 显示位置选取
editor_mode.enemyitem(callback)         // 显示图块属性
editor_mode.floor(callback)             // 显示楼层属性
editor_mode.tower(callback)             // 显示全塔属性
editor_mode.functions(callback)         // 显示脚本编辑
editor_mode.commonevent(callback)       // 显示公共事件
editor_mode.plugins(callback)           // 显示插件编写
```

### 操作列表格式

```javascript
// 修改操作
['change', "['main']['name']", "新游戏名称"]

// 添加操作
['add', "['autoEvent']['2']", eventData]

// 删除操作
['delete', "['items']['sword']"]
```

---

## 3. editor_file.js - 文件操作模块

### 核心职责
- 读取和写入项目文件
- 保存楼层、怪物、道具等数据
- 管理素材文件
- 处理批量文件操作

### 主要方法

```javascript
// 楼层相关
editor.file.saveFloorFile(callback)     // 保存当前楼层
editor.file.saveFloor(data, callback)   // 保存指定楼层数据
editor.file.saveNewFile(id, callback)   // 创建新楼层
editor.file.saveNewFiles(ids, from, to, cb) // 批量创建楼层
editor.file.editFloor(actions, callback) // 编辑楼层属性
editor.file.editLoc(x, y, actions, cb)  // 编辑位置事件

// 全塔属性
editor.file.editTower(actions, callback) // 编辑全塔属性

// 怪物/道具/图块
editor.file.editEnemy(id, actions, cb)  // 编辑怪物属性
editor.file.editItem(id, actions, cb)   // 编辑道具属性
editor.file.editMapBlocksInfo(idnum, actions, cb) // 编辑图块属性

// 脚本/事件/插件
editor.file.editFunctions(actions, cb)  // 编辑脚本函数
editor.file.editCommonEvent(actions, cb) // 编辑公共事件
editor.file.editPlugins(actions, cb)    // 编辑插件

// 素材管理
editor.file.changeIdAndIdnum(id, idnum, info, cb) // 修改素材 ID
editor.file.autoRegister(info, callback) // 自动注册素材
editor.file.removeMaterial(info, cb)    // 删除素材
editor.file.registerAutotile(name, cb)  // 注册自动元件

// 配置保存
editor.file.saveSetting(type, actions, cb) // 保存配置
```

---

## 4. editor_game.js - 游戏数据模块

### 核心职责
- 与游戏核心 (core) 交互
- 处理地图数据转换
- 管理图块索引
- 初始化游戏数据

### 主要方法

```javascript
editor.game.fixFunctionInGameData()     // 修复游戏数据中的函数
editor.game.idsInit(maps, icons)        // 初始化图块 ID
editor.game.fetchMapFromCore()          // 从 core 获取地图数据
editor.game.doCoreFunc(name, ...args)   // 调用 core 函数
editor.game.getFirstData()              // 获取初始数据
```

### 图块索引结构

```javascript
editor.ids = [
    {
        id: "greenSlime",      // 唯一标识符
        idnum: 201,            // 数字 ID
        images: "enemys",      // 所属图集
        y: 0,                  // 图集中的行位置
        // ...
    },
    // ...
]

editor.indexs = {
    201: [0, "greenSlime"],   // idnum → [索引, id]
    // ...
}
```

---

## 5. editor_table.js - 表格编辑器

### 核心职责
- 将对象数据转换为 HTML 表格
- 处理表格编辑和事件绑定
- 支持嵌套对象和数组
- 管理表格字段配置

### 主要方法

```javascript
editor.table.objToTable(obj, comment)   // 对象转表格 HTML
editor.table.addfunc()                  // 添加新项
editor.table.deletefunc(key)            // 删除项
```

### 表格配置格式

```javascript
// comment.js
{
    "_data": {
        "events": {
            "_leaf": false,
            "_data": "事件相关"
        },
        "id": {
            "_leaf": true,
            "_type": "textarea",
            "_data": "唯一标识符"
        }
    }
}
```

---

## 6. editor_blockly.js - Blockly 集成

### 核心职责
- 初始化和管理 Blockly 工作区
- 处理积木块的导入导出
- 代码生成和解析
- 自动补全和预览

### 主要方法

```javascript
editor_blockly.import(id, args)         // 导入事件到 Blockly
editor_blockly.show()                   // 显示 Blockly
editor_blockly.hide()                   // 隐藏 Blockly
editor_blockly.confirm(keep)            // 确认保存
editor_blockly.cancel()                 // 取消编辑
editor_blockly.parse()                  // 解析代码为积木
editor_blockly.setValue(value)          // 设置代码区内容
editor_blockly.previewBlock(b, args)    // 预览积木效果
editor_blockly.selectPoint(b, arr)      // 地图选点
editor_blockly.searchBlock(value)       // 搜索积木
editor_blockly.getAutoCompletions(...)  // 获取自动补全
editor_blockly.checkAsync(obj)          // 检查异步事件
```

### 入口类型

```javascript
editor_blockly.entryType = 'event'      // 事件入口类型
// 可选: event, commonEvent, beforeBattle, afterBattle, 
//       afterGetItem, afterOpenDoor, firstArrive, eachArrive,
//       choices, shop
```

---

## 7. editor_multi.js - 多行代码编辑器

### 核心职责
- 管理 CodeMirror 编辑器
- 处理代码语法检查
- 提供代码补全
- 格式化代码

### 主要方法

```javascript
editor_multi.import(id, args)           // 导入内容到编辑器
editor_multi.show()                     // 显示编辑器
editor_multi.hide()                     // 隐藏编辑器
editor_multi.confirm(keep)              // 确认保存
editor_multi.cancel()                   // 取消编辑
editor_multi.format()                   // 格式化代码
editor_multi.hasError()                 // 检查语法错误
editor_multi.setLint()                  // 设置语法检查
editor_multi.toggerLint()               // 切换语法检查
editor_multi.multiLineEdit(...)         // 从 Blockly 调用
editor_multi.importFile(filename)       // 编辑外部文件
editor_multi.editCommentJs(mod)         // 编辑配置文件
```

### Tern 服务器

```javascript
editor_multi.ternServer                 // 代码补全服务
editor_multi.codeEditor                 // CodeMirror 实例
```

---

## 8. editor_config.js - 配置管理

### 核心职责
- 管理编辑器配置
- 持久化存储配置
- 提供配置默认值

### 主要方法

```javascript
editor.config.load(callback)            // 加载配置
editor.config.get(key, defaultValue)    // 获取配置
editor.config.set(key, value)           // 设置配置
```

### 常用配置项

```javascript
'theme'                // 编辑器主题
'editorLastFloorId'    // 上次编辑的楼层
'viewportLoc'          // 视口位置
'folded'               // 素材区是否折叠
'foldPerCol'           // 折叠时每列数量
'lastUsed'             // 最近使用的图块
'lastUsedType'         // 最近使用类型
'disableBlocklyReplace' // 禁用 Blockly 替换
```

---

## 9. 辅助模块

### editor_ui.js
- 生成 UI 组件 HTML
- 创建按钮、下拉框等

### editor_uievent.js
- 处理 UI 预览
- 地图选点功能
- 素材选择器

### editor_listen.js
- 键盘事件绑定
- 鼠标事件绑定
- 触摸事件绑定

### editor_util.js
- 颜色转换函数
- 像素操作函数
- 编码解码函数
- GUID 生成

### editor_mappanel.js
- 地图编辑面板逻辑
- 新建/删除地图
- 导入/导出地图

### editor_datapanel.js
- 数据编辑面板逻辑
- 图块属性编辑
- 楼层属性编辑
- 全塔属性编辑

### editor_materialpanel.js
- 素材追加功能
- 素材拖拽处理
- 色相调整

---

## 模块依赖关系

```
editor.js (核心)
    ├── editor_config.js (配置)
    ├── editor_util.js (工具)
    ├── editor_game.js (游戏数据)
    │   └── core (游戏核心)
    ├── editor_file.js (文件操作)
    │   └── fs.js (文件系统)
    ├── editor_table.js (表格)
    ├── editor_mode.js (模式管理)
    ├── editor_ui.js (UI生成)
    ├── editor_uievent.js (UI事件)
    ├── editor_listen.js (事件监听)
    ├── editor_mappanel.js (地图面板)
    ├── editor_datapanel.js (数据面板)
    ├── editor_materialpanel.js (素材面板)
    ├── editor_blockly.js (Blockly)
    │   ├── editor_blocklyconfig.js
    │   └── Blockly 库
    └── editor_multi.js (代码编辑器)
        └── CodeMirror 库
```

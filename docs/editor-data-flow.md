# 魔塔编辑器 - 数据流与状态管理

## 概述

本文档描述魔塔编辑器中数据如何流动、状态如何管理、以及编辑器与游戏核心如何交互。

## 数据架构

### 三层数据结构

```
┌────────────────────────────────────────────────────┐
│                   编辑器层                          │
│  editor.map / editor.bgmap / editor.fgmap          │
│  editor.currentFloorData / editor.currentFloorId   │
│  editor.info / editor.pos / editor.ids             │
└───────────────────────┬────────────────────────────┘
                        ↓ ↑
┌───────────────────────┴────────────────────────────┐
│                   游戏核心层                        │
│  core.status.maps / core.status.thisMap            │
│  core.material.xxx / core.status.hero              │
└───────────────────────┬────────────────────────────┘
                        ↓ ↑
┌───────────────────────┴────────────────────────────┐
│                   文件系统层                        │
│  project/floors/*.js                               │
│  project/data.js / enemys.js / items.js / ...      │
└────────────────────────────────────────────────────┘
```

## 编辑器状态

### 1. 地图编辑状态

```javascript
// 当前编辑的楼层
editor.currentFloorId          // 当前楼层 ID
editor.currentFloorData        // 当前楼层完整数据

// 三层地图数据
editor.map                     // 事件层 (二维数组)
editor.bgmap                   // 背景层 (二维数组)
editor.fgmap                   // 前景层 (二维数组)

// 每个格子的值可能是:
// - 0: 空白
// - number: idnum
// - object: 图块信息对象 {idnum, id, images, y, ...}
```

### 2. 选择状态

```javascript
// 地图上选中的位置
editor.pos = {x: 0, y: 0}

// 素材区选中的图块
editor.info = {
    id: "greenSlime",
    idnum: 201,
    images: "enemys",
    y: 0,
    // ...
}

// 区域选择
editor.uivalues.selectedArea = {
    x1: 0, y1: 0,
    x2: 5, y2: 5
}
```

### 3. 编辑模式状态

```javascript
// 画笔模式
editor.brushMod = "line"       // line/rectangle/tileset/fill

// 图层模式
editor.layerMod = "map"        // bgmap/map/fgmap

// 面板模式
editor_mode.mode = "tower"     // map/loc/enemyitem/floor/tower/...

// 双击模式
editor_mode.doubleClickMode = "change"  // change/add/delete
```

### 4. 操作列表

```javascript
// 待保存的操作
editor_mode.actionList = [
    ['change', "['main']['name']", "新游戏名称"],
    ['add', "['events']['5,5']", [...事件数据]],
    ['delete', "['items']['sword']"],
]
```

### 5. 撤销/重做栈

```javascript
editor.uivalues.preMapData = []   // 撤销栈 (最多10个)
editor.uivalues.postMapData = []  // 重做栈
editor.uivalues.preMapMax = 10    // 最大记录数
```

## 数据同步流程

### 1. 编辑器 → 游戏核心

```javascript
// 地图数据同步
editor.prototype.updateMap = function () {
    // 将编辑器地图数据转换为 blocks
    var blocks = core.maps._mapIntoBlocks(
        editor.map.map(function (v) {
            return v.map(function (v) {
                return v.idnum || v || 0;
            });
        }), null, editor.currentFloorId
    );
    
    // 更新到游戏核心
    core.status.thisMap.blocks = blocks;
    
    // 重绘地图
    core.maps._drawMap_drawAll();
}
```

### 2. 游戏核心 → 编辑器

```javascript
// 从游戏核心获取地图数据
editor.game.fetchMapFromCore = function () {
    var floorId = core.status.floorId;
    var floor = core.floors[floorId];
    
    editor.currentFloorId = floorId;
    editor.currentFloorData = floor;
    
    // 转换地图数据
    editor.map = convertToEditorFormat(floor.map);
    editor.bgmap = convertToEditorFormat(floor.bgmap || []);
    editor.fgmap = convertToEditorFormat(floor.fgmap || []);
}
```

### 3. 编辑器 → 文件系统

```javascript
// 保存地图到文件
editor.file.saveFloorFile = function (callback) {
    // 1. 收集当前楼层数据
    var floorData = editor.currentFloorData;
    
    // 2. 更新地图数组
    ['map', 'bgmap', 'fgmap'].forEach(function (name) {
        floorData[name] = editor[name].map(function (row) {
            return row.map(function (cell) {
                return cell.idnum || cell || 0;
            });
        });
    });
    
    // 3. 序列化为 JS 代码
    var content = "main.floors." + floorId + " = " + 
                  JSON.stringify(floorData, null, 4);
    
    // 4. 写入文件
    fs.writeFile('project/floors/' + floorId + '.js', 
                 content, 'utf-8', callback);
}
```

### 4. 文件系统 → 游戏核心

```javascript
// 游戏启动时加载
main.init('editor', function () {
    // main.js 加载各种数据文件
    // 包括 floors/*.js, data.js, enemys.js 等
    
    // 数据被加载到全局变量中
    // 然后 core 从全局变量读取并处理
});
```

## 操作类型

### 1. 地图绘制操作

```
用户点击地图
    ↓
获取点击位置 (editor.pos)
    ↓
获取选中图块 (editor.info)
    ↓
更新 editor.map/bgmap/fgmap
    ↓
记录到撤销栈
    ↓
调用 editor.updateMap()
    ↓
同步到 core.status.thisMap.blocks
    ↓
重绘 Canvas
    ↓
标记地图已修改 (高亮保存按钮)
```

### 2. 属性编辑操作

```
双击表格值
    ↓
打开编辑器 (Blockly/CodeMirror/直接编辑)
    ↓
用户修改内容
    ↓
确认保存
    ↓
记录到 editor_mode.actionList
    ↓
点击[保存]按钮
    ↓
editor_mode.doActionList()
    ↓
editor.file.editXxx(actionList)
    ↓
更新内存数据
    ↓
写入文件
```

### 3. 切换楼层操作

```
用户选择楼层
    ↓
保存当前楼层数据到内存
    ↓
清空撤销/重做栈
    ↓
更新 core.status.floorId
    ↓
core.resizeMap(floorId)
    ↓
core.extractBlocks(floorId)
    ↓
editor.game.fetchMapFromCore()
    ↓
editor.updateMap()
    ↓
editor_mode.floor() - 刷新楼层属性面板
    ↓
恢复该楼层的视口位置
```

## 配置持久化

### localStorage 存储

```javascript
// editor_config.js
editor.config = {
    data: {},                    // 配置数据
    
    load: function (callback) {
        try {
            this.data = JSON.parse(localStorage.getItem('editorConfig') || '{}');
        } catch (e) {
            this.data = {};
        }
        callback();
    },
    
    get: function (key, defaultValue) {
        return this.data[key] !== undefined ? this.data[key] : defaultValue;
    },
    
    set: function (key, value) {
        this.data[key] = value;
        localStorage.setItem('editorConfig', JSON.stringify(this.data));
    }
}
```

### 持久化的配置项

```javascript
{
    'theme': 'editor_color',           // 编辑器主题
    'editorLastFloorId': 'MT0',        // 上次编辑的楼层
    'viewportLoc': [0, 0],             // 视口位置
    'folded': false,                   // 素材区是否折叠
    'foldPerCol': 50,                  // 折叠时每列数量
    'lastUsed': [...],                 // 最近使用的图块
    'lastUsedType': 'recent',          // 最近使用排序方式
    'disableBlocklyReplace': false,    // 禁用 Blockly 中文替换
    'disableBlocklyExpandCompare': false, // 禁用逻辑展开
}
```

## 文件系统通信

### 请求格式

```javascript
// fs.js 封装的请求
function readFile(filename, encoding, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/readFile', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(null, xhr.responseText);
            } else {
                callback(new Error('HTTP ' + xhr.status));
            }
        }
    };
    xhr.send('name=' + encodeURIComponent(filename));
}
```

### 服务端处理

服务端（启动服务.exe 或 node server.js）处理：
- `/readFile` - 读取文件
- `/writeFile` - 写入文件
- `/readdir` - 读取目录

## 游戏数据对象

### 全塔属性 (data.js)

```javascript
data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = {
    "main": {...},           // 主要配置
    "firstData": {...},      // 初始数据
    "values": {...},         // 全局数值
    "flags": {...},          // 系统开关
}
```

### 怪物属性 (enemys.js)

```javascript
enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = {
    "greenSlime": {
        "id": "greenSlime",
        "name": "绿色史莱姆",
        "hp": 100, "atk": 10, "def": 5,
        // ...
    },
    // ...
}
```

### 道具属性 (items.js)

```javascript
items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = {
    "redJewel": {
        "id": "redJewel",
        "cls": "items",
        "name": "红宝石",
        // ...
    },
    // ...
}
```

### 图块属性 (maps.js)

```javascript
maps_90f36752_8815_4be8_b32b_d7fad1d0542e = {
    "200": {
        "cls": "terrains",
        "id": "wall",
        "trigger": null,
        // ...
    },
    // ...
}
```

### 脚本函数 (functions.js)

```javascript
functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = {
    "events": {...},
    "enemys": {...},
    "actions": {...},
    "control": {...},
    "ui": {...},
}
```

### 事件定义 (events.js)

```javascript
events_c12a15a8_c380_4b28_8144_256cba95f760 = {
    "commonEvent": {...}     // 公共事件
}
```

### 插件 (plugins.js)

```javascript
plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = {
    "init": function () {...},
    "plugin1": function () {...},
    // ...
}
```

## 数据变更监听

### 表格输入监听

```javascript
// 表格输入框变化时
input.onchange = function () {
    // 验证输入
    // 记录到 actionList
    editor_mode.addAction(['change', field, newValue]);
    // 标记未保存
}
```

### 地图变更监听

```javascript
// 地图绘制时
// 更新地图数据
editor.map[y][x] = newValue;
// 标记未保存
editor.uifunctions.highlightSaveFloorButton();
```

## 错误处理

### 文件操作错误

```javascript
editor.file.saveFloorFile(function (err) {
    if (err) {
        printe(err);  // 显示错误提示
        throw(err);   // 抛出异常便于调试
    }
    printf('保存成功');
});
```

### 数据验证

```javascript
// 验证 floorIds 唯一性
editor_mode.checkUnique = function (arr) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        if (map[arr[i]]) {
            alert("警告：存在重复定义！");
            return false;
        }
        map[arr[i]] = true;
    }
    return true;
}
```

## 性能优化

### 批量更新

```javascript
// 使用 actionList 批量保存
editor_mode.actionList.push(['change', field1, value1]);
editor_mode.actionList.push(['change', field2, value2]);
// 一次性保存
editor_mode.doActionList(mode, actionList, callback);
```

### 延迟渲染

```javascript
// 只在需要时更新地图
// 而不是每次修改都重绘
editor.updateMap();
```

### 数据缓存

```javascript
// 图块信息缓存在 editor.ids 和 editor.indexs
// 避免重复计算
```

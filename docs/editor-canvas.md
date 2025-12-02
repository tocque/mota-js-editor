# 魔塔编辑器 - 中央画布编辑区域

## 概述

中央画布编辑区域是编辑器的核心工作区，用于可视化编辑游戏地图。支持多层画布叠加、多种绘制模式、视口移动、大地图模式等功能。

## 布局结构

```
┌─────────────────────────────────────────────────────┐
│                    列标记 (mapColMark)               │
├──┬──────────────────────────────────────────────────┤
│行│                                                   │
│标│         中央画布区域 (#mapEdit)                    │
│记│     ┌─────────────────────────────────────┐      │
│  │     │ Canvas 层叠                         │      │
│M │     │ ┌─────────────────────────────────┐│      │
│a │     │ │ ebm (背景标记层)                 ││      │
│p │     │ ├─────────────────────────────────┤│      │
│R │     │ │ efg (前景标记层)                 ││      │
│o │     │ ├─────────────────────────────────┤│      │
│w │     │ │ eui (UI/交互层)                  ││      │
│M │     │ ├─────────────────────────────────┤│      │
│a │     │ │ bg (背景画布)                    ││      │
│r │     │ ├─────────────────────────────────┤│      │
│k │     │ │ event (事件画布)                 ││      │
│  │     │ ├─────────────────────────────────┤│      │
│  │     │ │ event2 (事件2画布)               ││      │
│  │     │ ├─────────────────────────────────┤│      │
│  │     │ │ fg (前景画布)                    ││      │
│  │     │ └─────────────────────────────────┘│      │
│  │     └─────────────────────────────────────┘      │
└──┴──────────────────────────────────────────────────┘
```

## DOM 元素

### 画布元素

```javascript
editor.dom = {
    // 编辑器专用画布
    eui: document.getElementById('eui'),    // UI/交互层
    efg: document.getElementById('efg'),    // 前景标记层
    ebm: document.getElementById('ebm'),    // 背景标记层
    
    // 游戏共享画布
    bgc: document.getElementById('bg'),     // 背景画布
    evc: document.getElementById('event'),  // 事件画布
    ev2c: document.getElementById('event2'),// 事件2画布
    fgc: document.getElementById('fg'),     // 前景画布
    
    // 容器
    mapEdit: document.getElementById('mapEdit'),
    
    // 坐标标记
    mapColMark: document.getElementById('mapColMark'),
    mapRowMark: document.getElementById('mapRowMark'),
}
```

### Canvas 上下文

```javascript
editor.dom.euiCtx: eui.getContext('2d'),
editor.dom.efgCtx: efg.getContext('2d'),
editor.dom.ebmCtx: ebm.getContext('2d'),
editor.dom.bgCtx: bg.getContext('2d'),
editor.dom.evCtx: event.getContext('2d'),
editor.dom.ev2Ctx: event2.getContext('2d'),
editor.dom.fgCtx: fg.getContext('2d'),
```

## 画布层次

### 1. 背景层 (bg)
- 绘制地面图块
- 显示 defaultGround
- 显示 bgmap 层内容

### 2. 事件层 (event, event2)
- 绘制怪物、NPC、道具
- 显示 map 层内容
- 支持大型图块跨层渲染

### 3. 前景层 (fg)
- 绘制遮挡物
- 显示 fgmap 层内容
- 高于事件层的图块

### 4. 编辑器标记层 (efg)
- 绘制事件标记（色块）
- 绘制位置选择框
- 绘制通行度标记
- 绘制上下楼点标记

### 5. UI层 (eui)
- 处理用户交互
- 绘制选择框
- 绘制拖动预览

## 绘制模式

### 1. 画笔模式 (line)

单点绘制或连续绘制：

```javascript
editor.brushMod = "line"
```

- 点击：在当前位置绘制图块
- 拖拽：连续绘制图块

### 2. 矩形模式 (rectangle)

绘制矩形区域：

```javascript
editor.brushMod = "rectangle"
```

- 点击拖拽：选择矩形区域
- 释放：填充选中区域

### 3. 平铺模式 (tileset)

使用大图块平铺绘制：

```javascript
editor.brushMod = "tileset"
```

- 选择多个连续图块
- 按原始排列平铺绘制

### 4. 填充模式 (fill)

洪水填充：

```javascript
editor.brushMod = "fill"
```

- 点击：填充相同图块的连通区域

## 图层模式

### 1. 背景层 (bgmap)

```javascript
editor.layerMod = "bgmap"
```

编辑 `editor.bgmap` 数组

### 2. 事件层 (map)

```javascript
editor.layerMod = "map"
```

编辑 `editor.map` 数组（默认层）

### 3. 前景层 (fgmap)

```javascript
editor.layerMod = "fgmap"
```

编辑 `editor.fgmap` 数组

## 视口控制

### 视口位置

```javascript
core.bigmap.offsetX  // X轴偏移（像素）
core.bigmap.offsetY  // Y轴偏移（像素）
```

### 移动视口

```javascript
editor.setViewport(x, y)      // 设置视口位置
editor.moveViewport(dx, dy)   // 相对移动视口
```

### 视口按钮

```html
<div id="viewportButtons">
    <input type="button" value="←"/>
    <input type="button" value="↑"/>
    <input type="button" value="↓"/>
    <input type="button" value="→"/>
    <input type="button" id='bigmapBtn' value="大地图"/>
</div>
```

## 大地图模式

### 开启/关闭

```javascript
editor.uivalues.bigmap = true/false
```

### 大地图信息

```javascript
editor.uivalues.bigmapInfo = {
    top: 0,      // 上边距
    left: 0,     // 左边距
    size: 32,    // 格子大小
}
```

### 渲染方式

大地图模式下：
- 使用缩略图方式渲染整个地图
- 格子大小根据地图尺寸自适应
- 仍可进行点击编辑操作

```javascript
editor.prototype._updateMap_bigmap = function () {
    core.drawThumbnail(editor.currentFloorId, null, {ctx: bm, all: true});
    // 计算格子大小
    editor.uivalues.bigmapInfo.size = core.__PIXELS__ / Math.max(width, height);
}
```

## 事件标记

### 标记颜色

```javascript
// 各类事件的标记颜色
{
    events: '#FF0000',         // 红色 - 普通事件
    autoEvent: '#FFA500',      // 橙色 - 自动事件
    beforeBattle: '#0000FF',   // 蓝色 - 战前事件
    afterBattle: '#FFFF00',    // 黄色 - 战后事件
    changeFloor: '#00FF00',    // 绿色 - 楼传
    afterGetItem: '#00FFFF',   // 青色 - 获取道具后
    afterOpenDoor: '#FF00FF',  // 紫色 - 开门后
}
```

### 绘制事件标记

```javascript
editor.prototype.drawEventBlock = function () {
    // 遍历每个格子
    for (var i = 0; i < core.__SIZE__; i++) {
        for (var j = 0; j < core.__SIZE__; j++) {
            var loc = x + ',' + y;
            var color = this._drawEventBlock_getColor(loc);
            // 绘制色块
            for (var kk = 0; kk < color.length; kk++) {
                fg.fillStyle = color[kk];
                fg.fillRect(32*i+8*kk, 32*j+32-8, 8, 8);
            }
        }
    }
}
```

### 特殊标记

- **S**: 勇士初始位置
- **🔼**: 上楼点
- **🔽**: 下楼点
- **🔃**: 楼传落点

## 通行度显示

### 开启通行度

```javascript
editor.uivalues.showMovable = true
```

### 显示内容

```javascript
editor.prototype.drawEventBlock = function () {
    if (editor.uivalues.showMovable) {
        var movableArray = core.generateMovableArray();
        // 绘制不可通行的方向标记
        // 红色线条表示不可通行
        // 三角形表示单向通行
    }
}
```

## 位置选择

### 选择位置

```javascript
editor.pos = {x: 0, y: 0}  // 当前选中位置
```

### 绘制选择框

```javascript
editor.prototype.drawPosSelection = function () {
    var fg = editor.dom.efgCtx;
    fg.strokeStyle = 'rgba(255,255,255,0.7)';
    fg.lineWidth = 4;
    fg.strokeRect(32*editor.pos.x - offsetX + 4, 
                  32*editor.pos.y - offsetY + 4, 24, 24);
}
```

## 坐标标记

### 构建标记

```javascript
editor.prototype.buildMark = function () {
    // 列标记 (0, 1, 2, ...)
    var colNum = '';
    for (var i = 0; i < core.__SIZE__; i++) {
        colNum += '<td>' + (i + offsetX) + '</td>';
    }
    mapColMark.innerHTML = '<tr>' + colNum + '</tr>';
    
    // 行标记
    var rowNum = '';
    for (var i = 0; i < core.__SIZE__; i++) {
        rowNum += '<tr><td>' + (i + offsetY) + '</td></tr>';
    }
    mapRowMark.innerHTML = rowNum;
}
```

## 鼠标事件处理

### 坐标转换

```javascript
// 屏幕坐标 → 地图坐标
var eToLoc = function (e) {
    var scrollLeft = document.documentElement.scrollLeft;
    var scrollTop = document.documentElement.scrollTop;
    return {
        x: ~~((scrollLeft + e.clientX - mapEdit.offsetLeft) / 32),
        y: ~~((scrollTop + e.clientY - mapEdit.offsetTop) / 32),
    };
}
```

### 主要事件

```javascript
// 点击事件
mapEdit.onclick = function(e) {
    // 获取点击位置
    var loc = eToLoc(e);
    // 绘制或选择
}

// 鼠标移动
mapEdit.onmousemove = function(e) {
    // 拖动绘制
}

// 右键菜单
mapEdit.oncontextmenu = function(e) {
    // 显示右键菜单
}
```

## 右键菜单

### 菜单项

```html
<div id="midMenu">
    <div id='extraEvent'>绑定事件</div>
    <div id='chooseThis'>选中此点</div>
    <div id='chooseInRight'>在素材区选中此图块</div>
    <div id='copyLoc'>复制此事件</div>
    <div id='pasteLoc'>粘贴到此事件</div>
    <div id='clearEvent'>仅清空此点事件</div>
    <div id='clearLoc'>清空此点及事件</div>
</div>
```

### 功能说明

| 菜单项 | 功能 |
|--------|------|
| 选中此点 | 跳转到位置选取面板 |
| 在素材区选中此图块 | 滚动素材区到对应图块 |
| 复制此事件 | 复制当前位置的事件 |
| 粘贴到此事件 | 粘贴事件到当前位置 |
| 仅清空此点事件 | 清除事件但保留图块 |
| 清空此点及事件 | 清除图块和事件 |

## 更新流程

### 地图更新

```javascript
editor.prototype.updateMap = function () {
    // 1. 将编辑器数据同步到 core
    var blocks = core.maps._mapIntoBlocks(editor.map, ...);
    core.status.thisMap.blocks = blocks;
    
    // 2. 重绘所有画布
    core.removeGlobalAnimate();
    core.clearMap('all');
    core.maps._drawMap_drawAll();
    
    // 3. 绘制事件标记
    editor.drawEventBlock();
    
    // 4. 更新最近使用
    this.updateLastUsedMap();
}
```

### 切换楼层

```javascript
editor.prototype.changeFloor = function (floorId, callback) {
    // 1. 保存当前楼层数据
    // 2. 清空撤销栈
    // 3. 更新 core 数据
    core.status.floorId = floorId;
    core.resizeMap(floorId);
    core.clearMap('all');
    core.extractBlocks(floorId);
    
    // 4. 获取新楼层数据
    editor.game.fetchMapFromCore();
    
    // 5. 更新显示
    editor.updateMap();
    editor_mode.floor();
    editor.drawEventBlock();
    
    // 6. 恢复视口位置
    editor.setViewport(x, y);
}
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| F | 切换大地图模式 |
| ←↑↓→ | 移动视口 |
| Z | 切换到地图编辑 |
| X | 切换到位置选取 |
| C | 切换到图块属性 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |

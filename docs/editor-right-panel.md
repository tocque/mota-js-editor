# 魔塔编辑器 - 右侧素材面板

## 概述

右侧素材面板（也称图标库、素材区）用于显示和选择游戏中的所有图块素材。包括地形、动画、怪物、道具、NPC、自动元件、额外素材等。支持折叠显示、拖拽追加、最近使用等功能。

## 布局结构

```
┌───────────────────────────────────────┐
│  最近使用 (mid2)                       │
│  ┌─────────────────────────────────┐  │
│  │ [图块] [图块] [图块] [图块]      │  │
│  │ [图块] [图块] ...               │  │
│  └─────────────────────────────────┘  │
├───────────────────────────────────────┤
│  素材库 (right)                        │
│  ┌─────────────────────────────────┐  │
│  │ [空白] [空气墙]                  │  │
│  │ ══════════════════════════════  │  │
│  │ terrains (地形)                  │  │
│  │ [图块] [图块] [图块] ...         │  │
│  │ ══════════════════════════════  │  │
│  │ animates (动画)                  │  │
│  │ [图块] [图块] [图块] ...         │  │
│  │ ══════════════════════════════  │  │
│  │ enemys (怪物 32x32)              │  │
│  │ [怪物] [怪物] [怪物] ...         │  │
│  │ ══════════════════════════════  │  │
│  │ enemy48 (怪物 48x48)             │  │
│  │ ══════════════════════════════  │  │
│  │ items (道具)                     │  │
│  │ ══════════════════════════════  │  │
│  │ npcs (NPC 32x32)                │  │
│  │ ══════════════════════════════  │  │
│  │ npc48 (NPC 48x48)               │  │
│  │ ══════════════════════════════  │  │
│  │ autotile (自动元件)              │  │
│  │ ══════════════════════════════  │  │
│  │ tilesets (额外素材)              │  │
│  └─────────────────────────────────┘  │
│  [展开/折叠按钮]                       │
└───────────────────────────────────────┘
```

## DOM 元素

### 最近使用区域 (mid2)

```javascript
editor.dom.mid2 = document.getElementById('mid2');
editor.dom.lastUsedTitle = document.getElementById('lastUsedTitle');
editor.dom.lastUsedDiv = document.getElementById('lastUsedDiv');
editor.dom.lastUsed = document.getElementById('lastUsed');
editor.dom.lastUsedCtx = document.getElementById('lastUsed').getContext('2d');
editor.dom.clearLastUsedBtn = document.getElementById('clearLastUsedBtn');
```

### 素材库区域 (right)

```javascript
editor.dom.iconLib = document.getElementById('iconLib');
editor.dom.iconImages = document.getElementById('iconImages');
editor.dom.dataSelection = document.getElementById('dataSelection');
editor.dom.iconExpandBtn = document.getElementById('iconExpandBtn');
```

## 素材分类

### 1. 特殊图块

| 位置 | 图块 | idnum |
|------|------|-------|
| (0, 0) | 空白 | 0 |
| (0, 1) | 空气墙 | 17 |

### 2. terrains (地形)

- 文件: `project/materials/terrains.png`
- 尺寸: 32x32 每图块
- 内容: 墙壁、地面、楼梯、门等基础地形

### 3. animates (动画)

- 文件: `project/materials/animates.png`
- 尺寸: 32x32 每图块，4帧动画
- 内容: 岩浆、水流等动态图块

### 4. enemys (怪物 32x32)

- 文件: `project/materials/enemys.png`
- 尺寸: 32x32 每图块，4方向×4帧
- 内容: 小尺寸怪物行走图

### 5. enemy48 (怪物 48x48)

- 文件: `project/materials/enemy48.png`
- 尺寸: 32x48 每图块，4方向×4帧
- 内容: 大尺寸怪物行走图

### 6. items (道具)

- 文件: `project/materials/items.png`
- 尺寸: 32x32 每图块
- 内容: 宝石、药水、钥匙、装备等

### 7. npcs (NPC 32x32)

- 文件: `project/materials/npcs.png`
- 尺寸: 32x32 每图块，4方向×4帧
- 内容: 小尺寸 NPC 行走图

### 8. npc48 (NPC 48x48)

- 文件: `project/materials/npc48.png`
- 尺寸: 32x48 每图块，4方向×4帧
- 内容: 大尺寸 NPC 行走图

### 9. autotile (自动元件)

- 文件: `project/autotiles/*.png`
- 尺寸: 96x128 每自动元件
- 内容: 自动拼接的墙壁、水流等

### 10. tilesets (额外素材)

- 文件: `project/tilesets/*.png`
- 尺寸: 任意，以 32x32 为单位切割
- 内容: 用户自定义额外素材

## 图块索引系统

### 索引结构

```javascript
editor.ids = [
    {
        id: "greenSlime",       // 唯一标识符
        idnum: 201,             // 数字 ID
        images: "enemys",       // 所属图集
        y: 0,                   // 图集中的行位置 (像素/高度)
        x: 0,                   // 图集中的列位置 (仅 tileset)
        isTile: false,          // 是否是 tileset 素材
    },
    // ...
]

editor.indexs = {
    201: [0, "greenSlime"],    // idnum → [索引, id]
    // ...
}
```

### 宽度索引

```javascript
editor.widthsX = {
    "terrains": ["terrains", 0, 1, 320],  // [名称, 起始列, 结束列, 高度]
    "animates": ["animates", 1, 5, 256],
    "enemys": ["enemys", 5, 9, 640],
    // ...
}
```

## 初始化渲染

### 绘制素材

```javascript
editor.prototype.drawInitData = function (icons) {
    var iconImages = document.getElementById('iconImages');
    
    // 计算总宽度和最大高度
    var sumWidth = 0;
    var maxHeight = 700;
    
    // 遍历各图集
    var imgNames = ["terrains", "animates", "enemys", "enemy48", 
                    "items", "npcs", "npc48", "autotile"];
    
    for (var ii = 0; ii < imgNames.length; ii++) {
        var img = imgNames[ii];
        // 计算位置和尺寸
        // 创建图片元素并添加到容器
        drawImage(images[img], nowx, nowy, img);
        nowx += images[img].width;
    }
    
    // 添加 tilesets
    for (var ii in core.tilesets) {
        drawImage(tilesets[img], nowx, 0);
        nowx += tilesets[img].width;
    }
}
```

### 折叠显示

```javascript
editor.uivalues.folded = true;        // 是否折叠
editor.uivalues.foldPerCol = 50;      // 每列显示数量

// 折叠时，将多列图片压缩为单列显示
// 使用 Canvas 进行裁剪和重组
```

## 选择框

### 选择框元素

```javascript
editor.dom.dataSelection = document.getElementById('dataSelection');
```

### 设置选择框位置

```javascript
editor.prototype.setSelectBoxFromInfo = function (thisevent, scrollTo) {
    var pos = {x: 0, y: 0, images: "terrains"};
    var ysize = 32;
    
    // 计算图块在素材区的位置
    pos.x = editor.widthsX[thisevent.images][1];
    pos.y = thisevent.y;
    
    // 处理折叠显示的位置计算
    if (editor.uivalues.folded) {
        pos.x += Math.floor(pos.y / editor.uivalues.foldPerCol);
        pos.y %= editor.uivalues.foldPerCol;
    }
    
    // 设置选择框位置
    editor.dom.dataSelection.style.left = pos.x * 32 + 'px';
    editor.dom.dataSelection.style.top = pos.y * ysize + 'px';
    
    // 滚动到可见位置
    if (scrollTo) {
        editor.dom.iconLib.scrollLeft = pos.x * 32 - offset;
        editor.dom.iconLib.scrollTop = pos.y * ysize - offset;
    }
}
```

## 最近使用

### 数据结构

```javascript
editor.uivalues.lastUsed = [
    {
        id: "greenSlime",
        images: "enemys",
        y: 0,
        idnum: 201,
        recent: 1701234567890,   // 最近使用时间戳
        frequent: 15,            // 使用频率
        istop: 0,                // 是否置顶
    },
    // ...
]
```

### 显示模式切换

```javascript
editor.uivalues.lastUsedType = 'recent';    // 按最近使用排序
editor.uivalues.lastUsedType = 'frequent';  // 按使用频率排序

editor.prototype.setLastUsedType = function (type) {
    editor.uivalues.lastUsedType = type;
    this.updateLastUsedMap();
}
```

### 更新最近使用

```javascript
editor.prototype.updateLastUsedMap = function () {
    var lastUsed = editor.uivalues.lastUsed.sort(function (a, b) {
        // 置顶优先
        if ((a.istop || 0) != (b.istop || 0)) 
            return (b.istop || 0) - (a.istop || 0);
        // 按选择的排序方式
        return (b[editor.uivalues.lastUsedType] || 0) - 
               (a[editor.uivalues.lastUsedType] || 0);
    });
    
    // 绘制到 lastUsedCtx
    for (var i = 0; i < lastUsed.length; ++i) {
        // 绘制图块
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        // 绘制置顶标记
        if (info.istop) {
            ctx.fillRect(32 * x, 32 * y + 24, 8, 8);
        }
    }
}
```

## 拖拽追加

### 拖拽事件

```javascript
image.ondrop = function (e) {
    e.stopPropagation();
    e.preventDefault();
    
    var files = e.dataTransfer.files;
    if (files.length >= 1) {
        var file = files[0];
        if (file.type == 'image/png') {
            editor.uifunctions.dragImageToAppend(file, cls);
        }
    }
    return false;
}

image.ondragover = function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    return false;
}
```

### 追加流程

```javascript
editor.uifunctions.dragImageToAppend = function (file, cls) {
    // 1. 切换到素材追加面板
    editor.mode.change('appendpic');
    
    // 2. 设置目标分类
    editor.dom.selectAppend.value = cls;
    editor.dom.selectAppend.onchange();
    
    // 3. 读取文件
    var reader = new FileReader();
    reader.onload = function () {
        // 4. 加载到画板
        afterReadFile(reader.result, function() {
            // 5. 如果是非地形，提示快速追加
            if (cls != 'terrains' && confirm('确定快速追加？')) {
                quickAppendConfirm.onclick();
            }
        });
    }
    reader.readAsDataURL(file);
}
```

## 点击选择

### 获取点击位置

```javascript
var eToLoc = function (e) {
    var scrollLeft = document.documentElement.scrollLeft;
    var scrollTop = document.documentElement.scrollTop;
    return {
        x: scrollLeft + e.clientX + iconLib.scrollLeft - iconLib.offsetLeft,
        y: scrollTop + e.clientY + iconLib.scrollTop - iconLib.offsetTop,
    };
}

var locToPos = function (loc) {
    return {
        x: ~~(loc.x / 32),
        y: ~~(loc.y / ysize),  // ysize: 32 或 48
    };
}
```

### 查找图块信息

```javascript
var findInImages = function (loc) {
    // 遍历 widthsX 找到对应的图集
    for (var img in editor.widthsX) {
        var info = editor.widthsX[img];
        if (loc.x >= info[1] && loc.x < info[2]) {
            // 计算图块索引
            // 返回图块信息
        }
    }
}
```

## 展开/折叠

### 折叠按钮

```javascript
editor.dom.iconExpandBtn = document.getElementById('iconExpandBtn');
```

### 切换折叠状态

```javascript
iconExpandBtn.onclick = function () {
    editor.uivalues.folded = !editor.uivalues.folded;
    editor.config.set('folded', editor.uivalues.folded);
    
    // 重新渲染素材区
    // 需要刷新页面生效
    location.reload();
}
```

## 鼠标滚轮缩放

支持 Ctrl+滚轮缩放素材区显示：

```javascript
iconLib.onmousewheel = function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
        // 调整显示比例
    }
}
```

## 右键置顶

支持右键点击图块将其置顶到最近使用区：

```javascript
lastUsed.oncontextmenu = function (e) {
    e.preventDefault();
    // 获取点击的图块
    // 切换置顶状态
    info.istop = info.istop ? 0 : Date.now();
    editor.config.set('lastUsed', editor.uivalues.lastUsed);
    editor.updateLastUsedMap();
}
```

## 相关文件

**HTML**: `public/editor.html`

```html
<div id="mid2">
    <p><span id='lastUsedTitle'></span> <button id='clearLastUsedBtn'>清除</button></p>
    <div id="lastUsedDiv">
        <canvas id='lastUsed'></canvas>
    </div>
</div>
<div id="right">
    <div id="iconLib">
        <div id="iconImages"></div>
        <div id="selectBox">
            <div id='dataSelection'></div>
        </div>
    </div>
    <button id="iconExpandBtn"></button>
</div>
```

**JavaScript**:
- `public/_server/editor.js` - drawInitData(), setSelectBoxFromInfo(), updateLastUsedMap()
- `public/_server/editor_listen.js` - 点击和拖拽事件监听
- `public/_server/editor_materialpanel.js` - 素材追加相关

**CSS**:
- `public/_server/css/editor.css` - 素材区样式
- `public/_server/css/editor_color.css` - 主题颜色

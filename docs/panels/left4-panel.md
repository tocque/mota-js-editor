# Left4 面板 - 楼层属性面板

## 面板标识
- **DOM ID**: `left4`
- **模式名称**: `floor`
- **对应模块**: `editor_mode.js`, `editor_datapanel.js`

## 功能概述

楼层属性面板用于编辑当前楼层的各种属性配置。包括楼层基本信息（ID、标题、尺寸）、楼层事件（首次到达、每次到达）、楼层图层配置（贴图、天气、色调）、楼传配置等。是游戏关卡设计的核心面板之一。

## UI组件结构

### 1. 顶部工具栏

```
楼层属性  [保存] [添加] [删除] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存楼层属性修改
- `[添加]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('add')` 添加新属性项
- `[删除]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('delete')` 删除属性项
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('floor')` 自定义表格显示项

### 2. 属性表格区域

```
┌─────────────┬─────────────────┬─────────────────┐
│    条目      │      注释        │       值        │
├─────────────┼─────────────────┼─────────────────┤
│ floorId     │ 楼层唯一标识符   │ MT1             │
│ title       │ 楼层中文名       │ 主塔 1 层        │
│ name        │ 状态栏名称       │ 1               │
│ canFlyTo    │ 楼传允许飞到     │ true            │
│ canFlyFrom  │ 楼传允许飞离     │ true            │
│ canUseQuick │ 能否快捷使用     │ true            │
│ cannotViewMap│ 禁止查看地图    │ false           │
│ width       │ 地图宽度         │ 13              │
│ height      │ 地图高度         │ 13              │
│ defaultGround│ 默认地面        │ ground          │
│ images      │ 楼层贴图         │ [...]           │
│ color       │ 楼层色调         │ null            │
│ weather     │ 天气效果         │ null            │
│ bgm         │ 背景音乐         │ bgm.mp3         │
│ firstArrive │ 首次到达事件     │ [...]           │
│ eachArrive  │ 每次到达事件     │ [...]           │
│ parallelDo  │ 并行事件         │ null            │
│ upFloor     │ 上楼点           │ [6, 11]         │
│ downFloor   │ 下楼点           │ [6, 1]          │
│ flyPoint    │ 楼传落点         │ null            │
│ ratio       │ 宝石比例倍数     │ 1               │
│ underGround │ 是否地下层       │ false           │
└─────────────┴─────────────────┴─────────────────┘
```

**组件**:
- `#table_4a3b1b09_b2fb_4bdf_b9ab_9f4cdac14c74`: 动态生成的属性表格
- 每行包含：属性名、注释说明、可编辑的值

### 3. 修改楼层ID区域 (`#changeFloorId`)

```
[修改floorId为: ________] [确定]
```

**组件**:
- 输入框: 输入新的楼层ID
- `[确定]` 按钮: 确认修改楼层ID

### 4. 修改地图大小区域 (`#changeFloorSize`)

```
修改地图大小：宽[__]，高[__]，偏移x[__] y[__] [确定]
```

**组件**:
- 宽度输入框: 新的地图宽度
- 高度输入框: 新的地图高度
- 偏移x输入框: X轴偏移量
- 偏移y输入框: Y轴偏移量
- `[确定]` 按钮: 确认修改地图大小

## 核心功能

### 1. 基本属性编辑

**楼层标识属性**:
```javascript
{
  "floorId": "MT1",          // 楼层唯一标识符
  "title": "主塔 1 层",       // 地图中文名，显示在右上角
  "name": "1",               // 状态栏显示的楼层名
}
```

**楼层尺寸属性**:
```javascript
{
  "width": 13,               // 地图宽度（格子数）
  "height": 13,              // 地图高度（格子数）
}
```

### 2. 楼传相关属性

```javascript
{
  "canFlyTo": true,          // 能否被楼传飞到
  "canFlyFrom": true,        // 能否从此楼层使用楼传
  "canUseQuickShop": true,   // 能否使用快捷商店
  "cannotViewMap": false,    // 是否禁止查看本层地图
  "upFloor": [6, 11],        // 上楼点坐标 [x, y]
  "downFloor": [6, 1],       // 下楼点坐标 [x, y]
  "flyPoint": null,          // 楼传落点，null表示使用上/下楼点
}
```

### 3. 视觉效果属性

**默认地面**:
```javascript
{
  "defaultGround": "ground", // 默认地面图块ID
}
```

**楼层贴图**:
```javascript
{
  "images": [
    {
      "name": "bg.jpg",      // 图片名称
      "canvas": "bg",        // 目标画布 (bg/fg/fg2)
      "x": 0, "y": 0,        // 位置坐标
      "w": 416, "h": 416,    // 显示尺寸
      "sx": 0, "sy": 0,      // 源图起始位置
      "sw": 416, "sh": 416,  // 源图尺寸
      "frame": 1,            // 帧数
      "reverse": "",         // 翻转方式
    }
  ]
}
```

**楼层色调**:
```javascript
{
  "color": [0, 0, 0, 0.3],   // RGBA色调 [R, G, B, A]
}
```

**天气效果**:
```javascript
{
  "weather": ["rain", 5],    // [天气类型, 强度]
  // 类型: rain/snow/fog/sun
}
```

**背景音乐**:
```javascript
{
  "bgm": "bgm.mp3",          // 背景音乐文件名
}
```

### 4. 楼层事件

**首次到达事件** (`firstArrive`):
```javascript
{
  "firstArrive": [
    {"type": "text", "text": "欢迎来到主塔第一层！"}
  ]
}
```
- 仅在第一次进入此楼层时触发
- 使用 Blockly 可视化编辑

**每次到达事件** (`eachArrive`):
```javascript
{
  "eachArrive": [
    {"type": "playSound", "name": "floor.mp3"}
  ]
}
```
- 每次进入此楼层都会触发

**并行事件** (`parallelDo`):
```javascript
{
  "parallelDo": "function () { /* 并行执行的代码 */ }"
}
```
- 与游戏同时执行的脚本
- 用于实时更新UI或检测条件

### 5. 其他属性

```javascript
{
  "ratio": 1,                // 宝石比例倍数（影响宝石效果）
  "underGround": false,      // 是否地下层（影响楼传显示顺序）
}
```

### 6. 修改楼层ID

**功能**: `editor.uifunctions.changeFloorId_func()`

**流程**:
1. 输入新的楼层ID
2. 验证ID合法性（字母、数字、下划线，不能以数字开头）
3. 检查是否与已有楼层ID重复
4. 保存新的楼层文件
5. 更新 `main.floorIds` 数组
6. 刷新编辑器

**注意**: 原楼层文件不会自动删除，需手动删除

**实现位置**: `editor_datapanel.js` 第543-578行

### 7. 修改地图大小

**功能**: `editor.uifunctions.changeFloorSize_func()`

**参数**:
- 宽度 (width): 新的地图宽度，最大128
- 高度 (height): 新的地图高度，最大128
- 偏移x (x): 原地图在新地图中的X偏移
- 偏移y (y): 原地图在新地图中的Y偏移

**处理内容**:
1. 调整 map, bgmap, fgmap 三层地图数据
2. 更新所有坐标相关的事件数据:
   - events, beforeBattle, afterBattle
   - afterGetItem, afterOpenDoor
   - changeFloor, autoEvent, cannotMove
3. 更新上楼点、下楼点坐标

**实现位置**: `editor_datapanel.js` 第580-650行

## 数据流

```
切换到楼层属性面板
       ↓
editor_mode.floor()
       ↓
editor.file.editFloor([])
       ↓
读取 editor.currentFloorData
       ↓
生成属性表格 HTML
       ↓
用户编辑字段值
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('floor', actionList)
       ↓
editor.file.editFloor(actionList)
       ↓
写入 project/floors/{floorId}.js
       ↓
刷新画布显示
```

## 相关文件

**HTML**: `public/editor.html` (第161-186行)

**JavaScript**:
- `public/_server/editor_mode.js` - floor() 方法 (第288-299行)
- `public/_server/editor_datapanel.js` - 楼层属性相关函数 (第537-650行)
- `public/_server/editor_file.js` - editFloor(), saveFloor()
- `public/_server/table/comment.js` - 表格字段配置

**数据文件**:
- `project/floors/*.js` - 各楼层文件
- `project/data.js` - 包含 main.floorIds 楼层顺序

## 楼层文件结构

每个楼层文件 (`project/floors/{floorId}.js`) 的完整结构：

```javascript
main.floors.MT1 = {
  // 基本属性
  "floorId": "MT1",
  "title": "主塔 1 层",
  "name": "1",
  "width": 13,
  "height": 13,
  
  // 楼传相关
  "canFlyTo": true,
  "canFlyFrom": true,
  "canUseQuickShop": true,
  "cannotViewMap": false,
  "upFloor": [6, 11],
  "downFloor": [6, 1],
  "flyPoint": null,
  
  // 视觉效果
  "defaultGround": "ground",
  "images": [],
  "color": null,
  "weather": null,
  "bgm": null,
  
  // 楼层事件
  "firstArrive": [],
  "eachArrive": [],
  "parallelDo": null,
  
  // 其他属性
  "ratio": 1,
  "underGround": false,
  
  // 地图数据
  "map": [[...], [...], ...],     // 事件层
  "bgmap": [[...], [...], ...],   // 背景层
  "fgmap": [[...], [...], ...],   // 前景层
  
  // 位置事件
  "events": {},
  "changeFloor": {},
  "autoEvent": {},
  "beforeBattle": {},
  "afterBattle": {},
  "afterGetItem": {},
  "afterOpenDoor": {},
  "cannotMove": {},
}
```

## 使用场景

1. **设置楼层名称**: 修改 title 和 name 显示不同的楼层信息
2. **配置楼传**: 设置 canFlyTo、upFloor、downFloor 控制楼传行为
3. **添加视觉效果**: 设置 color 色调、weather 天气、images 贴图
4. **编辑楼层剧情**: 通过 firstArrive 设置首次到达的剧情对话
5. **扩展地图**: 使用修改地图大小功能扩展或缩小地图

## 注意事项

1. **floorId规范**: 只能使用字母、数字、下划线，不能以数字开头
2. **尺寸限制**: 宽高最大128，且修改大小会影响所有坐标事件
3. **偏移量说明**: 扩大地图用正偏移，缩小地图用负偏移
4. **事件迁移**: 修改大小时会自动迁移事件坐标，但可能需要手动检查
5. **文件残留**: 修改floorId后原文件不会删除，需手动清理
6. **音乐格式**: bgm需要是已加载的音乐文件名

## 天气类型说明

| 类型 | 说明 | 强度范围 |
|------|------|----------|
| rain | 下雨效果 | 1-10 |
| snow | 下雪效果 | 1-10 |
| fog | 雾气效果 | 1-10 |
| sun | 阳光效果 | 1-3 |
| cloud | 云层效果 | 1-10 |

## 画布层次说明

| 画布名 | 说明 | 用途 |
|--------|------|------|
| bg | 背景画布 | 地面、背景图 |
| event | 事件画布 | 怪物、NPC、道具 |
| fg | 前景画布 | 遮挡物、前景图 |
| fg2 | 前景2画布 | 额外前景层 |

## 快捷操作

- 双击 firstArrive/eachArrive → 打开 Blockly 事件编辑器
- 双击 images → 打开贴图配置编辑器
- 修改 defaultGround → 立即更新地图显示
- 切换楼层 → 自动加载该楼层属性

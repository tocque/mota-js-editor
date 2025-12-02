# Left2 面板 - 位置选取面板

## 面板标识
- **DOM ID**: `left2`
- **模式名称**: `loc`
- **对应模块**: `editor_datapanel.js` (地图选点部分)

## 功能概述

位置选取面板用于编辑地图上特定位置的事件和属性。通过在画布上点击选择位置后，可以在此面板配置该位置的自动事件（autoEvent）、楼传事件、触发器等。支持动态添加事件页，保存修改，以及配置表格自定义。

## UI组件结构

### 1. 顶部工具栏

```
地图选点  [保存] [添加自动事件页] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存当前位置的事件修改
- `[添加自动事件页]` 按钮: 调用 `editor.uifunctions.addAutoEvent()` 添加新的autoEvent页
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('loc')` 自定义表格显示项

### 2. 位置显示

```
当前位置: x, y
```

**组件**:
- `#pos_a6771a78_a099_417c_828f_0a24851ebfce`: 显示当前选中的地图坐标（如 "5,7"）

### 3. 属性表格

```
┌─────────┬─────────┬─────────────┐
│  条目    │  注释    │     值      │
├─────────┼─────────┼─────────────┤
│ event   │ 事件代码 │ {...}       │
│ changeFloor│楼传   │ {...}       │
│ autoEvent│自动事件 │ {...}       │
└─────────┴─────────┴─────────────┘
```

**组件**:
- `#table_3d846fc4_7644_44d1_aa04_433d266a73df`: 动态生成的属性表格
- 每行包含：条目名、注释说明、值（可编辑）

## 核心功能

### 1. 选择地图位置

**操作方式**:
1. 切换到位置选取面板（或其他面板时）
2. 在中央画布上点击任意位置
3. 面板自动更新显示该位置的属性

**数据绑定**:
```javascript
editor.pos = { x: ..., y: ... }
editor_mode.pos = { x: ..., y: ... }
```

### 2. 查看位置事件

**显示内容**:
- **event**: 该位置的单次触发事件（点击后触发）
- **changeFloor**: 楼层传送配置
  - `floorId`: 目标楼层ID
  - `loc`: 目标位置 `[x, y]`
  - `direction`: 勇士朝向
  - `time`: 传送动画时间
- **autoEvent**: 自动触发事件（进入该位置自动触发）
  - 可有多个事件页（编号1、2、3...）
  - 每页包含 `condition`（触发条件）和事件内容

**数据来源**:
```javascript
core.status.maps[floorId][x + ',' + y]
// 或
editor.main.floors[floorId].map[y][x]
```

### 3. 编辑位置属性

**编辑方式**:
- **Blockly事件**: 点击 `event` 或 `autoEvent` 的值，进入Blockly可视化编辑（跳转到left6面板）
- **代码编辑**: 点击代码类型的值，进入CodeMirror编辑（跳转到left7面板）
- **表格输入**: 直接在表格中输入简单值（如楼层ID、坐标等）

**实时修改记录**:
```javascript
editor_mode.addAction(['change', "['event']", newValue])
editor_mode.addAction(['add', "['autoEvent']['2']", eventData])
```

### 4. 添加自动事件页

**功能**: `editor.uifunctions.addAutoEvent()`

**逻辑**:
1. 检测当前位置已有的autoEvent编号（1, 2, 3...）
2. 找到下一个可用编号
3. 添加空白事件页
4. 自动保存

**应用场景**:
- 同一位置需要多个条件触发不同事件
- 例如：`autoEvent.1` 在flag:xxx=true时触发，`autoEvent.2` 在flag:yyy>10时触发

### 5. 保存修改

**触发**: 点击 `[保存]` 按钮

**流程**:
```
收集 editor_mode.actionList
       ↓
editor.file.editLoc(x, y, actionList)
       ↓
修改 project/floors/{floorId}.js
       ↓
更新 core.status.maps
       ↓
刷新画布显示
```

### 6. 配置表格

**功能**: `editor_multi.editCommentJs('loc')`

**作用**:
- 自定义表格显示哪些字段
- 修改字段注释文本
- 调整显示顺序

**配置文件**: `public/_server/table/data.comment.js`

## 数据流

```
点击画布位置
       ↓
editor.pos = { x, y }
       ↓
editor_mode.loc() - 切换到loc模式
       ↓
读取 floors[floorId].map[y][x] 或 changeFloor、autoEvent
       ↓
填充表格 (#table_3d846fc4...)
       ↓
用户编辑字段值
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor.file.editLoc() → 写入楼层文件
       ↓
core 数据同步更新
       ↓
画布重绘事件层
```

## 相关文件

**HTML**: `public/editor.html` (第119行左右，left2 div部分)

**JavaScript**:
- `public/_server/editor_datapanel.js` - 位置选取逻辑 (第237-248行: addAutoEvent)
- `public/_server/editor_mode.js` - 模式切换和loc()方法
- `public/_server/editor_file.js` - editLoc() 保存函数
- `public/_server/table/data.comment.js` - 表格字段配置

**数据文件**:
- `project/floors/{floorId}.js` - 存储该楼层所有位置的事件数据
  - `map[y][x]`: 位置上的图块信息
  - `changeFloor`: 楼传配置
  - `autoEvent`: 自动事件配置

## 使用场景

1. **配置楼梯传送**: 点击楼梯位置 → 编辑 changeFloor → 设置目标楼层和坐标
2. **添加触发事件**: 点击任意位置 → 编辑 event → 用Blockly配置对话、战斗等
3. **设置自动事件**: 点击位置 → 添加autoEvent → 配置条件和事件内容
4. **多条件触发**: 同一位置添加多个autoEvent页，根据不同条件触发不同剧情

## 常见事件类型

### changeFloor (楼层传送)
```javascript
{
  "floorId": "MT2",    // 目标楼层
  "loc": [7, 7],       // 目标位置
  "direction": "up",   // 勇士朝向
  "time": 500          // 传送动画时间
}
```

### event (单次触发事件)
```javascript
{
  "trigger": "action",  // 触发方式
  "enable": true,       // 是否启用
  "data": [...]         // Blockly事件数组
}
```

### autoEvent (自动触发事件)
```javascript
{
  "1": {                      // 事件页编号
    "condition": "flag:xxx",  // 触发条件
    "data": [...]             // Blockly事件数组
  },
  "2": { ... }               // 第二个事件页
}
```

## 注意事项

1. **坐标显示**: 左上角为 (0,0)，向右x增加，向下y增加
2. **事件优先级**: autoEvent > changeFloor > event
3. **条件语法**: autoEvent的condition支持flag表达式、switch判断等
4. **保存时机**: 每次修改后务必点击保存，否则切换面板会丢失修改
5. **事件页编号**: autoEvent编号从1开始（不是0）
6. **空事件清理**: 设置为null或空对象会在保存时清除该事件

## 快捷操作

- 双击画布位置：快速进入编辑模式
- Blockly事件编辑：点击event值 → 自动跳转left6面板
- 批量添加楼梯：使用配置表格功能快速配置多个楼传点

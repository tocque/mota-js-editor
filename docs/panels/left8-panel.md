# Left8 面板 - 脚本编辑面板

## 面板标识
- **DOM ID**: `left8`
- **模式名称**: `functions`
- **对应模块**: `editor_mode.js`, `editor_file.js`

## 功能概述

脚本编辑面板用于编辑游戏的各种自定义脚本函数。这些函数定义了游戏的核心逻辑，包括怪物战斗计算、伤害判定、技能效果、事件处理等。是游戏深度自定义的核心面板。

## UI组件结构

### 1. 顶部工具栏

```
脚本编辑  [保存] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存脚本修改
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('functions')` 自定义表格显示项

### 2. 属性表格区域

```
┌─────────────────┬───────────────────────┬─────────────────┐
│      条目        │         注释          │       值        │
├─────────────────┼───────────────────────┼─────────────────┤
│ events          │ 事件相关              │ {...}           │
│ ├─ resetGame    │ 重置游戏             │ function () ... │
│ ├─ afterBattle  │ 战后处理             │ function () ... │
│ ├─ afterOpenDoor│ 开门后处理           │ function () ... │
│ ├─ afterGetItem │ 获取道具后           │ function () ... │
│ └─ ...          │                      │                 │
│ enemys          │ 怪物相关              │ {...}           │
│ ├─ getSpecials  │ 获取怪物特殊属性      │ function () ... │
│ ├─ getEnemyInfo │ 获取战斗信息         │ function () ... │
│ ├─ getDamage    │ 计算伤害             │ function () ... │
│ ├─ getDefDamage │ 计算防御临界         │ function () ... │
│ └─ ...          │                      │                 │
│ actions         │ 动作相关              │ {...}           │
│ ├─ onKeyUp      │ 按键抬起处理         │ function () ... │
│ ├─ onKeyDown    │ 按键按下处理         │ function () ... │
│ ├─ onStatusBar  │ 状态栏点击           │ function () ... │
│ └─ ...          │                      │                 │
│ control         │ 控制相关              │ {...}           │
│ ├─ saveData     │ 保存数据处理         │ function () ... │
│ ├─ loadData     │ 读取数据处理         │ function () ... │
│ └─ ...          │                      │                 │
│ ui              │ UI相关               │ {...}           │
│ ├─ drawStatusBar│ 绘制状态栏           │ function () ... │
│ ├─ drawTip      │ 绘制提示             │ function () ... │
│ └─ ...          │                      │                 │
└─────────────────┴───────────────────────┴─────────────────┘
```

**组件**:
- `#table_e260a2be_5690_476a_b04e_dacddede78b3`: 动态生成的函数表格
- 支持层级展开的树形结构

## 核心函数分类

### 1. events - 事件处理函数

| 函数名 | 说明 | 参数 |
|--------|------|------|
| resetGame | 重置游戏数据 | hero, hard, floorId |
| win | 游戏胜利 | reason, no,回放 |
| lose | 游戏失败 | reason |
| changingFloor | 切换楼层时 | floorId, heroLoc |
| afterChangeFloor | 切换楼层后 | floorId |
| flyTo | 使用楼传 | floorId, callback |
| beforeBattle | 战斗前处理 | enemyId, x, y |
| afterBattle | 战斗后处理 | enemyId, x, y |
| afterOpenDoor | 开门后处理 | doorId, x, y |
| afterGetItem | 获取道具后 | itemId, x, y, isGentleClick |
| afterPushBox | 推箱子后 | |

### 2. enemys - 怪物相关函数

| 函数名 | 说明 | 参数 |
|--------|------|------|
| getSpecials | 获取特殊属性列表 | |
| getEnemyInfo | 获取战斗详情 | enemy, hero, x, y, floorId |
| getDamage | 计算伤害值 | enemy, hero, x, y, floorId |
| getCritical | 计算临界 | enemy, hero, x, y, floorId |
| getCriticalDamage | 计算临界伤害 | enemy, hero, x, y, floorId |
| getDefDamage | 计算防御临界 | enemy, hero, x, y, floorId |
| nextCriticals | 计算下N个临界 | enemy, number, hero, x, y, floorId |
| getExtraDamage | 额外领域伤害 | enemy, hero, x, y, floorId |

### 3. actions - 用户操作函数

| 函数名 | 说明 | 参数 |
|--------|------|------|
| onKeyUp | 按键抬起 | keyCode, altKey, fromReplay |
| onKeyDown | 按键按下 | keyCode, altKey, fromReplay |
| onStatusBarClick | 状态栏点击 | px, py, vertical |
| onmousewheel | 鼠标滚轮 | direct, x, y, px, py |
| keyDownAction | 按住键处理 | keyCode |
| longPressAction | 长按处理 | x, y, px, py |

### 4. control - 控制函数

| 函数名 | 说明 | 参数 |
|--------|------|------|
| saveData | 保存数据处理 | data |
| loadData | 读取数据处理 | data |
| getStatusLabel | 状态栏显示 | name |
| triggerDebuff | 触发负面状态 | type, amount |
| moveOneStep | 移动一步 | callback |
| moveDirectly | 瞬间移动 | destX, destY |
| parallelDo | 并行处理 | timestamp |
| checkAutoEvents | 检查自动事件 | x, y, callback |
| getVisitedFloors | 获取已访问楼层 | |
| replay | 回放 | action |

### 5. ui - 界面绘制函数

| 函数名 | 说明 | 参数 |
|--------|------|------|
| getToolboxItems | 工具栏项目 | |
| drawStatusBar | 绘制状态栏 | |
| drawStatistics | 绘制统计页 | |
| drawAbout | 绘制关于页 | |
| drawHelp | 绘制帮助页 | |
| drawTip | 绘制提示 | text, id |
| drawText | 绘制文本框 | |
| drawBook | 绘制怪物手册 | index |
| drawFly | 绘制楼传 | |
| drawSettings | 绘制设置 | |
| drawQuickShop | 绘制快捷商店 | |
| drawCursor | 绘制光标 | |
| drawKeyBoard | 绘制键盘 | |
| drawSLPanel | 绘制存读档 | |
| drawConfirmBox | 绘制确认框 | |
| drawWaiting | 绘制等待界面 | |

## 数据流

```
切换到脚本编辑面板
       ↓
editor_mode.functions()
       ↓
editor.file.editFunctions([])
       ↓
读取 functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a
       ↓
生成函数表格 HTML
       ↓
双击函数值
       ↓
打开 left7 代码编辑器
       ↓
用户编辑函数代码
       ↓
确认保存
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('functions', actionList)
       ↓
editor.file.editFunctions(actionList)
       ↓
写入 project/functions.js
```

## 相关文件

**HTML**: `public/editor.html` (第258-274行)

**JavaScript**:
- `public/_server/editor_mode.js` - functions() 方法 (第314-325行)
- `public/_server/editor_file.js` - editFunctions()
- `public/_server/table/functions.comment.js` - 表格字段配置

**数据文件**:
- `project/functions.js` - 脚本函数定义文件
  - `functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a` 函数对象

## functions.js 文件结构

```javascript
var functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a = {
  "events": {
    "resetGame": function (hero, hard, floorId) {
      // 游戏重置逻辑
    },
    "win": function (reason, noAnimate, noUpload) {
      // 游戏胜利逻辑
    },
    // ...
  },
  "enemys": {
    "getSpecials": function () {
      return [
        [1, "先攻", "怪物首先攻击"],
        [2, "魔攻", "无视勇士防御"],
        // ...
      ];
    },
    "getDamage": function (enemy, hero, x, y, floorId) {
      // 伤害计算逻辑
    },
    // ...
  },
  "actions": { ... },
  "control": { ... },
  "ui": { ... }
}
```

## 使用场景

1. **自定义伤害计算**: 修改 `enemys.getDamage` 改变战斗公式
2. **添加怪物特殊属性**: 修改 `enemys.getSpecials` 添加新特殊属性
3. **自定义状态栏**: 修改 `ui.drawStatusBar` 自定义状态栏显示
4. **自定义操作逻辑**: 修改 `actions.onKeyUp` 添加快捷键功能
5. **自定义存档处理**: 修改 `control.saveData/loadData` 添加自定义存档数据
6. **自定义怪物手册**: 修改 `ui.drawBook` 自定义手册显示样式

## 常见自定义示例

### 添加新的怪物特殊属性

在 `enemys.getSpecials` 中添加：
```javascript
[25, "新属性", function(enemy) { return "新属性描述"; }]
```

### 自定义伤害计算

修改 `enemys.getDamage`：
```javascript
// 添加额外伤害逻辑
var damage = ...; // 原有计算
if (core.hasFlag('extraDamage')) {
  damage += 100;
}
return damage;
```

### 添加自定义快捷键

修改 `actions.onKeyUp`：
```javascript
if (keyCode == 72) { // H键
  core.ui.drawHelp();
  return true;
}
```

### 自定义存档数据

修改 `control.saveData`：
```javascript
data.myCustomData = core.getFlag('myCustomData');
```

修改 `control.loadData`：
```javascript
core.setFlag('myCustomData', data.myCustomData);
```

## 注意事项

1. **函数签名**: 修改函数时保持参数签名一致
2. **返回值**: 注意函数的返回值要求
3. **核心逻辑**: 修改核心函数需谨慎，可能影响游戏平衡
4. **调试**: 可在函数中使用 `console.log` 调试
5. **备份**: 修改复杂函数前建议备份
6. **刷新生效**: 保存后需要刷新才能生效

## 调试技巧

1. **控制台日志**: 在函数中添加 `console.log()` 输出调试信息
2. **断点调试**: 使用浏览器开发者工具设置断点
3. **测试运行**: 保存后在游戏中测试功能
4. **错误追踪**: 查看控制台错误信息定位问题

## 函数文档

每个函数都有对应的注释说明，可以在配置表格中查看：

```javascript
// functions.comment.js
{
  "_leaf": true,
  "_type": "function",
  "_data": "计算怪物伤害。可以在这里对伤害值进行修正，比如毒衰咒等。"
}
```

## 与插件的关系

脚本函数和插件的区别：
- **脚本函数**: 覆盖核心函数的默认实现
- **插件**: 在核心函数基础上扩展新功能

建议：
- 简单修改使用脚本函数
- 复杂功能使用插件系统

## API 调用

在脚本函数中可以调用所有 core API：
- `core.status.xxx` - 游戏状态
- `core.flags.xxx` - 系统开关
- `core.getFlag()` / `core.setFlag()` - 变量操作
- `core.insertAction()` - 插入事件
- `core.drawXxx()` - 绘制函数
- 等等...

## 性能注意

某些函数会被频繁调用：
- `enemys.getDamage` - 计算伤害，手册中大量调用
- `ui.drawStatusBar` - 状态栏更新
- `control.parallelDo` - 并行处理

这些函数应注意性能优化，避免复杂计算。

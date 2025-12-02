# Left10 面板 - 插件编写面板

## 面板标识
- **DOM ID**: `left10`
- **模式名称**: `plugins`
- **对应模块**: `editor_mode.js`, `editor_file.js`

## 功能概述

插件编写面板用于管理和编辑游戏插件。插件是游戏功能扩展的主要方式，可以添加新功能、修改现有行为、创建复杂的游戏系统。支持从在线插件库下载和本地编写插件。

## UI组件结构

### 1. 顶部工具栏

```
插件编写  [保存] [添加] [删除] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存插件修改
- `[添加]` 按钮: 调用 `editor.table.addfunc()` 添加新的插件
- `[删除]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('delete')` 删除插件
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('plugins')` 自定义表格显示项

### 2. 属性表格区域

```
┌─────────────────┬───────────────────┬─────────────────┐
│      条目        │       注释        │       值        │
├─────────────────┼───────────────────┼─────────────────┤
│ init            │ 初始化插件        │ function () ... │
│ plugin1         │ 插件1描述         │ function () ... │
│ enemyLevel      │ 怪物等级显示      │ function () ... │
│ drawLight       │ 灯光效果          │ function () ... │
│ ...             │                   │                 │
└─────────────────┴───────────────────┴─────────────────┘
```

**组件**:
- `#table_e2c034ec_47c6_48ae_8db8_4f8f32fea2d6`: 动态生成的插件表格
- 每行包含：插件名称、注释说明、插件代码

## 核心功能

### 1. 查看插件列表

面板显示所有已添加的插件：
- 插件名称（ID）
- 插件注释说明
- 插件代码内容

### 2. 添加新插件

**操作步骤**:
1. 点击 `[添加]` 按钮
2. 输入新插件的名称
3. 确认添加
4. 双击新插件行打开代码编辑器
5. 编写插件代码
6. 保存

**命名规范**:
- 只能使用字母、数字、下划线
- 不能以数字开头
- 建议使用有意义的名称

### 3. 编辑插件代码

**操作方式**:
- 双击插件代码列 → 打开 CodeMirror 代码编辑器
- 支持语法高亮、代码补全、语法检查

**默认模板**:
```javascript
function () {
    // 在此增加新插件
    
}
```

### 4. 删除插件

**操作步骤**:
1. 点击 `[删除]` 按钮
2. 双击要删除的插件行
3. 确认删除

### 5. 在线插件库

通过 Ctrl+P 或编辑器中的链接访问在线插件库：
```
https://h5mota.com/plugins/
```

在线插件库提供：
- 社区贡献的各种插件
- 插件使用说明
- 一键复制安装

## 插件结构

### 基本结构

```javascript
function () {
    // 插件代码
    // this 指向 core.plugin 对象
    
    // 可以在这里：
    // 1. 定义新函数
    // 2. 修改现有函数
    // 3. 注册事件监听
    // 4. 扩展游戏功能
}
```

### 特殊插件: init

`init` 插件在游戏初始化时执行，用于：
- 全局变量初始化
- 系统配置修改
- 早期注入

```javascript
function () {
    console.log("游戏初始化中...");
    // 修改全局配置
    core.xxx = ...;
}
```

## 数据流

```
切换到插件编写面板
       ↓
editor_mode.plugins()
       ↓
editor.file.editPlugins([])
       ↓
读取 plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1
       ↓
生成插件表格 HTML
       ↓
双击插件代码
       ↓
editor_multi.import(id, {lint: true})
       ↓
打开 CodeMirror 编辑器
       ↓
用户编辑插件代码
       ↓
点击确认
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('plugins', actionList)
       ↓
editor.file.editPlugins(actionList)
       ↓
写入 project/plugins.js
```

## 相关文件

**HTML**: `public/editor.html` (第292-308行)

**JavaScript**:
- `public/_server/editor_mode.js` - plugins() 方法 (第340-351行)
- `public/_server/editor_file.js` - editPlugins()
- `public/_server/table/plugins.comment.js` - 表格字段配置

**数据文件**:
- `project/plugins.js` - 插件定义文件
  - `plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1` 插件对象

## plugins.js 文件结构

```javascript
var plugins_bb40132b_638b_4a9f_b028_d3fe47acc8d1 = {
    "init": function () {
        // 初始化插件
        this._initPlugin1();
        this._initPlugin2();
    },
    "plugin1": function () {
        // 插件1代码
    },
    "plugin2": function () {
        // 插件2代码
    }
}
```

## 插件编写示例

### 1. 添加新功能

```javascript
function () {
    // 添加一个自定义函数
    this.myCustomFunction = function (param) {
        // 功能代码
        return result;
    };
}
```

调用方式：
```javascript
core.plugin.myCustomFunction(param);
```

### 2. 覆盖现有函数

```javascript
function () {
    // 保存原函数
    var _old_drawTip = core.ui.drawTip;
    
    // 覆盖函数
    core.ui.drawTip = function (text, id) {
        // 自定义逻辑
        console.log("显示提示:", text);
        
        // 调用原函数
        _old_drawTip.call(core.ui, text, id);
    };
}
```

### 3. 怪物等级显示插件

```javascript
function () {
    // 在怪物名称前显示等级
    var _old_getEnemyName = core.enemys.getEnemyName;
    
    core.enemys.getEnemyName = function (enemy) {
        var name = _old_getEnemyName.call(this, enemy);
        var level = enemy.level || 1;
        return "Lv." + level + " " + name;
    };
}
```

### 4. 灯光效果插件

```javascript
function () {
    // 绘制灯光效果
    this.drawLight = function (ctx, x, y, radius) {
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,200,0.3)');
        gradient.addColorStop(1, 'rgba(255,255,200,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };
    
    // 在地图绘制后调用
    var _old_drawMap = core.maps.drawMap;
    core.maps.drawMap = function (floorId) {
        _old_drawMap.call(this, floorId);
        // 绘制灯光
        var hero = core.status.hero;
        core.plugin.drawLight(core.canvas.fg, 
            hero.loc.x * 32 + 16, 
            hero.loc.y * 32 + 16, 
            64);
    };
}
```

### 5. 快捷键扩展插件

```javascript
function () {
    // 添加新的快捷键
    var _old_onKeyUp = core.actions.onKeyUp;
    
    core.actions.onKeyUp = function (keyCode, altKey, fromReplay) {
        // 按下 M 键显示小地图
        if (keyCode == 77 && !core.status.lockControl) {
            core.ui.drawMinimap();
            return true;
        }
        
        return _old_onKeyUp.call(this, keyCode, altKey, fromReplay);
    };
}
```

### 6. 自定义状态栏插件

```javascript
function () {
    // 在状态栏显示自定义内容
    var _old_drawStatusBar = core.ui.drawStatusBar;
    
    core.ui.drawStatusBar = function () {
        _old_drawStatusBar.call(this);
        
        // 绘制额外内容
        var ctx = core.canvas.data;
        ctx.fillStyle = '#FFD700';
        ctx.fillText("自定义", 10, 420);
    };
}
```

## 插件执行顺序

1. `init` 插件首先执行
2. 其他插件按字母顺序执行
3. 所有插件执行完毕后，游戏开始加载

## 与脚本编辑的区别

| 特性 | 脚本编辑 | 插件编写 |
|------|----------|----------|
| 位置 | 覆盖核心函数 | 扩展或包装函数 |
| 原函数 | 完全替换 | 可以调用 |
| 适用性 | 修改核心逻辑 | 添加新功能 |
| 冲突风险 | 较高 | 较低 |

## 注意事项

1. **函数保存**: 覆盖函数前先保存原函数
2. **this 指向**: 插件中 `this` 指向 `core.plugin`
3. **执行时机**: 插件在游戏加载后执行
4. **调试模式**: 可使用 `console.log` 调试
5. **刷新生效**: 保存后需要刷新才能生效
6. **冲突处理**: 注意不同插件间的冲突

## 调试技巧

1. **控制台输出**: 添加 `console.log` 输出调试信息
2. **断点调试**: 在浏览器开发者工具中设置断点
3. **分步测试**: 先测试小功能再组合
4. **错误捕获**: 使用 try-catch 捕获错误

## 常用 API

### 获取游戏状态
```javascript
core.status.hero        // 勇士状态
core.status.floorId     // 当前楼层
core.status.maps        // 地图数据
core.status.thisMap     // 当前地图
```

### 操作变量
```javascript
core.getFlag('xxx')     // 获取变量
core.setFlag('xxx', v)  // 设置变量
core.hasFlag('xxx')     // 检查变量
```

### 绘制相关
```javascript
core.canvas.xxx         // 各种画布
core.drawXxx()          // 绘制函数
```

### 事件操作
```javascript
core.insertAction([])   // 插入事件
core.events.xxx         // 事件系统
```

## 在线插件列表

访问 https://h5mota.com/plugins/ 获取社区插件：
- 音乐播放器
- 存档压缩
- 成就系统
- 游戏加速
- 怪物图鉴
- 等等...

## 最佳实践

1. **模块化**: 将大插件拆分为多个小插件
2. **文档注释**: 在代码开头添加功能说明
3. **版本管理**: 记录插件版本和更新历史
4. **兼容性**: 考虑与其他插件的兼容性
5. **性能优化**: 避免在频繁调用的函数中进行复杂操作

# Left9 面板 - 公共事件面板

## 面板标识
- **DOM ID**: `left9`
- **模式名称**: `commonevent`
- **对应模块**: `editor_mode.js`, `editor_file.js`

## 功能概述

公共事件面板用于管理游戏中的公共事件（Common Events）。公共事件是可以被多次调用的事件模板，避免重复编写相同的事件逻辑。可以在任何事件中通过"触发公共事件"积木调用。适合用于制作技能系统、对话模板、通用剧情等。

## UI组件结构

### 1. 顶部工具栏

```
公共事件  [保存] [添加] [删除] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存公共事件修改
- `[添加]` 按钮: 调用 `editor.table.addfunc()` 添加新的公共事件
- `[删除]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('delete')` 删除公共事件
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('commonevent')` 自定义表格显示项

### 2. 属性表格区域

```
┌─────────────────┬───────────────────┬─────────────────┐
│      条目        │       注释        │       值        │
├─────────────────┼───────────────────┼─────────────────┤
│ event1          │ 公共事件1         │ [...]           │
│ event2          │ 公共事件2         │ [...]           │
│ skill_attack    │ 技能：攻击        │ [...]           │
│ skill_magic     │ 技能：魔法        │ [...]           │
│ dialog_npc1     │ NPC对话模板1      │ [...]           │
│ ...             │                   │                 │
└─────────────────┴───────────────────┴─────────────────┘
```

**组件**:
- `#table_b7bf0124_99fd_4af8_ae2f_0017f04a7c7d`: 动态生成的公共事件表格
- 每行包含：事件名称、注释说明、事件内容

## 核心功能

### 1. 查看公共事件列表

面板显示所有已定义的公共事件，包括：
- 事件名称（ID）
- 事件注释说明
- 事件内容（Blockly 事件数组）

### 2. 添加新公共事件

**操作步骤**:
1. 点击 `[添加]` 按钮
2. 输入新公共事件的名称（ID）
3. 确认添加
4. 双击新事件行打开 Blockly 编辑器
5. 编辑事件内容
6. 保存

**命名规范**:
- 只能使用字母、数字、下划线
- 不能以数字开头
- 建议使用有意义的名称，如 `skill_xxx`、`dialog_xxx`

### 3. 编辑公共事件

**操作方式**:
- 双击事件内容列 → 打开 Blockly 事件编辑器
- 编辑完成后点击确认保存

**Blockly 入口类型**: `commonEvent`

### 4. 删除公共事件

**操作步骤**:
1. 点击 `[删除]` 按钮
2. 双击要删除的事件行
3. 确认删除

**注意**: 删除后需要刷新编辑器才能生效

### 5. 调用公共事件

在 Blockly 中使用"触发公共事件"积木：

```javascript
{
  "type": "insert",
  "name": "event_name",  // 公共事件名称
  "args": []             // 传递的参数
}
```

**积木位置**: 事件控制 → 触发公共事件

### 6. 传递参数

公共事件支持参数传递：

**调用时**:
```javascript
{
  "type": "insert",
  "name": "skill_attack",
  "args": [100, "fire"]  // 传递参数
}
```

**在公共事件中使用**:
- `args[0]` → 第一个参数（100）
- `args[1]` → 第二个参数（"fire"）

通过"获取参数"积木或直接在表达式中使用 `args[n]`。

## 数据流

```
切换到公共事件面板
       ↓
editor_mode.commonevent()
       ↓
editor.file.editCommonEvent([])
       ↓
读取 events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent
       ↓
生成事件表格 HTML
       ↓
双击事件内容
       ↓
editor_blockly.import(id, {type: 'commonEvent'})
       ↓
打开 Blockly 编辑器
       ↓
用户编辑事件
       ↓
点击确认
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('commonevent', actionList)
       ↓
editor.file.editCommonEvent(actionList)
       ↓
写入 project/events.js
```

## 相关文件

**HTML**: `public/editor.html` (第275-291行)

**JavaScript**:
- `public/_server/editor_mode.js` - commonevent() 方法 (第327-338行)
- `public/_server/editor_file.js` - editCommonEvent()
- `public/_server/table/events.comment.js` - 表格字段配置

**数据文件**:
- `project/events.js` - 事件定义文件
  - `events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent` 公共事件对象

## events.js 文件结构

```javascript
var events_c12a15a8_c380_4b28_8144_256cba95f760 = {
  "commonEvent": {
    "event1": [
      {"type": "text", "text": "这是公共事件1"}
    ],
    "skill_attack": [
      {"type": "comment", "text": "技能：攻击"},
      {"type": "if", "condition": "args[0] > 0", "true": [...], "false": [...]}
    ],
    // ...更多公共事件
  }
}
```

## 使用场景

### 1. 技能系统

创建可复用的技能逻辑：

```javascript
// 公共事件: skill_heal
[
  {"type": "comment", "text": "治疗技能"},
  {"type": "if", "condition": "core.status.hero.hp >= core.status.hero.hpmax",
    "true": [{"type": "text", "text": "\\t[系统]生命值已满！"}],
    "false": [
      {"type": "setValue", "name": "status:hp", "operator": "+=", "value": "args[0]"},
      {"type": "playSound", "name": "heal.mp3"},
      {"type": "text", "text": "\\t[系统]恢复了\\r[green]${args[0]}\\r点生命值！"}
    ]
  }
]
```

调用：
```javascript
{"type": "insert", "name": "skill_heal", "args": [100]}
```

### 2. 对话模板

创建NPC对话模板：

```javascript
// 公共事件: dialog_merchant
[
  {"type": "text", "text": "\\t[商人,npc1.png]${args[0]}"},
  {"type": "choices", "choices": [
    {"text": "购买物品", "action": [...]},
    {"text": "离开", "action": []}
  ]}
]
```

### 3. 通用剧情

创建可复用的剧情片段：

```javascript
// 公共事件: cutscene_victory
[
  {"type": "setCurtain", "color": [0,0,0,1], "time": 500},
  {"type": "showImage", "name": "victory.png", "loc": [0,0]},
  {"type": "playSound", "name": "victory.mp3"},
  {"type": "waitAsync"},
  {"type": "sleep", "time": 2000},
  {"type": "hideImage", "name": "victory.png"},
  {"type": "setCurtain", "time": 500}
]
```

### 4. 数值计算

创建复杂的数值计算逻辑：

```javascript
// 公共事件: calc_damage
[
  {"type": "setValue", "name": "flag:temp_damage", "value": "args[0] - args[1]"},
  {"type": "if", "condition": "flag:temp_damage < 0",
    "true": [{"type": "setValue", "name": "flag:temp_damage", "value": "0"}]
  }
]
```

## 与地图事件的区别

| 特性 | 地图事件 | 公共事件 |
|------|----------|----------|
| 位置绑定 | 绑定到地图坐标 | 无位置绑定 |
| 触发方式 | 踩到/交互 | 手动调用 |
| 复用性 | 需复制粘贴 | 可多次调用 |
| 参数传递 | 不支持 | 支持 |
| 适用场景 | 单次事件 | 通用逻辑 |

## 注意事项

1. **命名唯一性**: 公共事件名称不能重复
2. **参数索引**: 参数从 `args[0]` 开始
3. **删除检查**: 删除前确保没有其他事件在调用
4. **循环调用**: 避免公共事件间的循环调用
   - 循环调用会导致无限递归，最终导致浏览器崩溃或栈溢出错误
   - 检测方法：在事件开头添加计数器，如果调用次数超过阈值则退出
   - 示例检测代码：
     ```javascript
     if ((core.getFlag('_callCount') || 0) > 100) {
       core.setFlag('_callCount', 0);
       return; // 防止无限循环
     }
     core.setFlag('_callCount', (core.getFlag('_callCount') || 0) + 1);
     ```
5. **刷新生效**: 添加/删除后需要刷新编辑器

## 调试技巧

1. **添加注释**: 使用注释积木说明事件功能
2. **分步测试**: 先测试单个事件再组合
3. **日志输出**: 使用"控制台输出"积木调试
4. **参数检查**: 在事件开头检查参数有效性

## 最佳实践

1. **命名规范**: 使用前缀区分类型
   - `skill_` - 技能相关
   - `dialog_` - 对话相关
   - `system_` - 系统功能
   - `util_` - 工具函数

2. **文档注释**: 在事件开头添加注释说明参数

3. **参数验证**: 检查必要参数是否传递

4. **错误处理**: 考虑异常情况的处理

5. **模块化**: 将复杂逻辑拆分为多个公共事件

## 与插件配合

插件中可以直接调用公共事件：

```javascript
core.insertCommonEvent("event_name", [arg1, arg2], callback);
```

也可以在插件中注册新的公共事件：

```javascript
core.events.commonEvent["my_event"] = [...];
```

## 在 Blockly 中调用

使用"触发公共事件"积木：

```
┌─────────────────────────────────┐
│ 触发公共事件 [event_name ▼]     │
│ 参数: [                    ]    │
└─────────────────────────────────┘
```

- 下拉框选择已定义的公共事件
- 参数输入框填写传递的参数（JSON数组格式）

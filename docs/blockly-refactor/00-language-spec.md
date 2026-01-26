# Mota Action DSL 语言规范

## 概述

Mota Action 是一种用于定义魔塔游戏事件的领域特定语言 (DSL)。本文档描述该语言的词法、语法和语义规则。

## 1. 语言分层结构

```
┌────────────────────────────────────────────────────────────┐
│                     入口层 (Entry)                          │
│  event_m, autoEvent_m, shop_m, changeFloor_m, common_m...  │
│  定义事件的上下文和元信息                                    │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     语句层 (Statement)                      │
│  _s 后缀: text_0_s, if_s, while_s, setValue_s, show_s...   │
│  可顺序执行，有 prev/next 连接                              │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     表达式层 (Expression)                   │
│  _e 后缀: expression_arithmetic_0, idString_e, bool_e...   │
│  返回值，可嵌套组合                                         │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                     原子层 (Primitive)                      │
│  字段类型: Int, Bool, EvalString, IdString, Colour...      │
│  下拉列表: Floor_List, Arithmetic_List, Id_List...         │
└────────────────────────────────────────────────────────────┘
```

## 2. 词法 (Lexical)

### 2.1 字段类型 (Field Types)

| 类型 | Blockly 类型 | 说明 |
|------|-------------|------|
| `Int` | field_number | 整数 |
| `Number` | field_number | 浮点数 |
| `Bool` | field_checkbox | 布尔值 |
| `EvalString` | field_input | 单行文本/表达式 |
| `EvalString_Multi` | field_multilinetext | 多行文本 |
| `IdString` | field_input | ID 字符串 |
| `IdText` | field_input | 自定义标识符 |
| `PosString` | field_input | 位置字符串 |
| `ColorString` | field_input | 颜色字符串 (r,g,b,a) |
| `FontString` | field_input | 字体字符串 |
| `Colour` | field_colour | 颜色选择器 |

### 2.2 下拉列表 (Dropdown Lists)

| 列表 | 选项示例 |
|------|---------|
| `Floor_List` | 楼层ID, :before, :next, :now |
| `Stair_List` | loc, upFloor, downFloor, :symmetry |
| `Arithmetic_List` | +, -, *, /, %, ===, !==, &&, \|\| |
| `AssignOperator_List` | =, +=, -=, *=, /= |
| `UnaryOperator_List` | Math.floor, Math.ceil, Math.abs |
| `Id_List` | status, item, flag, buff, temp |
| `B_0_List` | null, true, false (通行状态) |

### 2.3 预处理器 (Preprocessors)

字段值在代码生成前需要预处理：

```javascript
// 字符串转义
EvalString_pre: (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

// 多行文本转义
EvalString_Multi_pre: (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

// ID 验证
IdString_pre: (s) => s  // 原样返回

// 布尔值转换
Bool_pre: (b) => b  // true/false

// 整数转换  
Int_pre: (n) => parseInt(n, 10)

// 浮点数转换
Number_pre: (n) => parseFloat(n)
```

## 3. 语法 (Syntax)

### 3.1 入口类型 (Entry Types)

入口块定义事件的上下文，后缀 `_m`：

| 类型 | 用途 | 输出格式 |
|------|------|---------|
| `event_m` | 地图事件 | `{trigger, enable, data:[...]}` 或 `[...]` |
| `autoEvent_m` | 自动事件 | `{condition, priority, data:[...]}` |
| `shop_m` | 全局商店 | 商店配置对象 |
| `level_m` | 等级提升 | 等级数组 |
| `changeFloor_m` | 楼层切换 | 切换配置 |
| `common_m` | 通用事件列表 | `[...]` |
| `item_m` | 道具使用效果 | 事件数组 |
| `beforeBattle_m` | 战斗前事件 | 事件数组 |
| `afterBattle_m` | 战斗后事件 | 事件数组 |

### 3.2 语句类型 (Statement Types)

语句块可顺序连接，后缀 `_s`：

#### 3.2.1 文本显示
```
text_0_s     → "简单文本"
text_1_s     → {"type":"text", "text":"...", "title":"...", ...}
text_2_s     → {"type":"text", ...} (更多选项)
tip_s        → {"type":"tip", "text":"..."}
```

#### 3.2.2 控制流
```
if_s         → {"type":"if", "condition":"...", "true":[...], "false":[...]}
if_1_s       → {"type":"if", "condition":"...", "true":[...]}
switch_s     → {"type":"switch", "condition":"...", "caseList":[...]}
while_s      → {"type":"while", "condition":"...", "data":[...]}
dowhile_s    → {"type":"dowhile", "condition":"...", "data":[...]}
for_s        → {"type":"for", "name":"...", "data":[...]}
forEach_s    → {"type":"forEach", "name":"...", "list":"...", "data":[...]}
break_s      → {"type":"break"}
continue_s   → {"type":"continue"}
exit_s       → {"type":"exit"}
```

#### 3.2.3 数据操作
```
setValue_s   → {"type":"setValue", "name":"...", "operator":"...", "value":"..."}
setEnemy_s   → {"type":"setEnemy", "id":"...", "name":"...", "value":"..."}
setFloor_s   → {"type":"setFloor", "name":"...", "value":"..."}
setGlobalFlag_s → {"type":"setGlobalFlag", "name":"...", "value":"..."}
```

#### 3.2.4 地图操作
```
show_s       → {"type":"show", "loc":[...], ...}
hide_s       → {"type":"hide", "loc":[...], ...}
setBlock_s   → {"type":"setBlock", "number":"...", "loc":[...]}
trigger_s    → {"type":"trigger", "loc":[...]}
```

### 3.3 表达式类型 (Expression Types)

表达式块返回值，后缀 `_e`：

```
expression_arithmetic_0  → expr1 op expr2   (二元运算)
negate_e                 → !expr            (逻辑非)
unaryOperation_e         → func(expr)       (一元函数)
bool_e                   → true | false     (布尔字面量)
idString_e               → "变量路径"       (字符串表达式)
idIdList_e               → status:hp        (预定义变量)
idFlag_e                 → switch:A         (开关变量)
idTemp_e                 → temp:xxx         (临时变量)
evalString_e             → "任意表达式"     (原始表达式)
```

### 3.4 上下文类型 (Context Types)

上下文块是特殊的语句块，只能在特定父块中使用：

```
choicesContext  → 在 choices_s 中使用，定义选项
switchCase      → 在 switch_s 中使用，定义分支
waitContext_*   → 在 wait_s 中使用，定义等待条件
shopChoices     → 在 shop_m 中使用，定义商店选项
```

## 4. 语义 (Semantics)

### 4.1 表达式求值

表达式字符串在运行时由游戏引擎求值：

```javascript
// 变量访问语法
"status:hp"        → core.getStatus('hp')
"status:atk"       → core.getStatus('atk')
"item:yellowKey"   → core.itemCount('yellowKey')
"flag:xxx"         → core.getFlag('xxx')
"temp:xxx"         → core.getTemp('xxx')
"switch:A"         → core.getFlag('A')

// 复合表达式
"status:hp > 100 && flag:boss_defeated"
"item:yellowKey >= 3"
```

### 4.2 类型约束 (Type Checking)

通过 `check` 和 `previousStatement`/`nextStatement` 实现类型约束：

```javascript
// 语句块可接受的后续块类型
"nextStatement": ["text_0_s", "if_s", ...]  // action 数组

// 输入槽可接受的块类型
"check": ["expression"]  // 表达式类型数组

// 上下文块的限制
"previousStatement": "choicesContext"  // 只能接在同类型后面
"nextStatement": "choicesContext"      // 只能接同类型
```

### 4.3 输出简化规则

生成代码时，某些情况会简化输出：

```javascript
// 简单文本：字符串直接作为数组元素
"你好世界"  // 而非 {"type":"text","text":"你好世界"}

// event_m 默认值：如果全是默认配置，简化为数组
[...]  // 而非 {"trigger":null,"enable":true,"data":[...]}

// if_1_s：无 false 分支时省略
{"type":"if","condition":"...","true":[...]}  // 无 "false" 字段

// 可选字段为空时省略
{"type":"text","text":"..."}  // 无 title、icon 等
```

### 4.4 元信息保存

编辑器状态可保存到输出中：

```javascript
// 折叠的块
{"type":"text","text":"...","_collapsed":true}

// 禁用的块
{"type":"if","_disabled":true,...}
```

## 5. 块分类清单

### 5.1 入口块 (约 25 个)

```
event_m, autoEvent_m, shop_m, level_m, changeFloor_m, common_m,
beforeBattle_m, afterBattle_m, afterGetItem_m, afterOpenDoor_m,
firstArrive_m, eachArrive_m, commonEvent_m, item_m, 
levelChoose_m, equip_m, floorImage_m, doorInfo_m, faceIds_m,
mainStyle_m, nameMap_m, splitImages_m, floorPartition_m
```

### 5.2 语句块 (约 90 个)

按功能分类：
- **文本显示** (13): text_0_s, text_1_s, text_2_s, tip_s, confirm_s, choices_s...
- **数据操作** (18): setValue_s, setEnemy_s, setFloor_s, setGlobalFlag_s...
- **地图操作** (16): show_s, hide_s, setBlock_s, trigger_s, move_s...
- **控制流** (12): if_s, switch_s, while_s, for_s, break_s, exit_s...
- **特效表现** (20): sleep_s, animate_s, setCurtain_s, vibrate_s...
- **音频控制** (15): playBgm_s, playSound_s, stopSound_s...
- **UI 绘制** (20): fillRect_s, drawImage_s, drawIcon_s...

### 5.3 表达式块 (约 25 个)

```
expression_arithmetic_0, negate_e, unaryOperation_e, bool_e,
idString_e, idIdList_e, idFlag_e, idTemp_e, idFixedList_e,
evalString_e, enemyattr_e, blockId_e, blockNumber_e, blockCls_e,
equip_e, nextXY_e, isReplaying_e, hasVisitedFloor_e,
isShopVisited_e, hasEquip_e, canBattle_e, damage_e, damage_1_e, rand_e
```

### 5.4 上下文块 (约 15 个)

```
choicesContext, switchCase, waitContext_1~4, waitContext_empty,
shopChoices, shopItemChoices, levelCase, moveDirection,
textDrawing, textDrawingEmpty
```

## 6. 数据源：export.js

语言定义数据来自运行时抓取的 `export.js` 文件 (约 16700 行)，包含：

- `MotaActionBlocks`: 块定义集合
  - 分类数组 (`action`, `expression` 等)
  - 字段类型定义
  - 完整的块定义 (json, generFunc, args 等)
- `MotaActionFunctions`: 运行时辅助函数
  - `pre()`: 预处理器
  - `xmlText()`: XML 生成
  - `fieldDefault()`: 默认值

# Left3 面板 - 图块属性面板

## 面板标识
- **DOM ID**: `left3`
- **模式名称**: `enemyitem`
- **对应模块**: `editor_mode.js`, `editor_datapanel.js`

## 功能概述

图块属性面板用于编辑怪物、道具和其他图块的属性。当在右侧素材区选中一个图块后，可以在此面板中查看和修改其详细属性。支持怪物属性、道具属性、以及普通图块属性的编辑，还提供了复制/粘贴/清空属性等批量操作功能。

## UI组件结构

### 1. 顶部工具栏

```
图块属性  [保存] [添加] [删除] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存当前图块属性修改
- `[添加]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('add')` 添加新属性项
- `[删除]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('delete')` 删除属性项
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('enemyitem')` 自定义表格显示项

### 2. 属性表格区域 (`#enemyItemTable`)

```
┌─────────┬─────────────┬─────────────────┐
│  条目    │    注释      │       值        │
├─────────┼─────────────┼─────────────────┤
│ id      │ 唯一标识符   │ greenSlime      │
│ name    │ 名称        │ 绿色史莱姆       │
│ hp      │ 生命值      │ 100             │
│ atk     │ 攻击力      │ 10              │
│ def     │ 防御力      │ 5               │
│ money   │ 金币        │ 1               │
│ exp     │ 经验值      │ 1               │
│ special │ 特殊属性    │ [1]             │
└─────────┴─────────────┴─────────────────┘
```

**组件**:
- `#table_a3f03d4c_55b8_4ef6_b362_b345783acd72`: 动态生成的属性表格
- 每行包含：属性名、注释说明、可编辑的值

### 3. 属性操作按钮

```
[复制属性] [粘贴属性] [清空属性] [批量清空属性]
```

**组件**:
- `#copyEnemyItem`: 复制当前怪物/道具的属性到剪贴板
- `#pasteEnemyItem`: 粘贴已复制的属性到当前图块
- `#clearEnemyItem`: 清空当前图块的属性（恢复为默认值）
- `#clearAllEnemyItem`: 批量清空全塔所有同类图块的属性

### 4. 新建ID/idnum区域 (`#newIdIdnum`)

当选中的图块尚未注册时显示：

```
[新id输入框] [新idnum输入框] [确定]
[自动注册] [删除此素材] [以此素材为模板追加]
```

**组件**:
- 新id输入框: 输入图块唯一标识符，如 `greenSlime`
- 新idnum输入框: 输入数字ID（10000以内）
- `[确定]` 按钮: 确认注册新的id和idnum
- `[自动注册]` 按钮: 自动为该列所有未注册的素材分配ID
- `[删除此素材]` 按钮: 从素材库中删除此素材
- `[以此素材为模板追加]` 按钮: 跳转到素材追加面板并以当前素材为模板

### 5. 修改ID区域 (`#changeId`)

当选中的图块已注册时显示：

```
[修改图块id为] [确定] [删除此素材] [以此素材为模板追加]
```

**组件**:
- 修改id输入框: 输入新的图块id
- `[确定]` 按钮: 确认修改id
- `[删除此素材]` 按钮: 从素材库中删除此素材
- `[以此素材为模板追加]` 按钮: 跳转到素材追加面板

## 核心功能

### 1. 查看图块属性

**操作方式**:
1. 在右侧素材区点击选择一个图块
2. 面板自动显示该图块的属性表格

**数据来源**:
- 怪物: `enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id]`
- 道具: `items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id]`
- 其他图块: `maps_90f36752_8815_4be8_b32b_d7fad1d0542e[idnum]`

### 2. 编辑怪物属性

**怪物属性字段**:
```javascript
{
  "id": "greenSlime",        // 唯一标识符
  "name": "绿色史莱姆",       // 显示名称
  "displayIdInBook": "...",  // 怪物手册中显示的其他ID
  "hp": 100,                 // 生命值
  "atk": 10,                 // 攻击力
  "def": 5,                  // 防御力
  "money": 1,                // 金币奖励
  "exp": 1,                  // 经验奖励
  "point": 0,                // 加点
  "special": [1, 2],         // 特殊属性数组
  "value": 0,                // 特殊属性数值
  "zone": 0,                 // 领域范围
  "repulse": 0,              // 阻击范围
  "hpValue": null,           // 自定义血量
  "atkValue": null,          // 自定义攻击数值
  "defValue": null,          // 自定义防御数值
  "damage": null,            // 自定义伤害显示
  "critical": null,          // 自定义临界显示
  "criticalDamage": null,    // 自定义临界伤害
  "beforeBattle": [],        // 战前事件
  "afterBattle": [],         // 战后事件
  "bigImage": null,          // 大图文件名
  "notBomb": false,          // 是否炸弹不可用
  // ...其他自定义属性
}
```

### 3. 编辑道具属性

**道具属性字段**:
```javascript
{
  "id": "redJewel",          // 唯一标识符
  "cls": "items",            // 道具类别: items/constants/tools/equips
  "name": "红宝石",          // 显示名称
  "useItemEvent": null,      // 使用道具事件
  "canUseItemEffect": null,  // 能否使用判定
  "useItemEffect": null,     // 使用效果代码
  "equip": {},               // 装备属性
  // ...其他自定义属性
}
```

### 4. 编辑图块属性

**图块属性字段**:
```javascript
{
  "id": "wall",              // 唯一标识符
  "cls": "terrains",         // 图块类别
  "trigger": "...",          // 触发器类型
  "noPass": true,            // 是否不可通行
  "doorInfo": {},            // 门信息
  "script": "...",           // 脚本代码
  // ...其他自定义属性
}
```

### 5. 复制/粘贴属性

**复制功能** (`#copyEnemyItem`):
- 将当前怪物/道具的全部属性复制到临时存储
- 存储在 `editor.uivalues.copyEnemyItem.data` 中

**粘贴功能** (`#pasteEnemyItem`):
- 将已复制的属性覆盖到当前图块
- 保留原有的 id 和 name 不变
- 仅在同类型（怪物对怪物、道具对道具）之间粘贴

**实现位置**: `editor_datapanel.js` 第408-457行

### 6. 清空属性

**单个清空** (`#clearEnemyItem`):
- 将当前图块属性恢复为默认模板
- 怪物使用 `comment_c456ea59_..._data.enemys_template`
- 道具保留 id、cls、name，删除其他属性

**批量清空** (`#clearAllEnemyItem`):
- 怪物: 清空全塔所有怪物属性
- 道具: 清空所有自动注册且未修改ID的道具（匹配 `I\d+` 格式）

### 7. 注册新图块

**新建ID和idnum**:
- id: 唯一字符串标识符（字母、数字、下划线）
- idnum: 数字ID（1-9999）

**自动注册**:
- 为该列（如enemys列）所有未注册的素材自动分配ID
- 自动生成格式如 `E1`, `E2`, `I1`, `I2` 等

**实现位置**: `editor_datapanel.js` 第296-351行

### 8. 修改图块ID

**功能**: 修改已注册图块的id

**限制**:
- 不能使用保留关键字: `hero`, `this`, `none`, `airwall`
- 不能与状态栏图标ID冲突
- 自动元件和额外素材不可修改id

**实现位置**: `editor_datapanel.js` 第353-406行

## 数据流

```
在素材区选中图块
       ↓
editor.info = 选中的图块信息
       ↓
editor_mode.onmode('enemyitem')
       ↓
editor_mode.enemyitem() - 加载属性数据
       ↓
根据 images 类型判断:
├─ enemys/enemy48 → editor.file.editEnemy()
├─ items          → editor.file.editItem()
└─ 其他           → editor.file.editMapBlocksInfo()
       ↓
生成属性表格 HTML
       ↓
用户编辑字段值
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('enemyitem', actionList)
       ↓
写入对应的配置文件:
├─ enemys.js  (怪物属性)
├─ items.js   (道具属性)
└─ maps.js    (图块属性)
```

## 相关文件

**HTML**: `public/editor.html` (第121-160行)

**JavaScript**:
- `public/_server/editor_mode.js` - enemyitem() 方法 (第243-286行)
- `public/_server/editor_datapanel.js` - 图块属性相关函数 (第292-527行)
- `public/_server/editor_file.js` - editEnemy(), editItem(), editMapBlocksInfo()
- `public/_server/table/comment.js` - 表格字段配置

**数据文件**:
- `project/enemys.js` - 怪物属性定义
- `project/items.js` - 道具属性定义  
- `project/maps.js` - 图块属性定义
- `project/icons.js` - 图标ID映射

## 怪物特殊属性说明

| 编号 | 名称 | 说明 |
|------|------|------|
| 1 | 先攻 | 怪物先手攻击 |
| 2 | 魔攻 | 无视勇士防御 |
| 3 | 坚固 | 勇士伤害为1 |
| 4 | 2连击 | 攻击两次 |
| 5 | 3连击 | 攻击三次 |
| 6 | n连击 | 攻击n次 |
| 7 | 破甲 | 扣除勇士一定比例防御 |
| 8 | 反击 | 反弹伤害 |
| 9 | 净化 | 减少勇士魔防 |
| 10 | 模仿 | 复制勇士攻防 |
| 11 | 吸血 | 吸取勇士HP |
| 12 | 中毒 | 使勇士中毒 |
| 13 | 衰弱 | 减少勇士攻击 |
| 14 | 诅咒 | 战后无法获得金币经验 |
| 15 | 领域 | 领域伤害 |
| 16 | 夹击 | 夹击伤害 |
| 17 | 仇恨 | 累加仇恨值 |
| 18 | 阻击 | 阻击伤害 |
| 19 | 自爆 | 自爆伤害 |
| 20 | 无敌 | 无法战胜 |
| 21 | 退化 | 永久减少勇士攻击 |
| 22 | 固伤 | 额外固定伤害 |
| 23 | 重生 | 每次战斗后恢复生命 |
| 24 | 激光 | 激光伤害 |
| 25+ | 自定义 | 脚本编辑中定义 |

## 道具类别说明

| 类别 | 说明 | 示例 |
|------|------|------|
| items | 即捡即用类 | 红蓝宝石、血瓶 |
| constants | 永久道具 | 怪物手册、飞行器 |
| tools | 消耗道具 | 炸弹、圣水 |
| equips | 装备 | 剑、盾 |

## 使用场景

1. **配置新怪物**: 追加新怪物素材 → 在图块属性面板设置HP/攻/防/金币/经验/特殊属性
2. **批量修改怪物**: 复制基础怪物属性 → 粘贴到多个变色怪物 → 微调数值
3. **添加新道具**: 追加道具素材 → 设置道具类别和使用效果
4. **自定义地形**: 修改图块的触发器、通行性、门信息等

## 注意事项

1. **ID唯一性**: id不能与已有图块重复
2. **idnum范围**: 必须在1-9999之间，超过10000保留给额外素材
3. **保留字限制**: 不能使用 hero, this, none, airwall 作为id
4. **类型匹配**: 复制粘贴仅支持同类型（怪物/道具）之间
5. **删除风险**: 删除素材是不可逆操作，请先备份
6. **行走图绑定**: 同一行走图的多个朝向只需设置朝下怪物属性，会自动同步

## 快捷操作

- 点击素材区图块 → 自动切换到图块属性面板
- 双击表格值 → 进入编辑模式
- 复制属性 → 批量配置相似怪物
- 自动注册 → 快速注册整列素材

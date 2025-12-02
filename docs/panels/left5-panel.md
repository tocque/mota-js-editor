# Left5 面板 - 全塔属性面板

## 面板标识
- **DOM ID**: `left5`
- **模式名称**: `tower`
- **对应模块**: `editor_mode.js`, `editor_file.js`

## 功能概述

全塔属性面板是编辑器的默认初始面板，用于编辑整个游戏的全局配置。包括游戏基本信息、初始勇士属性、全局商店、系统开关、状态栏配置、窗口皮肤等。是游戏整体设计的核心配置面板。

## UI组件结构

### 1. 顶部工具栏

```
全塔属性  [保存] [添加] [配置表格]
```

**组件**:
- `[保存]` 按钮: 调用 `editor.mode.onmode('save')` 保存全塔属性修改
- `[添加]` 按钮: 调用 `editor.mode.changeDoubleClickModeByButton('add')` 添加新属性项
- `[配置表格]` 按钮: 调用 `editor_multi.editCommentJs('tower')` 自定义表格显示项

### 2. 属性表格区域

```
┌─────────────────┬───────────────────┬─────────────────┐
│      条目        │       注释         │       值        │
├─────────────────┼───────────────────┼─────────────────┤
│ main            │ 主要配置           │ {...}           │
│ ├─ name         │ 游戏名称           │ 魔塔样板        │
│ ├─ version      │ 游戏版本           │ 2.x.x           │
│ ├─ floorIds     │ 楼层ID列表         │ [...]           │
│ ├─ startFloor   │ 初始楼层           │ MT0             │
│ ├─ startCanvas  │ 游戏开始时画布     │ {...}           │
│ └─ ...          │                   │                 │
│ firstData       │ 初始数据           │ {...}           │
│ ├─ hero         │ 勇士初始属性       │ {...}           │
│ ├─ shops        │ 全局商店           │ {...}           │
│ └─ startItems   │ 初始道具           │ {...}           │
│ values          │ 全局数值配置       │ {...}           │
│ flags           │ 系统开关           │ {...}           │
└─────────────────┴───────────────────┴─────────────────┘
```

**组件**:
- `#table_b6a03e4c_5968_4633_ac40_0dfdd2c9cde5`: 动态生成的属性表格
- 支持层级展开的树形结构

## 核心功能

### 1. 游戏基本信息 (main)

```javascript
{
  "main": {
    "name": "魔塔样板",          // 游戏名称
    "version": "Ver 2.x.x",      // 游戏版本号
    "floorIds": ["MT0", "MT1"],  // 楼层ID顺序列表
    "startFloor": "MT0",         // 游戏开始楼层
    "startText": "...",          // 开场文字
    "startCanvas": {...},        // 开场画面配置
    "levelChoose": [...],        // 难度选择
    "animateSpeed": 300,         // 动画速度
    "noClickAnimate": false,     // 禁用点击动画
    "haloColor": "#fff",         // 光环颜色
  }
}
```

### 2. 初始勇士属性 (firstData.hero)

```javascript
{
  "firstData": {
    "hero": {
      "floorId": "MT0",          // 初始楼层
      "loc": {"x": 6, "y": 11},  // 初始位置
      "direction": "up",         // 初始朝向
      "hp": 1000,                // 初始生命值
      "atk": 10,                 // 初始攻击力
      "def": 10,                 // 初始防御力
      "mdef": 0,                 // 初始魔防
      "money": 0,                // 初始金币
      "exp": 0,                  // 初始经验
      "lv": 1,                   // 初始等级
      "name": "勇士",            // 勇士名称
      "items": {                 // 初始道具
        "keys": {"yellowKey": 0, "blueKey": 0, "redKey": 0},
        "tools": {},
        "constants": {},
        "equips": []
      }
    }
  }
}
```

### 3. 全局商店 (firstData.shops)

```javascript
{
  "firstData": {
    "shops": {
      "shop1": {
        "id": "shop1",              // 商店ID
        "textInList": "金币商店",   // 快捷列表显示名
        "mustEnable": false,        // 是否必须开启
        "disablePreview": false,    // 禁用预览
        "use": "money",             // 使用的货币类型
        "icon": "...",              // 商店图标
        "text": "...",              // 商店描述
        "choices": [                // 商店选项
          {"text": "生命+800", "need": "20", "action": [...]}
        ]
      }
    }
  }
}
```

### 4. 初始道具 (firstData.startItems)

```javascript
{
  "firstData": {
    "startItems": {
      "yellowKey": 1,     // 黄钥匙数量
      "blueKey": 0,       // 蓝钥匙数量
      "redKey": 0,        // 红钥匙数量
      "pickaxe": 0,       // 破墙镐数量
      "bomb": 0,          // 炸弹数量
      "book": 0,          // 怪物手册
      "fly": 0,           // 楼传器
      // ...
    }
  }
}
```

### 5. 全局数值配置 (values)

```javascript
{
  "values": {
    "lavaDamage": 100,          // 熔岩伤害
    "poisonDamage": 10,         // 中毒伤害
    "weakValue": 20,            // 衰弱效果值
    "redJewel": 3,              // 红宝石加攻
    "blueJewel": 3,             // 蓝宝石加防
    "greenJewel": 5,            // 绿宝石加魔防
    "yellowJewel": 500,         // 黄宝石加金
    "redPotion": 100,           // 红血瓶回血
    "bluePotion": 250,          // 蓝血瓶回血
    "yellowPotion": 500,        // 黄血瓶回血
    "greenPotion": 800,         // 绿血瓶回血
    "breakArmor": 0.9,          // 破甲比例
    "counterAttack": 0.1,       // 反击比例
    "purify": 3,                // 净化减魔防
    "hatred": 2,                // 仇恨累加
    "weakAtk": 0,               // 衰弱攻击减少
    "weakDef": 0,               // 衰弱防御减少
    "animateSpeed": 300,        // 动画速度
    "moveSpeed": 100,           // 移动速度
    "floorChangeTime": 500,     // 切换楼层时间
  }
}
```

### 6. 系统开关 (flags)

```javascript
{
  "flags": {
    "statusBarItems": [...],     // 状态栏显示项
    "enableFloor": true,         // 启用楼层显示
    "enableLv": false,           // 启用等级显示
    "enableExp": false,          // 启用经验显示
    "enableMoney": true,         // 启用金币显示
    "enableMDef": false,         // 启用魔防显示
    "enableDebuff": true,        // 启用负面状态
    "enableGentleClick": true,   // 启用双击勇士确认
    "enableViewMaps": true,      // 启用查看地图
    "enableQuickShop": true,     // 启用快捷商店
    "enableSwitchFloor": true,   // 启用楼层切换器
    "enableNegativeDamage": false,// 负伤显示
    "leftHandPrefer": false,     // 左手模式
    "enableMoveDirectly": true,  // 支持点击瞬间移动
    "cannotMoveDirectly": false, // 禁止点击瞬间移动
    "equipboxButton": false,     // 显示装备按钮
    "enableAddPoint": false,     // 允许加点
    "enableBattleAnimate": true, // 显示战斗动画
    "autoScale": true,           // 自动缩放
    "disableShopOnDamage": false,// 商店内不显示伤害
    "extendToolbar": true,       // 允许展开工具栏
  }
}
```

## 数据流

```
启动编辑器 / 切换到全塔属性面板
       ↓
editor_mode.tower()
       ↓
editor.file.editTower([])
       ↓
读取 data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d
       ↓
生成层级属性表格 HTML
       ↓
用户编辑字段值
       ↓
记录到 editor_mode.actionList
       ↓
点击保存
       ↓
editor_mode.doActionList('tower', actionList)
       ↓
editor.file.editTower(actionList)
       ↓
写入 project/data.js
       ↓
更新 core.xxx 运行时数据
```

## 相关文件

**HTML**: `public/editor.html` (第187-203行)

**JavaScript**:
- `public/_server/editor_mode.js` - tower() 方法 (第301-312行)
- `public/_server/editor_file.js` - editTower()
- `public/_server/table/data.comment.js` - 表格字段配置

**数据文件**:
- `project/data.js` - 全塔属性主文件
  - `data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d` 全局数据对象

## 特殊验证

### floorIds 验证

当修改 `main.floorIds` 时，会执行以下验证：

1. **唯一性检查**: 不能有重复的楼层ID
2. **存在性检查**: 每个ID必须对应存在的楼层文件

```javascript
editor_mode.checkFloorIds(thiseval)
```

**实现位置**: `editor_mode.js` 第159-186行

### 图片列表验证

当修改图片列表（如 `autotiles`, `images` 等）时：

```javascript
editor_mode.checkImages(thiseval, directory)
```

**实现位置**: `editor_mode.js` 第188-207行

## 使用场景

1. **设置游戏信息**: 修改游戏名称、版本号等基本信息
2. **配置勇士属性**: 设置初始HP、攻击力、防御力等
3. **设置全局数值**: 配置宝石效果、药水效果等数值
4. **开关系统功能**: 启用/禁用各种游戏功能
5. **配置全局商店**: 添加和编辑全局商店选项
6. **调整楼层顺序**: 修改 floorIds 改变楼层显示顺序

## data.js 文件结构

```javascript
var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = {
  "main": {
    "name": "...",
    "version": "...",
    "floorIds": [...],
    // ...其他main配置
  },
  "firstData": {
    "hero": {...},
    "shops": {...},
    "startItems": {...},
    // ...其他初始数据
  },
  "values": {...},
  "flags": {...},
}
```

## 注意事项

1. **游戏名称**: 首次使用样板时请修改 `main.name`，系统会提示
2. **floorIds顺序**: 列表顺序决定了楼传器中的楼层显示顺序
3. **startFloor匹配**: 必须是 floorIds 中存在的楼层
4. **hero.floorId**: 必须与 startFloor 一致
5. **数值平衡**: values 中的数值直接影响游戏平衡性
6. **状态栏配置**: flags.statusBarItems 决定状态栏显示哪些属性
7. **保存后生效**: 部分配置需要刷新才能看到效果

## 状态栏配置项

`flags.statusBarItems` 可配置以下显示项：

| 项目 | 说明 |
|------|------|
| floor | 楼层名 |
| name | 勇士名 |
| lv | 等级 |
| hp | 生命值 |
| atk | 攻击力 |
| def | 防御力 |
| mdef | 魔防 |
| money | 金币 |
| exp | 经验 |
| up | 升级按钮 |
| yellowKey | 黄钥匙 |
| blueKey | 蓝钥匙 |
| redKey | 红钥匙 |
| greenKey | 绿钥匙 |
| poison | 中毒状态 |
| weak | 衰弱状态 |
| curse | 诅咒状态 |
| pickaxe | 破墙镐 |
| bomb | 炸弹 |
| fly | 楼传器 |
| book | 怪物手册 |
| snowCrystal | 冰冻水晶 |
| earthquake | 地震卷轴 |

## 快捷操作

- 双击 `main` → 展开/收起主配置
- 双击 `firstData.hero` → 展开勇士属性
- 双击 `firstData.shops` → 展开商店配置
- 双击 `values` → 展开数值配置
- 双击 `flags` → 展开系统开关
- 直接编辑值 → 自动记录修改

## 常见配置示例

### 配置无装备模式
```javascript
flags.equipboxButton = false
firstData.hero.items.equips = []
```

### 配置经验等级系统
```javascript
flags.enableLv = true
flags.enableExp = true
// 然后在脚本编辑中配置升级所需经验
```

### 配置左手模式
```javascript
flags.leftHandPrefer = true
```

### 禁用点击移动
```javascript
flags.cannotMoveDirectly = true
```

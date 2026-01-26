# 10 - Blockly 工具箱分类梳理

## 目标

梳理 Blockly 工具箱的分类结构，对比原始配置和新的实现，明确每个块应该归属到哪个分类。

## 颜色继承机制

**设计决策**: 为了降低用户接受成本，完全接受原先的颜色配置。每种 category 有一个基础颜色，如果块没有显式指定颜色，就使用其 category 的默认颜色。

### Category 默认颜色映射

```typescript
// src/blockly/schemas/categoryColours.ts
export const CategoryColours = {
  entry: 250,      // 入口块 - 紫色
  text: 160,       // 文本块 - 橙色（原始配置）
  data: 130,       // 数据操作 - 绿色
  map: 180,        // 地图块 - 青绿色
  control: 20,     // 控制流 - 红色
  effect: 20,      // 特效表现 - 红色（与控制流相同）
  interaction: 70, // 交互功能 - 橙色
  misc: 330,       // 杂项 - 粉色
  unknown: 0,      // 未知块 - 黑色
} as const;
```

### 实现方式

1. **自动继承**: 在 `BlockRegistry.registerToBlockly` 中，如果块的 `definition.colour` 未指定或为特殊值（如 `'auto'`），则使用 category 的默认颜色
2. **显式覆盖**: 如果块显式指定了颜色，优先使用显式颜色（用于特殊情况，如 `comment_s` 使用紫色 285）
3. **简化配置**: 可以移除大部分显式的 `colour: BlockColours.XXX`，改为依赖 category 默认颜色

### 优势

- **降低维护成本**: 不需要为每个块都指定颜色
- **保持一致性**: 同一分类的块颜色自动一致
- **灵活性**: 仍支持特殊情况显式指定颜色
- **用户习惯**: 完全接受原先颜色，降低迁移成本

## 原始工具箱分类（editor_blocklyconfig.js）

原始配置中有以下分类：

1. **入口方块** (自定义回调 `entranceCategory`)
   - 根据当前编辑类型动态筛选
   - 包含所有入口块类型

2. **显示文字**
   - 文本显示相关块

3. **数据相关**
   - 数据设置、更新、战斗、商店等

4. **地图处理**
   - 地图块操作、移动、跳跃等

5. **事件控制**
   - 条件判断、循环、流程控制

6. **特效表现**
   - 动画、视角、状态栏、保存加载等

7. **音像处理**
   - 图片、音频相关

8. **UI绘制**
   - Canvas 绘制相关

9. **原生脚本**
   - function_s, unknown_s

10. **值块**
    - 表达式、ID、布尔值等

11. **常见事件模板** (静态示例)
    - 预设的事件模板

12. **最近使用事件** (自定义回调 `searchBlockCategory`)
    - 动态显示最近使用的块

## 新的 Schema 分类（src/blockly/schemas/）

新的实现按功能模块分类：

- `entry.ts` - 入口块
- `text.ts` - 文本相关
- `control.ts` - 控制流
- `data.ts` - 数据操作
- `map.ts` - 地图操作
- `interaction.ts` - 交互（选择、输入等）
- `effect.ts` - 特效（动画、视角等）
- `misc.ts` - 杂项（保存、加载、UI绘制等）
- `unknown.ts` - 未知块

## 工具箱分类映射

### 1. 入口方块 (ENTRY)

**原始分类**: 入口方块  
**新分类**: `entry`  
**颜色**: 250 (紫色)

**包含的块**:
- `common_m` - 公共事件
- `event_m` - 事件
- `autoEvent_m` - 自动事件
- `changeFloor_m` - 切换楼层
- `beforeBattle_m` - 战前事件
- `afterBattle_m` - 战后事件
- `afterGetItem_m` - 获得道具后
- `afterOpenDoor_m` - 开门后
- `firstArrive_m` - 首次到达
- `eachArrive_m` - 每次到达
- `commonEvent_m` - 公共事件
- `item_m` - 道具
- `level_m` - 难度选择
- `levelCase` - 难度分支
- `shop_m` - 商店
- `shopsub` - 商店子项
- `shopChoices` - 商店选择
- `changeFloor_m` - 切换楼层（配置）
- `floorPartition` - 楼层分区
- `equip` - 装备
- `floorImage` - 楼层图片
- `doorInfo` - 门信息
- `faceIds_m` - 头像ID
- `mainStyle_m` - 主样式
- `nameMap` - 名称映射
- `splitImages` - 分割图片

**实现方式**: 使用自定义回调 `entranceCategory`，根据当前编辑类型动态筛选

---

### 2. 显示文字 (TEXT)

**原始分类**: 显示文字  
**新分类**: `text`  
**颜色**: 160 (橙色)

**包含的块**:
- `text_0_s` - 显示文字（无头像）
- `text_1_s` - 显示文字（有头像）
- `moveTextBox_s` - 移动文字框
- `clearTextBox_s` - 清空文字框
- `comment_s` - 注释
- `autoText_s` - 自动文字
- `scrollText_s` - 滚动文字
- `setText_s` - 设置文字
- `tip_s` - 提示
- `confirm_s` - 确认对话框
- `choices_s` - 选择对话框
- `win_s` - 胜利
- `lose_s` - 失败
- `restart_s` - 重启

---

### 3. 数据相关 (DATA)

**原始分类**: 数据相关  
**新分类**: `data`  
**颜色**: 130 (绿色)

**包含的块**:
- `setValue_s` - 设置数值
- `setEnemy_s` - 设置敌人
- `setEnemyOnPoint_s` - 在点设置敌人
- `resetEnemyOnPoint_s` - 重置点上的敌人
- `moveEnemyOnPoint_s` - 移动点上的敌人
- `moveEnemyOnPoint_1_s` - 移动点上的敌人（带ID）
- `setEquip_s` - 设置装备
- `setFloor_s` - 设置楼层
- `setGlobalAttribute_s` - 设置全局属性
- `setGlobalValue_s` - 设置全局数值
- `setGlobalFlag_s` - 设置全局标志
- `setNameMap_s` - 设置名称映射
- `input_s` - 输入
- `input2_s` - 输入（多行）
- `update_s` - 更新
- `moveAction_s` - 移动动作
- `changeFloor_s` - 切换楼层
- `changePos_s` - 改变位置
- `battle_s` - 战斗
- `useItem_s` - 使用道具
- `loadEquip_s` - 加载装备
- `unloadEquip_s` - 卸载装备
- `openShop_s` - 打开商店
- `disableShop_s` - 禁用商店
- `setHeroIcon_s` - 设置英雄图标
- `follow_s` - 跟随
- `unfollow_s` - 取消跟随

---

### 4. 地图处理 (MAP)

**原始分类**: 地图处理  
**新分类**: `map`  
**颜色**: 180 (青绿色)

**包含的块**:
- `battle_1_s` - 战斗（指定位置）
- `openDoor_s` - 开门
- `closeDoor_s` - 关门
- `show_s` - 显示
- `hide_s` - 隐藏
- `setBlock_s` - 设置块
- `setBlockOpacity_s` - 设置块透明度
- `setBlockFilter_s` - 设置块滤镜
- `turnBlock_s` - 旋转块
- `moveHero_s` - 移动英雄
- `move_s` - 移动
- `jumpHero_s` - 英雄跳跃
- `jumpHero_1_s` - 英雄跳跃（指定位置）
- `jump_s` - 跳跃
- `jump_1_s` - 跳跃（指定位置）
- `showBgFgMap_s` - 显示背景/前景地图
- `hideBgFgMap_s` - 隐藏背景/前景地图
- `setBgFgBlock_s` - 设置背景/前景块
- `showFloorImg_s` - 显示楼层图片
- `hideFloorImg_s` - 隐藏楼层图片

---

### 5. 事件控制 (CONTROL)

**原始分类**: 事件控制  
**新分类**: `control`  
**颜色**: 20 (红色)

**包含的块**:
- `if_1_s` - 如果（单分支）
- `if_s` - 如果（双分支）
- `switch_s` - 开关
- `for_s` - 循环（for）
- `forEach_s` - 循环（forEach）
- `while_s` - 循环（while）
- `dowhile_s` - 循环（do-while）
- `break_s` - 跳出
- `continue_s` - 继续
- `exit_s` - 退出
- `trigger_s` - 触发
- `insert_1_s` - 插入（位置）
- `insert_2_s` - 插入（ID）

---

### 6. 特效表现 (EFFECT)

**原始分类**: 特效表现  
**新分类**: `effect`  
**颜色**: 20 (红色，与控制流相同)

**包含的块**:
- `sleep_s` - 休眠
- `wait_s` - 等待（带上下文）
- `waitAsync_s` - 异步等待
- `stopAsync_s` - 停止异步
- `vibrate_s` - 震动
- `animate_s` - 动画
- `animate_1_s` - 动画（指定位置）
- `stopAnimate_s` - 停止动画
- `setViewport_s` - 设置视口
- `setViewport_1_s` - 设置视口（指定位置）
- `lockViewport_s` - 锁定视口
- `showStatusBar_s` - 显示状态栏
- `hideStatusBar_s` - 隐藏状态栏
- `setHeroOpacity_s` - 设置英雄透明度
- `setCurtain_0_s` - 设置幕布（淡入）
- `setCurtain_1_s` - 设置幕布（淡出）
- `screenFlash_s` - 屏幕闪烁
- `setWeather_s` - 设置天气
- `callBook_s` - 调用图鉴
- `callSave_s` - 调用保存
- `autoSave_s` - 自动保存
- `forbidSave_s` - 禁止保存
- `callLoad_s` - 调用加载

**注意**: `callBook_s`, `callSave_s`, `autoSave_s`, `forbidSave_s`, `callLoad_s` 可能更适合放在 `misc` 分类

---

### 7. 音像处理 (AUDIO_VIDEO)

**原始分类**: 音像处理  
**新分类**: 需要拆分到 `effect` 和 `misc`

**图片相关** (可归入 `effect`):
- `showImage_s` - 显示图片
- `showImage_1_s` - 显示图片（指定位置）
- `hideImage_s` - 隐藏图片
- `showTextImage_s` - 显示文字图片
- `moveImage_s` - 移动图片
- `rotateImage_s` - 旋转图片
- `scaleImage_s` - 缩放图片
- `showGif_s` - 显示GIF

**音频相关** (可归入 `effect`):
- `playBgm_s` - 播放背景音乐
- `pauseBgm_s` - 暂停背景音乐
- `resumeBgm_s` - 恢复背景音乐
- `loadBgm_s` - 加载背景音乐
- `freeBgm_s` - 释放背景音乐
- `playSound_s` - 播放音效
- `playSound_1_s` - 播放音效（指定位置）
- `stopSound_s` - 停止音效
- `setVolume_s` - 设置音量
- `setBgmSpeed_s` - 设置BGM速度

---

### 8. UI绘制 (UI_DRAW)

**原始分类**: UI绘制  
**新分类**: `misc`  
**颜色**: 220 (黄色)

**包含的块**:
- `previewUI_s` - 预览UI
- `clearMap_s` - 清空地图
- `setAttribute_s` - 设置属性
- `setFilter_s` - 设置滤镜
- `fillText_s` - 填充文字
- `fillBoldText_s` - 填充粗体文字
- `drawTextContent_s` - 绘制文字内容
- `fillRect_s` - 填充矩形
- `strokeRect_s` - 描边矩形
- `drawLine_s` - 绘制线条
- `drawArrow_s` - 绘制箭头
- `fillPolygon_s` - 填充多边形
- `strokePolygon_s` - 描边多边形
- `fillEllipse_s` - 填充椭圆
- `strokeEllipse_s` - 描边椭圆
- `fillArc_s` - 填充圆弧
- `strokeArc_s` - 描边圆弧
- `drawImage_s` - 绘制图片
- `drawImage_1_s` - 绘制图片（指定位置）
- `drawIcon_s` - 绘制图标
- `drawBackground_s` - 绘制背景
- `drawSelector_s` - 绘制选择器
- `drawSelector_1_s` - 绘制选择器（指定位置）

---

### 9. 原生脚本 (SCRIPT)

**原始分类**: 原生脚本  
**新分类**: `unknown`  
**颜色**: 0 (黑色)

**包含的块**:
- `function_s` - 函数
- `unknown_s` - 未知

---

### 10. 值块 (VALUE)

**原始分类**: 值块  
**新分类**: 需要单独处理，不放在工具箱中（值块通过连接使用）

**包含的块**:
- `expression_arithmetic_0` - 算术表达式
- `idFlag_e` - 标志ID
- `idTemp_e` - 临时变量ID
- `negate_e` - 取反
- `unaryOperation_e` - 一元运算
- `bool_e` - 布尔值
- `idString_e` - ID字符串
- `idIdList_e` - ID列表
- `idFixedList_e` - 固定列表
- `enemyattr_e` - 敌人属性
- `blockId_e` - 块ID
- `blockNumber_e` - 块编号
- `blockCls_e` - 块类别
- `hasEquip_e` - 拥有装备
- `equip_e` - 装备
- `nextXY_e` - 下一个坐标
- `isReplaying_e` - 是否回放
- `hasVisitedFloor_e` - 是否访问过楼层
- `isShopVisited_e` - 是否访问过商店
- `canBattle_e` - 能否战斗
- `damage_e` - 伤害
- `damage_1_e` - 伤害（指定位置）
- `rand_e` - 随机数
- `evalString_e` - 求值字符串

**注意**: 值块通常不直接显示在工具箱中，而是通过连接其他块时自动出现

---

### 11. 交互相关 (INTERACTION)

**原始分类**: 部分在"显示文字"中  
**新分类**: `interaction`  
**颜色**: 70 (橙色)

**包含的块**:
- `input_s` - 输入
- `input2_s` - 输入（多行）
- `confirm_s` - 确认对话框
- `choices_s` - 选择对话框

---

## 推荐的工具箱分类结构

基于以上分析，推荐以下工具箱分类：

1. **入口方块** (自定义回调)
   - 使用 `entranceCategory` 回调动态筛选
   - 颜色: 250

2. **显示文字**
   - 文本显示、注释、提示等
   - 颜色: 160

3. **数据操作**
   - 设置数值、属性、战斗、商店等
   - 颜色: 130

4. **地图处理**
   - 地图块操作、移动、跳跃等
   - 颜色: 180

5. **事件控制**
   - 条件判断、循环、流程控制
   - 颜色: 20

6. **特效表现**
   - 动画、视角、等待、状态栏等
   - 颜色: 20 (或使用不同色相区分)

7. **音像处理**
   - 图片、音频相关
   - 颜色: 45

8. **UI绘制**
   - Canvas 绘制相关
   - 颜色: 220

9. **交互功能**
   - 输入、选择、确认等
   - 颜色: 70

10. **原生脚本**
    - function_s, unknown_s
    - 颜色: 0

11. **最近使用** (自定义回调)
    - 使用 `searchBlockCategory` 回调动态显示
    - 颜色: 0

**注意**: 值块不显示在工具箱中，通过连接自动出现

## 实现建议

1. **创建工具箱配置模块** (`src/blockly/toolbox/index.ts`)
   - 定义所有分类配置
   - 支持自定义回调注册
   - 根据 schema 的 category 自动分组

2. **分类映射**
   - 建立 schema category 到工具箱分类的映射
   - 支持一个 schema 属于多个工具箱分类（如果需要）

3. **动态分类**
   - 入口方块：根据当前编辑类型筛选
   - 最近使用：记录并显示最近使用的块

4. **颜色配置**
   - 使用 `src/blockly/schemas/colours.ts` 中的颜色常量
   - 确保与原系统颜色一致

## 待确认问题

1. **特效表现 vs 事件控制**: 两者都使用颜色 20，是否需要区分？
2. **音像处理**: 是否应该拆分为"图片"和"音频"两个分类？
3. **保存/加载相关**: `callSave_s`, `callLoad_s` 等应该放在"特效表现"还是单独分类？
4. **值块**: 是否需要在工具箱中显示常用值块（如表达式、ID等）？
5. **常见事件模板**: 是否保留这个分类？如果保留，如何实现？

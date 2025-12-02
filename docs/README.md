# 魔塔编辑器 功能文档

本文档详细梳理了魔塔编辑器 (mota-js-editor) 的所有功能，包括各个面板、模块和组件的说明。

## 文档结构

### 核心架构文档

| 文档 | 说明 | 路径 |
|------|------|------|
| [整体架构与技术栈](./editor-architecture.md) | 编辑器的整体架构设计、技术栈、目录结构 | `docs/editor-architecture.md` |
| [核心模块详解](./editor-modules.md) | 各核心 JavaScript 模块的功能和接口说明 | `docs/editor-modules.md` |
| [中央画布编辑区](./editor-canvas.md) | 地图编辑画布的结构、图层、交互说明 | `docs/editor-canvas.md` |
| [右侧素材面板](./editor-right-panel.md) | 素材库、最近使用、图块选择说明 | `docs/editor-right-panel.md` |
| [数据流与状态管理](./editor-data-flow.md) | 数据架构、状态管理、文件同步说明 | `docs/editor-data-flow.md` |

### 左侧面板文档

| 面板 | DOM ID | 模式名 | 功能 | 文档路径 |
|------|--------|--------|------|----------|
| [地图编辑面板](./panels/left-panel.md) | left | map | 地图导入导出、新建删除 | `docs/panels/left-panel.md` |
| [素材追加面板](./panels/left1-panel.md) | left1 | appendpic | 追加新素材到游戏 | `docs/panels/left1-panel.md` |
| [位置选取面板](./panels/left2-panel.md) | left2 | loc | 编辑地图上某点的事件 | `docs/panels/left2-panel.md` |
| [图块属性面板](./panels/left3-panel.md) | left3 | enemyitem | 编辑怪物/道具/图块属性 | `docs/panels/left3-panel.md` |
| [楼层属性面板](./panels/left4-panel.md) | left4 | floor | 编辑当前楼层属性 | `docs/panels/left4-panel.md` |
| [全塔属性面板](./panels/left5-panel.md) | left5 | tower | 编辑全局游戏配置 | `docs/panels/left5-panel.md` |
| [Blockly事件编辑面板](./panels/left6-panel.md) | left6 | - | 可视化事件编程 | `docs/panels/left6-panel.md` |
| [代码编辑面板](./panels/left7-panel.md) | left7 | - | 多行文本/代码编辑 | `docs/panels/left7-panel.md` |
| [脚本编辑面板](./panels/left8-panel.md) | left8 | functions | 编辑游戏脚本函数 | `docs/panels/left8-panel.md` |
| [公共事件面板](./panels/left9-panel.md) | left9 | commonevent | 管理公共事件模板 | `docs/panels/left9-panel.md` |
| [插件编写面板](./panels/left10-panel.md) | left10 | plugins | 编写游戏插件 | `docs/panels/left10-panel.md` |

## 编辑器界面布局

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              工具栏区域                                      │
├────────────────────┬────────────────────────────────┬───────────────────────┤
│                    │                                │                       │
│    左侧面板区       │        中央画布区               │     右侧素材区         │
│    (left~left10)   │        (mapEdit)               │     (iconLib)         │
│                    │                                │                       │
│ ┌────────────────┐ │ ┌────────────────────────────┐ │ ┌───────────────────┐ │
│ │  面板内容       │ │ │                            │ │ │ 最近使用 (mid2)   │ │
│ │  根据模式切换   │ │ │    地图编辑画布            │ │ │                   │ │
│ │                │ │ │    (多层 Canvas)           │ │ ├───────────────────┤ │
│ │ - 地图编辑     │ │ │                            │ │ │                   │ │
│ │ - 素材追加     │ │ │                            │ │ │  素材库           │ │
│ │ - 位置选取     │ │ │                            │ │ │  (iconImages)     │ │
│ │ - 图块属性     │ │ └────────────────────────────┘ │ │                   │ │
│ │ - 楼层属性     │ │                                │ │  - terrains       │ │
│ │ - 全塔属性     │ │ ┌────────────────────────────┐ │ │  - animates       │ │
│ │ - Blockly     │ │ │  工具按钮区                 │ │ │  - enemys         │ │
│ │ - 代码编辑     │ │ │  - 画笔模式选择             │ │ │  - items          │ │
│ │ - 脚本编辑     │ │ │  - 图层选择                 │ │ │  - npcs           │ │
│ │ - 公共事件     │ │ │  - 视口控制                 │ │ │  - autotile       │ │
│ │ - 插件编写     │ │ │  - 楼层选择                 │ │ │  - tilesets       │ │
│ │                │ │ │  - 保存/帮助按钮            │ │ │                   │ │
│ └────────────────┘ │ └────────────────────────────┘ │ └───────────────────┘ │
└────────────────────┴────────────────────────────────┴───────────────────────┘
```

## 源代码位置

### 编辑器核心

| 文件 | 行数 | 说明 |
|------|------|------|
| `public/_server/editor.js` | ~1054 | 编辑器主入口 |
| `public/_server/editor_mode.js` | ~371 | 面板模式管理 |
| `public/_server/editor_file.js` | - | 文件读写 |
| `public/_server/editor_game.js` | - | 游戏数据 |
| `public/_server/editor_ui.js` | - | UI 生成 |
| `public/_server/editor_uievent.js` | - | UI 事件 |
| `public/_server/editor_table.js` | - | 表格编辑 |
| `public/_server/editor_listen.js` | - | 事件监听 |
| `public/_server/editor_util.js` | - | 工具函数 |
| `public/_server/editor_config.js` | - | 配置管理 |

### 面板相关

| 文件 | 说明 |
|------|------|
| `public/_server/editor_mappanel.js` | 地图编辑面板 |
| `public/_server/editor_datapanel.js` | 数据编辑面板 |
| `public/_server/editor_materialpanel.js` | 素材面板 |
| `public/_server/editor_blockly.js` | Blockly 集成 |
| `public/_server/editor_blocklyconfig.js` | Blockly 配置 |
| `public/_server/editor_multi.js` | 多行编辑器 |

### 表格配置

| 文件 | 说明 |
|------|------|
| `public/_server/table/comment.js` | 位置/图块/楼层表格配置 |
| `public/_server/table/data.comment.js` | 全塔属性表格配置 |
| `public/_server/table/functions.comment.js` | 脚本编辑表格配置 |
| `public/_server/table/events.comment.js` | 公共事件表格配置 |
| `public/_server/table/plugins.comment.js` | 插件表格配置 |

### HTML 入口

| 文件 | 说明 |
|------|------|
| `public/editor.html` | 桌面端编辑器 |
| `public/editor-mobile.html` | 移动端编辑器 |

## 游戏数据文件

| 文件 | 全局变量 | 说明 |
|------|----------|------|
| `project/data.js` | `data_a1e2fb4a_...` | 全塔属性 |
| `project/enemys.js` | `enemys_fcae963b_...` | 怪物属性 |
| `project/items.js` | `items_296f5d02_...` | 道具属性 |
| `project/maps.js` | `maps_90f36752_...` | 图块属性 |
| `project/icons.js` | `icons_4665ee12_...` | 图标映射 |
| `project/functions.js` | `functions_d6ad677b_...` | 脚本函数 |
| `project/events.js` | `events_c12a15a8_...` | 公共事件 |
| `project/plugins.js` | `plugins_bb40132b_...` | 插件代码 |
| `project/floors/*.js` | `main.floors.*` | 楼层数据 |

## 快捷键参考

### 全局快捷键

| 快捷键 | 功能 |
|--------|------|
| Z | 切换到地图编辑模式 |
| X | 切换到位置选取模式 |
| C | 切换到图块属性模式 |
| V | 切换到楼层属性模式 |
| B | 切换到全塔属性模式 |
| N | 切换到脚本编辑模式 |
| M | 切换到素材追加模式 |
| , | 切换到公共事件模式 |
| . | 切换到插件编写模式 |
| F | 切换大地图模式 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |

### 代码编辑器快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+/ | 注释/取消注释 |
| Ctrl+F | 查找 |
| Ctrl+R | 全部替换 |
| Ctrl+D | 折叠/展开 |
| Ctrl+B | 跳转到定义 |
| Ctrl+Q | 重命名变量 |
| Ctrl+O | 打开 API 文档 |
| Ctrl+P | 打开在线插件 |

## 相关资源

- [H5 魔塔样板官网](https://h5mota.com/)
- [在线插件库](https://h5mota.com/plugins/)
- [API 文档](/_docs/#/api)
- [魔塔论坛](https://h5mota.com/bbs/)

## 版本信息

- 编辑器版本: 2.0
- 文档最后更新: 2024

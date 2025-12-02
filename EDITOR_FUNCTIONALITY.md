# 魔塔编辑器功能文档 - 总览

> 本文档系统详细梳理原编辑器的所有功能模块、面板、数据流和实现位置

## 文档结构

本文档拆分为以下多个文件，便于阅读和维护：

### 核心文档
- **EDITOR_FUNCTIONALITY.md** (本文件) - 编辑器总览
- **docs/editor-architecture.md** - 整体架构与技术栈
- **docs/editor-modules.md** - 核心模块详解
- **docs/editor-canvas.md** - 中央画布编辑区域
- **docs/editor-right-panel.md** - 右侧素材面板
- **docs/editor-data-flow.md** - 数据流与状态管理

### 左侧面板文档 (11个)
- **docs/panels/left-panel.md** - left: 地图编辑面板
- **docs/panels/left1-panel.md** - left1: 素材追加面板
- **docs/panels/left2-panel.md** - left2: 位置选取面板
- **docs/panels/left3-panel.md** - left3: 图块属性面板
- **docs/panels/left4-panel.md** - left4: 楼层属性面板
- **docs/panels/left5-panel.md** - left5: 全塔属性面板
- **docs/panels/left6-panel.md** - left6: Blockly事件编辑面板
- **docs/panels/left7-panel.md** - left7: 事件代码编辑面板
- **docs/panels/left8-panel.md** - left8: 函数编辑面板
- **docs/panels/left9-panel.md** - left9: 公共事件面板
- **docs/panels/left10-panel.md** - left10: 插件编辑面板

---

## 编辑器概览

### 整体布局

魔塔编辑器是一个基于Web的游戏关卡编辑器，采用三栏布局：

```
┌─────────────┬──────────────────┬─────────────┐
│             │   顶部工具栏      │             │
│             ├──────────────────┤             │
│   左侧面板   │                  │  右侧素材库  │
│  (11个模式)  │   中央画布区域    │  (图标/图块)  │
│             │   (Canvas层叠)    │             │
│             │                  │             │
└─────────────┴──────────────────┴─────────────┘
                  底部状态栏
```

### 主要组成部分

1. **左侧面板区域** (可切换11种模式)
   - 地图编辑、素材追加、位置选取、图块/楼层/全塔属性
   - Blockly可视化事件、代码编辑器、函数/公共事件/插件

2. **中央编辑区域**
   - 多层Canvas画布（背景层、事件层、前景层、UI层）
   - 支持画笔/矩形/tileset三种绘制模式
   - 视口拖拽、缩放、大地图模式

3. **右侧面板区域**
   - 图标库/素材库切换显示
   - 最近使用的图块
   - 可折叠显示

4. **顶部工具栏**
   - 文件操作（读取/保存/导入/导出）
   - 楼层切换器
   - 画笔/图层模式切换
   - 视口控制按钮

5. **底部状态栏**
   - 当前坐标显示
   - 选中图块信息
   - 操作提示信息

### 技术栈

- **UI框架**: 原生JavaScript + DOM操作
- **可视化编程**: Google Blockly (用于可视化事件编辑)
- **代码编辑器**: CodeMirror 5 (用于函数/插件代码编辑)
- **数据存储**: localforage (IndexedDB封装)
- **数据压缩**: lz-string
- **文件处理**: zip.js (zip打包导出)
- **颜色选择**: jsColor
- **自动完成**: Awesomplete

### 主要文件位置

```
public/
├── editor.html              # 桌面端编辑器HTML模板
├── editor-mobile.html       # 移动端编辑器HTML模板
└── _server/
    ├── editor.js           # 核心编辑器对象 (1054行)
    ├── editor_mode.js      # 面板模式切换 (371行)
    ├── editor_ui.js        # UI组件生成
    ├── editor_uievent.js   # UI事件绑定
    ├── editor_mappanel.js  # 地图编辑面板
    ├── editor_datapanel.js # 数据编辑面板
    ├── editor_materialpanel.js # 素材面板
    ├── editor_file.js      # 文件读写操作
    ├── editor_game.js      # 游戏数据交互
    ├── editor_util.js      # 工具函数
    ├── editor_table.js     # 表格编辑器
    ├── editor_listen.js    # 事件监听
    ├── editor_blockly.js   # Blockly集成
    ├── editor_blocklyconfig.js # Blockly配置
    ├── editor_config.js    # 编辑器配置
    └── editor_multi.js     # 多选操作
```

### 编辑器对象结构

```javascript
editor {
  version: "2.0",
  brushMod: "line",      // 画笔模式: line/rectangle/tileset
  layerMod: "map",       // 图层模式: fgmap/map/bgmap
  isMobile: false,       // 是否移动端
  
  dom: {},               // 所有DOM元素引用
  uivalues: {},          // UI状态值
  uifunctions: {},       // UI函数
  
  // 子模块
  mode: editor_mode,     // 面板模式管理
  file: editor_file,     // 文件操作
  game: editor_game,     // 游戏数据
  // ...其他模块
}
```

---

## 快速导航

- 查看具体面板功能 → `docs/panels/` 目录
- 查看核心模块详解 → `docs/editor-modules.md`
- 查看画布编辑功能 → `docs/editor-canvas.md`
- 查看数据流程 → `docs/editor-data-flow.md`


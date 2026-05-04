# 游戏加载系统迁移计划

## 现状

游戏加载逻辑位于 `editor.ts` 的 `init` 函数中，依赖复杂的回调链。

## 待迁移功能清单

### 初始化流程 (`editor.ts`)

**位置**: `src/scripts/editor.ts` lines 163-280

```
init
├── 加载 index.html (XHR)
├── 注入游戏 DOM
├── 加载 main.js
├── main.init('editor', callback)
│   ├── editor_*_wrapper 初始化
│   └── afterMainInit
│       ├── game.fixFunctionInGameData
│       └── editor_file 初始化
│           └── afterCoreReset
│               ├── game.idsInit (素材映射)
│               ├── drawInitData (素材绘制)
│               ├── fetchMapFromCore (加载地图)
│               ├── 初始化各面板状态
│               └── 收集 used_flags
```

### 核心数据结构初始化

| 数据 | 来源 | 说明 |
|------|------|------|
| `editor.ids` | `idsInit` | 素材 ID 到信息的映射 |
| `editor.indexs` | `idsInit` | 数字到 ids 索引的映射 |
| `editor.widthsX` | `drawInitData` | 素材类型位置映射 |
| `editor.map` | `fetchMapFromCore` | 当前楼层地图数据 |
| `editor.used_flags` | `addUsedFlags` | 已使用的 flags |

### 迁移建议

把这些维护在 GameDataStore 里

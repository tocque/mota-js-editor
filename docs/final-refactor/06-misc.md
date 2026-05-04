# 其他待迁移功能

## 快捷键系统 (`editor_ui.ts`, `editor_listen.ts`)

**位置**: `src/scripts/editor_ui.ts` (317 行)

### 当前快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+S | 保存 |
| Ctrl+Z | 撤销 |
| Ctrl+Y | 重做 |
| Ctrl+C/X/V | 复制/剪切/粘贴 |
| Delete | 删除 |
| PgUp/PgDn | 切换楼层 |
| H | 帮助 |
| Alt+数字 | 保存图块 |
| 数字 | 读取保存的图块 |

### 迁移方案

使用 `useHotkeys` hook 或自定义 `KeyboardManager`:

```typescript
// src/hooks/useEditorHotkeys.ts
export function useEditorHotkeys() {
  useHotkeys('ctrl+s', handleSave);
  useHotkeys('ctrl+z', handleUndo);
  // ...
}
```

## 提示信息系统 (`editor_ui.ts`)

| 函数 | 说明 |
|------|------|
| `showBlockInfo` | 显示图块信息 |
| `showTips` | 显示随机提示 |

## 事件监听系统 (`editor_listen.ts`)

**位置**: `src/scripts/editor_listen.ts` (200 行)

已部分迁移，主要剩余:
- 移动端触摸事件
- 视口按钮功能
- 各种 checkbox/select 的 onchange

## 工具函数 (`editor_util.ts`)

**位置**: `src/scripts/editor_util.ts` (177 行)

| 函数 | 迁移状态 |
|------|----------|
| `guid` | ✅ 已迁移到 `utils/json.ts` |
| `HTMLescape` | ❌ 待迁移 |
| `encode64/decode64` | ✅ 已迁移到 `utils/encoding.ts` |
| `isset` | ❌ 可用 TypeScript 替代 |
| `getPixel/setPixel` | ❌ Canvas 工具 |
| `rgbToHsl/hslToRgb` | ❌ 颜色转换 |

## 数据面板 (`editor_datapanel.ts`)

**位置**: `src/scripts/editor_datapanel.ts` (127 行)

大部分为空函数占位，实际逻辑已迁移至各 Service。

剩余待处理:
- `appendPic_func`: 追加素材相关

## Blockly 相关

### 已迁移
- `src/blockly/` 新 Blockly 实现
- `Workbench/EventsEditor` 事件编辑器组件

### 可移除
- `src/scripts/blockly.ts` (271 行) - legacy Blockly 修改
- `src/scripts/editor_blockly.ts` (953 行) - legacy 事件编辑器
- `src/scripts/editor_blocklyconfig.js` - legacy 配置

### 配置加载 (`editor_config.ts`)

**位置**: `src/scripts/editor_config.ts` (52 行)

- 加载/保存 `_server/config.json`
- 配置项: theme, shortcut, folded, foldPerCol 等

### Comment 文件加载 (`editor_file.ts`)

**位置**: `src/scripts/editor_file.ts` `loadCommentjs`

加载表格注释定义文件:
- `comment.js`
- `data.comment.js`
- `functions.comment.js`
- `events.comment.js`
- `plugins.comment.js`

## 迁移策略

### Phase 1: 异步化重构

将回调链改为 async/await:

```typescript
// src/services/editorInit.ts
export async function initializeEditor() {
  const config = await loadConfig();
  await injectGameDOM();
  await loadMainScript();
  await initializeGame();
  await initializeMaterials();
  await initializeFloor();
}
```

### Phase 2: 状态分离

创建初始化相关 stores:
- `stores/gameDataState.ts`: 游戏数据
- `stores/materialState.ts`: 素材数据  
- `stores/configState.ts`: 编辑器配置

### Phase 3: React Query 集成

使用 React Query 管理异步状态:

```typescript
const { data: config } = useQuery({
  queryKey: ['editorConfig'],
  queryFn: loadConfig
});
```

### Phase 4: 移除全局依赖

逐步移除 `window.editor` 全局对象依赖，改用 React Context 或 Zustand。

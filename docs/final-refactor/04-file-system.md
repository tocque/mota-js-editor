# 文件保存系统迁移计划

## 现状

文件操作逻辑位于 `editor_file.ts`，通过 fs service 与服务端交互。

## 待迁移功能清单

### 核心保存函数 (`editor_file.ts`)

**位置**: `src/scripts/editor_file.ts` (1003 行)

| 功能 | 函数 | 已迁移 |
|------|------|--------|
| 保存楼层 | `saveFloor`, `saveFloorFile` | ❌ |
| 保存脚本文件 | `saveScript` | ❌ |
| 格式化地图 | `formatMap` | ❌ |
| 自动注册素材 | `autoRegister` | ❌ |
| 注册自动元件 | `registerAutotile` | ❌ |
| 修改ID | `changeIdAndIdnum` | ❌ |
| 删除素材 | `removeMaterial` | ❌ |

### 数据编辑函数

| 功能 | 函数 | Service |
|------|------|---------|
| 编辑道具 | `editItem` | `itemService` ✅ |
| 编辑怪物 | `editEnemy` | `enemyService` ✅ |
| 编辑图块 | `editMapBlocksInfo` | `mapBlockService` ✅ |
| 编辑位置 | `editLoc` | `locService` ✅ |
| 编辑楼层 | `editFloor` | `floorService` ✅ |
| 编辑全塔 | `editTower` | `towerService` ✅ |
| 编辑脚本 | `editFunctions` | `functionsService` ✅ |
| 编辑公共事件 | `editCommonEvent` | `commonEventService` ✅ |
| 编辑插件 | `editPlugins` | `pluginsService` ✅ |

### 通用保存函数 (`saveSetting`)

**位置**: `src/scripts/editor_file.ts` 约 700 行

处理各类配置文件的统一保存:
- icons.js, maps.js, items.js, enemys.js
- data.js, functions.js, events.js, plugins.js
- 楼层文件

## 迁移策略

### Phase 1: 已完成

Services 层已建立，大部分编辑功能已迁移。

### Phase 2: 保存逻辑整合

创建统一的保存 service:

```typescript
// src/services/saveService.ts
export const saveService = {
  async saveFloor(floorId: string, data: FloorData): Promise<void>,
  async saveScript(name: string, data: unknown): Promise<void>,
  async batchSave(changes: SaveChange[]): Promise<void>
};
```

### Phase 3: 格式化函数提取

将 `formatMap` 等格式化函数提取到 utils:

```typescript
// src/utils/mapFormat.ts
export function formatMapArray(map: number[][]): string;
export function parseMapArray(str: string): number[][];
```

### 注意事项

1. `replacerForSaving` 需要处理函数序列化
2. Base64 编码用于写入文件 (`encode64`)
3. 需保持与原始 js 文件格式兼容

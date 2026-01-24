# Design Document: Floor Service Refactor

## 1. Overview

### 1.1 问题回顾

当前楼层数据管理系统存在以下核心问题（详见 requirements.md）：

1. **数据变更难以追踪和同步** - 文件修改后 UI 无法自动更新，多个组件编辑同一数据时缺乏同步机制
2. **无法支持 AI Agent** - Agent 需要命令式 API，且修改后 UI 无法自动同步
3. **元数据订阅粒度过粗** - `useFloorTableMeta` 返回整个 `floors` 对象，导致不必要的重渲染
4. **代码组织混乱** - 业务逻辑散落在 fs 层，缺乏清晰的分层架构

### 1.2 为什么 React Query 不够用？

**关键需求：Agent 和其他非 React 环境需要读写数据**

```
场景 1: Agent 修改楼层标题
  Agent (Node.js) → 调用 API → 修改数据 → UI 自动更新

场景 2: 脚本批量处理
  Script → 读取多个楼层 → 修改 → 保存 → UI 同步

场景 3: 测试环境
  Test → 模拟数据修改 → 验证业务逻辑
```

**React Query 的局限：**
- ✅ 适合 React 组件的数据获取和缓存
- ❌ 无法在非 React 环境使用
- ❌ Agent 调用后无法通知 React 组件更新
- ❌ 缺乏统一的数据访问层

**因此需要：框架无关的状态管理层（FileHandler）**

### 1.3 核心设计理念

#### 内存数据源 + 异步落盘（编辑器模式）

编辑器与互联网应用的本质区别：

| 特性 | 互联网应用 | 编辑器（本设计） |
|------|-----------|-----------------|
| 数据源 | 服务器 | **内存** |
| 写入目标 | 远程 API | **本地文件** |
| 写入延迟 | 网络往返（100ms~数秒） | 落盘（几乎无感） |
| 失败概率 | 较高（网络、服务器错误） | **极低**（除非磁盘满） |
| 乐观更新 | 需要（假设成功，失败回滚） | **不需要**（内存就是真实数据） |
| UI 响应 | 等请求或乐观 | **立即**（同步更新内存） |

**工作模式：**
```
用户修改
    │
    ▼
┌─────────────────┐
│ 更新内存数据     │ ← 同步，UI 立即响应
│ FileHandler     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 异步落盘        │ ← 后台写入文件，几乎必成功
│ fs.writeFile()  │
└─────────────────┘
```

#### 双轨 API：命令式为基底 + Hooks 为包装

```
┌─────────────────────────────────────────────────────────────┐
│                      消费层                                  │
├─────────────────────────────┬───────────────────────────────┤
│      Hooks (React 绑定)      │       命令式 API              │
│  useFloorData(id)           │   floorService.getFloor()     │
│  - 使用 computed 细粒度订阅  │   floorService.getHandler()   │
│  - 基于 useSignal            │   - 直接访问 signal           │
└─────────────────────────────┴───────────────────────────────┘
            │ useSignal                     │ read/update
            │                               │
            ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│           状态层 (内存数据源 + 异步落盘)                      │
│                                                             │
│   FileHandler (每个文件一个实例)                             │
│   ├── content: signal       ← 内存中的当前数据（真实来源）   │
│   ├── isDirty: boolean      ← 是否有未落盘的修改             │
│   ├── update(content)       ← 同步更新 signal + 异步落盘     │
│   └── load()                ← 首次从文件加载                 │
│                                                             │
│   关键：update() 立即更新 signal，然后异步落盘               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (异步落盘)
┌─────────────────────────────────────────────────────────────┐
│                        IO 层                                 │
│   fs.promises.writeFile()  ← 只是持久化副本                  │
└─────────────────────────────────────────────────────────────┘
```

**为什么以命令式 API 为基底？**

| 优势 | 说明 |
|------|------|
| 通用性 | Agent、脚本、测试、UI 都能用 |
| 可测试 | 不依赖 React 环境 |
| 简单直接 | `await service.save()` 比 hooks 更直观 |
| Hooks 只是包装 | `useXxx = subscribe + service.getXxx` |

#### 细粒度订阅：使用 Computed

**问题**：FileHandler 是文件级别的 signal，任何变化都会通知所有订阅者。但很多时候我们只关心某个字段。

**解决方案**：使用 `computed` 创建派生 signal，只在关心的数据变化时触发更新。

```typescript
// 订阅整个楼层数据（粗粒度）
const handler = floorService.getHandler('MT1');
const content = useSignal(handler.content);

// 只关心 title（细粒度）
const handler = floorService.getHandler('MT1');
const title = useMemo(() => computed(() => {
  return ContentUtils.map(handler.content.value, data => data.title);
}), [handler]);
const titleContent = useSignal(title);

// 只关心尺寸
const handler = floorService.getHandler('MT1');
const size = useMemo(() => computed(() => {
  return ContentUtils.map(handler.content.value, data => ({
    width: data.width,
    height: data.height
  }));
}), [handler]);
const sizeContent = useSignal(size);

// 非 React 环境：直接使用 computed
const handler = floorService.getHandler('MT1');
const title = computed(() => {
  return ContentUtils.map(handler.content.value, data => data.title);
});
const dispose = effect(() => {
  const titleContent = title.value;
  if (ContentUtils.isLoaded(titleContent)) {
    console.log('标题:', titleContent.value);
  }
});
```

**工作原理：**
1. FileHandler 的 signal 变化时，触发所有 effect
2. Computed 自动追踪依赖，只在依赖变化时重新计算
3. Computed 内置缓存，避免不必要的计算
4. 多层 computed 可以组合，形成派生链

### 1.4 设计目标

1. ✅ 支持 Agent 和 React 组件共享数据
2. ✅ 按文件隔离并发写入（不同楼层并行，同一楼层串行）
3. ✅ 自动变更同步（Agent 修改后 UI 自动更新）
4. ✅ 细粒度订阅（只在关心的数据变化时更新）
5. ✅ 清晰的分层架构（fs -> services -> ui）
6. ✅ 遗留兼容（保持 core.floors 同步）



## 2. Architecture

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  src/Workbench/FloorPanel, MapPanel, etc.                   │
│  src/stores/FloorDataStore (过渡期保留)                      │
│  - 消费 hooks 层                                             │
└─────────────────────────────────────────────────────────────┘
                              │ useFloorData(), useFloorDataView()
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Hooks Layer                             │
│  src/hooks/                                                  │
│  - useFs.ts            - FS 层 hooks (React 绑定)           │
│  - useFloor.ts         - Floor 业务 hooks                    │
│  - useTableMeta.ts     - TableMeta 业务 hooks                │
│  - 依赖 services 和 fs，提供 React 组件使用的 hooks         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                           │
│  src/services/                                               │
│  - floor/floorService.ts       - 命令式 API（无 React 依赖）│
│  - tableMeta/tableMetaService.ts                             │
│  - 业务逻辑、数据解析、数据转换                              │
│  - 可在任何环境使用（Agent、脚本、测试）                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        FS Layer                              │
│  src/fs/                                                     │
│  - FileHandler, DataView, DataHandler                        │
│  - 文件状态管理（无 React 依赖）                             │
└─────────────────────────────────────────────────────────────┘
```

**依赖规则：**
- UI 层可以依赖 Hooks 层
- Hooks 层可以依赖 Services 层和 FS 层
- Services 层可以依赖 FS 层
- FS 层不依赖其他层
- **Services 层不依赖 React**（保持框架无关）

### 2.2 数据流

#### Agent 调用流程

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Agent Tool: updateFloorTitle                      │
│                                                                      │
│  // Agent 调用命令式 API                                             │
│  floorService.saveFloor('MT1', [                                    │
│    { type: 'change', path: ['title'], value: 'New Title' }          │
│  ]);                                                                 │
│  // 立即返回，内存已更新，文件异步落盘                                │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    floorService.saveFloor()                     │ │
│  │  1. FileHandlerManager.get('project/floors/MT1.js')            │ │
│  │  2. 读取当前内存内容                                            │ │
│  │  3. 解析 → 应用 actions → 序列化                                │ │
│  │  4. fileHandler.update(newContent)                             │ │
│  │       ├─→ 同步：更新 signal → 自动触发 effect → UI 立即更新    │ │
│  │       └─→ 异步：落盘（后台进行）                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │           UI 组件（正在使用 useFloorData('MT1')）               │ │
│  │                                                                 │ │
│  │  FileHandler.content 变化 → useSyncExternalStore 触发          │ │
│  │  → 组件重渲染 → 显示新的 title                                  │ │
│  │                                                                 │ │
│  │  注意：UI 更新是同步的，不需要等待文件落盘                      │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

#### 写入流程（同步 + 异步）

```
saveFloor(id, actions)
    │
    ├─→ 1. 从 FileHandler 读取当前内存数据
    │
    ├─→ 2. 应用 actions（纯函数）
    │
    ├─→ 3. 调用 handler.update(newContent)
    │       │
    │       ├─→ 同步：更新 signal，设置 isDirty = true
    │       │         signal 自动触发 effect → UI 立即更新
    │       │
    │       └─→ 异步：写入文件
    │               ├─→ 成功: isDirty = false
    │               └─→ 失败: error = err（可重试）
    │
    └─→ 4. 函数返回（不等待落盘）
```

### 2.3 目录结构

```
src/
├── fs/                              # FS 层（文件状态管理）
│   ├── FileHandler.ts               # 可观察的文件状态容器（文本层）
│   ├── FileHandlerManager.ts        # FileHandler 实例管理器
│   ├── DataView.ts                  # 数据层只读视图
│   ├── DataHandler.ts               # 数据层可写处理器
│   ├── PersistenceMonitor.ts        # 全局落盘状态监控（可选）
│   ├── fs.ts                        # 底层文件 IO API
│   └── index.ts
│
├── services/                        # Services 层（业务逻辑，无 React 依赖）
│   ├── floor/
│   │   ├── floorService.ts          # 命令式 API（主）
│   │   ├── FloorDataHandler.ts      # 楼层数据处理器（DataHandler 子类）
│   │   ├── floorFileService.ts      # 楼层创建等操作
│   │   ├── coreFloorsSync.ts        # 遗留兼容 - core.floors 同步
│   │   └── index.ts
│   │
│   ├── tower/
│   │   ├── towerService.ts          # 命令式 API（主）
│   │   ├── TowerDataHandler.ts      # 全塔数据处理器（DataHandler 子类）
│   │   └── index.ts
│   │
│   └── tableMeta/
│       ├── tableMetaService.ts      # 命令式 API（主）
│       └── index.ts
│
├── hooks/                           # Hooks 层（React 绑定）
│   ├── useFs.ts                     # FS 层所有 hooks
│   │                                # - useSignal, useFileHandler
│   │                                # - useDataView, useDataHandler
│   ├── useFloor.ts                  # Floor 业务所有 hooks
│   │                                # - useFloorData
│   ├── useTower.ts                  # Tower 业务所有 hooks
│   │                                # - useTowerData
│   ├── useTableMeta.ts              # TableMeta 业务所有 hooks
│   │                                # - useTableMeta, useFloorTableMeta, useLocTableMeta
│   └── index.ts                     # 统一导出
│
└── stores/
    └── FloorDataStore.ts            # 过渡期保留，可能被简化或移除
```

**层次关系：**

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  React Components → useFloorData (from hooks/)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Hooks Layer                             │
│  useFloor.ts → floorService                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                           │
│  floorService → FloorDataHandler / FloorDataView            │
│                 (DataHandler / DataView)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        FS Layer                              │
│  DataHandler → FileHandler → FileHandlerManager → fs.ts     │
│  (数据层)      (文本层)      (实例管理)        (IO)          │
└─────────────────────────────────────────────────────────────┘
```



## 3. Core Types and Utilities

### 3.1 Signal-Based 响应式架构

**设计决策：使用 `alien-signals` 作为内部响应式引擎**

**为什么选择 alien-signals？**
1. **Push-Pull 混合模型** - 天然解决当前设计的推拉模型混淆问题
2. **自动依赖追踪** - computed 自动追踪依赖，无需手动订阅
3. **智能缓存** - 只在依赖变化时重新计算，避免不必要的解析
4. **极致性能** - 比 Vue 3.4 更快，适合高频更新场景
5. **轻量简洁** - API 简单，学习成本低

**核心概念：**

```typescript
import { signal, computed, effect, type ReadonlySignal } from 'alien-signals';

// signal - 可变的响应式状态
const count = signal(0);
count.value = 1; // 触发订阅者

// computed - 自动追踪依赖的派生状态
const doubled = computed(() => count.value * 2);
console.log(doubled.value); // 2

// effect - 副作用（订阅）
const dispose = effect(() => {
  console.log('count:', count.value); // 自动追踪 count
});
```

**在我们的设计中：**
- **FileHandler** - 内部使用 `signal<Content<string>>`，暴露只读引用
- **DataHandler** - 使用 `computed` 自动追踪 FileHandler，无需手动缓存
- **多层嵌套** - computed 链自动传播变化
- **React 集成** - 通过 `effect` 实现 `useSyncExternalStore`

### 3.2 Content<T> - 统一的状态类型

**设计理念：** 受 Rust 的 `Result<T, E>` 和 `Option<T>` 启发，使用 Tagged Union 表示数据的所有可能状态。

**核心类型：**

```typescript
// 通用的 Content 类型 - 适用于所有层
type Content<T> = 
  | { status: 'idle' }                // 空闲，未开始加载
  | { status: 'loading' }             // 加载中
  | { status: 'loaded', value: T }    // 已加载，包含数据
  | { status: 'not-found' }           // 文件未找到
  | { status: 'error', error: Error } // 错误（权限、IO、解析等）

// 具体应用
type FileContent = Content<string>;        // 文件层（文本内容）
type DataContent<T> = Content<T>;          // 数据层（解析后的数据）
```

**状态转换：**

```
idle → loading → loaded
              → not-found
              → error
```

**关键特性：**

1. **类型安全** - TypeScript 可以精确推断每个状态下的数据
2. **统一接口** - 所有层使用相同的类型结构
3. **错误携带** - error 状态包含详细的 Error 对象
4. **可组合** - 可以通过 map/andThen 等函数组合转换
5. **响应式友好** - 配合 signal 实现自动更新

### 3.3 ContentUtils - 通用辅助函数

**职责：** 提供函数式操作工具，简化 Content<T> 的使用。

**设计决策：使用 ts-pattern 进行模式匹配**

项目已安装 `ts-pattern`，它提供了更强大的类型推断和模式匹配能力。因此：
- **模式匹配**：使用 `ts-pattern` 的 `match()` 和 `P` (Pattern)
- **辅助函数**：提供 `map`, `andThen`, `unwrapOr` 等函数式工具

**核心函数：**

```typescript
import { match, P } from 'ts-pattern';

const ContentUtils = {
  // map: 转换成功值（类似 Rust 的 map）
  map<T, R>(
    content: Content<T>,
    fn: (value: T) => R
  ): Content<R> {
    return match(content)
      .with({ status: 'loaded' }, (c) => {
        try {
          return { status: 'loaded' as const, value: fn(c.value) };
        } catch (err) {
          return { status: 'error' as const, error: err as Error };
        }
      })
      .otherwise((c) => c as any);
  },
  
  // andThen: 链式转换，可能失败（类似 Rust 的 and_then）
  andThen<T, R>(
    content: Content<T>,
    fn: (value: T) => Content<R>
  ): Content<R> {
    return match(content)
      .with({ status: 'loaded' }, (c) => {
        try {
          return fn(c.value);
        } catch (err) {
          return { status: 'error' as const, error: err as Error };
        }
      })
      .otherwise((c) => c as any);
  },
  
  // unwrapOr: 获取值或默认值（类似 Rust 的 unwrap_or）
  unwrapOr<T>(content: Content<T>, defaultValue: T): T {
    return match(content)
      .with({ status: 'loaded' }, (c) => c.value)
      .otherwise(() => defaultValue);
  },
  
  // unwrapOrElse: 获取值或执行函数
  unwrapOrElse<T>(
    content: Content<T>,
    fn: (content: Content<T>) => T
  ): T {
    return match(content)
      .with({ status: 'loaded' }, (c) => c.value)
      .otherwise(() => fn(content));
  },
  
  // 类型守卫
  isIdle<T>(content: Content<T>): content is { status: 'idle' } {
    return content.status === 'idle';
  },
  
  isLoading<T>(content: Content<T>): content is { status: 'loading' } {
    return content.status === 'loading';
  },
  
  isLoaded<T>(content: Content<T>): content is { status: 'loaded', value: T } {
    return content.status === 'loaded';
  },
  
  isNotFound<T>(content: Content<T>): content is { status: 'not-found' } {
    return content.status === 'not-found';
  },
  
  isError<T>(content: Content<T>): content is { status: 'error', error: Error } {
    return content.status === 'error';
  },
  
  // 是否可用（已加载）
  isAvailable<T>(content: Content<T>): content is { status: 'loaded', value: T } {
    return content.status === 'loaded';
  },
  
  // 是否处于错误状态
  hasError<T>(content: Content<T>): content is 
    | { status: 'not-found' }
    | { status: 'error', error: Error } {
    return content.status === 'not-found' || content.status === 'error';
  },
};
```

**使用 ts-pattern 进行模式匹配：**

```typescript
import { match } from 'ts-pattern';

const fileContent = handler.getContent();

// 1. 基础模式匹配
const result = match(fileContent)
  .with({ status: 'idle' }, () => 'Not loaded')
  .with({ status: 'loading' }, () => 'Loading...')
  .with({ status: 'loaded' }, (c) => `Content: ${c.value}`)
  .with({ status: 'not-found' }, () => 'File not found')
  .with({ status: 'error' }, (c) => `Error: ${c.error.message}`)
  .exhaustive();

// 2. 使用 map 转换
const length = ContentUtils.map(fileContent, content => content.length);

// 3. 使用 andThen 链式转换（可能失败）
const parsed = ContentUtils.andThen(fileContent, content => {
  try {
    return { status: 'loaded', value: JSON.parse(content) };
  } catch (err) {
    return { status: 'error', error: err as Error };
  }
});

// 4. 使用 unwrapOr 获取值或默认值
const content = ContentUtils.unwrapOr(fileContent, '');

// 5. 使用类型守卫
if (ContentUtils.isLoaded(fileContent)) {
  console.log(fileContent.value); // 类型安全
}

// 6. 组合使用 ts-pattern 的高级特性
const status = match(fileContent)
  .with({ status: 'loaded' }, { status: 'loading' }, () => 'active')
  .with({ status: 'error' }, { status: 'not-found' }, () => 'failed')
  .otherwise(() => 'idle');
```

**为什么选择 ts-pattern？**

1. **更好的类型推断** - TypeScript 能精确推断每个分支的类型
2. **更强大的模式** - 支持嵌套匹配、守卫、通配符等
3. **exhaustive 检查** - 编译时确保处理所有情况
4. **社区成熟** - 广泛使用，文档完善
5. **性能优化** - 内部做了优化，比手写 switch 更快

## 4. Core Components

### 4.1 核心接口

#### 4.1.1 IContentView<T> - 只读内容视图

**职责：** 定义只读内容访问接口，支持多层嵌套。

```typescript
interface IContentView<T> {
  // 主要接口：只读 signal（推荐使用）
  readonly content: ReadonlySignal<Content<T>>;
  
  // 兼容方法（可选，不想用 signal 的场景）
  getContent(): Content<T>;
  subscribe(listener: (content: Content<T>) => void): () => void;
  
  // 重新加载
  refetch(): Promise<void>;
  
  // 获取路径（用于调试）
  getPath(): string;
}
```

**使用方式：**

```typescript
// 方式 1: 直接使用 signal（推荐）
const content = view.content.value;
const dispose = effect(() => {
  console.log('content changed:', view.content.value);
});

// 方式 2: 使用兼容方法
const content = view.getContent();
const unsubscribe = view.subscribe(content => {
  console.log('content changed:', content);
});
```

#### 4.1.2 IContentHandler<T> - 可写内容处理器

**职责：** 扩展 IContentView，添加写入能力。

```typescript
interface IContentHandler<T> extends IContentView<T> {
  // 统一的 update API（支持三种模式）
  update(value: T): void;                                    // 直接设置
  update(transform: (current: T) => T): void;                // 同步转换
  update(transform: (current: T) => Promise<T>): Promise<void>; // 异步转换
  
  // 等待写入队列清空
  waitForIdle(): Promise<void>;
  
  // 删除管理
  markDeletionPending(): void;
  markAsDeleted(): void;
}
```

**update API 使用示例：**

```typescript
// 1. 直接设置新值
handler.update('new content');

// 2. 基于当前值的同步转换
handler.update(current => current + ' appended');

// 3. 基于当前值的异步转换
await handler.update(async current => {
  const processed = await someAsyncOperation(current);
  return processed;
});
```

### 4.2 FileHandler (文本层)

**职责：** 文件系统的直接接口，实现 `IContentHandler<string>`。使用 signal 管理状态，自动通知订阅者。

**核心接口：**

```typescript
class FileHandler implements IContentHandler<string> {
  constructor(path: string, encoding: FileEncoding = 'base64')
  
  // IContentView 接口
  readonly content: ReadonlySignal<Content<string>>;
  getContent(): Content<string>;
  subscribe(listener: (content: Content<string>) => void): () => void;
  refetch(): Promise<void>;
  getPath(): string;
  
  // IContentHandler 接口（可写部分）
  update(value: string): void;
  update(transform: (current: string) => string): void;
  update(transform: (current: string) => Promise<string>): Promise<void>;
  waitForIdle(): Promise<void>;
  markDeletionPending(): void;
  markAsDeleted(): void;
  
  // 内部加载方法（由 Manager 调用）
  load(): Promise<void>;
}
```

**关键特性：**

1. **Signal-based 状态管理** - 内部使用 `signal<Content<string>>`，暴露只读引用
2. **同步更新 + 异步落盘** - `update()` 立即更新 signal 并通知订阅者
3. **优化的写入队列** - 最多保留 2 个任务（正在执行 + 待执行）
4. **自动通知** - signal 变化自动触发所有 effect
5. **删除保护** - 标记删除意图后阻止新的写入操作

**内部实现要点：**

```typescript
class FileHandler {
  // 内部 signal（私有）
  private _content = signal<Content<string>>({ status: 'idle' });
  
  // 暴露只读引用
  readonly content: ReadonlySignal<Content<string>> = this._content;
  
  // update 实现
  update(valueOrTransform: string | ((current: string) => string | Promise<string>)) {
    // 1. 直接值：同步更新 signal
    // 2. 同步转换：获取当前值 → 转换 → 更新 signal
    // 3. 异步转换：获取当前值 → 转换 → 更新 signal（返回 Promise）
    // 所有情况都会触发 writeQueue.enqueue()
  }
}
```

**使用示例：**

```typescript
import { match } from 'ts-pattern';

// 1. 使用 signal（推荐）
const content = handler.content.value;

effect(() => {
  match(handler.content.value)
    .with({ status: 'idle' }, () => console.log('未加载'))
    .with({ status: 'loading' }, () => console.log('加载中...'))
    .with({ status: 'loaded' }, (c) => console.log('内容:', c.value))
    .with({ status: 'not-found' }, () => console.log('文件不存在'))
    .with({ status: 'error' }, (c) => console.log('错误:', c.error.message))
    .exhaustive();
});

// 2. 使用兼容方法
const content = handler.getContent();
if (ContentUtils.isLoaded(content)) {
  console.log('内容长度:', content.value.length);
}

// 3. 使用 ContentUtils.map
const length = computed(() => {
  return ContentUtils.map(handler.content.value, text => text.length);
});

// 4. React 组件
function FileDisplay({ path }: { path: string }) {
  const handler = FileHandlerManager.get(path);
  const content = useSignal(handler.content); // 自定义 hook
  
  return match(content)
    .with({ status: 'idle' }, () => <Button onClick={() => FileHandlerManager.load(path)}>Load</Button>)
    .with({ status: 'loading' }, () => <Loading />)
    .with({ status: 'loaded' }, (c) => <pre>{c.value}</pre>)
    .with({ status: 'not-found' }, () => <NotFound />)
    .with({ status: 'error' }, (c) => <Error error={c.error} />)
    .exhaustive();
}
```

### 4.3 FileHandlerManager

**职责：** 管理 FileHandler 实例，负责实例创建、加载协调、删除管理，确保同一文件路径只有一个 FileHandler 实例（单例模式）。

**核心接口：**

```typescript
class FileHandlerManager {
  // 同步获取或创建 FileHandler（未加载状态）
  get(path: string, encoding: FileEncoding = 'base64'): FileHandler
  
  // 异步加载：确保文件已加载（带加载锁）
  async load(path: string, encoding: FileEncoding = 'base64'): Promise<FileHandler>
  
  // 批量加载
  async loadAll(paths: string[]): Promise<FileHandler[]>
  
  // 检查 FileHandler 是否存在
  has(path: string, encoding: FileEncoding = 'base64'): boolean
  
  // 检查文件是否存在于文件系统
  async exists(path: string): Promise<boolean>
  
  // 检查 FileHandler 是否已加载数据
  isLoaded(path: string, encoding: FileEncoding = 'base64'): boolean
  
  // 删除文件和 FileHandler
  async delete(path: string, force: boolean = false): Promise<void>
  
  // 移除 FileHandler 实例（不删除文件）
  remove(path: string, encoding?: FileEncoding): void
  
  // 强制重新加载
  async reload(path: string): Promise<void>
  
  // 清空所有 FileHandler（用于测试）
  clear(): void
  
  // 获取当前 FileHandler 数量（用于调试）
  get size(): number
}

// 全局单例
export const FileHandlerManager = new FileHandlerManagerImpl();
```

**关键特性：**

1. **实例唯一性**：相同 `path:encoding` 返回同一个 FileHandler 实例
2. **加载锁机制**：并发 load() 同一文件时，返回同一个 Promise，避免重复加载
3. **分离获取和加载**：get() 同步获取，load() 异步加载
4. **删除协调**：delete() 处理删除意图标记、等待队列清空、删除文件、移除 handler
5. **WriteExecutor 自然隔离**：不同文件有不同的 FileHandler，自然实现写入隔离

**加载锁机制：**

```typescript
// 并发加载同一文件
const promise1 = FileHandlerManager.load('MT1.js');
const promise2 = FileHandlerManager.load('MT1.js');
console.log(promise1 === promise2); // true（返回同一个 Promise）

// 避免重复加载
await Promise.all([promise1, promise2]); // 只加载一次
```

**删除流程：**

```typescript
async delete(path: string, force: boolean = false): Promise<void> {
  const handler = this.handlers.get(path);
  if (!handler) {
    // handler 不存在，直接删除文件
    await fs.unlink(path).catch(err => {
      if (err.code !== 'ENOENT') throw err;
    });
    return;
  }
  
  // 非强制删除：检查 isDirty
  if (!force) {
    const content = handler.getContent();
    // 检查是否有未保存的修改
    if (ContentUtils.isLoaded(content) && this.writeQueue.hasPending()) {
      throw new Error('Cannot delete file with unsaved changes');
    }
  }
  
  // 标记删除意图（阻止新写入）
  handler.markDeletionPending();
  
  // 等待写入队列清空（最多等待 1 个正在执行的任务）
  await handler.waitForIdle();
  
  // 删除文件
  await fs.unlink(path).catch(err => {
    if (err.code !== 'ENOENT') throw err;
  });
  
  // 标记为已删除，通知订阅者
  handler.markAsDeleted();
  
  // 移除 handler
  this.handlers.delete(path);
}
```

**使用示例：**

```typescript
// 场景 1: 需要立即使用数据
const handler = await FileHandlerManager.load('MT1.js');
const content = handler.getContent();
if (ContentUtils.isLoaded(content)) {
  const data = parseFloor(content.value);
}

// 场景 2: 先订阅，稍后加载
const handler = FileHandlerManager.get('MT1.js'); // 同步获取
handler.subscribe((state) => {
  if (state.content) console.log('数据加载完成');
});
FileHandlerManager.load('MT1.js'); // 异步加载

// 场景 3: 批量预加载
await FileHandlerManager.loadAll(['MT1.js', 'MT2.js', 'MT3.js']);
// 之后所有 get() 都是同步的，数据已就绪

// 场景 4: 删除文件
await FileHandlerManager.delete('MT1.js'); // 检查 isDirty，等待队列，删除文件
```

### 4.3 useSignal (通用 Signal 绑定)

**职责：** 将 alien-signals 的 signal 绑定到 React 组件，实现自动订阅和更新。

**位置：** `src/hooks/useFs.ts`

**核心接口：**

```typescript
// src/hooks/useFs.ts
import { useSyncExternalStore } from 'react';
import { effect, type ReadonlySignal } from 'alien-signals';

export function useSignal<T>(signal: ReadonlySignal<T>): T {
  return useSyncExternalStore(
    (callback) => effect(() => {
      signal.value; // 触发依赖追踪
      callback();
    }),
    () => signal.value,
    () => signal.value
  );
}
```

**关键特性：**

1. **通用性** - 可用于任何 ReadonlySignal，不限于特定业务
2. **简单** - 只有 10 行代码，易于理解
3. **标准** - 基于 React 18 的 useSyncExternalStore
4. **自动清理** - effect 返回的 dispose 函数会被 React 自动调用
5. **并发模式兼容** - useSyncExternalStore 保证并发安全

**使用示例：**

```typescript
// 1. 基础用法
function MyComponent() {
  const handler = FileHandlerManager.get('file.txt');
  const content = useSignal(handler.content); // 自动订阅
  
  return match(content)
    .with({ status: 'loaded' }, (c) => <div>{c.value}</div>)
    .otherwise(() => <Loading />);
}

// 2. 配合 computed
function FloorTitle({ floorId }: { floorId: string }) {
  const handler = floorService.getDataHandler(floorId);
  
  // 创建派生 signal
  const title = useMemo(() => computed(() => {
    return ContentUtils.map(handler.content.value, data => data.title);
  }), [handler]);
  
  const titleContent = useSignal(title); // 订阅派生 signal
  
  return match(titleContent)
    .with({ status: 'loaded' }, (c) => <h1>{c.value}</h1>)
    .otherwise(() => <span>Loading...</span>);
}
```

### 4.3.1 FS 层 Hooks (useFs.ts)

**职责：** 提供 FS 层的所有 React Hooks。

**位置：** `src/hooks/useFs.ts`

**完整实现：**

```typescript
// src/hooks/useFs.ts
import { useSyncExternalStore } from 'react';
import { effect, type ReadonlySignal } from 'alien-signals';
import type { FileHandler, DataView, DataHandler, Content } from '@/fs';

/**
 * 订阅任何 signal
 */
export function useSignal<T>(signal: ReadonlySignal<T>): T {
  return useSyncExternalStore(
    (callback) => effect(() => {
      signal.value;
      callback();
    }),
    () => signal.value,
    () => signal.value
  );
}

/**
 * 订阅 FileHandler（可写）
 */
export function useFileHandler(
  handler: FileHandler
): [Content<string>, typeof handler.update] {
  const content = useSignal(handler.content);
  return [content, handler.update.bind(handler)];
}

/**
 * 订阅 DataView（只读）
 */
export function useDataView<T>(view: DataView<T>): Content<T> {
  return useSignal(view.content);
}

/**
 * 订阅 DataHandler（可写）
 */
export function useDataHandler<T>(
  handler: DataHandler<T>
): [Content<T>, typeof handler.update] {
  const content = useSignal(handler.content);
  return [content, handler.update.bind(handler)];
}
```

**使用示例：**

```typescript
import { useFileHandler, useDataView, useDataHandler } from '@/hooks';

// 文件层
function FileEditor({ path }: { path: string }) {
  const handler = FileHandlerManager.get(path);
  const [content, update] = useFileHandler(handler);
  // ...
}

// 数据层只读（类型转换）
function DataDisplay() {
  const handler = someService.getHandler();
  const view: IContentView<SomeData> = handler; // 类型转换为只读
  const content = useDataView(view);
  // ...
}

// 数据层可写
function DataEditor() {
  const handler = someService.getHandler();
  const [content, update] = useDataHandler(handler);
  // ...
}
```

### 4.4 数据层处理器（DataView 和 DataHandler）

**职责：** 在 FileHandler（文本层）之上提供数据层抽象，使用 computed 自动处理 parse/stringify 和缓存。

**设计决策：明确区分只读和可写**

- **DataView**：只读数据视图，实现 `IContentView<T>`
- **DataHandler**：可写数据处理器，实现 `IContentHandler<T>`

#### 4.4.1 DataView（只读）

**核心接口：**

```typescript
abstract class DataView<T> implements IContentView<T> {
  constructor(protected fileHandler: FileHandler)
  
  // IContentView 接口（只读）
  readonly content: ReadonlySignal<Content<T>>;
  getContent(): Content<T>;
  subscribe(listener: (content: Content<T>) => void): () => void;
  refetch(): Promise<void>;
  getPath(): string;
  
  // 子类实现
  protected abstract parse(text: string): T;
}
```

**关键特性：**

1. **Computed 自动缓存** - 使用 `computed(() => parse(fileHandler.content.value))`
2. **只读视图** - 不提供 update 方法
3. **透明代理** - 自动追踪 FileHandler 的 signal
4. **懒解析** - 只在访问时才 parse

#### 4.4.2 DataHandler（可写）

**核心接口：**

```typescript
abstract class DataHandler<T> implements IContentHandler<T> {
  constructor(protected fileHandler: FileHandler)
  
  // IContentView 接口（只读部分）
  readonly content: ReadonlySignal<Content<T>>;
  getContent(): Content<T>;
  subscribe(listener: (content: Content<T>) => void): () => void;
  refetch(): Promise<void>;
  getPath(): string;
  
  // IContentHandler 接口（可写部分）
  update(value: T): void;
  update(transform: (current: T) => T): void;
  update(transform: (current: T) => Promise<T>): Promise<void>;
  waitForIdle(): Promise<void>;
  markDeletionPending(): void;
  markAsDeleted(): void;
  
  // 子类实现
  protected abstract parse(text: string): T;
  protected abstract stringify(data: T): string;
}
```

**关键特性：**

1. **Computed 自动缓存** - 使用 `computed(() => parse(fileHandler.content.value))`
2. **可写处理器** - 提供 update 方法，写入底层 FileHandler
3. **类型安全** - 泛型 `T` 确保数据类型正确
4. **错误隔离** - parse 错误不影响文件层

**内部实现要点：**

```typescript
abstract class DataHandler<T> {
  readonly content: ReadonlySignal<Content<T>>;
  
  constructor(protected fileHandler: FileHandler) {
    this.content = computed(() => {
      const fileContent = fileHandler.content.value; // 自动追踪依赖
      
      return ContentUtils.andThen(fileContent, (text) => {
        try {
          const data = this.parse(text);
          return { status: 'loaded' as const, value: data };
        } catch (err) {
          return { status: 'error' as const, error: err as Error };
        }
      });
    });
  }
  
  // update 实现：写入底层 FileHandler
  update(valueOrTransform: T | ((current: T) => T | Promise<T>)) {
    // 1. 如果是直接值：stringify → fileHandler.update()
    // 2. 如果是转换函数：获取当前值 → 转换 → stringify → fileHandler.update()
    // computed 会自动重新计算
  }
}
```

**使用示例：**

```typescript
// 只读视图
class FloorDataView extends DataView<FloorData> {
  constructor(fileHandler: FileHandler, private floorId: string) {
    super(fileHandler);
  }
  
  protected parse(text: string): FloorData {
    return parseFloorContent(text, this.floorId);
  }
}

// 可写处理器
class FloorDataHandler extends DataHandler<FloorData> {
  constructor(fileHandler: FileHandler, private floorId: string) {
    super(fileHandler);
  }
  
  protected parse(text: string): FloorData {
    return parseFloorContent(text, this.floorId);
  }
  
  protected stringify(data: FloorData): string {
    return stringifyFloorData(data);
  }
  
  // 业务方法（使用 computed）
  readonly title = computed(() => {
    return ContentUtils.map(this.content.value, data => data.title);
  });
}

// 使用只读视图
const view = getFloorDataView('MT1');
const content = view.content.value;

// 使用可写处理器
const handler = getFloorDataHandler('MT1');
handler.update(data => ({ ...data, title: 'New' }));
```

**多层嵌套的价值：**

```typescript
// 可以有多层 computed 链
FileHandler (signal<Content<string>>)
  → DataHandler (computed<Content<FloorData>>)
    → TitleHandler (computed<Content<string>>)

// 每一层都是 computed，自动追踪依赖
// 变化自动传播，无需手动管理
```

### 4.5 floorService (命令式 API)

**职责：** 楼层业务逻辑核心，提供命令式 API 供 Agent、脚本、测试使用。内部使用 DataHandler/DataView 处理数据层。

**核心接口：**

```typescript
export const floorService = {
  // 获取楼层数据（load 模式：抛出异常）
  getFloor(floorId: string): Promise<FloorData>
  
  // 获取楼层数据（Content 模式：返回所有状态）
  getFloorContent(floorId: string): Content<FloorData>
  
  // 获取 Handler（可写，也可类型转换为只读）
  getHandler(floorId: string): FloorDataHandler
  
  // 保存楼层修改
  saveFloor(floorId: string, actions: Action[]): Promise<void>
  
  // 批量修改多个楼层
  batchSave(changes: Array<{ floorId: string; actions: Action[] }>): Promise<void>
  
  // 创建新楼层
  createFloor(floorId: string, options?: CreateFloorOptions): Promise<void>
  
  // 批量创建楼层
  batchCreateFloors(floorIds: string[], options?: CreateFloorOptions): Promise<void>
  
  // 删除楼层
  deleteFloor(floorId: string): Promise<void>
  
  // 获取所有楼层 ID
  getFloorIds(): string[]
  
  // 重新加载楼层数据（从文件重新读取）
  refetch(floorId: string): Promise<void>
  
  // 预览变更后的内容（不实际写入）
  previewChanges(floorId: string, actions: Action[]): Promise<FloorData>
}
```

**关键特性：**

1. **不依赖 React**：可在任何 JavaScript 环境使用
2. **使用 DataHandler**：自动处理 parse/stringify 和缓存
3. **三种 API 模式**：
   - `getFloor()` - load 模式，抛出异常，保证返回数据
   - `getFloorContent()` - Content 模式，返回所有状态
   - `getHandler()` - 暴露 Handler，直接访问 signal（可类型转换为只读）
4. **完整的 CRUD 操作**：创建、读取、更新、删除楼层
5. **内存 + 落盘模式**：修改立即生效，异步落盘

**实现要点：**

```typescript
class FloorServiceImpl {
  // 获取 DataHandler（带缓存）
  private getDataHandler(floorId: string): FloorDataHandler {
    return getFloorDataHandler(floorId);
  }
  
  // load 模式：使用 match 处理状态，抛出异常
  async getFloor(floorId: string): Promise<FloorData> {
    await FileHandlerManager.load(`project/floors/${floorId}.js`);
    const handler = this.getDataHandler(floorId);
    const content = handler.content.value;
    
    return match(content)
      .with({ status: 'loaded' }, (c) => c.value)
      .otherwise(() => { throw new Error(`Floor ${floorId} not available`); });
  }
  
  // Content 模式：直接返回 signal 的值
  getFloorContent(floorId: string): Content<FloorData> {
    const handler = this.getDataHandler(floorId);
    return handler.content.value;
  }
  
  // 获取 Handler：暴露 DataHandler
  getHandler(floorId: string): FloorDataHandler {
    return this.getDataHandler(floorId);
  }
  
  // 保存：获取当前数据 → 应用 actions → 更新
  async saveFloor(floorId: string, actions: Action[]): Promise<void> {
    await FileHandlerManager.load(`project/floors/${floorId}.js`);
    const handler = this.getDataHandler(floorId);
    
    handler.update(currentData => applyActions(currentData, actions));
  }
  
  // 创建楼层：生成初始数据 → 创建文件 → 添加到 floorIds
  async createFloor(floorId: string, options?: CreateFloorOptions): Promise<void> {
    const floorData = generateInitialFloorData(floorId, options);
    const content = stringifyFloorData(floorData);
    
    const path = `project/floors/${floorId}.js`;
    await fs.writeFile(path, content);
    
    // 添加到 floorIds 并触发 FileHandler 加载
    await this.addToFloorIds(floorId);
    await FileHandlerManager.load(path);
  }
  
  // 删除楼层：删除文件 → 从 floorIds 移除 → 清理 handler
  async deleteFloor(floorId: string): Promise<void> {
    const path = `project/floors/${floorId}.js`;
    
    // 删除文件（FileHandlerManager 会处理 handler 清理）
    await FileHandlerManager.delete(path);
    
    // 从 floorIds 移除
    await this.removeFromFloorIds(floorId);
  }
  
  // 重新加载：委托给 FileHandlerManager
  async refetch(floorId: string): Promise<void> {
    return FileHandlerManager.reload(`project/floors/${floorId}.js`);
  }
}
```
  async refetch(floorId: string): Promise<void> {
    return FileHandlerManager.reload(`project/floors/${floorId}.js`);
  }
}
```

**使用示例：**

```typescript
// 1. load 模式（业务逻辑）
try {
  const floorData = await floorService.getFloor('MT1');
  console.log(floorData.title); // 保证有数据
} catch (err) {
  console.error('加载失败:', err);
}

// 2. Content 模式（UI 展示）
const content = floorService.getFloorContent('MT1');
match(content)
  .with({ status: 'loaded' }, (c) => console.log('标题:', c.value.title))
  .otherwise(() => {});

// 3. 保存修改
await floorService.saveFloor('MT1', [
  { type: 'change', path: ['title'], value: '新标题' }
]);

// 4. 重新加载（从文件重新读取）
await floorService.refetch('MT1');

// 5. 直接访问 signal（非 React 环境）
const handler = floorService.getHandler('MT1');
const content = handler.content.value; // 直接读取

// 6. 订阅变化（非 React 环境）
const handler = floorService.getHandler('MT1');
const dispose = effect(() => {
  const content = handler.content.value;
  match(content)
    .with({ status: 'loaded' }, (c) => console.log('数据变化:', c.value))
    .otherwise(() => {});
});
// 不再需要时清理
dispose();

// 7. 使用 computed 做细粒度订阅
const handler = floorService.getHandler('MT1');
const title = computed(() => {
  return ContentUtils.map(handler.content.value, data => data.title);
});
const dispose = effect(() => {
  const titleContent = title.value;
  if (ContentUtils.isLoaded(titleContent)) {
    console.log('标题变化:', titleContent.value);
  }
});
```

### 4.6 业务层 Hooks

**职责：** 提供业务特定的 React Hooks，内部使用通用 hooks。

**位置：** `src/hooks/useFloor.ts`

#### 4.6.1 useFloorData（最常用，可写）

**核心接口：**

```typescript
// src/hooks/useFloor.ts
export function useFloorData(
  floorId: string
): [Content<FloorData>, (value: FloorData | ((current: FloorData) => FloorData | Promise<FloorData>)) => void | Promise<void>] {
  const handler = floorService.getHandler(floorId);
  return useDataHandler(handler);
}
```

**使用示例：**

```typescript
// 1. 基础用法
function FloorEditor({ floorId }: { floorId: string }) {
  const [content, update] = useFloorData(floorId);
  
  const handleTitleChange = (newTitle: string) => {
    update(data => ({ ...data, title: newTitle }));
  };
  
  return match(content)
    .with({ status: 'loaded' }, (c) => (
      <Input value={c.value.title} onChange={handleTitleChange} />
    ))
    .otherwise(() => <Loading />);
}

// 2. 细粒度订阅（手动使用 computed）
function FloorTitle({ floorId }: { floorId: string }) {
  const handler = floorService.getHandler(floorId);
  
  const title = useMemo(() => computed(() => {
    return ContentUtils.map(handler.content.value, data => data.title);
  }), [handler]);
  
  const titleContent = useSignal(title);
  
  return match(titleContent)
    .with({ status: 'loaded' }, (c) => <h1>{c.value}</h1>)
    .otherwise(() => <span>Loading...</span>);
}

// 3. 复杂派生数据
function FloorSize({ floorId }: { floorId: string }) {
  const handler = floorService.getHandler(floorId);
  
  const size = useMemo(() => computed(() => {
    return ContentUtils.map(handler.content.value, data => ({
      width: data.width,
      height: data.height
    }));
  }), [handler]);
  
  const sizeContent = useSignal(size);
  
  return match(sizeContent)
    .with({ status: 'loaded' }, (c) => (
      <div>{c.value.width} x {c.value.height}</div>
    ))
    .otherwise(() => <Loading />);
}

// 4. 异步更新
function FloorMapProcessor({ floorId }: { floorId: string }) {
  const [content, update] = useFloorData(floorId);
  
  const handleProcess = async () => {
    await update(async data => ({
      ...data,
      map: await processMap(data.map)
    }));
  };
  
  return match(content)
    .with({ status: 'loaded' }, (c) => (
      <Button onClick={handleProcess}>Process Map</Button>
    ))
    .otherwise(() => <Loading />);
}

// 5. 使用类型守卫
function FloorSize({ floorId }: { floorId: string }) {
  const [content] = useFloorData(floorId);
  
  if (ContentUtils.isLoading(content)) {
    return <Loading />;
  }
  
  if (ContentUtils.isLoaded(content)) {
    return <div>{content.value.width} x {content.value.height}</div>;
  }
  
  return <Error />;
}

// 6. 多个 handler 组合
function FloorEditorWithMeta({ floorId }: { floorId: string }) {
  const [floorContent, updateFloor] = useFloorData(floorId);
  
  // 如果需要只读，可以类型转换
  const metaHandler: IContentView<TableMeta> = tableMetaService.getHandler();
  const metaContent = useDataView(metaHandler);
  
  // 两个 handler 都会自动订阅
  return <div>...</div>;
}

// 6. 只读使用（类型转换）
function FloorDisplay({ floorId }: { floorId: string }) {
  const handler = floorService.getHandler(floorId);
  const view: IContentView<FloorData> = handler; // 类型转换为只读
  const content = useDataView(view);
  
  return match(content)
    .with({ status: 'loaded' }, (c) => <div>{c.value.title}</div>)
    .otherwise(() => <Loading />);
}
```

**关键特性：**

1. **统一接口** - 一个 hook 同时提供读写能力
2. **类型安全** - TypeScript 自动推断返回类型
3. **符合直觉** - 像 useState 一样的 API
4. **简化代码** - 不需要单独的 mutation hook

### 4.7 PersistenceMonitor (可选)

**职责：** 全局落盘状态监控，监控所有 FileHandler 的落盘状态。

**使用场景：**
- 编辑器关闭前检查是否有未保存的更改
- 状态栏显示保存进度
- 落盘失败时提示用户

**核心接口：**

```typescript
interface PersistenceStatus {
  savingCount: number;      // 正在落盘的文件数量
  dirtyCount: number;        // 有未落盘修改的文件数量
  errorCount: number;        // 落盘失败的文件数量
  errors: PersistError[];    // 落盘失败的详细信息
  savingPaths: string[];     // 正在落盘的文件路径
  dirtyPaths: string[];      // 有未落盘修改的文件路径
}

class PersistenceMonitor {
  // 开始监控一个 FileHandler
  watch(handler: FileHandler): void
  
  // 停止监控
  unwatch(path: string): void
  
  // 获取当前状态
  getStatus(): PersistenceStatus
  
  // 是否有未保存的修改
  hasUnsavedChanges(): boolean
  
  // 重试所有失败的落盘
  retryAllFailed(): Promise<void>
  
  // 事件订阅
  readonly onChange: EventEmitter<PersistenceStatus>
  readonly onError: EventEmitter<PersistError>
  readonly onAllSaved: EventEmitter<void>
}
```

**使用示例：**

```typescript
// 监控文件
const handler = FileHandlerManager.get('project/floors/MT1.js');
PersistenceMonitor.watch(handler);

// 订阅状态变化
PersistenceMonitor.onChange.on((status) => {
  console.log(`脏文件: ${status.dirtyCount}, 错误: ${status.errorCount}`);
});

// 编辑器关闭前检查
window.addEventListener('beforeunload', (e) => {
  if (PersistenceMonitor.hasUnsavedChanges()) {
    e.preventDefault();
    e.returnValue = '有未保存的更改，确定要离开吗？';
  }
});
```

### 4.8 towerService (全塔属性服务)

**职责：** 管理全塔属性数据（`project/data.js`），提供命令式 API。

**核心接口：**

```typescript
export const towerService = {
  // 获取全塔数据（load 模式：抛出异常）
  getTowerData(): Promise<TowerData>
  
  // 获取全塔数据（Content 模式：返回所有状态）
  getTowerDataContent(): Content<TowerData>
  
  // 获取 Handler（可写，也可类型转换为只读）
  getHandler(): TowerDataHandler
  
  // 保存全塔修改
  saveTowerData(actions: Action[]): Promise<void>
  
  // 重新加载全塔数据（从文件重新读取）
  refetch(): Promise<void>
  
  // 预览变更后的内容（不实际写入）
  previewChanges(actions: Action[]): Promise<TowerData>
}
```

**关键特性：**

1. **单文件管理** - 全塔数据只有一个文件 `project/data.js`
2. **与 floor service 一致的架构** - 使用相同的 FileHandler + DataHandler 模式
3. **不依赖 React** - 可在任何 JavaScript 环境使用
4. **内存 + 落盘模式** - 修改立即生效，异步落盘

**实现要点：**

```typescript
class TowerServiceImpl {
  private readonly DATA_FILE_PATH = 'project/data.js';
  private readonly DATA_VAR_NAME = 'data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d';
  
  // 获取 DataHandler（单例）
  private getDataHandler(): TowerDataHandler {
    return getTowerDataHandler();
  }
  
  // load 模式：使用 match 处理状态，抛出异常
  async getTowerData(): Promise<TowerData> {
    await FileHandlerManager.load(this.DATA_FILE_PATH);
    const handler = this.getDataHandler();
    const content = handler.content.value;
    
    return match(content)
      .with({ status: 'loaded' }, (c) => c.value)
      .otherwise(() => { throw new Error('Tower data not available'); });
  }
  
  // Content 模式：直接返回 signal 的值
  getTowerDataContent(): Content<TowerData> {
    const handler = this.getDataHandler();
    return handler.content.value;
  }
  
  // 获取 Handler：暴露 DataHandler
  getHandler(): TowerDataHandler {
    return this.getDataHandler();
  }
  
  // 保存：获取当前数据 → 应用 actions → 更新
  async saveTowerData(actions: Action[]): Promise<void> {
    await FileHandlerManager.load(this.DATA_FILE_PATH);
    const handler = this.getDataHandler();
    
    handler.update(currentData => {
      const updated = applyActions(currentData, actions);
      
      // 检查 firstData.floorId 是否在 main.floorIds 中
      const mainFloorIds = updated.main?.floorIds;
      const firstData = updated.firstData;
      if (mainFloorIds && firstData && Array.isArray(mainFloorIds)) {
        if (!mainFloorIds.includes(firstData.floorId)) {
          firstData.floorId = mainFloorIds[0];
        }
      }
      
      return updated;
    });
  }
  
  // 重新加载：委托给 FileHandlerManager
  async refetch(): Promise<void> {
    return FileHandlerManager.reload(this.DATA_FILE_PATH);
  }
}
```

**TowerDataHandler 实现：**

```typescript
class TowerDataHandler extends DataHandler<TowerData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler);
  }
  
  protected parse(text: string): TowerData {
    // 解析 JS 文件，提取 data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d 变量
    return parseTowerDataFile(text);
  }
  
  protected stringify(data: TowerData): string {
    // 序列化为 JS 文件格式
    return serializeToJsDataFile('data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d', data);
  }
}
```

**使用示例：**

```typescript
// 1. load 模式（业务逻辑）
try {
  const towerData = await towerService.getTowerData();
  console.log(towerData.main.floorIds);
} catch (err) {
  console.error('加载失败:', err);
}

// 2. Content 模式（UI 展示）
const content = towerService.getTowerDataContent();
match(content)
  .with({ status: 'loaded' }, (c) => console.log('楼层列表:', c.value.main.floorIds))
  .otherwise(() => {});

// 3. 保存修改
await towerService.saveTowerData([
  { type: 'change', path: ['main', 'title'], value: '新标题' }
]);

// 4. 直接访问 signal（非 React 环境）
const handler = towerService.getHandler();
const content = handler.content.value;

// 5. 订阅变化（非 React 环境）
const handler = towerService.getHandler();
const dispose = effect(() => {
  const content = handler.content.value;
  match(content)
    .with({ status: 'loaded' }, (c) => console.log('数据变化:', c.value))
    .otherwise(() => {});
});

// 6. 使用 computed 做细粒度订阅
const handler = towerService.getHandler();
const floorIds = computed(() => {
  return ContentUtils.map(handler.content.value, data => data.main.floorIds);
});
const dispose = effect(() => {
  const floorIdsContent = floorIds.value;
  if (ContentUtils.isLoaded(floorIdsContent)) {
    console.log('楼层列表变化:', floorIdsContent.value);
  }
});
```

**Hooks 层：**

```typescript
// src/hooks/useTower.ts
export function useTowerData(): [Content<TowerData>, typeof handler.update] {
  const handler = towerService.getHandler();
  return useDataHandler(handler);
}

// 使用示例
function TowerEditor() {
  const [content, update] = useTowerData();
  
  const handleTitleChange = (newTitle: string) => {
    update(data => ({
      ...data,
      main: { ...data.main, title: newTitle }
    }));
  };
  
  return match(content)
    .with({ status: 'loaded' }, (c) => (
      <Input value={c.value.main.title} onChange={handleTitleChange} />
    ))
    .otherwise(() => <Loading />);
}

// 细粒度订阅示例
function FloorIdsList() {
  const handler = towerService.getHandler();
  
  const floorIds = useMemo(() => computed(() => {
    return ContentUtils.map(handler.content.value, data => data.main.floorIds);
  }), [handler]);
  
  const floorIdsContent = useSignal(floorIds);
  
  return match(floorIdsContent)
    .with({ status: 'loaded' }, (c) => (
      <ul>
        {c.value.map(id => <li key={id}>{id}</li>)}
      </ul>
    ))
    .otherwise(() => <Loading />);
}
```

**与 floor service 的对比：**

| 特性 | floor service | tower service |
|------|--------------|---------------|
| 文件数量 | 多个（每个楼层一个） | 单个（project/data.js） |
| Handler 管理 | 每个楼层一个 handler | 全局单例 handler |
| 并发写入 | 不同楼层可并行 | 单文件串行 |
| API 模式 | getFloor(floorId) | getTowerData() |
| 架构模式 | 完全相同（FileHandler + DataHandler） | 完全相同 |

### 4.9 coreFloorsSync (遗留兼容)

**职责：** 保持 `core.floors` 与 FileHandler 同步，供未重构模块使用。

**原因：** 部分未重构模块依赖 `core.floors` 全局对象。

**工作原理：**
1. 订阅所有楼层文件的 FileHandler 变更
2. 文件变更时，解析内容并同步到 `core.floors`

**核心接口：**

```typescript
// 启动 core.floors 同步
export function setupCoreFloorsSync(): void

// 为新创建的楼层添加同步
export function addFloorSync(floorId: string): void

// 移除楼层同步
export function removeFloorSync(floorId: string): void

// 停止所有同步
export function stopCoreFloorsSync(): void
```

**数据流：**

```
floorService.saveFloor()
    │
    ▼
FileHandler.update()
    │
    ├─→ UI 组件更新 (useFloorData)
    │
    └─→ coreFloorsSync 订阅
            │
            ▼
        core.floors[floorId] = data
        (遗留代码可继续使用)
```

**未来：** 完全重构后可删除此模块。



## 5. Key Design Decisions

### 5.1 为什么使用 alien-signals？

**问题：当前设计的推拉模型混淆**

之前的设计混合了 push（手动 subscribe/notify）和 pull（getContent 懒解析）模型：
- FileHandler 通过手动 subscribe/notify 推送变化
- DataHandler 订阅 FileHandler，但在 getContent() 时才懒解析（pull）
- 每次 FileHandler 通知时都 `invalidateCache()`，即使是 `loading`/`not-found` 状态
- 导致不必要的缓存清除和重新解析

**alien-signals 的解决方案：**

| 特性 | 手动实现 | alien-signals |
|------|---------|---------------|
| 依赖追踪 | 手动订阅 fileHandler | computed 自动追踪 |
| 缓存管理 | 手动 invalidateCache() | computed 内置缓存 |
| 缓存失效 | 每次通知都清除 | 只在依赖变化时失效 |
| 多层嵌套 | 手动传播 | computed 链自动传播 |
| 性能 | 可能重复解析 | 智能缓存 + 懒计算 |

**核心优势：**
1. **Push-Pull 混合模型** - 天然支持响应式 + 懒计算
2. **自动依赖追踪** - 无需手动订阅和清理
3. **智能缓存** - 只在真正需要时重新计算
4. **极致性能** - 比 Vue 3.4 更快

### 5.2 为什么暴露只读 Signal？

**方案对比：**

| 方案 | DataHandler 实现 | 多层嵌套 | 实现灵活性 | 使用便利性 |
|------|-----------------|---------|-----------|-----------|
| 完全隐藏 | ❌ 困难（手动订阅） | ❌ 需要手动传播 | ✅ 可替换库 | ⚠️ 只能用包装方法 |
| 暴露只读 signal | ✅ 简单（computed） | ✅ 自动（computed 链） | ⚠️ 绑定 signal API | ✅ 可直接用 signal |

**最终选择：暴露只读 signal + 提供兼容方法**

```typescript
interface IContentHandler<T> {
  // 主要接口：只读 signal（推荐）
  readonly content: ReadonlySignal<Content<T>>;
  
  // 兼容方法（可选）
  getContent(): Content<T>;
  subscribe(listener: (content: Content<T>) => void): () => void;
}
```

**理由：**
1. **DataHandler 实现简洁** - 使用 computed 自动追踪，无需手动缓存
2. **多层嵌套自然** - computed 链自动传播变化
3. **使用灵活** - 可以直接用 signal，也可以用兼容方法
4. **向后兼容** - 不想学 signal 的可以继续用 getContent()

### 5.3 为什么统一 update API？

**之前的设计：**
- `update(value: T)` - 直接设置
- `atomicUpdate(transform: (T) => T | Promise<T>)` - 原子性转换

**问题：**
- 两个 API 功能重叠
- atomicUpdate 的"原子性"在单线程 JavaScript 中意义不大
- 增加 API 复杂度

**改进方案：统一为一个 update API**

```typescript
update(value: T): void;                                    // 直接设置
update(transform: (current: T) => T): void;                // 同步转换
update(transform: (current: T) => Promise<T>): Promise<void>; // 异步转换
```

**优势：**
1. **API 更简洁** - 一个方法支持三种模式
2. **类型安全** - TypeScript 正确推断返回类型
3. **使用直观** - 根据参数类型自动选择行为

### 5.4 为什么使用 ts-pattern 而不是自定义 match？

**ts-pattern 的优势：**
- ✅ 更好的类型推断 - TypeScript 能精确推断每个分支的类型
- ✅ exhaustive 检查 - 编译时确保处理所有情况
- ✅ 更强大的模式 - 支持嵌套匹配、守卫、通配符等
- ✅ 社区成熟 - 广泛使用，文档完善，持续维护
- ✅ 性能优化 - 内部做了优化，比手写 switch 更快

**保留 ContentUtils 的原因：**
- `map`, `andThen`, `unwrapOr` 等函数式工具仍然有价值
- 提供更简洁的 API 用于常见操作
- 类型守卫（`isLoaded`, `isError` 等）提供便利

### 5.5 为什么需要 FileHandler 而不是 React Query？

**React Query 的局限：**
- 只能在 React 组件中使用
- Agent 在 Node.js 或浏览器非 React 环境运行
- Agent 调用后无法通知 React 组件更新

**FileHandler 的优势：**
- 框架无关，可在任何 JavaScript 环境使用
- 提供统一的数据源，Agent 和 UI 共享
- 通过订阅机制实现自动同步

### 5.6 为什么选择内存数据源模式？

**编辑器 vs 互联网应用的本质区别：**
- 编辑器：本地文件操作，几乎必成功
- 互联网应用：网络请求，失败概率高

**因此：**
- 不需要"乐观更新 + 回滚"
- 内存就是真实数据，文件只是持久化副本
- UI 可以立即响应，不需要等待

### 5.7 为什么选择双轨 API？

**命令式 API 为基底：**
- 通用性强：Agent、脚本、测试都能用
- 可测试：不依赖 React 环境
- 简单直接：`await service.save()` 比 hooks 更直观

**Hooks API 为包装：**
- React 组件的便利性
- 自动订阅和清理
- 与 React 生态集成

### 5.8 为什么用 useSyncExternalStore？

- React 18 官方推荐的外部状态订阅方式
- 并发模式兼容
- 自动处理订阅和清理

### 5.9 为什么需要 coreFloorsSync？

- 部分未重构模块依赖 `core.floors`
- 提供过渡期兼容
- 完全重构后可删除

### 5.10 设计中需要注意的问题

#### 5.10.1 状态转换的完整性

**问题：** `refetch()` 时状态如何转换？

```typescript
// 当前状态：loaded
handler.refetch();
// 应该变成：loading → loaded/error

// 实现：
async refetch(): Promise<void> {
  // 转换到 loading 状态
  this._content.value = { status: 'loading' };
  
  // 重新加载
  await this.load();
}
```

**状态转换图（完整版）：**
```
idle → loading → loaded ⟲ (refetch)
              → not-found
              → error ⟲ (refetch/retry)
```

#### 5.10.2 DataHandler 实例管理

**问题：** `FloorDataHandler` 实例何时清理？

```typescript
// 当前设计：永久缓存
const floorDataHandlerCache = new Map<string, FloorDataHandler>();

// 问题：
// 1. 文件被删除后，handler 仍在缓存中
// 2. 内存泄漏风险（虽然文件数量有限）

// 改进建议：
class FloorDataHandlerManager {
  private handlers = new Map<string, FloorDataHandler>();
  
  get(floorId: string): FloorDataHandler {
    const path = `project/floors/${floorId}.js`;
    let handler = this.handlers.get(path);
    
    if (!handler) {
      const fileHandler = FileHandlerManager.get(path);
      handler = new FloorDataHandler(fileHandler, floorId);
      this.handlers.set(path, handler);
    }
    
    return handler;
  }
  
  // 文件删除时调用
  remove(floorId: string): void {
    const path = `project/floors/${floorId}.js`;
    this.handlers.delete(path);
  }
}
```

#### 5.10.3 错误类型区分

**问题：** 无法区分不同类型的错误

```typescript
// 当前：所有错误都是 { status: 'error', error: Error }
// 无法区分：
// - 文件读取错误（权限、IO）
// - 解析错误（JSON.parse 失败）
// - 业务逻辑错误

// 改进建议：使用自定义错误类型
class FileReadError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'FileReadError';
  }
}

class ParseError extends Error {
  constructor(message: string, public source: string) {
    super(message);
    this.name = 'ParseError';
  }
}

// 使用 ts-pattern 区分错误类型：
match(content)
  .with({ status: 'error', error: P.instanceOf(FileReadError) }, (c) => {
    console.log('文件读取失败:', c.error.code);
  })
  .with({ status: 'error', error: P.instanceOf(ParseError) }, (c) => {
    console.log('解析失败:', c.error.source);
  })
  .with({ status: 'error' }, (c) => {
    console.log('其他错误:', c.error.message);
  })
  .exhaustive();
```

#### 5.10.4 Signal 的内存管理

**问题：** effect 需要手动清理

```typescript
// ❌ 错误：effect 没有清理
function subscribe(handler: FileHandler) {
  effect(() => {
    console.log(handler.content.value);
  });
  // effect 会一直存在，即使不再需要
}

// ✅ 正确：保存 dispose 函数并调用
function subscribe(handler: FileHandler) {
  const dispose = effect(() => {
    console.log(handler.content.value);
  });
  
  // 不再需要时清理
  return dispose;
}

// React 中自动清理
useEffect(() => {
  const dispose = effect(() => {
    console.log(handler.content.value);
  });
  
  return dispose; // React 会在组件卸载时调用
}, [handler]);
```

## 6. API Design

### 6.1 命令式 API 使用示例

```typescript
// 1. 获取楼层数据
const data = await floorService.getFloor('MT1');
console.log(data.title, data.width, data.height);

// 2. 保存修改
await floorService.saveFloor('MT1', [
  { type: 'change', path: ['title'], value: '新标题' },
  { type: 'change', path: ['width'], value: 15 }
]);

// 3. 批量保存
await floorService.batchSave([
  { floorId: 'MT1', actions: [{ type: 'change', path: ['title'], value: 'A' }] },
  { floorId: 'MT2', actions: [{ type: 'change', path: ['title'], value: 'B' }] }
]);

// 4. 订阅变化（整个楼层）
const unsub1 = floorService.subscribe('MT1', {
  onChange: (data) => console.log('楼层变化:', data)
});

// 5. 订阅变化（只关心 title）
const unsub2 = floorService.subscribe('MT1', {
  selector: (data) => data?.title,
  onChange: (title) => console.log('标题变了:', title)
});

// 6. 取消订阅
unsub1();
unsub2();
```

### 6.2 Hooks API 使用示例

```typescript
// 1. 基础用法
function FloorEditor({ floorId }) {
  const { data, isLoading, error, saveActions } = useFloorData(floorId);
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return <div>{data.title}</div>;
}

// 2. 细粒度订阅（只关心 title）
function FloorTitle({ floorId }) {
  const title = useFloorData(floorId, d => d?.title);
  return <h1>{title}</h1>;
}

// 3. 写入操作
function FloorEditor({ floorId }) {
  const { data } = useFloorData(floorId);
  const { mutate, isSaving, isDirty, error } = useFloorMutation(floorId, {
    onSuccess: () => console.log('保存成功'),
    onError: (err) => console.error('保存失败:', err)
  });
  
  const handleSave = () => {
    mutate([
      { type: 'change', path: ['title'], value: '新标题' }
    ]);
  };
  
  return (
    <div>
      <Input value={data?.title} />
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? '保存中...' : '保存'}
      </Button>
      {isDirty && <span>● 未保存</span>}
      {error && <span>错误: {error.message}</span>}
    </div>
  );
}

// 4. 元数据订阅
function FloorPropertiesPanel() {
  const { meta, isLoading } = useFloorTableMeta();
  // meta 只包含 floor 属性定义，不包含 loc
}

function LocPropertiesPanel() {
  const { meta, isLoading } = useLocTableMeta();
  // meta 只包含 loc 属性定义
}
```

## 7. Data Models

### 7.1 Content<T> (核心类型)

```typescript
// 通用的 Content 类型 - 适用于所有层
type Content<T> = 
  | { status: 'idle' }                // 空闲，未开始加载
  | { status: 'loading' }             // 加载中
  | { status: 'loaded', value: T }    // 已加载，包含数据
  | { status: 'not-found' }           // 文件未找到
  | { status: 'error', error: Error } // 错误（权限、IO、解析等）

// 具体应用
type FileContent = Content<string>;        // 文件层（文本内容）
type FloorDataContent = Content<FloorData>; // 数据层（解析后的楼层数据）
```

### 7.2 FloorData

```typescript
interface FloorData {
  floorId: string;
  title: string;
  name: string;
  width: number;
  height: number;
  map: number[][];
  bgmap?: number[][];
  fgmap?: number[][];
  canFlyTo?: boolean;
  canFlyFrom?: boolean;
  // ... 其他字段
}
```

### 7.3 TowerData

```typescript
interface TowerData {
  main: {
    floorIds: string[];
    title: string;
    // ... 其他主要配置
  };
  firstData: {
    floorId: string;
    // ... 其他初始数据
  };
  values: Record<string, unknown>;
  flags: Record<string, unknown>;
  // ... 其他全塔属性
}
```

### 7.4 Action

```typescript
type Action = 
  | { type: 'change'; path: string[]; value: unknown }
  | { type: 'delete'; path: string[] }
  | { type: 'insert'; path: string[]; value: unknown; index?: number };
```

## 8. Implementation Phases

### Phase 1: FS 层基础（核心）
- ✅ FileHandler
- ✅ FileHandlerManager
- ✅ useFile / useFileContent
- ⚠️ PersistenceMonitor（可选，可后续添加）

### Phase 2: Services 层 - 命令式 API
- ✅ floorService (getFloor, saveFloor, subscribe)
- ✅ 解析和序列化逻辑
- ✅ 单元测试

### Phase 3: Services 层 - Hooks API
- ✅ useFloorData (基于 useSyncExternalStore)
- ✅ useFloorMutation
- ✅ 与 floorService 集成

### Phase 4: 元数据分离
- ✅ useFloorTableMeta（只返回 floor）
- ✅ useLocTableMeta（只返回 loc）

### Phase 5: 业务功能
- ✅ floorFileService (createFloor, batchCreateFloors, formatMap)
- ✅ 整合 src/fs/maps.ts 的功能

### Phase 6: 兼容和可选功能
- ✅ coreFloorsSync（遗留兼容，必需）
- ⚠️ PersistenceMonitor（可选）

### Phase 7: UI 层适配
- ✅ FloorDataStore 适配
- ✅ 更新使用楼层数据的组件

### Phase 8: 未来扩展（标记为可选）
- ⏸️ Agent 工具层（未来）
- ⏸️ 完全移除 core.floors 依赖（未来）

## 9. Trade-offs

### 优势

1. **支持 Agent 和非 React 环境**
   - 命令式 API 可在任何 JavaScript 环境使用
   - Agent 修改后 UI 自动同步

2. **按文件隔离并发写入**
   - 不同楼层并行写入，不互相阻塞
   - 同一楼层串行写入，保证顺序

3. **自动变更同步**
   - 任何修改都会通知所有订阅者
   - UI 立即响应，不需要手动刷新

4. **细粒度订阅**
   - 支持 selector 模式
   - 只在关心的数据变化时更新

5. **清晰的分层架构**
   - fs -> services -> ui
   - 职责明确，易于测试和维护

### 劣势

1. **引入新的状态管理层**
   - 学习成本
   - 与 React Query 共存（过渡期）

2. **过渡期复杂度**
   - 需要维护 coreFloorsSync
   - 新旧系统并存

3. **文档和培训成本**
   - 需要文档说明新架构
   - 团队需要学习新 API

### 替代方案对比

| 方案 | 优势 | 劣势 | 结论 |
|------|------|------|------|
| 纯 React Query | 简单，已有基础 | 无法支持 Agent | ❌ 不满足需求 |
| 纯全局状态 (core.floors) | 简单，已有基础 | 无法细粒度订阅，无法追踪变更 | ❌ 不满足需求 |
| FileHandler + 双轨 API | 支持 Agent，细粒度订阅 | 引入新层，学习成本 | ✅ 推荐方案 |

## 10. Migration Strategy

### 10.1 React Query 迁移

**决策：完全移除 React Query，使用 FileHandler 替代**

**原因：**
- FileHandler 已提供缓存、订阅、状态管理能力
- 避免两个缓存系统并存
- 简化架构

**迁移步骤：**
1. 实现 FileHandler 和 useFloorData
2. 更新 FloorDataStore 使用 useFloorData
3. 移除 React Query 相关代码
4. 更新所有使用 useQuery 的组件

**对比：**
```typescript
// 旧代码（React Query）
const dataQuery = useQuery({
  queryKey: FLOOR_QUERY_KEY(floorId),
  queryFn: () => fetchFloorData(floorId, floorMeta),
});

// 新代码（FileHandler）
const { data, isLoading, error } = useFloorData(floorId);
```

### 10.2 渐进式迁移

1. **Phase 1**: 实现 FS 层和 Services 层，不影响现有代码
2. **Phase 2**: 新功能使用新 API
3. **Phase 3**: 逐步迁移现有组件，移除 React Query
4. **Phase 4**: 完全迁移后移除 coreFloorsSync

### 10.3 兼容性保证

- ✅ 保持 `core.floors` 同步（coreFloorsSync，同步更新）
- ✅ FloorDataStore 继续可用（适配新 API）
- ✅ 现有组件无需立即修改

### 10.4 coreFloorsSync 同步时机保证

**关键：同步更新，无延迟**

```typescript
// coreFloorsSync 实现
handler.subscribe((state) => {
  if (!state.content || state.isLoading || state.error) return;
  
  try {
    // 同步解析和更新（不要 await）
    const data = parseFloorContent(state.content, floorId);
    core.floors[floorId] = data; // 同步赋值
  } catch (err) {
    console.error(`同步 core.floors[${floorId}] 失败:`, err);
  }
});
```

**保证：**
- FileHandler.update() 同步更新 signal
- signal 自动触发所有 effect（包括 coreFloorsSync）
- coreFloorsSync 订阅者同步执行
- core.floors 立即更新

**验证：**
```typescript
// 测试
await floorService.saveFloor('MT1', actions);
expect(core.floors.MT1.title).toBe('新标题'); // 立即可用
```

## 11. Testing Strategy

### 11.1 测试分层

```
┌─────────────────────────────────────────────────────────────┐
│                    单元测试（Unit Tests）                     │
│  - FileHandler                                               │
│  - FileHandlerManager                                        │
│  - floorService                                              │
│  - 解析/序列化函数                                            │
│  - 不依赖真实文件系统                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  集成测试（Integration Tests）                │
│  - Agent 调用 → UI 自动更新                                  │
│  - 并发写入测试                                               │
│  - coreFloorsSync 同步测试                                   │
│  - 使用 MemoryFileSystem                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  属性测试（Property Tests）                   │
│  - 并发写入顺序性                                             │
│  - 数据一致性                                                 │
│  - 使用 fast-check                                           │
└─────────────────────────────────────────────────────────────┘
```

### 11.2 测试工具

#### MemoryFileSystem（测试用）

```typescript
// test/utils/MemoryFileSystem.ts
export class MemoryFileSystem {
  private files = new Map<string, string>();
  private writeDelay = 0; // 模拟写入延迟
  
  async readFile(path: string, encoding: string): Promise<string> {
    const content = this.files.get(path);
    if (!content) throw new Error(`File not found: ${path}`);
    return content;
  }
  
  async writeFile(path: string, content: string, encoding: string): Promise<void> {
    if (this.writeDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.writeDelay));
    }
    this.files.set(path, content);
  }
  
  // 测试辅助方法
  setFile(path: string, content: string): void
  getFile(path: string): string | undefined
  clear(): void
  setWriteDelay(ms: number): void
}
```

#### 测试工厂函数

```typescript
// test/utils/testHelpers.ts
export function createTestFileHandler(
  path: string,
  initialContent?: string,
  fs?: MemoryFileSystem
): FileHandler

export function createTestFloorData(
  overrides?: Partial<FloorData>
): FloorData
```

### 11.3 单元测试示例

#### FileHandler 测试

```typescript
describe('FileHandler', () => {
  let memoryFs: MemoryFileSystem;
  
  beforeEach(() => {
    memoryFs = new MemoryFileSystem();
  });
  
  it('should update memory synchronously', async () => {
    const handler = createTestFileHandler('test.txt', 'old', memoryFs);
    await handler.read();
    
    handler.update('new');
    
    // 立即检查内存（同步）
    const content = handler.getContent();
    expect(ContentUtils.isLoaded(content)).toBe(true);
    if (ContentUtils.isLoaded(content)) {
      expect(content.value).toBe('new');
    }
  });
  
  it('should serialize concurrent writes', async () => {
    memoryFs.setWriteDelay(50); // 模拟慢速写入
    const handler = createTestFileHandler('test.txt', '0', memoryFs);
    await handler.read();
    
    const writes = [
      handler.update('1'),
      handler.update('2'),
      handler.update('3'),
    ];
    
    await Promise.all(writes);
    
    // 最后一次写入应该生效
    expect(memoryFs.getFile('test.txt')).toBe('3');
  });
});
```

#### floorService 测试

```typescript
describe('floorService', () => {
  beforeEach(() => {
    FileHandlerManager.setFileSystem(new MemoryFileSystem());
  });
  
  it('should apply actions and save', async () => {
    const floorData = createTestFloorData({ title: '旧标题' });
    // 设置初始文件...
    
    await floorService.saveFloor('MT1', [
      { type: 'change', path: ['title'], value: '新标题' }
    ]);
    
    const savedData = await floorService.getFloor('MT1');
    expect(savedData.title).toBe('新标题');
  });
  
  it('should notify subscribers on changes', async () => {
    const changes: string[] = [];
    const unsub = floorService.subscribe('MT1', {
      selector: (data) => data?.title,
      onChange: (title) => changes.push(title),
    });
    
    await floorService.saveFloor('MT1', [
      { type: 'change', path: ['title'], value: '新标题' }
    ]);
    
    expect(changes).toContain('新标题');
    unsub();
  });
});
```

### 11.4 集成测试示例

```typescript
describe('Agent → UI 同步', () => {
  it('Agent 修改后 UI 自动更新', async () => {
    // 渲染 UI 组件
    const { getByText } = render(<FloorEditor floorId="MT1" />);
    
    await waitFor(() => {
      expect(getByText('初始标题')).toBeInTheDocument();
    });
    
    // Agent 修改数据
    await floorService.saveFloor('MT1', [
      { type: 'change', path: ['title'], value: 'Agent 修改的标题' }
    ]);
    
    // UI 应该自动更新
    await waitFor(() => {
      expect(getByText('Agent 修改的标题')).toBeInTheDocument();
    });
  });
});

describe('coreFloorsSync', () => {
  it('should sync to core.floors immediately', async () => {
    setupCoreFloorsSync();
    
    await floorService.saveFloor('MT1', [
      { type: 'change', path: ['title'], value: '新标题' }
    ]);
    
    // 立即可用（同步更新）
    expect(core.floors.MT1.title).toBe('新标题');
  });
});
```

### 11.5 属性测试示例

```typescript
import * as fc from 'fast-check';

describe('FileHandler 属性测试', () => {
  it('Property: 并发写入顺序性', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        async (writes) => {
          const memoryFs = new MemoryFileSystem();
          const handler = createTestFileHandler('test.txt', '', memoryFs);
          
          // 并发写入
          await Promise.all(writes.map(content => handler.update(content)));
          
          // 最后一次写入应该生效
          const finalContent = memoryFs.getFile('test.txt');
          expect(writes).toContain(finalContent);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property: 订阅者总是收到最新数据', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
        async (updates) => {
          const handler = createTestFileHandler('test.txt', 'initial', memoryFs);
          
          const received: string[] = [];
          handler.subscribe((state) => {
            if (state.content) received.push(state.content);
          });
          
          for (const content of updates) {
            await handler.update(content);
          }
          
          // 订阅者应该收到所有更新
          expect(received).toEqual(['initial', ...updates]);
        }
      ),
      { numRuns: 50 }
    );
  });
});
```

### 11.6 测试覆盖目标

| 模块 | 单元测试 | 集成测试 | 属性测试 |
|------|---------|---------|---------|
| FileHandler | ✅ 必需 | ✅ 必需 | ✅ 必需 |
| FileHandlerManager | ✅ 必需 | - | - |
| floorService | ✅ 必需 | ✅ 必需 | - |
| useFloorData | ✅ 必需 | ✅ 必需 | - |
| coreFloorsSync | - | ✅ 必需 | - |

### 11.7 测试命令

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行集成测试
pnpm test:integration

# 运行属性测试
pnpm test:property

# 测试覆盖率
pnpm test:coverage
```

## 12. Future Extensions

### 12.1 Agent 工具层（未来扩展）

```typescript
// src/agent/tools/floorTools.ts
export const floorTools = [
  {
    name: 'get_floor',
    description: '获取楼层信息',
    execute: ({ floorId }) => floorService.getFloor(floorId)
  },
  {
    name: 'update_floor',
    description: '修改楼层属性',
    execute: ({ floorId, updates }) => {
      const actions = Object.entries(updates).map(([key, value]) => ({
        type: 'change',
        path: [key],
        value
      }));
      return floorService.saveFloor(floorId, actions);
    }
  }
];
```

### 12.2 完全移除 core.floors（未来）

当所有模块重构完成后：
1. 移除 coreFloorsSync
2. 移除 core.floors 依赖
3. 简化架构

### 12.3 性能优化（未来）

- 虚拟化大型楼层数据
- 增量序列化（只序列化变更部分）
- 批量写入优化

---

**设计原则：**
- 单一 API：只用 `getContent()` 返回 `Content<T>`
- 类型安全：使用 ts-pattern 的 exhaustive 检查
- 简洁明了：移除冗余的兼容层

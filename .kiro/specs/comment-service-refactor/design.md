# Design Document: TableMeta Service Refactor

## Overview

本设计文档描述了 TableMeta Service 的架构设计，用于将表格元数据配置文件（`*.comment.js`）的加载、保存逻辑重构为独立的服务模块。

该服务将：
1. 独立于 `editor.file`，自己实现加载逻辑
2. 使用 `new Function` 安全解析 JS 文件，防止泄露到全局
3. 在内存中维护配置的最新版本
4. 通过 React Query 暴露给调用方，接入 React 响应性体系

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      上层 Hooks（特定表格）                  │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │useTowerTableMeta│  │useItemTableMeta │                  │
│  │useFunctionsTable│  │useEnemyTableMeta│                  │
│  │useEventsTableMeta│ │useMapTableMeta  │                  │
│  │usePluginsTable  │  │useFloorTableMeta│                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
│           │ 直接使用           │ 通过中间层                 │
│           ▼                    ▼                            │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │useTableMetaFile │  │useObjectTableMeta│ (返回完整结构)   │
│  │ ('dataComment') │  │                 │                  │
│  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                            │
│           └────────┬───────────┘                            │
│                    ▼                                        │
│           ┌─────────────────┐                              │
│           │useTableMetaFile │ (底层，裸文本读写)            │
│           │ ('comment')     │                              │
│           └────────┬────────┘                              │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ React Query
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    TableMeta Service                        │
│  src/services/tableMeta/tableMetaService.ts                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ loadTableMetaFile(key): Promise<string>  (读取裸文本)   ││
│  │ saveTableMetaFile(key, content): Promise<void>          ││
│  │ parseTableMetaJs(content, varName): CommentObject       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ META_FILE_CONFIG: Record<MetaFileKey, MetaFileConfig>   ││
│  │ - filePath: string                                      ││
│  │ - varName: string                                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                     │
                     │ read/write (fs service)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│   Comment Files                                             │
│   - _server/table/comment.js (包含多个 meta)                │
│   - _server/table/data.comment.js                           │
│   - _server/table/functions.comment.js                      │
│   - _server/table/events.comment.js                         │
│   - _server/table/plugins.comment.js                        │
└─────────────────────────────────────────────────────────────┘
```

### 层次说明

1. **底层 `useTableMetaFile`**：提供裸文本的读写，不关心内容结构
2. **中间层 `useObjectTableMeta`**：专门处理 `comment.js` 的特殊结构（包含多个 table meta）
3. **上层 Hooks**：
   - 单一 meta 文件（tower, functions, events, plugins）：直接基于 `useTableMetaFile`
   - `comment.js` 中的 meta（items, enemys, maps, floors）：基于 `useObjectTableMeta`

## Components and Interfaces

### MetaFileKey（文件标识符）

```typescript
/**
 * 元数据文件的 key
 * 每个 key 对应一个 comment 文件
 */
export type MetaFileKey = 
  | 'comment'           // comment.js (包含 items, enemys, maps, floors)
  | 'dataComment'       // data.comment.js (全塔属性)
  | 'functionsComment'  // functions.comment.js (脚本编辑)
  | 'eventsComment'     // events.comment.js (公共事件)
  | 'pluginsComment';   // plugins.comment.js (插件)
```

### MetaFileConfig

```typescript
/**
 * 元数据文件配置
 */
export interface MetaFileConfig {
  /** 文件路径 */
  filePath: string;
  /** JS 变量名（用于解析文件内容） */
  varName: string;
}

/**
 * 元数据文件配置映射表
 */
export const META_FILE_CONFIG: Record<MetaFileKey, MetaFileConfig> = {
  comment: {
    filePath: '_server/table/comment.js',
    varName: 'comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  dataComment: {
    filePath: '_server/table/data.comment.js',
    varName: 'data_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  functionsComment: {
    filePath: '_server/table/functions.comment.js',
    varName: 'functions_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  eventsComment: {
    filePath: '_server/table/events.comment.js',
    varName: 'events_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
  pluginsComment: {
    filePath: '_server/table/plugins.comment.js',
    varName: 'plugins_comment_c456ea59_6018_45ef_8bcc_211a24c627dc',
  },
};
```

### TableMetaService API（底层服务）

```typescript
// src/services/tableMeta/tableMetaService.ts

/**
 * 加载元数据文件内容（裸文本）
 * 
 * @param key - 文件 key
 * @returns Promise<string> 文件内容
 */
export async function loadTableMetaFile(key: MetaFileKey): Promise<string>;

/**
 * 保存元数据文件内容
 * 
 * @param key - 文件 key
 * @param content - 文件内容（未编码的 JS 代码）
 * @returns Promise<void>
 */
export async function saveTableMetaFile(key: MetaFileKey, content: string): Promise<void>;

/**
 * 安全解析表格元数据 JS 文件内容
 * 
 * 使用 new Function 在隔离的作用域中执行，防止泄露到全局
 * 
 * @param content - JS 文件内容
 * @param varName - 变量名
 * @returns 解析后的元数据对象
 */
export function parseTableMetaJs(content: string, varName: string): CommentObject;
```

### useTableMetaFile Hook（底层 Hook，裸文本读写）

```typescript
// src/services/tableMeta/useTableMetaFile.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadTableMetaFile, saveTableMetaFile, type MetaFileKey } from './tableMetaService';

/**
 * 表格元数据文件的 React Query hook（底层，裸文本）
 * 
 * @param key - 文件 key
 */
export function useTableMetaFile(key: MetaFileKey) {
  const queryClient = useQueryClient();

  const query = useQuery<string>({
    queryKey: ['tableMetaFile', key],
    queryFn: () => loadTableMetaFile(key),
    staleTime: Infinity,
    placeholderData: (previousData) => previousData,
  });

  const mutation = useMutation({
    mutationFn: (content: string) => saveTableMetaFile(key, content),
    onSuccess: (_, content) => {
      // 更新缓存
      queryClient.setQueryData(['tableMetaFile', key], content);
    },
    onError: (error) => {
      if (typeof printe === 'function') {
        printe(`保存失败: ${(error as Error).message}`);
      }
    },
  });

  return {
    /** 文件内容（裸文本） */
    content: query.data,
    /** 文件 key */
    fileKey: key,
    /** 保存文件内容 */
    save: mutation.mutateAsync,
    /** 是否正在加载 */
    isLoading: query.isLoading,
    /** 是否正在保存 */
    isSaving: mutation.isPending,
    /** 加载错误 */
    error: query.error,
  };
}
```

### useTowerTableMeta Hook（单一 meta 文件）

```typescript
// src/services/tableMeta/hooks/useTowerTableMeta.ts

import { useMemo } from 'react';
import { useTableMetaFile } from '../useTableMetaFile';
import { parseTableMetaJs, META_FILE_CONFIG } from '../tableMetaService';
import type { CommentObject } from '@/components/Table';

/**
 * 全塔属性表格元数据 hook
 * 
 * 基于 useTableMetaFile，解析后返回 CommentObject
 */
export function useTowerTableMeta() {
  const { content, fileKey, save, isLoading, isSaving, error } = useTableMetaFile('dataComment');

  const meta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.dataComment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    /** 解析后的元数据对象 */
    meta,
    /** 文件 key（供 useTableMetaEditor 使用） */
    fileKey,
    /** 保存文件内容（裸文本） */
    save,
    /** 是否正在加载 */
    isLoading,
    /** 是否正在保存 */
    isSaving,
    /** 加载错误 */
    error,
  };
}

// 类似地可以创建：
// useFunctionsTableMeta() - 'functionsComment'
// useEventsTableMeta() - 'eventsComment'
// usePluginsTableMeta() - 'pluginsComment'
```

### useObjectTableMeta Hook（处理 comment.js 的中间层）

```typescript
// src/services/tableMeta/hooks/useObjectTableMeta.ts

import { useMemo } from 'react';
import { useTableMetaFile } from '../useTableMetaFile';
import { parseTableMetaJs, META_FILE_CONFIG } from '../tableMetaService';
import type { CommentObject } from '@/components/Table';

/**
 * comment.js 完整元数据 hook
 * 
 * comment.js 包含多个 table meta：items, enemys, maps, floors 等
 * 返回完整的解析结果，由上层 hooks 提取需要的部分
 */
export function useObjectTableMeta() {
  const { content, fileKey, save, isLoading, isSaving, error } = useTableMetaFile('comment');

  const fullMeta = useMemo<CommentObject | undefined>(() => {
    if (!content) return undefined;
    try {
      return parseTableMetaJs(content, META_FILE_CONFIG.comment.varName);
    } catch {
      return undefined;
    }
  }, [content]);

  return {
    /** 解析后的完整元数据对象 */
    fullMeta,
    /** 文件 key（供 useTableMetaEditor 使用） */
    fileKey,
    /** 保存文件内容（裸文本） */
    save,
    /** 是否正在加载 */
    isLoading,
    /** 是否正在保存 */
    isSaving,
    /** 加载错误 */
    error,
  };
}

// 上层 hooks - 从 fullMeta 中提取特定对象的 meta
export function useItemTableMeta() {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(() => {
    return fullMeta?._data?.items as CommentObject | undefined;
  }, [fullMeta]);
  return { meta, ...rest };
}

export function useEnemyTableMeta() {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(() => {
    return fullMeta?._data?.enemys as CommentObject | undefined;
  }, [fullMeta]);
  return { meta, ...rest };
}

export function useMapTableMeta() {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(() => {
    return fullMeta?._data?.maps as CommentObject | undefined;
  }, [fullMeta]);
  return { meta, ...rest };
}

export function useFloorTableMeta() {
  const { fullMeta, ...rest } = useObjectTableMeta();
  const meta = useMemo(() => {
    return fullMeta?._data?.floors as CommentObject | undefined;
  }, [fullMeta]);
  return { meta, ...rest };
}
```

### useTableMetaEditor Hook（编辑器 Hook）

```typescript
// src/components/Table/hooks/useTableMetaEditor.ts

import { useCallback } from 'react';
import { useTableMetaFile } from '@/services/tableMeta';
import type { MetaFileKey } from '@/services/tableMeta';

/**
 * 表格元数据编辑器 hook
 * 
 * 基于 useTableMetaFile，提供打开编辑器的函数
 * 
 * @param key - 文件 key
 */
export function useTableMetaEditor(key: MetaFileKey) {
  const { content, save } = useTableMetaFile(key);

  const openEditor = useCallback(() => {
    if (!content) {
      printe('元数据文件尚未加载');
      return;
    }

    // 打开代码编辑器
    editor_multi.open(content, {
      lint: true,
      contextId: `tableMeta-${key}`,
    }, {
      onConfirm: async (newContent: string) => {
        try {
          await save(newContent);
          printf(`${key} 配置已更新`);
        } catch (error) {
          // 错误已在 mutation.onError 中处理
        }
      },
    });
  }, [content, key, save]);

  return openEditor;
}
```

## Data Models

### TableMetaObject (CommentObject)

TableMetaObject 使用现有的 CommentObject 类型，定义在 `src/components/Table/types.ts` 中：

```typescript
/**
 * 表格元数据对象结构
 */
export interface CommentObject {
  _type: 'object';
  _data: Record<string, CommentField>;
}

export interface CommentField {
  _leaf?: boolean;
  _type?: string;
  _data?: string | Record<string, CommentField>;
  _docs?: string;
  _string?: boolean;
  _lint?: boolean;
  _range?: string;
  _select?: { values: unknown[] };
  _event?: string;
  // ... 其他字段
}
```

## loadTableMetaFile 实现细节

```typescript
export async function loadTableMetaFile(key: MetaFileKey): Promise<string> {
  const config = META_FILE_CONFIG[key];
  if (!config) {
    throw new Error(`无效的文件 key: ${key}`);
  }

  // 读取文件内容
  const content = await fs.promises.readFile(config.filePath, 'base64');
  return decode64(content);
}
```

## saveTableMetaFile 实现细节

```typescript
export async function saveTableMetaFile(key: MetaFileKey, content: string): Promise<void> {
  const config = META_FILE_CONFIG[key];
  if (!config) {
    throw new Error(`无效的文件 key: ${key}`);
  }

  // 编码并写入文件
  const encodedContent = encode64(content);
  await fs.promises.writeFile(config.filePath, encodedContent, 'base64');

  // 同步更新 editor.file（兼容旧代码）
  try {
    const newMeta = parseTableMetaJs(content, config.varName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).editor?.file) {
      (window as any).editor.file[key] = newMeta;
    }
  } catch {
    // 解析失败不影响文件保存
  }
}
```

## parseTableMetaJs 实现细节

```typescript
/**
 * 安全解析表格元数据 JS 文件内容
 * 
 * 使用 new Function 在隔离的作用域中执行，防止泄露到全局
 */
export function parseTableMetaJs(content: string, varName: string): CommentObject {
  const fn = new Function(`
    "use strict";
    ${content}
    return ${varName};
  `);
  return fn() as CommentObject;
}
```

## TowerPanel 集成示例

```typescript
// src/Workbench/TowerPanel/index.tsx

import { useTowerTableMeta } from '@/services/tableMeta';
import { useTableMetaEditor } from '@/components/Table/hooks/useTableMetaEditor';

const TowerPanel: FC = () => {
  const { meta, fileKey, isLoading, error } = useTowerTableMeta();
  const openEditor = useTableMetaEditor(fileKey);

  const handleConfigure = () => {
    openEditor();
    // 编辑器内部会处理保存和更新缓存
  };

  if (error) {
    return <div>加载失败: {error.message}</div>;
  }

  if (isLoading || !meta) {
    return <div>加载中...</div>;
  }

  // 使用 meta 渲染表格...
  // meta 在更新时保持可用（placeholderData）
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Meta Object Loading

*For any* valid MetaKey, calling `loadTableMeta(key)` should return a valid CommentObject parsed from the corresponding file.

**Validates: Requirements 1.1, 1.2**

### Property 2: Invalid Key Error

*For any* string that is not a valid MetaKey, calling `loadTableMeta(key)` should throw an error with a descriptive message.

**Validates: Requirements 1.4**

### Property 3: File Path Mapping

*For any* valid MetaKey, `saveTableMeta(key, content)` should write to the file path specified in `META_FILE_CONFIG[key].filePath`.

**Validates: Requirements 2.3**

### Property 4: Save Updates Cache

*For any* valid MetaKey and content, after `saveTableMeta(key, content)` completes, `loadTableMeta(key)` should return the newly parsed meta object.

**Validates: Requirements 3.3, 3.4**

### Property 5: Parse Isolation

*For any* JS content, `parseTableMetaJs(content, varName)` should not pollute the global scope.

**Validates: Requirements 6.2**

## Error Handling

### 加载错误

```typescript
// 当元数据 key 无效时
throw new Error(`无效的元数据 key: ${key}`);

// 当文件读取失败时
throw new Error(`读取 ${config.filePath} 失败: ${err.message}`);

// 当解析失败时
throw new Error(`解析元数据内容失败: ${err.message}`);
```

### 保存错误

```typescript
// 文件写入失败时
throw new Error(`写入 ${config.filePath} 失败: ${err.message}`);

// 解析失败时
throw new Error(`解析元数据内容失败: ${err.message}`);
```

## Testing Strategy

### 单元测试

1. **loadTableMeta 测试**
   - 测试所有有效的 MetaKey 返回正确的对象
   - 测试无效 key 抛出错误
   - 测试缓存机制

2. **saveTableMeta 测试**
   - 测试写入正确的文件路径
   - 测试写入后缓存被更新
   - 测试写入失败时 Promise reject

3. **parseTableMetaJs 测试**
   - 测试正确解析 JS 内容
   - 测试解析失败时抛出错误
   - 测试不污染全局作用域

### Property-Based Tests

使用 fast-check 进行属性测试：

1. **Property 1**: 对于所有有效的 MetaKey，loadTableMeta 应返回非空对象
2. **Property 2**: 对于所有无效的字符串，loadTableMeta 应抛出错误
3. **Property 3**: 对于所有有效的 MetaKey，saveTableMeta 应写入正确的文件路径
4. **Property 4**: 对于所有有效的 MetaKey，saveTableMeta 后 loadTableMeta 应返回新对象
5. **Property 5**: parseTableMetaJs 不应污染全局作用域

测试配置：
- 最少 100 次迭代
- 使用 fast-check 库
- 每个测试标注对应的 Property 编号

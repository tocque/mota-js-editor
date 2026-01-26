# 06 - React BlocklyWorkspace 组件

## 目标

创建 React 化的 Blockly 工作区组件，替代现有的命令式实现。

## 输出文件

```
src/blockly/components/
├── BlocklyWorkspace.tsx    # 主组件
├── Toolbox.tsx             # 工具箱配置
├── useBlocklyWorkspace.ts  # 核心 hook
├── useBlocklyEvents.ts     # 事件处理 hook
└── index.ts
```

## 实现

### 1. 主组件

```tsx
// src/blockly/components/BlocklyWorkspace.tsx
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as Blockly from 'blockly';
import { useBlocklyWorkspace } from './useBlocklyWorkspace';
import { useBlocklyEvents } from './useBlocklyEvents';
import { Toolbox, ToolboxConfig } from './Toolbox';
import type { BlockState } from '../parser/types';

export interface BlocklyWorkspaceProps {
  /** 初始状态 */
  initialState?: BlockState;
  /** 入口类型 */
  entryType: string;
  /** 工具箱配置 */
  toolbox?: ToolboxConfig;
  /** 变更回调 */
  onChange?: (code: string) => void;
  /** 只读模式 */
  readOnly?: boolean;
  /** 自定义样式 */
  className?: string;
}

export interface BlocklyWorkspaceRef {
  /** 获取 workspace 实例 */
  getWorkspace(): Blockly.WorkspaceSvg | null;
  /** 获取生成的代码 */
  getCode(): string;
  /** 加载状态 */
  loadState(state: BlockState): void;
  /** 获取状态 */
  getState(): BlockState | null;
  /** 清空 */
  clear(): void;
}

export const BlocklyWorkspace = forwardRef<BlocklyWorkspaceRef, BlocklyWorkspaceProps>(
  function BlocklyWorkspace(props, ref) {
    const {
      initialState,
      entryType,
      toolbox,
      onChange,
      readOnly = false,
      className
    } = props;
    
    const containerRef = useRef<HTMLDivElement>(null);
    
    // 核心 workspace 管理
    const {
      workspace,
      isReady,
      loadState,
      getState,
      getCode,
      clear
    } = useBlocklyWorkspace({
      container: containerRef,
      toolbox: toolbox || Toolbox.getDefault(entryType),
      readOnly
    });
    
    // 事件处理
    useBlocklyEvents({
      workspace,
      onChange,
      entryType
    });
    
    // 加载初始状态
    useEffect(() => {
      if (isReady && initialState) {
        loadState(initialState);
      }
    }, [isReady, initialState]);
    
    // 暴露 ref API
    useImperativeHandle(ref, () => ({
      getWorkspace: () => workspace,
      getCode,
      loadState,
      getState,
      clear
    }), [workspace, getCode, loadState, getState, clear]);
    
    return (
      <div 
        ref={containerRef}
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
);
```

### 2. Workspace Hook

```typescript
// src/blockly/components/useBlocklyWorkspace.ts
import { useRef, useEffect, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import type { BlockState } from '../parser/types';

interface UseBlocklyWorkspaceOptions {
  container: React.RefObject<HTMLDivElement>;
  toolbox: Blockly.utils.toolbox.ToolboxDefinition;
  readOnly?: boolean;
}

export function useBlocklyWorkspace(options: UseBlocklyWorkspaceOptions) {
  const { container, toolbox, readOnly } = options;
  
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // 初始化 workspace
  useEffect(() => {
    if (!container.current) return;
    
    const workspace = Blockly.inject(container.current, {
      toolbox,
      readOnly,
      media: 'blockly/media/',
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.08
      },
      trashcan: !readOnly,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      }
    });
    
    workspaceRef.current = workspace;
    setIsReady(true);
    
    // 滚轮滚动
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollbar = e.shiftKey 
        ? workspace.scrollbar?.hScroll 
        : workspace.scrollbar?.vScroll;
      if (scrollbar) {
        const delta = e.deltaY > 0 ? 20 : -20;
        scrollbar.setHandlePosition(scrollbar.getHandlePosition() + delta);
      }
    };
    
    container.current.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.current?.removeEventListener('wheel', handleWheel);
      workspace.dispose();
      workspaceRef.current = null;
      setIsReady(false);
    };
  }, [container, toolbox, readOnly]);
  
  // 加载状态
  const loadState = useCallback((state: BlockState) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    
    workspace.clear();
    Blockly.serialization.workspaces.load(
      { blocks: { languageVersion: 0, blocks: [state] } },
      workspace
    );
  }, []);
  
  // 获取状态
  const getState = useCallback((): BlockState | null => {
    const workspace = workspaceRef.current;
    if (!workspace) return null;
    
    const state = Blockly.serialization.workspaces.save(workspace);
    return state?.blocks?.blocks?.[0] || null;
  }, []);
  
  // 获取代码
  const getCode = useCallback((): string => {
    const workspace = workspaceRef.current;
    if (!workspace) return '';
    
    return javascriptGenerator.workspaceToCode(workspace);
  }, []);
  
  // 清空
  const clear = useCallback(() => {
    workspaceRef.current?.clear();
  }, []);
  
  return {
    workspace: workspaceRef.current,
    isReady,
    loadState,
    getState,
    getCode,
    clear
  };
}
```

### 3. 事件处理 Hook

```typescript
// src/blockly/components/useBlocklyEvents.ts
import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

interface UseBlocklyEventsOptions {
  workspace: Blockly.WorkspaceSvg | null;
  onChange?: (code: string) => void;
  entryType: string;
  onDoubleClick?: (blockId: string) => void;
}

export function useBlocklyEvents(options: UseBlocklyEventsOptions) {
  const { workspace, onChange, entryType, onDoubleClick } = options;
  
  // 双击检测
  const lastClickRef = useRef<{ time: number; blockId: string } | null>(null);
  
  useEffect(() => {
    if (!workspace) return;
    
    const handleChange = (event: Blockly.Events.Abstract) => {
      // 只处理实际的变更事件
      if (!['create', 'move', 'change', 'delete'].includes(event.type)) {
        // 双击检测
        if (event.type === 'ui' && (event as any).element === 'click') {
          const blockId = (event as any).blockId;
          const now = Date.now();
          
          if (lastClickRef.current && 
              lastClickRef.current.blockId === blockId &&
              now - lastClickRef.current.time < 500) {
            onDoubleClick?.(blockId);
            lastClickRef.current = null;
          } else {
            lastClickRef.current = { time: now, blockId };
          }
        }
        return;
      }
      
      // 验证入口方块
      const topBlocks = workspace.getTopBlocks(false);
      if (topBlocks.length > 1) {
        onChange?.('入口方块只能有一个');
        return;
      }
      
      if (topBlocks.length === 1) {
        const validType = entryType + '_m';
        const commonTypes = ['common_m'];
        if (topBlocks[0].type !== validType && !commonTypes.includes(topBlocks[0].type)) {
          onChange?.('入口方块类型错误');
          return;
        }
      }
      
      // 生成代码
      try {
        const code = javascriptGenerator.workspaceToCode(workspace);
        onChange?.(code);
      } catch (error) {
        onChange?.(String(error));
      }
    };
    
    workspace.addChangeListener(handleChange);
    workspace.addChangeListener(Blockly.Events.disableOrphans);
    
    return () => {
      workspace.removeChangeListener(handleChange);
    };
  }, [workspace, onChange, entryType, onDoubleClick]);
}
```

### 4. 工具箱配置

```typescript
// src/blockly/components/Toolbox.tsx
import * as Blockly from 'blockly';

export type ToolboxConfig = Blockly.utils.toolbox.ToolboxDefinition;

export const Toolbox = {
  /**
   * 获取默认工具箱
   */
  getDefault(entryType: string): ToolboxConfig {
    return {
      kind: 'categoryToolbox',
      contents: [
        {
          kind: 'category',
          name: '入口方块',
          custom: 'ENTRY_BLOCKS',
          colour: 120
        },
        {
          kind: 'category',
          name: '显示文字',
          colour: 160,
          contents: [
            { kind: 'block', type: 'text_0_s' },
            { kind: 'block', type: 'text_1_s' },
            { kind: 'block', type: 'comment_s' },
            // ...
          ]
        },
        {
          kind: 'category',
          name: '数据相关',
          colour: 330,
          contents: [
            { kind: 'block', type: 'setValue_s' },
            // ...
          ]
        },
        // ... 其他分类
        {
          kind: 'category',
          name: '最近使用',
          custom: 'RECENT_BLOCKS',
          colour: 0
        }
      ]
    };
  },
  
  /**
   * 注册自定义分类回调
   */
  registerCallbacks(workspace: Blockly.WorkspaceSvg, entryType: string): void {
    // 入口方块
    workspace.registerToolboxCategoryCallback('ENTRY_BLOCKS', () => {
      const validType = entryType + '_m';
      return [Blockly.utils.xml.textToDom(
        `<block type="${validType}"></block>`
      )];
    });
    
    // 最近使用
    workspace.registerToolboxCategoryCallback('RECENT_BLOCKS', () => {
      const recent = getRecentBlocks();
      return recent.map(type => 
        Blockly.utils.xml.textToDom(`<block type="${type}"></block>`)
      );
    });
  }
};

// 最近使用的块
let recentBlocks: string[] = [];

export function addRecentBlock(type: string): void {
  recentBlocks = [type, ...recentBlocks.filter(t => t !== type)].slice(0, 15);
}

export function getRecentBlocks(): string[] {
  return recentBlocks;
}
```

### 5. 导出

```typescript
// src/blockly/components/index.ts
export { BlocklyWorkspace } from './BlocklyWorkspace';
export type { BlocklyWorkspaceProps, BlocklyWorkspaceRef } from './BlocklyWorkspace';
export { useBlocklyWorkspace } from './useBlocklyWorkspace';
export { useBlocklyEvents } from './useBlocklyEvents';
export { Toolbox, addRecentBlock, getRecentBlocks } from './Toolbox';
```

## 使用示例

```tsx
// src/Workbench/EventsEditor/index.tsx
import { useRef, useCallback } from 'react';
import { BlocklyWorkspace, BlocklyWorkspaceRef } from '@/blockly/components';
import { parseEventEntry } from '@/blockly/parser';
import { generateEventJson } from '@/blockly/generator';

export function EventsEditor() {
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  
  // 加载事件数据
  const handleLoad = useCallback((eventData: unknown) => {
    const state = parseEventEntry(eventData);
    workspaceRef.current?.loadState(state);
  }, []);
  
  // 保存事件数据
  const handleSave = useCallback(() => {
    const code = workspaceRef.current?.getCode() || '';
    const eventJson = generateEventJson(code);
    return eventJson;
  }, []);
  
  return (
    <div style={{ height: '100%' }}>
      <div className="toolbar">
        <button onClick={() => handleSave()}>保存</button>
      </div>
      <BlocklyWorkspace
        ref={workspaceRef}
        entryType="event"
        className="blockly-container"
      />
    </div>
  );
}
```

## 验收标准

- [ ] 组件能正确渲染 Blockly workspace
- [ ] 能通过 ref 获取和设置状态
- [ ] 变更事件正确触发 onChange
- [ ] 双击事件正确触发
- [ ] 工具箱分类正确显示

## 后续步骤

完成组件后，进入 [07-features.md](./07-features.md) 实现交互功能。

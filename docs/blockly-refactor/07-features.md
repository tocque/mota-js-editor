# 07 - 交互功能实现

## 目标

实现事件编辑器的各种交互功能，包括自动补全、双击操作、搜索等。

## 输出文件

```
src/blockly/features/
├── useAutoComplete.ts      # 自动补全
├── useDoubleClick.ts       # 双击处理
├── useSelectPoint.ts       # 地图选点
├── usePreview.ts           # 预览功能
├── useSearch.ts            # 搜索功能
├── useColorPicker.ts       # 颜色选择
├── customFields.ts         # 自定义 Field
└── index.ts
```

## 实现

### 1. 自动补全

```typescript
// src/blockly/features/useAutoComplete.ts
import { useCallback } from 'react';
import type * as Blockly from 'blockly';

interface CompletionItem {
  label: string;
  value: string;
  icon?: string;
}

interface AutoCompleteContext {
  blockType: string;
  fieldName: string;
  content: string;
  cursorPosition: number;
}

/**
 * 自动补全 Hook
 */
export function useAutoComplete() {
  
  /**
   * 获取补全建议
   */
  const getCompletions = useCallback((ctx: AutoCompleteContext): CompletionItem[] => {
    const { content, cursorPosition } = ctx;
    const textBefore = content.substring(0, cursorPosition);
    
    // 检查 status:xxx, item:xxx, flag:xxx
    const colonMatch = textBefore.match(/(状态|物品|变量|怪物|status|item|flag|enemy)[:：]([a-zA-Z0-9_\u4E00-\u9FCC]*)$/);
    if (colonMatch) {
      const [, type, prefix] = colonMatch;
      return getCompletionsForType(type, prefix);
    }
    
    // 检查 core.xxx
    const coreMatch = textBefore.match(/core\.([a-zA-Z0-9_.]+)$/);
    if (coreMatch) {
      return getCoreCompletions(coreMatch[1]);
    }
    
    // 检查 flags.xxx
    const flagsMatch = textBefore.match(/flags\.([a-zA-Z0-9_]*)$/);
    if (flagsMatch) {
      return getFlagCompletions(flagsMatch[1]);
    }
    
    // 检查 \f[xxx (立绘)
    const fMatch = textBefore.match(/\\f\[([^,\]]*?)$/);
    if (fMatch) {
      return getImageCompletions(fMatch[1]);
    }
    
    // 检查 \i[xxx (图标)
    const iMatch = textBefore.match(/\\i\[([^\]]*?)$/);
    if (iMatch) {
      return getIconCompletions(iMatch[1]);
    }
    
    return [];
  }, []);
  
  return { getCompletions };
}

function getCompletionsForType(type: string, prefix: string): CompletionItem[] {
  // 根据类型获取补全列表
  const items: CompletionItem[] = [];
  
  if (type === '状态' || type === 'status') {
    const statusList = ['hp', 'atk', 'def', 'mdef', 'money', 'exp', 'lv'];
    items.push(...statusList
      .filter(s => s.startsWith(prefix))
      .map(s => ({ label: s, value: s }))
    );
  }
  
  if (type === '物品' || type === 'item') {
    // 从 core.material.items 获取
    const itemIds = Object.keys(window.core?.material?.items || {});
    items.push(...itemIds
      .filter(id => id.startsWith(prefix))
      .map(id => ({ label: id, value: id }))
    );
  }
  
  if (type === '变量' || type === 'flag') {
    // 从 editor.used_flags 获取
    const flags = Object.keys(window.editor?.used_flags || {});
    items.push(...flags
      .filter(f => f.startsWith(prefix))
      .map(f => ({ label: f, value: f }))
    );
  }
  
  return items.slice(0, 12);
}

function getCoreCompletions(path: string): CompletionItem[] {
  // 遍历 core 对象获取补全
  const parts = path.split('.');
  let obj: any = window.core;
  
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj?.[parts[i]];
    if (!obj) return [];
  }
  
  const prefix = parts[parts.length - 1];
  return Object.keys(obj || {})
    .filter(k => k.startsWith(prefix))
    .map(k => ({ label: k, value: k }))
    .slice(0, 12);
}

function getFlagCompletions(prefix: string): CompletionItem[] {
  const flags = Object.keys(window.editor?.used_flags || {});
  return flags
    .filter(f => f.startsWith(prefix) && /^[a-zA-Z_]\w*$/.test(f))
    .map(f => ({ label: f, value: f }))
    .slice(0, 12);
}

function getImageCompletions(prefix: string): CompletionItem[] {
  const images = Object.keys(window.core?.material?.images?.images || {});
  return images
    .filter(i => i.startsWith(prefix))
    .map(i => ({ label: i, value: i }))
    .slice(0, 12);
}

function getIconCompletions(prefix: string): CompletionItem[] {
  const icons = window.core?.getAllIconIds?.() || [];
  return icons
    .filter((i: string) => i.startsWith(prefix))
    .map((i: string) => ({ label: i, value: i }))
    .slice(0, 12);
}
```

### 2. 双击处理

```typescript
// src/blockly/features/useDoubleClick.ts
import { useCallback } from 'react';
import type * as Blockly from 'blockly';
import { usePreview } from './usePreview';
import { useSelectPoint } from './useSelectPoint';

interface BlockFeatures {
  previewBlock?: boolean;
  selectPoint?: [string, string, string?, boolean?];
  material?: [string, string];
  doubleclicktext?: string;
}

/**
 * 双击处理 Hook
 */
export function useDoubleClick(workspace: Blockly.WorkspaceSvg | null) {
  const { showPreview } = usePreview();
  const { openSelectPoint } = useSelectPoint();
  
  const handleDoubleClick = useCallback((blockId: string) => {
    if (!workspace) return;
    
    const block = workspace.getBlockById(blockId);
    if (!block) return;
    
    // 获取 block 的特性配置
    const features = getBlockFeatures(block.type);
    
    // 预览
    if (features.previewBlock) {
      showPreview(block);
      return;
    }
    
    // 选点
    if (features.selectPoint) {
      const [xField, yField, floorField, forceFloor] = features.selectPoint;
      openSelectPoint({
        block,
        xField,
        yField,
        floorField,
        forceFloor
      });
      return;
    }
    
    // 选素材
    if (features.material) {
      const [path, field] = features.material;
      openMaterialPicker(block, path, field);
      return;
    }
    
    // 多行编辑
    if (features.doubleclicktext) {
      openMultilineEdit(block, features.doubleclicktext);
      return;
    }
  }, [workspace, showPreview, openSelectPoint]);
  
  return { handleDoubleClick };
}

// 从 schema 获取 block 特性
function getBlockFeatures(blockType: string): BlockFeatures {
  // 从注册的 schema 中获取
  return window.__blockSchemas?.[blockType]?.features || {};
}

function openMaterialPicker(block: Blockly.Block, path: string, field: string) {
  const currentValue = block.getFieldValue(field);
  window.editor?.uievent?.selectMaterial?.(
    [currentValue], 
    '请选择素材', 
    path,
    (value: string) => {
      if (value) {
        block.setFieldValue(value, field);
      }
    }
  );
}

function openMultilineEdit(block: Blockly.Block, field: string) {
  const currentValue = block.getFieldValue(field);
  window.editor_multi?.multiLineEdit?.(
    currentValue,
    block,
    field,
    {},
    (newValue: string) => {
      block.setFieldValue(newValue, field);
    }
  );
}
```

### 3. 地图选点

```typescript
// src/blockly/features/useSelectPoint.ts
import { useCallback } from 'react';
import type * as Blockly from 'blockly';

interface SelectPointOptions {
  block: Blockly.Block;
  xField: string;
  yField: string;
  floorField?: string;
  forceFloor?: boolean;
}

/**
 * 地图选点 Hook
 */
export function useSelectPoint() {
  
  const openSelectPoint = useCallback((options: SelectPointOptions) => {
    const { block, xField, yField, floorField, forceFloor } = options;
    
    // 获取当前值
    const currentX = block.getFieldValue(xField) || window.editor?.pos?.x || 0;
    const currentY = block.getFieldValue(yField) || window.editor?.pos?.y || 0;
    const currentFloor = floorField 
      ? (block.getFieldValue(floorField) || window.editor?.currentFloorId)
      : window.editor?.currentFloorId;
    
    // 调用选点 UI
    window.editor?.uievent?.selectPoint?.(
      currentFloor,
      currentX,
      currentY,
      false,
      (floorId: string, x: number, y: number) => {
        // 设置坐标
        block.setFieldValue(String(x), xField);
        block.setFieldValue(String(y), yField);
        
        // 设置楼层
        if (floorField) {
          if (floorId !== window.editor?.currentFloorId || forceFloor) {
            block.setFieldValue(floorId, floorField);
          } else {
            block.setFieldValue('', floorField);
          }
        }
      }
    );
  }, []);
  
  return { openSelectPoint };
}
```

### 4. 预览功能

```typescript
// src/blockly/features/usePreview.ts
import { useCallback } from 'react';
import type * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

/**
 * 预览功能 Hook
 */
export function usePreview() {
  
  const showPreview = useCallback((block: Blockly.Block) => {
    try {
      // 生成代码
      const code = '[' + javascriptGenerator.blockToCode(block) + ']';
      const obj = eval(code);
      
      if (!obj || obj.length === 0) return;
      
      const data = obj[0];
      
      // 根据类型调用不同的预览
      switch (block.type) {
        case 'text_0_s':
        case 'text_1_s':
        case 'text_2_s':
        case 'choices_s':
        case 'confirm_s':
          window.editor?.uievent?.previewUI?.([data]);
          break;
          
        case 'showImage_s':
        case 'showImage_1_s':
          previewImage(data);
          break;
          
        case 'setCurtain_0_s':
          if (data.color) {
            window.editor?.uievent?.previewUI?.([{
              type: 'fillRect',
              x: 0, y: 0,
              width: window.core?.__PIXELS__,
              height: window.core?.__PIXELS__,
              style: data.color
            }]);
          }
          break;
          
        default:
          if (block.type.startsWith(data.type)) {
            window.editor?.uievent?.previewUI?.([data]);
          }
      }
    } catch (e) {
      console.error('预览失败:', e);
    }
  }, []);
  
  return { showPreview };
}

function previewImage(data: any) {
  if (data.sloc) {
    window.editor?.uievent?.previewUI?.([
      { type: 'setAttribute', alpha: data.opacity },
      {
        type: 'drawImage',
        image: data.image,
        x: data.sloc[0], y: data.sloc[1],
        w: data.sloc[2], h: data.sloc[3],
        x1: data.loc[0], y1: data.loc[1],
        w1: data.loc[2], h1: data.loc[3],
        reverse: data.reverse
      }
    ]);
  } else {
    window.editor?.uievent?.previewUI?.([
      { type: 'setAttribute', alpha: data.opacity },
      {
        type: 'drawImage',
        image: data.image,
        x: data.loc[0], y: data.loc[1],
        w: data.loc[2], h: data.loc[3],
        reverse: data.reverse
      }
    ]);
  }
}
```

### 5. 搜索功能

```typescript
// src/blockly/features/useSearch.ts
import { useState, useCallback, useMemo } from 'react';

interface SearchResult {
  type: string;
  message: string;
  tooltip: string;
}

/**
 * 搜索功能 Hook
 */
export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchTerm) {
      // 返回最近使用
      return getRecentBlocks().map(type => ({
        type,
        message: getBlockMessage(type),
        tooltip: getBlockTooltip(type)
      }));
    }
    
    const term = searchTerm.toLowerCase();
    const results: SearchResult[] = [];
    
    // 搜索所有 _s 结尾的动作块
    for (const [type, schema] of Object.entries(window.__blockSchemas || {})) {
      if (!type.endsWith('_s')) continue;
      
      const message = (schema as any).message0 || '';
      const tooltip = (schema as any).tooltip || '';
      
      if (
        type.toLowerCase().includes(term) ||
        message.toLowerCase().includes(term) ||
        tooltip.toLowerCase().includes(term)
      ) {
        results.push({ type, message, tooltip });
        if (results.length >= 15) break;
      }
    }
    
    return results;
  }, [searchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    searchResults
  };
}

function getRecentBlocks(): string[] {
  return window.__recentBlocks || [];
}

function getBlockMessage(type: string): string {
  return window.__blockSchemas?.[type]?.message0 || type;
}

function getBlockTooltip(type: string): string {
  return window.__blockSchemas?.[type]?.tooltip || '';
}
```

### 6. 自定义 Field

```typescript
// src/blockly/features/customFields.ts
import * as Blockly from 'blockly';

/**
 * 注册自定义颜色选择器
 */
export function registerColorField() {
  // 重写颜色 Field 的编辑器
  Blockly.FieldColour.prototype.showEditor_ = function() {
    const field = this;
    const block = this.sourceBlock_;
    
    // 获取关联的文本字段
    const args = window.__blockSchemas?.[block.type]?.args0 || [];
    const idx = args.findIndex((a: any) => a.name === this.name);
    const textField = idx > 0 ? args[idx - 1].name : null;
    
    // 打开颜色选择器
    const currentValue = textField ? block.getFieldValue(textField) : '';
    
    openColorPicker(currentValue, (newValue: string) => {
      if (textField) {
        block.setFieldValue(newValue, textField);
      }
      this.setValue('rgba(' + newValue + ')');
    });
  };
}

function openColorPicker(value: string, callback: (value: string) => void) {
  // 调用全局颜色选择器
  window.openColorPicker?.(value, callback);
}

/**
 * 注册自定义文本输入 Field
 */
export function registerTextInputField() {
  const originalShowEditor = Blockly.FieldTextInput.prototype.showInlineEditor_;
  
  Blockly.FieldTextInput.prototype.showInlineEditor_ = function(quietInput) {
    originalShowEditor.call(this, quietInput);
    
    // 添加自动补全
    if (this.htmlInput_) {
      setupAutoComplete(this, this.htmlInput_);
    }
  };
}

function setupAutoComplete(field: Blockly.FieldTextInput, input: HTMLInputElement) {
  // 初始化 awesomplete 或其他自动补全库
  // ...
}

/**
 * 初始化所有自定义 Field
 */
export function initCustomFields() {
  registerColorField();
  registerTextInputField();
}
```

### 7. 导出

```typescript
// src/blockly/features/index.ts
export { useAutoComplete } from './useAutoComplete';
export { useDoubleClick } from './useDoubleClick';
export { useSelectPoint } from './useSelectPoint';
export { usePreview } from './usePreview';
export { useSearch } from './useSearch';
export { initCustomFields } from './customFields';
```

## 验收标准

- [ ] 自动补全在文本输入时正常工作
- [ ] 双击块能触发对应的功能
- [ ] 选点功能能正确设置坐标
- [ ] 预览功能能正确显示效果
- [ ] 搜索功能能找到匹配的块

## 后续步骤

完成交互功能后，进入 [08-migration.md](./08-migration.md) 进行最终迁移。

## Plan: editor_multi 重构 Phase 4 - 完全移除 editor_multi.ts

将 CodeMirror 初始化移入 React 组件，完全移除 `editor_multi.ts`，仅保留 `window.editor_multi` 兼容层。

### Background

- Phase 1-3 已完成纯函数提取、工具函数迁移、React 状态化
- 原 `editor_multi.ts` 仍有 533 行
- **目标：完全移除 editor_multi.ts**

---

### 外部依赖分析

`window.editor_multi` 被外部模块调用情况：

| 方法/属性 | 调用位置 | 用途 |
|-----------|----------|------|
| `.id` (读取) | editor_ui.js (L148, L161) | 检查编辑器是否打开 |
| `.confirm()` | editor_ui.js (L149) | 保存并关闭编辑器 |
| `.import(id, args)` | editor_table.js (L422, L454) | 打开表格 textarea 编辑 |
| `.multiLineEdit(...)` | editor_blockly.js (L413) | Blockly 多行代码编辑 |

**结论：** 外部仅使用 4 个 API，兼容层非常简单。

---

### 难点分析

| 难点 | 描述 | 解决方案 |
|------|------|----------|
| **CodeMirror 初始化时机** | 需要 DOM 元素存在 | 使用 `useEffect` + `ref`，在组件挂载后初始化 |
| **window.editor_multi 时序** | 外部可能在组件挂载前访问 | Phase 4a 先创建 API 占位，组件挂载后填充实现 |
| **闭包引用问题** | extraKeys 中引用 ternServer | 使用 `useRef` 存储稳定引用 |
| **状态同步** | id/isString/lintAutocomplete | 使用 `useRef` 存储状态，同时更新 React state |
| **Tern 定义依赖 core** | buildTernDefinitions 需要 core 对象 | 在 `useEditor` 回调中获取 core |

---

### Phase 4 分两阶段执行

#### Phase 4a: 准备工作（降低风险）

**目标：** 在不改变 editor_multi.ts 结构的情况下，提取所有可提取的逻辑

1. **使用已提取的工具函数**
   - 替换 Tern 定义构建 → `buildTernDefinitions()`
   - 替换 TernServer 创建 → `createTernServer()`
   - 替换 extraKeys → `createExtraKeys()`
   - 替换 commandsName → `generateCommandOptionsHtml()`

2. **提取 handlers**
   - `handlers/tableHandler.ts` - import(), confirm()
   - `handlers/blocklyHandler.ts` - multiLineEdit(), multiLineDone()
   - `handlers/fileHandler.ts` - importFile(), writeFileDone(), editCommentJs()
   - `handlers/editorEvents.ts` - cursorActivity, keyup 事件

3. **验证外部调用不受影响**
   - 手动测试 editor_table.js 的 import 调用
   - 手动测试 editor_blockly.js 的 multiLineEdit 调用
   - 手动测试 editor_ui.js 的 confirm 调用

**Phase 4a 完成后 editor_multi.ts 预期：~150 行**

---

#### Phase 4b: 最终整合（移除 editor_multi.ts）

**目标：** 将 CodeMirror 移入组件，删除 editor_multi.ts

1. **重构 CodeEditor/index.tsx**

```tsx
export const CodeEditor: FC = () => {
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const codeEditorRef = useRef<CodeMirror.Editor | null>(null);
  const ternServerRef = useRef<TernServer | null>(null);
  
  // State (React 管理)
  const [visible, setVisible] = useState(false);
  const [lintEnabled, setLintEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  
  // State (外部可变，用 ref)
  const stateRef = useRef({
    id: '',
    isString: false,
    preview: null as string | null,
  });

  // 初始化 CodeMirror
  useEditor(() => {
    if (!textareaRef.current) return;
    
    const extraKeys = createExtraKeys({
      ternServer: () => ternServerRef.current,
      openUrl: (url) => { ... },
    });
    
    const codeEditor = CodeMirror.fromTextArea(textareaRef.current, { ... });
    codeEditorRef.current = codeEditor;
    
    const ternDefs = buildTernDefinitions(core, ...);
    const ternServer = createTernServer(ternDefs, codeEditor);
    ternServerRef.current = ternServer;
    
    setupEditorEvents(codeEditor, ternServer, () => lintEnabled);
    
    // 创建兼容层 API
    window.editor_multi = createLegacyApi({
      codeEditorRef,
      ternServerRef,
      stateRef,
      show: () => setVisible(true),
      hide: () => setVisible(false),
      // ...其他方法
    });
  });

  return (
    <div id="left7" style={visible ? undefined : { zIndex: -1, opacity: 0 }}>
      ...
      <textarea ref={textareaRef} id="multiLineCode" />
    </div>
  );
};
```

2. **创建兼容层工厂** `createLegacyApi.ts`

```typescript
export function createLegacyApi(deps: LegacyApiDeps): EditorMultiApi {
  const tableHandler = createTableHandler(deps);
  const blocklyHandler = createBlocklyHandler(deps);
  const fileHandler = createFileHandler(deps);
  
  return {
    // 属性（getter 实现）
    get id() { return deps.stateRef.current.id; },
    set id(v) { deps.stateRef.current.id = v; },
    get codeEditor() { return deps.codeEditorRef.current; },
    get ternServer() { return deps.ternServerRef.current; },
    
    // 方法
    show: deps.show,
    hide: deps.hide,
    confirm: tableHandler.confirm,
    import: tableHandler.import,
    multiLineEdit: blocklyHandler.multiLineEdit,
    // ...
  };
}
```

3. **删除 editor_multi.ts**

4. **更新导入**
   - `index.tsx` 不再导入 `editor_multi`
   - 直接使用 handlers 和 utils

---

### 阶段验收标准

#### Phase 4a
- [ ] editor_multi.ts 使用所有已提取的工具函数
- [ ] handlers 提取完成并有单测
- [ ] 外部调用行为不变
- [ ] editor_multi.ts 代码量 < 150 行

#### Phase 4b  
- [ ] editor_multi.ts 完全删除
- [ ] CodeMirror 在组件内初始化
- [ ] window.editor_multi 通过 createLegacyApi 创建
- [ ] 所有外部调用行为不变
- [ ] 所有单测通过 (目标 160+)
- [ ] 无 TypeScript 编译错误

---

### Final Structure

```
src/Workbench/CodeEditor/
├── index.tsx                    # React 组件 + CodeMirror 初始化
├── createLegacyApi.ts           # 🆕 window.editor_multi 兼容层
├── types/
│   └── index.ts                 # ✅ Phase 1
├── config/
│   └── commands.ts              # ✅ Phase 1
├── utils/
│   ├── index.ts                 # ✅ Phase 1
│   ├── ternDefinitions.ts       # ✅ Phase 1
│   ├── codeTransformers.ts      # ✅ Phase 1
│   └── createTernServer.ts      # ✅ Phase 2
├── handlers/
│   ├── editorEvents.ts          # 🆕 Phase 4a
│   ├── tableHandler.ts          # 🆕 Phase 4a
│   ├── blocklyHandler.ts        # 🆕 Phase 4a
│   └── fileHandler.ts           # 🆕 Phase 4a
└── __tests__/
    ├── codeTransformers.test.ts # ✅ Phase 1
    ├── ternDefinitions.test.ts  # ✅ Phase 1
    ├── createTernServer.test.ts # ✅ Phase 2
    ├── CodeEditor.test.tsx      # ✅ Phase 3
    ├── handlers.test.ts         # 🆕 Phase 4a
    └── integration.test.ts      # 🆕 Phase 4b
```

**注意：删除 `editor_multi.ts` 后不再需要 `legacyApi.ts`，兼容层直接在 `createLegacyApi.ts` 中实现。**

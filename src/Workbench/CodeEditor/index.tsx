import { useEditor } from "@/stores/EditorStore";
import { useCurrentFn } from "@/hooks/useCurrentFn";
import { useState, useCallback, type FC, useRef, useEffect } from "react";
import { editor_multi as createCodeEditor } from "./editor_multi";
import { commandsName, getShortcutKeys } from "./config/commands";

const DEFAULT_FONT_SIZE = 14;
const CONFIG_FONT_SIZE_KEY = "editor_multi.fontSize";

export const CodeEditor: FC = () => {
  const [visible, setVisible] = useState(false);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontBold, setFontBold] = useState(false);
  const [lintEnabled, setLintEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const editorMultiRef = useRef<ReturnType<typeof createCodeEditor> | null>(null);

  // Wrap state setters with useCurrentFn so they can be exposed to window.editor_multi
  const show = useCurrentFn(() => setVisible(true));
  const hide = useCurrentFn(() => setVisible(false));
  
  const updateFontSize = useCurrentFn((size: number, bold: boolean) => {
    setFontSize(size);
    setFontBold(bold);
    // Apply to CodeMirror wrapper
    if (editorMultiRef.current) {
      const wrapper = editorMultiRef.current.getWrapperElement?.();
      if (wrapper) {
        wrapper.style.fontSize = `${size}px`;
        wrapper.style.fontWeight = bold ? 'bold' : 'normal';
      }
    }
  });

  const updateLint = useCurrentFn((enabled: boolean) => {
    setLintEnabled(enabled);
  });

  const updateShowPreview = useCurrentFn((show: boolean) => {
    setShowPreview(show);
  });

  const handleLintToggle = useCallback(() => {
    const newValue = !lintEnabled;
    setLintEnabled(newValue);
    editorMultiRef.current?.setLint?.(newValue);
  }, [lintEnabled]);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFontSize(value);
    window.editor?.config?.set?.(CONFIG_FONT_SIZE_KEY, value);
    if (editorMultiRef.current) {
      const wrapper = editorMultiRef.current.getWrapperElement?.();
      if (wrapper) {
        wrapper.style.fontSize = `${value}px`;
        wrapper.style.fontWeight = fontBold ? 'bold' : 'normal';
      }
    }
  }, [fontBold]);

  const handleFontBoldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFontBold(checked);
    if (editorMultiRef.current) {
      const wrapper = editorMultiRef.current.getWrapperElement?.();
      if (wrapper) {
        wrapper.style.fontSize = `${fontSize}px`;
        wrapper.style.fontWeight = checked ? 'bold' : 'normal';
      }
    }
  }, [fontSize]);

  const handleCommandChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    editorMultiRef.current?.doCommand?.(e.target);
  }, []);

  useEditor(() => {
    // Load saved font size from config
    const savedFontSize = window.editor?.config?.get?.(CONFIG_FONT_SIZE_KEY, DEFAULT_FONT_SIZE) ?? DEFAULT_FONT_SIZE;
    setFontSize(savedFontSize);

    // Create the editor_multi instance
    const instance = createCodeEditor();
    editorMultiRef.current = instance;
    
    // Inject React state controls into the instance
    instance._reactControls = {
      show,
      hide,
      updateFontSize,
      updateLint,
      updateShowPreview,
    };

    window.editor_multi = instance;
  });

  // Sync lint checkbox state with React state
  useEffect(() => {
    const checkbox = document.getElementById('lintCheckbox') as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = lintEnabled;
    }
  }, [lintEnabled]);

  return (
    <div 
      id="left7" 
      className={visible ? '' : 'hidden-panel'}
      style={visible ? undefined : { zIndex: -1, opacity: 0 }}
    >
      {/* 多行文本编辑器 */}
      <div>
        <button onClick={() => editorMultiRef.current?.confirm?.()}>确认</button>
        <button onClick={() => editorMultiRef.current?.cancel?.()}>取消</button>
        <button onClick={() => editorMultiRef.current?.confirm?.(true)}>应用</button>
        <button onClick={() => editorMultiRef.current?.format?.()}>格式化</button>
        <button 
          id="editor_multi_preview" 
          style={{ display: showPreview ? "inline" : "none" }}
          onClick={() => editorMultiRef.current?.preview && window.editor?.uievent?.previewEditorMulti?.(
            editorMultiRef.current.preview,
            editorMultiRef.current.getValue?.() ?? ''
          )}
        >
          预览
        </button>
        <input
          type="checkbox"
          checked={lintEnabled}
          onChange={handleLintToggle}
          id="lintCheckbox"
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        />
        <span style={{ verticalAlign: "middle", marginLeft: "-3px" }}>
          语法检查
        </span>
        <select
          id="codemirrorCommands"
          onChange={handleCommandChange}
          style={{ verticalAlign: "middle", marginLeft: 6 }}
        >
          <option value="">常用命令</option>
          {getShortcutKeys().map(key => (
            <option key={key} value={key}>{commandsName[key]}</option>
          ))}
        </select>
        <span>字体大小</span>
        <input
          style={{ width: 40 }}
          type="number"
          value={fontSize}
          onChange={handleFontSizeChange}
          id="editor_multi_fontsize"
        />
        <span>字体加粗</span>
        <input
          type="checkbox"
          checked={fontBold}
          onChange={handleFontBoldChange}
          id="editor_multi_fontweight"
        />
      </div>
      <textarea id="multiLineCode" name="multiLineCode" defaultValue={""} />
    </div>
  );
}

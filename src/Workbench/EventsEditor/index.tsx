import type { FC } from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';

import { BlocklyWorkspace } from '@/blockly/components/BlocklyWorkspace';
import { createEditorBlocklyApi } from '@/blockly/api/editorBlockly';
import type { BlocklyWorkspaceRef, BlocklyWorkspaceProps } from '@/blockly/components/BlocklyWorkspace';
import type { EditorBlocklyApi } from '@/blockly/api/editorBlockly';

/**
 * 事件编辑器组件
 *
 * 基于 Blockly V12 的事件编辑器，用于编辑 MotaAction JSON
 */
export const EventsEditor: FC = () => {
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  const apiRef = useRef<EditorBlocklyApi | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [codePreview, setCodePreview] = useState('');

  // 显示编辑器
  const showEditor = useCallback(() => {
    setIsVisible(true);
    // 更新 DOM 样式以兼容旧版样式
    const panel = document.getElementById('left6');
    if (panel) {
      panel.style.zIndex = '999';
      panel.style.opacity = '1';
    }
  }, []);

  // 隐藏编辑器
  const hideEditor = useCallback(() => {
    setIsVisible(false);
    // 更新 DOM 样式以兼容旧版样式
    const panel = document.getElementById('left6');
    if (panel) {
      panel.style.zIndex = '-1';
      panel.style.opacity = '0';
    }
  }, []);

  // 初始化 API 并挂载到全局
  useEffect(() => {
    const api = createEditorBlocklyApi(
      () => workspaceRef.current,
      showEditor,
      hideEditor,
    );
    apiRef.current = api;

    // 挂载到全局，兼容旧版调用
    window.editor_blockly = api;

    return () => {
      // 清理全局引用
      if (window.editor_blockly === api) {
        window.editor_blockly = undefined as unknown as EditorBlocklyApi;
      }
    };
  }, [showEditor, hideEditor]);

  // 处理工作区内容变化
  const handleChange: BlocklyWorkspaceProps['onChange'] = useCallback((json: string) => {
    setCodePreview(json);
  }, []);

  // 处理确认按钮
  const handleConfirm = useCallback(() => {
    apiRef.current?.confirm();
  }, []);

  // 处理应用按钮
  const handleApply = useCallback(() => {
    apiRef.current?.confirm(true);
  }, []);

  // 处理取消按钮
  const handleCancel = useCallback(() => {
    apiRef.current?.cancel();
  }, []);

  // 处理解析按钮（未实现）
  const handleParse = useCallback(() => {
    apiRef.current?.parse();
  }, []);

  // 处理地图选点按钮（未实现）
  const handleSelectPoint = useCallback(() => {
    apiRef.current?.selectPointFromButton();
  }, []);

  // 处理中文名替换（未实现）
  const handleTriggerReplace = useCallback(() => {
    apiRef.current?.triggerReplace();
  }, []);

  // 处理展开逻辑运算（未实现）
  const handleTriggerExpandCompare = useCallback(() => {
    apiRef.current?.triggerExpandCompare();
  }, []);

  return (
    <div
      id="left6"
      className="leftTab"
      style={{ zIndex: isVisible ? 999 : -1, opacity: isVisible ? 1 : 0 }}
    >
      <div style={{ position: 'relative', height: '95%' }}>
        {/* 工具栏 */}
        <h3>
          事件编辑器 (V12 Preview) &nbsp;&nbsp;
          <button onClick={handleConfirm}>确认</button>
          <button onClick={handleApply}>应用</button>
          <button id="blocklyParse" onClick={handleParse}>
            解析
          </button>
          <button onClick={handleCancel}>取消</button>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginLeft: 10,
            }}
          >
            <div className="searchLogo" />
            <input type="text" id="searchBlock" placeholder="搜索事件块..." disabled />
          </div>
          <button
            className="cpPanel"
            onClick={handleSelectPoint}
            style={{ marginLeft: 5 }}
          >
            地图选点
          </button>
          <input
            type="checkbox"
            className="cpPanel"
            id="blocklyReplace"
            onChange={handleTriggerReplace}
            style={{ marginLeft: 10 }}
          />
          <span
            className="cpPanel"
            style={{ marginLeft: '-4px', fontSize: 13 }}
          >
            开启中文名替换
          </span>
          <input
            type="checkbox"
            className="cpPanel"
            id="blocklyExpandCompare"
            onChange={handleTriggerExpandCompare}
            style={{ marginLeft: 10 }}
          />
          <span
            className="cpPanel"
            style={{ marginLeft: '-4px', fontSize: 13 }}
          >
            展开值块逻辑运算
          </span>
        </h3>

        {/* Blockly 工作区和代码预览 */}
        <div style={{ position: 'relative', height: '100%', display: 'flex' }}>
          <div id="blocklyArea" style={{ flex: 1, position: 'relative' }}>
            <BlocklyWorkspace
              ref={workspaceRef}
              onChange={handleChange}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <textarea
            id="codeArea"
            spellCheck="false"
            value={codePreview}
            readOnly
            style={{
              width: '300px',
              height: '100%',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

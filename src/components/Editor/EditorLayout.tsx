import React, { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import { useEditorScripts } from '../../hooks/useEditorScripts';
import { loadEditorHTML } from '../../utils/editorTemplate';
import './EditorLayout.css';

const { Content } = Layout;

/**
 * 桌面端编辑器布局组件
 * 保留原有的 HTML 结构，使用 React 进行包装
 */
export const EditorLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  
  // 加载编辑器脚本
  useEditorScripts();

  useEffect(() => {
    // 检查协议
    if (location.protocol.indexOf('http') !== 0) {
      alert('请在启动服务中打开本编辑器！不然包括编辑在内的绝大多数功能都无法使用。');
    }

    // 加载 HTML 内容
    loadEditorHTML().then(html => {
      setHtmlContent(html);
    });
  }, []);

  return (
    <Layout className="editor-layout">
      <Content className="editor-content">
        <div className="main" ref={containerRef}>
          {htmlContent && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Layout } from 'antd';
import { useEditorStore } from '../../utils/store/editorStore';
import { useEditorScripts } from '../../hooks/useEditorScripts';
import { loadMobileEditorHTML } from '../../utils/editorTemplate';
import './EditorMobileLayout.css';

const { Content } = Layout;

/**
 * 移动端编辑器布局组件
 */
export const EditorMobileLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const { setIsMobile } = useEditorStore();
  
  // 加载编辑器脚本
  useEditorScripts();

  useEffect(() => {
    setIsMobile(true);
    
    // 检查协议
    if (location.protocol.indexOf('http') !== 0) {
      alert('请在启动服务中打开本编辑器！不然包括编辑在内的绝大多数功能都无法使用。');
    }

    // 加载 HTML 内容
    loadMobileEditorHTML().then(html => {
      setHtmlContent(html);
    });
  }, [setIsMobile]);

  return (
    <Layout className="editor-mobile-layout">
      <Content className="editor-mobile-content">
        <div className="main" ref={containerRef}>
          {htmlContent && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

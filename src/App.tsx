import { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { EditorLayout } from './components/Editor/EditorLayout';
import { EditorMobileLayout } from './components/Editor/EditorMobileLayout';
import './App.css';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测设备方向
    const checkOrientation = () => {
      setIsMobile(window.innerWidth < window.innerHeight);
    };

    checkOrientation();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      {isMobile ? <EditorMobileLayout /> : <EditorLayout />}
    </ConfigProvider>
  );
}

export default App;

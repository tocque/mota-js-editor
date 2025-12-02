/// <reference types="vite/client" />

// 扩展 Window 接口以包含编辑器全局对象
declare global {
  interface Window {
    editor: any;
    main: any;
    core: any;
  }
}

export {};

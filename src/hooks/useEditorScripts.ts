import { useEffect, useRef } from 'react';

/**
 * 加载编辑器所需的脚本文件
 */
export const useEditorScripts = () => {
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptsLoadedRef.current) return;
    scriptsLoadedRef.current = true;

    const scripts = [
      // 核心库
      '_server/fs.js',
      '_server/editor_config.js',
      '_server/editor_util.js',
      '_server/editor_game.js',
      '_server/editor_file.js',
      '_server/editor_table.js',
      '_server/editor_mode.js',
      '_server/editor_ui.js',
      '_server/editor_uievent.js',
      '_server/editor_mappanel.js',
      '_server/editor_datapanel.js',
      '_server/editor_materialpanel.js',
      '_server/editor_listen.js',
      
      // 第三方库（游戏运行时）
      'libs/thirdparty/lz-string.min.js',
      'libs/thirdparty/localforage.min.js',
      'libs/thirdparty/zip.min.js',
      
      // 编辑器主脚本
      '_server/editor.js',
      '_server/editor_multi.js',
      
      // Blockly
      '_server/blockly/Converter.bundle.min.js',
      '_server/blockly/blockly_compressed.js',
      '_server/blockly/blocks_compressed.js',
      '_server/blockly/javascript_compressed.js',
      '_server/blockly/zh-hans.js',
      '_server/MotaActionParser.js',
      '_server/editor_blocklyconfig.js',
      '_server/editor_blockly.js',
      
      // CodeMirror
      '_server/CodeMirror/codeMirror.bundle.min.js',
      '_server/CodeMirror/beautify.min.js',
      '_server/CodeMirror/jshint.min.js',
      '_server/CodeMirror/codeMirror.plugin.min.js',
      '_server/CodeMirror/acorn.min.js',
      '_server/CodeMirror/defs.js',
      '_server/CodeMirror/tern.min.js',
      
      // 第三方工具
      '_server/thirdparty/color.all.min.js',
      '_server/thirdparty/awesomplete.min.js',
      '_server/thirdparty/caret-position.js',
      '_server/thirdparty/jsColor.js',
    ];

    // 顺序加载脚本
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // 保持加载顺序
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    // 按顺序加载所有脚本
    const loadAllScripts = async () => {
      for (const src of scripts) {
        try {
          await loadScript(src);
        } catch (error) {
          console.error(error);
        }
      }
      
      // 所有脚本加载完成后初始化编辑器
      if ((window as any).editor) {
        (window as any).editor.init(() => {
          (window as any).editor.listen();
          (window as any).editor.mode_listen();
          (window as any).editor.mobile_listen();
        });
      }
    };

    loadAllScripts();

    return () => {
      // 清理函数（如果需要）
    };
  }, []);

  return scriptsLoadedRef.current;
};

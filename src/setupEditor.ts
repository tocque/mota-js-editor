import { once } from "es-toolkit";
import { loadScript } from "./utils/dom/loadScript";

export const setupEditor = once(async () => {

  const scriptList = [
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
    'libs/thirdparty/lz-string.min.js',
    'libs/thirdparty/localforage.min.js',
    'libs/thirdparty/zip.min.js',
    '_server/editor.js',
    '_server/editor_multi.js',
    '_server/blockly/Converter.bundle.min.js',
    '_server/blockly/blockly_compressed.js',
    '_server/blockly/blocks_compressed.js',
    '_server/blockly/javascript_compressed.js',
    '_server/blockly/zh-hans.js',
    '_server/MotaActionParser.js',
    '_server/editor_blocklyconfig.js',
    '_server/editor_blockly.js',
    '_server/CodeMirror/codeMirror.bundle.min.js',
    '_server/CodeMirror/beautify.min.js',
    '_server/CodeMirror/jshint.min.js',
    '_server/CodeMirror/codeMirror.plugin.min.js',
    '_server/CodeMirror/acorn.min.js',
    '_server/CodeMirror/defs.js',
    '_server/CodeMirror/tern.min.js',
    '_server/thirdparty/color.all.min.js',
    '_server/thirdparty/awesomplete.min.js',
    '_server/thirdparty/caret-position.js',
    '_server/thirdparty/jsColor.js'
  ];

  for (const script of scriptList) {
    await loadScript(script);
  }

  editor.init(() => {
    editor.listen();
    editor.mode_listen();
    editor.mobile_listen();
  });
});
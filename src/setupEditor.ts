import { once } from "es-toolkit";
import { loadScript } from "./utils/dom/loadScript";

import { fs } from '@/scripts/fs';
import { editor_config } from "./scripts/editor_config";
import { editor_util_wrapper } from "./scripts/editor_util";
import { editor_game_wrapper } from "./scripts/editor_game";
import { editor_file, editor_file_wrapper } from "./scripts/editor_file";

export const setupEditor = once(async () => {

  window.fs = fs;
  window.editor_config = editor_config;
  window.editor_util_wrapper = editor_util_wrapper;
  window.editor_game_wrapper = editor_game_wrapper;
  window.editor_file_wrapper = editor_file_wrapper;
  window.editor_file = editor_file;

  const scriptList = [
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
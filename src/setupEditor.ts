import { once } from "es-toolkit";
import { loadScript } from "./utils/dom/loadScript";

import { fs } from '@/services/fs';
import { editor_config } from "./scripts/editor_config";
import { editor_util_wrapper } from "./scripts/editor_util";
import { editor_game_wrapper } from "./scripts/editor_game";
import { editor_file, editor_file_wrapper } from "./scripts/editor_file";
import { editor_mode } from "./scripts/editor_mode";
import { editor_table_wrapper } from "./scripts/editor_table";
import { editor_ui_wrapper } from "./scripts/editor_ui";
import { editor_mappanel_wrapper } from "./scripts/editor_mappanel";
import { editor_datapanel_wrapper } from "./scripts/editor_datapanel";
import { editor_materialpanel_wrapper } from "./scripts/editor_materialpanel";
import { editor_listen_wrapper } from "./scripts/editor_listen";
import localforage from "localforage";
import { MotaActionParser } from "./scripts/MotaActionParser";
import "./scripts/blockly";
import { editor_blockly } from "./scripts/editor_blockly";
import editor_blocklyconfig from "./scripts/editor_blocklyconfig?raw";
import * as LZString from "lz-string";
import CodeMirror from "codemirror";
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/tern/tern';
import 'codemirror/lib/codemirror.css';
import * as tern from 'tern';
import { createEditor } from "./scripts/editor";
import Awesomplete from "awesomplete";
import "awesomplete/awesomplete.css";
import "@/css/editor.css";

export const setupEditor = once(async () => {

  window.fs = fs;
  window.editor_config = editor_config;
  window.editor_util_wrapper = editor_util_wrapper;
  window.editor_game_wrapper = editor_game_wrapper;
  window.editor_file_wrapper = editor_file_wrapper;
  window.editor_file = editor_file;
  window.editor_table_wrapper = editor_table_wrapper;
  window.editor_mode = editor_mode;
  window.editor_ui_wrapper = editor_ui_wrapper;
  window.editor_mappanel_wrapper = editor_mappanel_wrapper;
  window.editor_datapanel_wrapper = editor_datapanel_wrapper;
  window.editor_materialpanel_wrapper = editor_materialpanel_wrapper;
  window.editor_listen_wrapper = editor_listen_wrapper;
  window.LZString = LZString;
  window.localforage = localforage;
  window.editor = createEditor();
  window.MotaActionParser = MotaActionParser;
  window.editor_blockly = editor_blockly;
  window.editor_blocklyconfig = editor_blocklyconfig;
  window.CodeMirror = CodeMirror;
  window.tern = tern;
  window.Awesomplete = Awesomplete;

  const scriptList = [
    'libs/thirdparty/zip.min.js',
    '_server/blockly/Converter.bundle.min.js',
    '_server/CodeMirror/defs.js',
    '_server/thirdparty/color.all.min.js',
    '_server/thirdparty/caret-position.js',
    '_server/thirdparty/jsColor.js'
  ];

  for (const script of scriptList) {
    await loadScript(script);
  }

  await new Promise<void>((resolve) => {
    editor.init(() => {
      resolve();
    });
  });

  editor.listen();
  editor.mode_listen();
  editor.mobile_listen();
});
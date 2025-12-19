/// <reference types="vite/client" />

const fs: typeof import("@/scripts/fs")['fs']
const core: any;
const editor: any;
const editor_mode: any;
const editor_multi: any;
const editor_blockly: any;
const confirmColor: () => void;
const printf: (msg: string) => void;
const printe: (msg: unknown) => void;
const printi: (msg: string) => void;

interface Window {
  core: any;
  editor: any;
  editor_mode: any;
  editor_multi: any;
  editor_blockly: any;
  confirmColor: () => void;
  printf: (msg: string) => void;
  printe: (msg: unknown) => void;
  printi: (msg: string) => void;
  tern: typeof import('tern')
}


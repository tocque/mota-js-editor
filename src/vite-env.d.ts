/// <reference types="vite/client" />

const fs: typeof import("@/scripts/fs")['fs']
const core: any;
const editor: any;
const editor_mode: any;
const editor_multi: any;
const editor_blockly: any;
const confirmColor: () => void;

interface Window {
  printf: (msg: string) => void;
  printe: (msg: unknown) => void;
  printi: (msg: string) => void;
}

const printf: (msg: string) => void;
const printe: (msg: unknown) => void;
const printi: (msg: string) => void;

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { FileHandler } from "@/fs/FileHandler";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { projectData } from "@/project/data/projectData";
import type { DataResource } from "@/project/data/DataResource";
import { MemoryFileSystem } from "./MemoryFileSystem";

interface FileHandlerManagerInternals {
  handlers: Map<string, FileHandler>;
}

export interface SampleProjectContext {
  fs: MemoryFileSystem;
  registerPath(path: string): Promise<FileHandler>;
  loadResource<T>(resource: DataResource<T>): Promise<T>;
  reloadResource<T>(resource: DataResource<T>): Promise<T>;
  readText(path: string): string;
  hasFile(path: string): boolean;
}

const PROJECT_ROOT = path.resolve(process.cwd(), "public/project");

async function collectProjectFiles(dir: string = PROJECT_ROOT): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const result: string[] = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...await collectProjectFiles(absolute));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      result.push(absolute);
    }
  }

  return result;
}

function toProjectPath(absolute: string): string {
  return `project/${path.relative(PROJECT_ROOT, absolute).split(path.sep).join("/")}`;
}

function injectHandler(filePath: string, handler: FileHandler): void {
  (FileHandlerManager as unknown as FileHandlerManagerInternals).handlers.set(filePath, handler);
}

export async function loadSampleProject(): Promise<SampleProjectContext> {
  const fs = new MemoryFileSystem();
  FileHandlerManager.clear();
  projectData.resetForTests();

  for (const absolute of await collectProjectFiles()) {
    const filePath = toProjectPath(absolute);
    fs.setFile(filePath, await readFile(absolute, "utf-8"));
    const handler = new FileHandler(filePath, fs.createFsInterface());
    await handler.load();
    injectHandler(filePath, handler);
  }

  async function registerPath(filePath: string): Promise<FileHandler> {
    const handler = new FileHandler(filePath, fs.createFsInterface());
    await handler.load();
    injectHandler(filePath, handler);
    return handler;
  }

  async function loadResource<T>(resource: DataResource<T>): Promise<T> {
    await resource.reload();
    await resource.waitForSettled();
    return resource.value();
  }

  async function reloadResource<T>(resource: DataResource<T>): Promise<T> {
    await resource.raw().waitForIdle();
    projectData.resetForTests();
    await resource.reload();
    await resource.waitForSettled();
    return resource.value();
  }

  return {
    fs,
    registerPath,
    loadResource,
    reloadResource,
    readText(filePath: string): string {
      const content = fs.getFile(filePath);
      if (content == null) throw new Error(`Missing file ${filePath}`);
      return content;
    },
    hasFile(filePath: string): boolean {
      return fs.hasFile(filePath);
    },
  };
}

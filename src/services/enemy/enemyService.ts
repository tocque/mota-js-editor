/**
 * enemyService - 怪物数据服务
 *
 * 管理怪物数据（project/enemys.js），提供命令式 API
 * 不依赖 React，可在任何 JavaScript 环境使用
 *
 * 核心理念：
 * - 单文件管理：怪物数据只有一个文件 project/enemys.js
 * - 与 towerService 一致的架构：使用 FileHandler 管理状态
 * - 内存数据源 + 异步落盘
 */

import { produce } from "immer";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import type { Content } from "@/fs";
import { applyActions, type Action } from "@/utils/action";
import { EnemysDataHandler } from "./EnemysDataHandler";

/** 怪物数据文件路径 */
const ENEMYS_DATA_PATH = "project/enemys.js";

/**
 * 怪物信息类型
 */
export interface EnemyInfo {
  name?: string;
  hp?: number;
  atk?: number;
  def?: number;
  money?: number;
  exp?: number;
  point?: number;
  special?: number | number[];
  value?: number;
  range?: number;
  zoneSquare?: boolean;
  n?: number;
  atkValue?: number;
  defValue?: number;
  add?: boolean;
  notBomb?: boolean;
  bigImage?: string;
  faceIds?: Record<string, string>;
  displayIdInBook?: unknown;
  [key: string]: unknown;
}

/**
 * 怪物数据类型
 */
export interface EnemysData {
  [id: string]: EnemyInfo;
}

/**
 * enemyService - 怪物数据服务（命令式 API）
 */
class EnemyServiceImpl {
  /** 怪物数据 DataHandler（单例，懒加载） */
  private dataHandler: EnemysDataHandler | null = null;

  /**
   * 获取或创建 DataHandler（懒加载）
   */
  private getDataHandler(): EnemysDataHandler {
    if (!this.dataHandler) {
      const fileHandler = FileHandlerManager.get(ENEMYS_DATA_PATH);
      this.dataHandler = new EnemysDataHandler(fileHandler);
    }
    return this.dataHandler;
  }

  /**
   * 获取怪物数据（load 模式：抛出异常）
   *
   * 保证返回数据，如果加载失败则抛出异常
   *
   * 注意：调用者需要先确保文件已加载
   */
  getEnemysData(): EnemysData {
    return this.getDataHandler().unwrap();
  }

  /**
   * 获取怪物数据（Content 模式：返回所有状态）
   */
  getEnemysDataContent(): Content<EnemysData> {
    return this.getDataHandler().getContent();
  }

  /**
   * 获取 DataHandler（用于直接访问 signal）
   */
  getHandler(): EnemysDataHandler {
    return this.getDataHandler();
  }

  /**
   * 获取单个怪物信息
   */
  getEnemy(id: string): EnemyInfo | undefined {
    const data = this.getEnemysData();
    return data[id];
  }

  /**
   * 保存怪物数据修改
   *
   * 应用 actions 到怪物数据，立即更新内存并异步落盘
   */
  saveEnemy(id: string, actions: Action[]): void {
    if (actions.length === 0) {
      return;
    }

    // 使用 handler.update() 的转换函数模式 + immer
    this.getDataHandler().update((currentData) =>
      produce(currentData, (draft) => {
        // 将 actions 的路径前缀加上怪物 ID
        const prefixedActions: Action[] = actions.map(([type, path, value]) => [
          type,
          `['${id}']${path}`,
          value,
        ]);

        applyActions(draft as unknown as Record<string, unknown>, prefixedActions);

        // 同步到全局变量（兼容 legacy 代码）
        this.syncToGlobal(draft);
      })
    );
  }

  /**
   * 直接保存整个怪物数据
   */
  saveEnemysData(actions: Action[]): void {
    if (actions.length === 0) {
      return;
    }

    this.getDataHandler().update((currentData) =>
      produce(currentData, (draft) => {
        applyActions(draft as unknown as Record<string, unknown>, actions);

        // 同步到全局变量（兼容 legacy 代码）
        this.syncToGlobal(draft);
      })
    );
  }

  /**
   * 同步数据到全局变量（兼容 legacy 代码）
   */
  private syncToGlobal(data: EnemysData): void {
    if (typeof enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 !== "undefined") {
      // 清空并复制新数据
      const global = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80;
      for (const key of Object.keys(global)) {
        delete global[key];
      }
      Object.assign(global, data);
    }
  }

  /**
   * 重新加载怪物数据（从文件重新读取）
   */
  async refetch(): Promise<void> {
    return FileHandlerManager.reload(ENEMYS_DATA_PATH);
  }

  /**
   * 获取文件路径
   */
  getPath(): string {
    return ENEMYS_DATA_PATH;
  }
}

// 导出单例
export const enemyService = new EnemyServiceImpl();

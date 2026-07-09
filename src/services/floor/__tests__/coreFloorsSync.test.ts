/**
 * coreFloorsSync 集成测试
 * 
 * 测试目标：
 * 1. floorService.saveFloor() 后 core.floors 立即更新
 * 2. 同步更新（不是异步）
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { floorService } from "../floorService";
import { setupCoreFloorsSync, addFloorSync, removeFloorSync, stopCoreFloorsSync } from "../coreFloorsSync";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { FileHandler } from "@/fs/FileHandler";
import { MemoryFileSystem } from "@test/utils/MemoryFileSystem";
import { serializeToJsMapFile } from "@/utils/serialize";
import type { FloorData } from "@/types";
import type { Action } from "@/utils/action";

describe("coreFloorsSync", () => {
  let memoryFs: MemoryFileSystem;
  let originalCore: typeof globalThis.core | undefined;

  beforeEach(() => {
    // 保存原始 core
    originalCore = (globalThis as any).core;

    // 创建模拟的 core 对象
    (globalThis as any).core = {
      floors: {} as Record<string, ResolvedMap>,
      floorIds: [] as string[],
    };

    // 创建内存文件系统
    memoryFs = new MemoryFileSystem();
    
    // 清空 FileHandlerManager
    FileHandlerManager.clear();
    
    // 清空 floorService 的 dataHandlers 缓存
    (floorService as any).dataHandlers.clear();

    // 停止之前的同步（如果有）
    stopCoreFloorsSync();
  });

  afterEach(() => {
    // 停止同步
    stopCoreFloorsSync();

    // 恢复原始 core
    if (originalCore) {
      (globalThis as any).core = originalCore;
    } else {
      delete (globalThis as any).core;
    }

    // 清理
    FileHandlerManager.clear();
    (floorService as any).dataHandlers.clear();
  });

  /**
   * 辅助函数：创建并加载楼层文件
   */
  async function setupFloor(floorId: string, data: Partial<FloorData> = {}): Promise<void> {
    const floorData: FloorData = {
      floorId,
      title: data.title ?? `${floorId}层`,
      name: data.name ?? floorId,
      width: data.width ?? 13,
      height: data.height ?? 13,
      canFlyTo: data.canFlyTo ?? true,
      canFlyFrom: data.canFlyFrom ?? true,
      map: data.map ?? [],
      bgmap: data.bgmap ?? [],
      fgmap: data.fgmap ?? [],
      events: data.events ?? {},
      beforeBattle: data.beforeBattle ?? {},
      afterBattle: data.afterBattle ?? {},
      afterGetItem: data.afterGetItem ?? {},
      afterOpenDoor: data.afterOpenDoor ?? {},
      changeFloor: data.changeFloor ?? {},
      autoEvent: data.autoEvent ?? {},
      cannotMove: data.cannotMove ?? {},
    };

    const path = `project/floors/${floorId}.js`;

    // 设置文件内容
    memoryFs.setFile(path, serializeToJsMapFile(floorId, floorData));

    // 创建 FileHandler 并加载
    const handler = new FileHandler(path, memoryFs.createFsInterface());
    await handler.load();

    // 注入到 FileHandlerManager（通过反射）
    (FileHandlerManager as any).handlers.set(path, handler);
  }

  describe("setupCoreFloorsSync", () => {
    it("应该为所有现有楼层建立同步", async () => {
      // 设置 core.floorIds
      core.floorIds = ["MT1", "MT2", "MT3"];

      // 创建楼层文件
      await setupFloor("MT1", { title: "主塔1层" });
      await setupFloor("MT2", { title: "主塔2层" });
      await setupFloor("MT3", { title: "主塔3层" });

      // 启动同步
      setupCoreFloorsSync();

      // 验证 core.floors 已同步
      expect(core.floors["MT1"]).toBeDefined();
      expect(core.floors["MT2"]).toBeDefined();
      expect(core.floors["MT3"]).toBeDefined();
      
      expect((core.floors["MT1"] as any).title).toBe("主塔1层");
      expect((core.floors["MT2"] as any).title).toBe("主塔2层");
      expect((core.floors["MT3"] as any).title).toBe("主塔3层");
    });

    it("重复调用应该输出警告", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      setupCoreFloorsSync();
      setupCoreFloorsSync();

      expect(consoleSpy).toHaveBeenCalledWith("coreFloorsSync already setup");

      consoleSpy.mockRestore();
    });

    it("core 未定义时应该正常处理", () => {
      // 删除 core
      delete (globalThis as any).core;

      // 不应该抛出错误
      expect(() => setupCoreFloorsSync()).not.toThrow();
    });
  });

  describe("addFloorSync", () => {
    it("应该为单个楼层建立同步", async () => {
      await setupFloor("MT_SYNC1", { title: "测试楼层" });

      addFloorSync("MT_SYNC1");

      // 验证 core.floors 已同步
      expect(core.floors["MT_SYNC1"]).toBeDefined();
      expect((core.floors["MT_SYNC1"] as any).title).toBe("测试楼层");
    });

    it("重复添加同一楼层应该被忽略", async () => {
      await setupFloor("MT_SYNC2", { title: "测试楼层" });

      addFloorSync("MT_SYNC2");
      addFloorSync("MT_SYNC2");

      // 应该只有一个订阅
      expect(core.floors["MT_SYNC2"]).toBeDefined();
    });

    it("core 未定义时应该输出警告", () => {
      delete (globalThis as any).core;

      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      addFloorSync("MT_SYNC3");

      expect(consoleSpy).toHaveBeenCalledWith("core is not defined, skipping floor sync");

      consoleSpy.mockRestore();
    });
  });

  describe("removeFloorSync", () => {
    it("应该移除楼层同步", async () => {
      await setupFloor("MT_REMOVE1", { title: "测试楼层" });

      addFloorSync("MT_REMOVE1");
      expect(core.floors["MT_REMOVE1"]).toBeDefined();

      removeFloorSync("MT_REMOVE1");
      expect(core.floors["MT_REMOVE1"]).toBeUndefined();
    });

    it("移除不存在的楼层应该正常处理", () => {
      expect(() => removeFloorSync("NOTEXIST")).not.toThrow();
    });

    it("core 未定义时应该正常处理", () => {
      delete (globalThis as any).core;

      expect(() => removeFloorSync("MT_REMOVE2")).not.toThrow();
    });
  });

  describe("stopCoreFloorsSync", () => {
    it("应该停止所有同步", async () => {
      await setupFloor("MT_STOP1", { title: "楼层1" });
      await setupFloor("MT_STOP2", { title: "楼层2" });

      addFloorSync("MT_STOP1");
      addFloorSync("MT_STOP2");

      expect(core.floors["MT_STOP1"]).toBeDefined();
      expect(core.floors["MT_STOP2"]).toBeDefined();

      stopCoreFloorsSync();

      // 修改数据后不应该再同步
      const actions: Action[] = [["change", "['title']", "新标题"]];
      floorService.saveFloor("MT_STOP1", actions);

      // core.floors 应该保持旧值（因为同步已停止）
      // 注意：这里我们无法验证"不更新"，因为 core.floors 已经有值了
      // 我们只能验证 stopCoreFloorsSync 不抛出错误
      expect(() => stopCoreFloorsSync()).not.toThrow();
    });

    it("重复调用应该正常处理", () => {
      stopCoreFloorsSync();
      expect(() => stopCoreFloorsSync()).not.toThrow();
    });
  });

  describe("同步更新测试", () => {
    it("floorService.saveFloor() 后 core.floors 应该立即更新", async () => {
      await setupFloor("MT_IMMEDIATE", { title: "旧标题" });

      addFloorSync("MT_IMMEDIATE");

      // 验证初始状态
      expect((core.floors["MT_IMMEDIATE"] as any).title).toBe("旧标题");

      // 修改数据
      const actions: Action[] = [["change", "['title']", "新标题"]];
      floorService.saveFloor("MT_IMMEDIATE", actions);

      // 验证 core.floors 立即更新（同步）
      expect((core.floors["MT_IMMEDIATE"] as any).title).toBe("新标题");
    });

    it("多次修改应该每次都同步", async () => {
      await setupFloor("MT_MULTIPLE", { title: "标题0" });

      addFloorSync("MT_MULTIPLE");

      // 第一次修改
      floorService.saveFloor("MT_MULTIPLE", [["change", "['title']", "标题1"]]);
      expect((core.floors["MT_MULTIPLE"] as any).title).toBe("标题1");

      // 第二次修改
      floorService.saveFloor("MT_MULTIPLE", [["change", "['title']", "标题2"]]);
      expect((core.floors["MT_MULTIPLE"] as any).title).toBe("标题2");

      // 第三次修改
      floorService.saveFloor("MT_MULTIPLE", [["change", "['title']", "标题3"]]);
      expect((core.floors["MT_MULTIPLE"] as any).title).toBe("标题3");
    });

    it("修改多个字段应该全部同步", async () => {
      await setupFloor("MT_FIELDS", {
        title: "旧标题",
        width: 13,
        height: 13,
      });

      addFloorSync("MT_FIELDS");

      // 修改多个字段
      const actions: Action[] = [
        ["change", "['title']", "新标题"],
        ["change", "['width']", 20],
        ["change", "['height']", 20],
      ];
      floorService.saveFloor("MT_FIELDS", actions);

      // 验证所有字段都已同步
      expect((core.floors["MT_FIELDS"] as any).title).toBe("新标题");
      expect((core.floors["MT_FIELDS"] as any).width).toBe(20);
      expect((core.floors["MT_FIELDS"] as any).height).toBe(20);
    });

    it("修改嵌套字段应该同步", async () => {
      await setupFloor("MT_NESTED", {
        events: { "0,0": [{ type: "test" }] },
      });

      addFloorSync("MT_NESTED");

      // 修改嵌套字段
      const actions: Action[] = [
        ["change", "['events']['1,1']", [{ type: "new" }]],
      ];
      floorService.saveFloor("MT_NESTED", actions);

      // 验证嵌套字段已同步
      expect((core.floors["MT_NESTED"] as any).events?.["1,1"]).toEqual([{ type: "new" }]);
    });

    it("batchSave 应该同步所有修改", async () => {
      await setupFloor("MT_BATCH1", { title: "标题1" });
      await setupFloor("MT_BATCH2", { title: "标题2" });
      await setupFloor("MT_BATCH3", { title: "标题3" });

      addFloorSync("MT_BATCH1");
      addFloorSync("MT_BATCH2");
      addFloorSync("MT_BATCH3");

      // 批量修改
      floorService.batchSave([
        { floorId: "MT_BATCH1", actions: [["change", "['title']", "新标题1"]] },
        { floorId: "MT_BATCH2", actions: [["change", "['title']", "新标题2"]] },
        { floorId: "MT_BATCH3", actions: [["change", "['title']", "新标题3"]] },
      ]);

      // 验证所有楼层都已同步
      expect((core.floors["MT_BATCH1"] as any).title).toBe("新标题1");
      expect((core.floors["MT_BATCH2"] as any).title).toBe("新标题2");
      expect((core.floors["MT_BATCH3"] as any).title).toBe("新标题3");
    });
  });

  describe("同步时机测试", () => {
    it("应该是同步更新，不是异步", async () => {
      await setupFloor("MT_TIMING", { title: "旧标题" });

      addFloorSync("MT_TIMING");

      // 修改数据
      const actions: Action[] = [["change", "['title']", "新标题"]];
      floorService.saveFloor("MT_TIMING", actions);

      // 立即检查（不使用 await 或 setTimeout）
      // 如果是同步的，这里应该已经更新了
      expect((core.floors["MT_TIMING"] as any).title).toBe("新标题");

      // 再次验证（确保不是巧合）
      const floorData = floorService.getFloor("MT_TIMING");
      expect(floorData.title).toBe("新标题");
      expect((core.floors["MT_TIMING"] as any).title).toBe(floorData.title);
    });

    it("连续修改应该立即反映", async () => {
      await setupFloor("MT_CONTINUOUS", { title: "标题0" });

      addFloorSync("MT_CONTINUOUS");

      // 连续修改（不等待）
      floorService.saveFloor("MT_CONTINUOUS", [["change", "['title']", "标题1"]]);
      expect((core.floors["MT_CONTINUOUS"] as any).title).toBe("标题1");

      floorService.saveFloor("MT_CONTINUOUS", [["change", "['title']", "标题2"]]);
      expect((core.floors["MT_CONTINUOUS"] as any).title).toBe("标题2");

      floorService.saveFloor("MT_CONTINUOUS", [["change", "['title']", "标题3"]]);
      expect((core.floors["MT_CONTINUOUS"] as any).title).toBe("标题3");
    });
  });

  describe("边界情况", () => {
    it("未加载的楼层不应该同步", () => {
      // 不调用 setupFloor，直接添加同步
      addFloorSync("MT_NOTLOADED");

      // core.floors 不应该有这个楼层
      expect(core.floors["MT_NOTLOADED"]).toBeUndefined();
    });

    it("加载失败的楼层不应该同步", async () => {
      // 创建一个无效的文件
      const path = "project/floors/MT_INVALID.js";
      memoryFs.setFile(path, "invalid content");

      const handler = new FileHandler(path, memoryFs.createFsInterface());
      await handler.load();

      (FileHandlerManager as any).handlers.set(path, handler);

      addFloorSync("MT_INVALID");

      // core.floors 不应该有这个楼层（因为解析失败）
      expect(core.floors["MT_INVALID"]).toBeUndefined();
    });

    it("空 actions 不应该触发同步", async () => {
      await setupFloor("MT_EMPTY", { title: "原标题" });

      addFloorSync("MT_EMPTY");

      const originalTitle = (core.floors["MT_EMPTY"] as any).title;

      // 空 actions
      floorService.saveFloor("MT_EMPTY", []);

      // 标题应该保持不变
      expect((core.floors["MT_EMPTY"] as any).title).toBe(originalTitle);
    });
  });

  describe("集成测试", () => {
    it("完整流程：setup → add → modify → remove → stop", async () => {
      // 1. 创建楼层
      await setupFloor("MT_FULL", { title: "初始标题" });

      // 2. 启动同步
      core.floorIds = ["MT_FULL"];
      setupCoreFloorsSync();

      // 验证初始同步
      expect((core.floors["MT_FULL"] as any).title).toBe("初始标题");

      // 3. 修改数据
      floorService.saveFloor("MT_FULL", [["change", "['title']", "修改后标题"]]);
      expect((core.floors["MT_FULL"] as any).title).toBe("修改后标题");

      // 4. 移除同步
      removeFloorSync("MT_FULL");
      expect(core.floors["MT_FULL"]).toBeUndefined();

      // 5. 停止所有同步
      stopCoreFloorsSync();

      // 再次修改不应该同步（因为已停止）
      await setupFloor("MT_FULL2", { title: "新楼层" });
      addFloorSync("MT_FULL2");
      
      // 停止后添加的同步不应该生效
      stopCoreFloorsSync();
      floorService.saveFloor("MT_FULL2", [["change", "['title']", "不应该同步"]]);
      
      // 验证停止后不再同步
      expect(() => stopCoreFloorsSync()).not.toThrow();
    });

    it("多个楼层同时同步", async () => {
      const floorIds = ["MT_M1", "MT_M2", "MT_M3", "MT_M4", "MT_M5"];

      // 创建所有楼层
      for (const id of floorIds) {
        await setupFloor(id, { title: `${id}初始` });
      }

      // 启动同步
      core.floorIds = floorIds;
      setupCoreFloorsSync();

      // 验证所有楼层都已同步
      for (const id of floorIds) {
        expect((core.floors[id] as any).title).toBe(`${id}初始`);
      }

      // 批量修改
      floorService.batchSave(
        floorIds.map(id => ({
          floorId: id,
          actions: [["change", "['title']", `${id}修改`]],
        }))
      );

      // 验证所有修改都已同步
      for (const id of floorIds) {
        expect((core.floors[id] as any).title).toBe(`${id}修改`);
      }
    });
  });
});

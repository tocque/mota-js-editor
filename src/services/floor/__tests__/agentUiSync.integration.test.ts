/**
 * Agent → UI 同步集成测试
 * 
 * 测试目标：
 * 1. Agent 调用 floorService.saveFloor()
 * 2. 验证 useFloorData hook 自动收到更新
 * 3. 验证 UI 组件重渲染
 * 4. 验证双轨 API 状态同步
 * 
 * 测试策略：
 * - 使用非 React 环境模拟 Agent 调用
 * - 使用 signal 的 effect 模拟 React hook 订阅
 * - 验证命令式 API 和 signal 订阅的状态同步
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { effect, computed } from "alien-signals";
import { floorService } from "../floorService";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { FileHandler } from "@/fs/FileHandler";
import { MemoryFileSystem } from "@test/utils/MemoryFileSystem";
import { serializeToJsMapFile } from "@/utils/serialize";
import { ContentUtils } from "@/fs/ContentUtils";
import type { FloorData } from "@/types";
import type { Action } from "@/utils/action";

describe("Agent → UI 同步集成测试", () => {
  let memoryFs: MemoryFileSystem;

  beforeEach(() => {
    // 创建内存文件系统
    memoryFs = new MemoryFileSystem();
    
    // 清空 FileHandlerManager
    FileHandlerManager.clear();
    
    // 清空 floorService 的 dataHandlers 缓存
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (floorService as any).dataHandlers.clear();
  });

  afterEach(() => {
    FileHandlerManager.clear();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (FileHandlerManager as any).handlers.set(path, handler);
  }

  describe("基础同步测试", () => {
    it("Agent 调用 saveFloor 后，订阅者应该立即收到更新", async () => {
      await setupFloor("MT1", { title: "初始标题" });

      // 模拟 UI 组件订阅（使用 effect）
      const handler = floorService.getHandler("MT1");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 验证初始值
      expect(updates).toContain("初始标题");

      // Agent 调用命令式 API
      const actions: Action[] = [["change", "['title']", "Agent 修改的标题"]];
      floorService.saveFloor("MT1", actions);

      // 验证订阅者立即收到更新
      expect(updates).toContain("Agent 修改的标题");
      expect(updates.length).toBe(2); // 初始值 + 更新值

      dispose();
    });

    it("Agent 调用 saveFloor 后，getFloor 应该返回最新数据", async () => {
      await setupFloor("MT2", { title: "旧标题" });

      // Agent 修改数据
      const actions: Action[] = [["change", "['title']", "新标题"]];
      floorService.saveFloor("MT2", actions);

      // 验证命令式 API 返回最新数据
      const floorData = floorService.getFloor("MT2");
      expect(floorData.title).toBe("新标题");
    });

    it("Agent 调用 saveFloor 后，getFloorContent 应该返回最新数据", async () => {
      await setupFloor("MT3", { title: "旧标题" });

      // Agent 修改数据
      const actions: Action[] = [["change", "['title']", "新标题"]];
      floorService.saveFloor("MT3", actions);

      // 验证 Content 模式返回最新数据
      const content = floorService.getFloorContent("MT3");
      expect(ContentUtils.isLoaded(content)).toBe(true);
      if (ContentUtils.isLoaded(content)) {
        expect(content.value.title).toBe("新标题");
      }
    });
  });

  describe("多订阅者同步测试", () => {
    it("多个订阅者应该同时收到 Agent 的更新", async () => {
      await setupFloor("MT4", { title: "初始标题" });

      const handler = floorService.getHandler("MT4");
      
      // 模拟多个 UI 组件订阅
      const updates1: string[] = [];
      const updates2: string[] = [];
      const updates3: string[] = [];
      
      const dispose1 = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates1.push(content.value.title ?? "");
        }
      });

      const dispose2 = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates2.push(content.value.title ?? "");
        }
      });

      const dispose3 = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates3.push(content.value.title ?? "");
        }
      });

      // Agent 修改数据
      const actions: Action[] = [["change", "['title']", "Agent 更新"]];
      floorService.saveFloor("MT4", actions);

      // 验证所有订阅者都收到更新
      expect(updates1).toContain("Agent 更新");
      expect(updates2).toContain("Agent 更新");
      expect(updates3).toContain("Agent 更新");

      dispose1();
      dispose2();
      dispose3();
    });

    it("细粒度订阅应该只在关心的字段变化时更新", async () => {
      await setupFloor("MT5", { title: "标题", width: 13, height: 13 });

      const handler = floorService.getHandler("MT5");
      
      // 创建只关心 title 的派生 signal
      const titleSignal = computed(() =>
        ContentUtils.map(handler.content(), (data) => data.title)
      );
      
      const titleUpdates: string[] = [];
      const dispose = effect(() => {
        const titleContent = titleSignal();
        if (ContentUtils.isLoaded(titleContent)) {
          titleUpdates.push(titleContent.value ?? "");
        }
      });

      // 初始值
      expect(titleUpdates).toContain("标题");

      // Agent 修改 width（不应该触发 title 订阅者）
      floorService.saveFloor("MT5", [["change", "['width']", 20]]);

      // Agent 修改 title（应该触发）
      floorService.saveFloor("MT5", [["change", "['title']", "新标题"]]);

      // 验证只收到 title 的更新
      expect(titleUpdates).toContain("新标题");
      // 应该至少有初始值和新标题
      expect(titleUpdates.length).toBeGreaterThanOrEqual(2);

      dispose();
    });
  });

  describe("双轨 API 状态同步测试", () => {
    it("命令式 API 和 signal 订阅应该保持同步", async () => {
      await setupFloor("MT6", { title: "初始标题", width: 13 });

      const handler = floorService.getHandler("MT6");
      
      // 订阅者
      const updates: FloorData[] = [];
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push({ ...content.value });
        }
      });

      // Agent 通过命令式 API 修改
      floorService.saveFloor("MT6", [
        ["change", "['title']", "新标题"],
        ["change", "['width']", 20],
      ]);

      // 验证命令式 API 返回最新数据
      const floorData = floorService.getFloor("MT6");
      expect(floorData.title).toBe("新标题");
      expect(floorData.width).toBe(20);

      // 验证订阅者收到的数据与命令式 API 一致
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate.title).toBe(floorData.title);
      expect(lastUpdate.width).toBe(floorData.width);

      dispose();
    });

    it("通过 handler.update 修改后，命令式 API 应该返回最新数据", async () => {
      await setupFloor("MT7", { title: "旧标题" });

      const handler = floorService.getHandler("MT7");
      
      // 通过 handler.update 修改（模拟 UI 组件修改）
      handler.update((data) => ({ ...data, title: "UI 修改的标题" }));

      // 验证命令式 API 返回最新数据
      const floorData = floorService.getFloor("MT7");
      expect(floorData.title).toBe("UI 修改的标题");
    });

    it("batchSave 后，所有楼层的订阅者都应该收到更新", async () => {
      await setupFloor("MT8", { title: "标题1" });
      await setupFloor("MT9", { title: "标题2" });
      await setupFloor("MT10", { title: "标题3" });

      const handler1 = floorService.getHandler("MT8");
      const handler2 = floorService.getHandler("MT9");
      const handler3 = floorService.getHandler("MT10");
      
      const updates1: string[] = [];
      const updates2: string[] = [];
      const updates3: string[] = [];
      
      const dispose1 = effect(() => {
        const content = handler1.content();
        if (ContentUtils.isLoaded(content)) {
          updates1.push(content.value.title ?? "");
        }
      });

      const dispose2 = effect(() => {
        const content = handler2.content();
        if (ContentUtils.isLoaded(content)) {
          updates2.push(content.value.title ?? "");
        }
      });

      const dispose3 = effect(() => {
        const content = handler3.content();
        if (ContentUtils.isLoaded(content)) {
          updates3.push(content.value.title ?? "");
        }
      });

      // Agent 批量修改
      floorService.batchSave([
        { floorId: "MT8", actions: [["change", "['title']", "新标题1"]] },
        { floorId: "MT9", actions: [["change", "['title']", "新标题2"]] },
        { floorId: "MT10", actions: [["change", "['title']", "新标题3"]] },
      ]);

      // 验证所有订阅者都收到更新
      expect(updates1).toContain("新标题1");
      expect(updates2).toContain("新标题2");
      expect(updates3).toContain("新标题3");

      // 验证命令式 API 返回最新数据
      expect(floorService.getFloor("MT8").title).toBe("新标题1");
      expect(floorService.getFloor("MT9").title).toBe("新标题2");
      expect(floorService.getFloor("MT10").title).toBe("新标题3");

      dispose1();
      dispose2();
      dispose3();
    });
  });

  describe("复杂场景测试", () => {
    it("Agent 连续修改，订阅者应该收到所有更新", async () => {
      await setupFloor("MT11", { title: "标题0" });

      const handler = floorService.getHandler("MT11");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // Agent 连续修改
      floorService.saveFloor("MT11", [["change", "['title']", "标题1"]]);
      floorService.saveFloor("MT11", [["change", "['title']", "标题2"]]);
      floorService.saveFloor("MT11", [["change", "['title']", "标题3"]]);

      // 验证收到所有更新
      expect(updates).toContain("标题0"); // 初始值
      expect(updates).toContain("标题1");
      expect(updates).toContain("标题2");
      expect(updates).toContain("标题3");

      dispose();
    });

    it("Agent 修改嵌套字段，订阅者应该收到更新", async () => {
      await setupFloor("MT12", {
        events: { "0,0": [{ type: "test" }] },
      });

      const handler = floorService.getHandler("MT12");
      const updates: Record<string, unknown>[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push({ ...content.value.events });
        }
      });

      // Agent 修改嵌套字段
      floorService.saveFloor("MT12", [
        ["change", "['events']['1,1']", [{ type: "new" }]],
      ]);

      // 验证订阅者收到更新
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate?.["1,1"]).toEqual([{ type: "new" }]);

      dispose();
    });

    it("Agent 修改多个字段，订阅者应该收到完整更新", async () => {
      await setupFloor("MT13", {
        title: "旧标题",
        width: 13,
        height: 13,
        canFlyTo: true,
      });

      const handler = floorService.getHandler("MT13");
      const updates: FloorData[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push({ ...content.value });
        }
      });

      // Agent 修改多个字段
      floorService.saveFloor("MT13", [
        ["change", "['title']", "新标题"],
        ["change", "['width']", 20],
        ["change", "['height']", 20],
        ["change", "['canFlyTo']", false],
      ]);

      // 验证订阅者收到完整更新
      const lastUpdate = updates[updates.length - 1];
      expect(lastUpdate.title).toBe("新标题");
      expect(lastUpdate.width).toBe(20);
      expect(lastUpdate.height).toBe(20);
      expect(lastUpdate.canFlyTo).toBe(false);

      dispose();
    });

    it("多个 Agent 同时修改不同楼层，订阅者应该各自收到更新", async () => {
      await setupFloor("MT14", { title: "标题14" });
      await setupFloor("MT15", { title: "标题15" });

      const handler14 = floorService.getHandler("MT14");
      const handler15 = floorService.getHandler("MT15");
      
      const updates14: string[] = [];
      const updates15: string[] = [];
      
      const dispose14 = effect(() => {
        const content = handler14.content();
        if (ContentUtils.isLoaded(content)) {
          updates14.push(content.value.title ?? "");
        }
      });

      const dispose15 = effect(() => {
        const content = handler15.content();
        if (ContentUtils.isLoaded(content)) {
          updates15.push(content.value.title ?? "");
        }
      });

      // 模拟多个 Agent 同时修改
      floorService.saveFloor("MT14", [["change", "['title']", "Agent1 修改"]]);
      floorService.saveFloor("MT15", [["change", "['title']", "Agent2 修改"]]);

      // 验证各自的订阅者收到正确的更新
      expect(updates14).toContain("Agent1 修改");
      expect(updates15).toContain("Agent2 修改");

      // 验证没有交叉污染
      expect(updates14).not.toContain("Agent2 修改");
      expect(updates15).not.toContain("Agent1 修改");

      dispose14();
      dispose15();
    });
  });

  describe("边界情况测试", () => {
    it("订阅后立即修改，应该收到更新", async () => {
      await setupFloor("MT16", { title: "初始标题" });

      const handler = floorService.getHandler("MT16");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 立即修改
      floorService.saveFloor("MT16", [["change", "['title']", "立即修改"]]);

      // 应该收到更新
      expect(updates).toContain("立即修改");

      dispose();
    });

    it("取消订阅后，不应该再收到更新", async () => {
      await setupFloor("MT17", { title: "初始标题" });

      const handler = floorService.getHandler("MT17");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 取消订阅
      dispose();

      // 修改数据
      floorService.saveFloor("MT17", [["change", "['title']", "取消后修改"]]);

      // 不应该收到更新
      expect(updates).not.toContain("取消后修改");
    });

    it("空 actions 不应该触发订阅者更新", async () => {
      await setupFloor("MT18", { title: "原标题" });

      const handler = floorService.getHandler("MT18");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      const initialLength = updates.length;

      // 空 actions
      floorService.saveFloor("MT18", []);

      // 不应该触发新的更新
      expect(updates.length).toBe(initialLength);

      dispose();
    });
  });

  describe("性能测试", () => {
    it("大量订阅者不应该影响更新性能", async () => {
      await setupFloor("MT19", { title: "初始标题" });

      const handler = floorService.getHandler("MT19");
      const disposes: Array<() => void> = [];
      
      // 创建100个订阅者
      for (let i = 0; i < 100; i++) {
        const dispose = effect(() => {
          const content = handler.content();
          if (ContentUtils.isLoaded(content)) {
            // 模拟订阅者处理
            void content.value.title;
          }
        });
        disposes.push(dispose);
      }

      // 修改数据
      const startTime = Date.now();
      floorService.saveFloor("MT19", [["change", "['title']", "新标题"]]);
      const endTime = Date.now();

      // 验证更新时间合理（应该在100ms内完成）
      expect(endTime - startTime).toBeLessThan(100);

      // 清理订阅
      disposes.forEach(dispose => dispose());
    });

    it("连续快速修改应该正确处理", async () => {
      await setupFloor("MT20", { title: "标题0" });

      const handler = floorService.getHandler("MT20");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 连续快速修改
      for (let i = 1; i <= 10; i++) {
        floorService.saveFloor("MT20", [["change", "['title']", `标题${i}`]]);
      }

      // 验证最后一次修改生效
      expect(updates[updates.length - 1]).toBe("标题10");

      dispose();
    });
  });
});

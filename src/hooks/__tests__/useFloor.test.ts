/**
 * useFloorData 集成测试
 * 
 * 测试策略：
 * - useFloorData 只是对 floorService 的薄包装，核心逻辑已在 floorService 中测试
 * - 这里主要测试 hook 正确调用了 service，以及 signal 订阅机制工作正常
 * - 使用非 React 环境测试 signal 订阅，避免需要 jsdom
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { effect, computed } from "alien-signals";
import { floorService } from "@/services/floor";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { FileHandler } from "@/fs/FileHandler";
import { MemoryFileSystem } from "@test/utils/MemoryFileSystem";
import { serializeToJsMapFile } from "@/utils/serialize";
import { ContentUtils } from "@/fs/ContentUtils";
import type { FloorData } from "@/types";

describe("useFloorData 集成测试（非 React 环境）", () => {
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

  describe("基础功能", () => {
    it("getHandler 应该返回正确的 DataHandler", async () => {
      await setupFloor("MT1", { title: "主塔1层" });

      const handler = floorService.getHandler("MT1");
      
      expect(handler).toBeDefined();
      expect(handler.content).toBeDefined();
      expect(handler.update).toBeDefined();
      
      const content = handler.content();
      expect(ContentUtils.isLoaded(content)).toBe(true);
      if (ContentUtils.isLoaded(content)) {
        expect(content.value.floorId).toBe("MT1");
        expect(content.value.title).toBe("主塔1层");
      }
    });

    it("应该能够通过 handler.update 更新数据", async () => {
      await setupFloor("MT2", { title: "旧标题" });

      const handler = floorService.getHandler("MT2");
      
      // 更新数据
      handler.update((data) => ({ ...data, title: "新标题" }));
      
      // 验证更新
      const content = handler.content();
      expect(ContentUtils.isLoaded(content)).toBe(true);
      if (ContentUtils.isLoaded(content)) {
        expect(content.value.title).toBe("新标题");
      }
    });
  });

  describe("Signal 订阅机制", () => {
    it("应该能够订阅数据变化", async () => {
      await setupFloor("MT3", { title: "初始标题" });

      const handler = floorService.getHandler("MT3");
      const updates: string[] = [];
      
      // 订阅变化
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 初始值应该被记录
      expect(updates).toContain("初始标题");

      // 更新数据
      handler.update((data) => ({ ...data, title: "更新后的标题" }));

      // 新值应该被记录
      expect(updates).toContain("更新后的标题");
      expect(updates.length).toBe(2);

      dispose();
    });

    it("多个订阅者应该都能收到更新", async () => {
      await setupFloor("MT4", { title: "初始标题" });

      const handler = floorService.getHandler("MT4");
      const updates1: string[] = [];
      const updates2: string[] = [];
      
      // 第一个订阅者
      const dispose1 = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates1.push(content.value.title ?? "");
        }
      });

      // 第二个订阅者
      const dispose2 = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates2.push(content.value.title ?? "");
        }
      });

      // 更新数据
      handler.update((data) => ({ ...data, title: "新标题" }));

      // 两个订阅者都应该收到更新
      expect(updates1).toContain("新标题");
      expect(updates2).toContain("新标题");

      dispose1();
      dispose2();
    });

    it("通过 floorService.saveFloor 更新后，订阅者应该收到通知", async () => {
      await setupFloor("MT5", { title: "初始标题" });

      const handler = floorService.getHandler("MT5");
      const updates: string[] = [];
      
      const dispose = effect(() => {
        const content = handler.content();
        if (ContentUtils.isLoaded(content)) {
          updates.push(content.value.title ?? "");
        }
      });

      // 通过 floorService 更新
      floorService.saveFloor("MT5", [["change", "['title']", "通过 service 更新"]]);

      // 订阅者应该收到更新
      expect(updates).toContain("通过 service 更新");

      dispose();
    });
  });

  describe("细粒度订阅（computed）", () => {
    it("应该支持只订阅特定字段", async () => {
      await setupFloor("MT6", { title: "初始标题", width: 13 });

      const handler = floorService.getHandler("MT6");
      
      // 创建派生 signal，只关心 title
      const titleSignal = computed(() =>
        ContentUtils.map(handler.content(), (data) => data.title)
      );
      
      const titleContent = titleSignal();
      expect(ContentUtils.isLoaded(titleContent)).toBe(true);
      if (ContentUtils.isLoaded(titleContent)) {
        expect(titleContent.value).toBe("初始标题");
      }
    });

    it("只订阅 title 时，修改 title 应该触发更新", async () => {
      await setupFloor("MT7", { title: "标题", width: 13 });

      const handler = floorService.getHandler("MT7");
      
      // 创建派生 signal，只关心 title
      const titleSignal = computed(() =>
        ContentUtils.map(handler.content(), (data) => data.title)
      );
      
      const updates: string[] = [];
      const dispose = effect(() => {
        const titleContent = titleSignal();
        if (ContentUtils.isLoaded(titleContent)) {
          updates.push(titleContent.value ?? "");
        }
      });

      // 初始值
      expect(updates).toContain("标题");

      // 修改 width（虽然会触发 handler.content 变化，但 title 值没变）
      floorService.saveFloor("MT7", [["change", "['width']", 20]]);

      // 修改 title（应该触发更新）
      floorService.saveFloor("MT7", [["change", "['title']", "新标题"]]);

      // 应该收到新的 title
      expect(updates).toContain("新标题");
      // 验证至少有初始值和新标题
      expect(updates.length).toBeGreaterThanOrEqual(2);

      dispose();
    });

    it("应该支持复杂的派生数据", async () => {
      await setupFloor("MT8", {
        title: "测试楼层",
        width: 15,
        height: 20,
      });

      const handler = floorService.getHandler("MT8");
      
      // 创建派生 signal，计算面积
      const areaSignal = computed(() =>
        ContentUtils.map(handler.content(), (data) => ({
          width: data.width ?? 0,
          height: data.height ?? 0,
          area: (data.width ?? 0) * (data.height ?? 0),
        }))
      );
      
      const areaContent = areaSignal();
      expect(ContentUtils.isLoaded(areaContent)).toBe(true);
      if (ContentUtils.isLoaded(areaContent)) {
        expect(areaContent.value.width).toBe(15);
        expect(areaContent.value.height).toBe(20);
        expect(areaContent.value.area).toBe(300);
      }

      // 修改尺寸
      floorService.saveFloor("MT8", [
        ["change", "['width']", 10],
        ["change", "['height']", 10],
      ]);

      // 验证更新
      const updatedContent = areaSignal();
      expect(ContentUtils.isLoaded(updatedContent)).toBe(true);
      if (ContentUtils.isLoaded(updatedContent)) {
        expect(updatedContent.value.area).toBe(100);
      }
    });
  });

  describe("错误处理", () => {
    it("未加载时应该返回 idle 状态", () => {
      const handler = floorService.getHandler("MT_NOTEXIST");
      const content = handler.content();

      expect(content.status).toBe("idle");
    });

    it("更新未加载的数据应该抛出错误", () => {
      const handler = floorService.getHandler("MT_NOTEXIST");

      expect(() => {
        handler.update((data) => ({ ...data, title: "新标题" }));
      }).toThrow();
    });
  });
});

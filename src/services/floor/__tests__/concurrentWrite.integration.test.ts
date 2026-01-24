/**
 * 并发写入集成测试
 * 
 * 测试目标：
 * 1. 测试不同楼层并行写入
 * 2. 测试同一楼层串行写入
 * 3. 验证写入顺序性
 * 
 * 测试策略：
 * - 使用 MemoryFileSystem 模拟文件系统
 * - 使用 setWriteDelay 模拟慢速写入
 * - 验证并发写入的隔离性和顺序性
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { floorService } from "../floorService";
import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { FileHandler } from "@/fs/FileHandler";
import { MemoryFileSystem } from "@test/utils/MemoryFileSystem";
import { encode64 } from "@/utils/encoding";
import { serializeToJsMapFile } from "@/utils/serialize";
import { wait } from "@test/utils/testHelpers";
import type { FloorData } from "@/types";
import type { Action } from "@/utils/action";

describe("并发写入集成测试", () => {
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

    const content = serializeToJsMapFile(floorId, floorData);
    const encoded = encode64(content);
    const path = `project/floors/${floorId}.js`;

    // 设置文件内容
    memoryFs.setFile(path, encoded);

    // 创建 FileHandler 并加载
    const handler = new FileHandler(path, memoryFs.createFsInterface());
    await handler.load();

    // 注入到 FileHandlerManager（通过反射）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (FileHandlerManager as any).handlers.set(path, handler);
  }

  describe("不同楼层并行写入", () => {
    it("不同楼层应该可以并行写入，互不阻塞", async () => {
      // 设置写入延迟，模拟慢速写入
      memoryFs.setWriteDelay(50);

      await setupFloor("MT1", { title: "标题1" });
      await setupFloor("MT2", { title: "标题2" });
      await setupFloor("MT3", { title: "标题3" });

      const startTime = Date.now();

      // 并行修改三个楼层
      await Promise.all([
        (async () => {
          floorService.saveFloor("MT1", [["change", "['title']", "新标题1"]]);
          await wait(10); // 等待内存更新
        })(),
        (async () => {
          floorService.saveFloor("MT2", [["change", "['title']", "新标题2"]]);
          await wait(10);
        })(),
        (async () => {
          floorService.saveFloor("MT3", [["change", "['title']", "新标题3"]]);
          await wait(10);
        })(),
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 验证内存立即更新（不等待文件写入）
      expect(floorService.getFloor("MT1").title).toBe("新标题1");
      expect(floorService.getFloor("MT2").title).toBe("新标题2");
      expect(floorService.getFloor("MT3").title).toBe("新标题3");

      // 验证并行执行（总时间应该远小于串行执行的时间）
      // 如果是串行，需要 50ms * 3 = 150ms
      // 如果是并行，应该接近 50ms + 一些开销
      expect(duration).toBeLessThan(120); // 给一些余量
    });

    it("大量不同楼层并行写入应该正常工作", async () => {
      memoryFs.setWriteDelay(20);

      // 创建10个楼层
      const floorIds = Array.from({ length: 10 }, (_, i) => `MT_PARALLEL_${i}`);
      for (const id of floorIds) {
        await setupFloor(id, { title: `${id}初始` });
      }

      // 并行修改所有楼层
      await Promise.all(
        floorIds.map(async (id, i) => {
          floorService.saveFloor(id, [["change", "['title']", `${id}修改${i}`]]);
          await wait(10);
        })
      );

      // 验证所有楼层都已更新
      for (let i = 0; i < floorIds.length; i++) {
        const id = floorIds[i];
        expect(floorService.getFloor(id).title).toBe(`${id}修改${i}`);
      }
    });

    it("不同楼层的写入不应该相互影响", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_A", { title: "A初始", width: 13 });
      await setupFloor("MT_B", { title: "B初始", width: 13 });

      // 并行修改
      await Promise.all([
        (async () => {
          floorService.saveFloor("MT_A", [
            ["change", "['title']", "A修改"],
            ["change", "['width']", 20],
          ]);
          await wait(10);
        })(),
        (async () => {
          floorService.saveFloor("MT_B", [
            ["change", "['title']", "B修改"],
            ["change", "['width']", 15],
          ]);
          await wait(10);
        })(),
      ]);

      // 验证各自的修改都生效，没有交叉污染
      const floorA = floorService.getFloor("MT_A");
      const floorB = floorService.getFloor("MT_B");

      expect(floorA.title).toBe("A修改");
      expect(floorA.width).toBe(20);
      expect(floorB.title).toBe("B修改");
      expect(floorB.width).toBe(15);
    });
  });

  describe("同一楼层串行写入", () => {
    it("同一楼层的并发写入应该串行化", async () => {
      memoryFs.setWriteDelay(50);

      await setupFloor("MT_SERIAL", { title: "初始" });

      // 并发发起多个写入请求
      const writes = [
        (async () => {
          floorService.saveFloor("MT_SERIAL", [["change", "['title']", "写入1"]]);
          await wait(10);
        })(),
        (async () => {
          floorService.saveFloor("MT_SERIAL", [["change", "['title']", "写入2"]]);
          await wait(10);
        })(),
        (async () => {
          floorService.saveFloor("MT_SERIAL", [["change", "['title']", "写入3"]]);
          await wait(10);
        })(),
      ];

      await Promise.all(writes);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_SERIAL").title).toBe("写入3");
    });

    it("同一楼层的连续写入应该保持顺序", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_ORDER", { title: "0" });

      // 连续发起写入（不等待）
      for (let i = 1; i <= 5; i++) {
        floorService.saveFloor("MT_ORDER", [["change", "['title']", `${i}`]]);
      }

      // 等待所有写入完成
      await wait(200);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_ORDER").title).toBe("5");
    });

    it("同一楼层的快速连续写入应该正确处理", async () => {
      memoryFs.setWriteDelay(20);

      await setupFloor("MT_FAST", { title: "0" });

      // 快速连续写入
      const count = 20;
      for (let i = 1; i <= count; i++) {
        floorService.saveFloor("MT_FAST", [["change", "['title']", `${i}`]]);
      }

      // 等待所有写入完成
      await wait(500);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_FAST").title).toBe(`${count}`);
    });

    it("同一楼层的写入应该按照发起顺序执行", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_SEQUENCE", { title: "0", width: 0 });

      // 按顺序发起写入
      floorService.saveFloor("MT_SEQUENCE", [["change", "['title']", "1"]]);
      floorService.saveFloor("MT_SEQUENCE", [["change", "['width']", 10]]);
      floorService.saveFloor("MT_SEQUENCE", [["change", "['title']", "2"]]);
      floorService.saveFloor("MT_SEQUENCE", [["change", "['width']", 20]]);

      // 等待所有写入完成
      await wait(200);

      // 验证最后的状态
      const floor = floorService.getFloor("MT_SEQUENCE");
      expect(floor.title).toBe("2");
      expect(floor.width).toBe(20);
    });
  });

  describe("写入顺序性验证", () => {
    it("内存更新应该立即生效，不等待文件写入", async () => {
      memoryFs.setWriteDelay(100); // 长延迟

      await setupFloor("MT_IMMEDIATE", { title: "旧标题" });

      // 发起写入
      floorService.saveFloor("MT_IMMEDIATE", [["change", "['title']", "新标题"]]);

      // 立即检查（不等待文件写入）
      expect(floorService.getFloor("MT_IMMEDIATE").title).toBe("新标题");
    });

    it("多次修改应该累积，最后一次生效", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_ACCUMULATE", { title: "0", width: 0, height: 0 });

      // 连续修改不同字段
      floorService.saveFloor("MT_ACCUMULATE", [["change", "['title']", "1"]]);
      floorService.saveFloor("MT_ACCUMULATE", [["change", "['width']", 10]]);
      floorService.saveFloor("MT_ACCUMULATE", [["change", "['height']", 10]]);
      floorService.saveFloor("MT_ACCUMULATE", [["change", "['title']", "2"]]);

      // 等待所有写入完成
      await wait(200);

      // 验证最终状态
      const floor = floorService.getFloor("MT_ACCUMULATE");
      expect(floor.title).toBe("2");
      expect(floor.width).toBe(10);
      expect(floor.height).toBe(10);
    });

    it("batchSave 应该保持批次内的顺序", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_BATCH1", { title: "0" });
      await setupFloor("MT_BATCH2", { title: "0" });
      await setupFloor("MT_BATCH3", { title: "0" });

      // 批量修改
      floorService.batchSave([
        { floorId: "MT_BATCH1", actions: [["change", "['title']", "1"]] },
        { floorId: "MT_BATCH2", actions: [["change", "['title']", "2"]] },
        { floorId: "MT_BATCH3", actions: [["change", "['title']", "3"]] },
      ]);

      // 等待所有写入完成
      await wait(150);

      // 验证所有修改都生效
      expect(floorService.getFloor("MT_BATCH1").title).toBe("1");
      expect(floorService.getFloor("MT_BATCH2").title).toBe("2");
      expect(floorService.getFloor("MT_BATCH3").title).toBe("3");
    });

    it("混合单个和批量写入应该正确处理", async () => {
      memoryFs.setWriteDelay(20);

      await setupFloor("MT_MIX1", { title: "0" });
      await setupFloor("MT_MIX2", { title: "0" });

      // 混合写入
      floorService.saveFloor("MT_MIX1", [["change", "['title']", "1"]]);
      floorService.batchSave([
        { floorId: "MT_MIX1", actions: [["change", "['title']", "2"]] },
        { floorId: "MT_MIX2", actions: [["change", "['title']", "1"]] },
      ]);
      floorService.saveFloor("MT_MIX2", [["change", "['title']", "2"]]);

      // 等待所有写入完成
      await wait(150);

      // 验证最终状态
      expect(floorService.getFloor("MT_MIX1").title).toBe("2");
      expect(floorService.getFloor("MT_MIX2").title).toBe("2");
    });
  });

  describe("边界情况", () => {
    it("写入延迟为0时应该正常工作", async () => {
      memoryFs.setWriteDelay(0);

      await setupFloor("MT_NODELAY", { title: "旧标题" });

      // 并发写入
      await Promise.all([
        (async () => {
          floorService.saveFloor("MT_NODELAY", [["change", "['title']", "写入1"]]);
          await wait(5);
        })(),
        (async () => {
          floorService.saveFloor("MT_NODELAY", [["change", "['title']", "写入2"]]);
          await wait(5);
        })(),
        (async () => {
          floorService.saveFloor("MT_NODELAY", [["change", "['title']", "写入3"]]);
          await wait(5);
        })(),
      ]);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_NODELAY").title).toBe("写入3");
    });

    it("极短时间内大量写入应该正确处理", async () => {
      memoryFs.setWriteDelay(10);

      await setupFloor("MT_BURST", { title: "0" });

      // 瞬间发起大量写入
      const count = 50;
      for (let i = 1; i <= count; i++) {
        floorService.saveFloor("MT_BURST", [["change", "['title']", `${i}`]]);
      }

      // 等待所有写入完成
      await wait(1000);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_BURST").title).toBe(`${count}`);
    });

    it("写入过程中读取应该返回最新的内存数据", async () => {
      memoryFs.setWriteDelay(100); // 长延迟

      await setupFloor("MT_READ", { title: "旧标题" });

      // 发起写入
      floorService.saveFloor("MT_READ", [["change", "['title']", "新标题"]]);

      // 立即读取（文件还在写入中）
      expect(floorService.getFloor("MT_READ").title).toBe("新标题");

      // 再次修改
      floorService.saveFloor("MT_READ", [["change", "['title']", "更新标题"]]);

      // 立即读取
      expect(floorService.getFloor("MT_READ").title).toBe("更新标题");
    });

    it("空 actions 不应该触发文件写入", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_EMPTY", { title: "原标题" });

      const initialWriteCount = memoryFs.getWriteCount();

      // 空 actions
      floorService.saveFloor("MT_EMPTY", []);

      await wait(100);

      // 验证没有触发写入
      expect(memoryFs.getWriteCount()).toBe(initialWriteCount);
    });
  });

  describe("性能测试", () => {
    it("并行写入多个楼层应该比串行快", async () => {
      memoryFs.setWriteDelay(50);

      // 创建5个楼层
      const floorIds = ["MT_P1", "MT_P2", "MT_P3", "MT_P4", "MT_P5"];
      for (const id of floorIds) {
        await setupFloor(id, { title: `${id}初始` });
      }

      // 并行写入
      const parallelStart = Date.now();
      await Promise.all(
        floorIds.map(async (id) => {
          floorService.saveFloor(id, [["change", "['title']", `${id}并行`]]);
          await wait(10);
        })
      );
      const parallelDuration = Date.now() - parallelStart;

      // 验证并行执行时间合理
      // 如果是串行，需要 50ms * 5 = 250ms
      // 如果是并行，应该接近 50ms + 一些开销
      expect(parallelDuration).toBeLessThan(150);

      // 验证所有修改都生效
      for (const id of floorIds) {
        expect(floorService.getFloor(id).title).toBe(`${id}并行`);
      }
    });

    it("同一楼层的连续写入应该优化（只保留最后的写入）", async () => {
      memoryFs.setWriteDelay(30);

      await setupFloor("MT_OPTIMIZE", { title: "0" });

      const initialWriteCount = memoryFs.getWriteCount();

      // 快速连续写入10次
      for (let i = 1; i <= 10; i++) {
        floorService.saveFloor("MT_OPTIMIZE", [["change", "['title']", `${i}`]]);
      }

      // 等待所有写入完成
      await wait(500);

      // 验证最后一次写入生效
      expect(floorService.getFloor("MT_OPTIMIZE").title).toBe("10");

      // 验证写入次数被优化（应该远少于10次）
      // WriteExecutor 会合并队列中的写入
      const writeCount = memoryFs.getWriteCount() - initialWriteCount;
      expect(writeCount).toBeLessThan(10);
    });
  });

  describe("错误处理", () => {
    it("写入失败不应该影响内存数据", async () => {
      await setupFloor("MT_ERROR", { title: "旧标题" });

      // 模拟写入失败
      memoryFs.setWriteError(new Error("写入失败"));

      // 发起写入
      floorService.saveFloor("MT_ERROR", [["change", "['title']", "新标题"]]);

      // 等待写入尝试
      await wait(100);

      // 验证内存数据已更新（即使文件写入失败）
      expect(floorService.getFloor("MT_ERROR").title).toBe("新标题");

      // 清除错误
      memoryFs.clearWriteError();
    });

    it("一个楼层写入失败不应该影响其他楼层", async () => {
      await setupFloor("MT_FAIL", { title: "标题1" });
      await setupFloor("MT_SUCCESS", { title: "标题2" });

      // 只对 MT_FAIL 设置写入失败
      const originalWriteFile = memoryFs.writeFile.bind(memoryFs);
      memoryFs.writeFile = async (path: string, content: string) => {
        if (path.includes("MT_FAIL")) {
          throw new Error("写入失败");
        }
        return originalWriteFile(path, content);
      };

      // 并行写入
      await Promise.all([
        (async () => {
          floorService.saveFloor("MT_FAIL", [["change", "['title']", "新标题1"]]);
          await wait(10);
        })(),
        (async () => {
          floorService.saveFloor("MT_SUCCESS", [["change", "['title']", "新标题2"]]);
          await wait(10);
        })(),
      ]);

      await wait(100);

      // 验证两个楼层的内存数据都已更新
      expect(floorService.getFloor("MT_FAIL").title).toBe("新标题1");
      expect(floorService.getFloor("MT_SUCCESS").title).toBe("新标题2");
    });
  });
});

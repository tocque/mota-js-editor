import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { projectData } from "@/project/data/projectData";
import { projectModel } from "@/project/model/projectModel";
import { loadSampleProject, type SampleProjectContext } from "@test/utils/sampleProject";

describe("ProjectModel computed resources", () => {
  let project: SampleProjectContext;

  beforeEach(async () => {
    project = await loadSampleProject();
  });

  afterEach(() => {
    FileHandlerManager.clear();
    projectData.resetForTests();
  });

  it("updates blockRegistry when map block data changes", async () => {
    const registry = projectModel.blockRegistry();
    await registry.reload();
    await registry.waitForSettled();

    expect(registry.value().get(21)?.id).toBe("yellowKey");
    expect(registry.value().get(21)?.name).toBe("黄钥匙");
    expect(registry.value().get(21)).toMatchObject({
      images: "items",
      y: 0,
      materialPath: "project/materials/items.png",
    });

    await projectData.mapBlocks().patch([
      ["change", "['21']['name']", "模型层黄钥匙"],
    ]);

    expect(registry.value().get(21)?.name).toBe("模型层黄钥匙");
    await projectData.mapBlocks().waitForIdle();
    expect(project.readText("project/maps.js")).toContain("模型层黄钥匙");
  });

  it("materialRegistry uses the same computed projection as blockRegistry", async () => {
    const registry = projectModel.materialRegistry();
    await registry.reload();
    await registry.waitForSettled();

    expect(registry.value().get(201)?.id).toBe("greenSlime");

    await projectData.mapBlocks().patch([
      ["change", "['201']['name']", "模型层绿头怪"],
    ]);

    expect(registry.value().get(201)?.name).toBe("模型层绿头怪");
  });

  it("builds spriteRegistry from icons.js for render-only materials", async () => {
    const registry = projectModel.spriteRegistry();
    await registry.reload();
    await registry.waitForSettled();

    expect(registry.value().get("terrains:ground")).toMatchObject({
      path: "project/materials/terrains.png",
      y: 0,
      width: 32,
      height: 32,
    });
    expect(registry.value().get("items:yellowKey")).toMatchObject({
      path: "project/materials/items.png",
      y: 0,
    });
    expect(registry.value().get("enemy48:angel")).toMatchObject({
      path: "project/materials/enemy48.png",
      height: 48,
    });
  });
});

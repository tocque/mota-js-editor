import { expect, test, type Page } from "@playwright/test";

const panels = [
  { mode: "map", testId: "panel-map", title: "", contentTestId: "map-panel-textarea" },
  { mode: "tower", testId: "panel-tower", title: "全塔属性", contentTestId: "data-table-grid" },
  { mode: "functions", testId: "panel-functions", title: "脚本编辑", contentTestId: "data-table-grid" },
  { mode: "commonevent", testId: "panel-common-event", title: "公共事件", contentTestId: "data-table-grid" },
  { mode: "plugins", testId: "panel-plugins", title: "插件编写", contentTestId: "data-table-grid" },
  { mode: "floor", testId: "panel-floor", title: "楼层属性", contentTestId: "floor-resize" },
  { mode: "loc", testId: "panel-loc", title: "地图选点", contentTestId: "loc-empty-state" },
  { mode: "enemyitem", testId: "panel-prefab", title: "图块属性", contentTestId: "prefab-empty-state" },
  { mode: "appendpic", testId: "panel-appendpic", title: "追加素材", contentTestId: "appendpic-canvas" },
] as const;

async function expectNoFatalFallback(page: Page): Promise<void> {
  await expect(page.getByText("编辑器启动失败")).toHaveCount(0);
  await expect(page.getByText("面板暂不可用")).toHaveCount(0);
}

async function readPixiCanvasStats(page: Page): Promise<{
  width: number;
  height: number;
  opaque: number;
  colored: number;
  checksum: number;
}> {
  return page.getByTestId("map-pixi-renderer").evaluate((root) => {
    const canvas = root.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Pixi canvas is missing");
    }

    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true }) ??
      canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
      throw new Error("Pixi canvas WebGL context is missing");
    }

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let opaque = 0;
    let colored = 0;
    let checksum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) opaque += 1;
      if (pixels[i + 3] > 0 && (pixels[i] !== pixels[i + 1] || pixels[i + 1] !== pixels[i + 2])) {
        colored += 1;
      }
      checksum = (checksum + pixels[i] * 3 + pixels[i + 1] * 5 + pixels[i + 2] * 7 + pixels[i + 3] * 11) % 1_000_000_007;
    }

    return { width, height, opaque, colored, checksum };
  });
}

test("core data panels open without runtime fatal errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  await expect(page.getByTestId("edit-mode-select")).toBeVisible();
  await expectNoFatalFallback(page);

  for (const panel of panels) {
    await page.getByTestId("edit-mode-select").selectOption(panel.mode);
    const panelRoot = page.getByTestId(panel.testId);
    await expect(panelRoot).toBeVisible();
    if (panel.title) await expect(panelRoot).toContainText(panel.title);
    await expect(panelRoot.getByTestId(panel.contentTestId)).toBeVisible();
    await expectNoFatalFallback(page);
  }

  expect(pageErrors).toEqual([]);
});

test("map renderer draws real material pixels without diagnostics", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  for (const floorId of ["sample0", "sample1"]) {
    await page.getByTestId("floor-select").selectOption(floorId);
    await page.getByTestId("layer-mode-map").check();
    await expect(page.getByTestId("map-pixi-renderer").locator("canvas")).toBeVisible();
    await expect(page.getByTestId("map-render-diagnostics")).toHaveCount(0);

    const stats = await readPixiCanvasStats(page);
    expect(stats.width).toBeGreaterThan(0);
    expect(stats.height).toBeGreaterThan(0);
    expect(stats.opaque).toBeGreaterThan(0);
    expect(stats.colored).toBeGreaterThan(0);
  }

  await page.getByTestId("floor-select").selectOption("sample1");
  await page.getByTestId("layer-mode-map").check();
  const eventLayerStats = await readPixiCanvasStats(page);
  await page.getByTestId("layer-mode-bgmap").check();
  await expect.poll(async () => (await readPixiCanvasStats(page)).checksum).not.toBe(eventLayerStats.checksum);

  await expectNoFatalFallback(page);
  expect(pageErrors).toEqual([]);
});

test("map keeps the previous frame while a new floor is loading", async ({ page }) => {
  let releaseSample1: () => void = () => undefined;
  let resolveSample1Requested: () => void = () => undefined;
  const sample1Release = new Promise<void>((resolve) => {
    releaseSample1 = resolve;
  });
  const sample1Requested = new Promise<void>((resolve) => {
    resolveSample1Requested = resolve;
  });

  await page.route("**/readFile", async (route) => {
    const params = new URLSearchParams(route.request().postData() ?? "");
    const name = (params.get("name") ?? "").replace(/\\/g, "/").replace(/^\/+/, "");
    if (name === "project/floors/sample1.js") {
      resolveSample1Requested();
      await sample1Release;
    }
    await route.fallback();
  });

  await page.goto("/");
  await page.getByTestId("floor-select").selectOption("sample0");
  await expect(page.getByTestId("map-pixi-renderer").locator("canvas")).toBeVisible();
  const sample0Stats = await readPixiCanvasStats(page);

  await page.getByTestId("floor-select").selectOption("sample1");
  await sample1Requested;

  await expect(page.getByTestId("map-pixi-renderer").locator("canvas")).toBeVisible();
  await expect(page.getByTestId("map-canvas-input")).toBeVisible();
  await expect(page.locator("#mapEdit")).not.toContainText("Loading...");

  releaseSample1();
  await expect.poll(async () => (await readPixiCanvasStats(page)).checksum).not.toBe(sample0Stats.checksum);
});

test("map click selects a loc for the Loc panel without runtime", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  await page.getByTestId("floor-select").selectOption("sample0");
  const canvas = page.getByTestId("map-canvas-input");
  await expect(canvas).toBeVisible();
  await canvas.click({ position: { x: 2 * 32 + 16, y: 10 * 32 + 16 } });

  await page.getByTestId("edit-mode-select").selectOption("loc");
  const panel = page.getByTestId("panel-loc");
  await expect(panel).toBeVisible();
  await expect(panel.getByTestId("loc-selected-position")).toHaveText("2,10");
  await expect(panel.getByTestId("loc-summary")).toBeVisible();
  await expect(panel.getByTestId("data-table-grid")).toBeVisible();
  await expectNoFatalFallback(page);
  expect(pageErrors).toEqual([]);
});

test("map double click selects a prefab for the Prefab panel without runtime", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");
  await page.getByTestId("floor-select").selectOption("sample0");
  const canvas = page.getByTestId("map-canvas-input");
  await expect(canvas).toBeVisible();
  await canvas.dblclick({ position: { x: 8 * 32 + 16, y: 7 * 32 + 16 } });

  await page.getByTestId("edit-mode-select").selectOption("enemyitem");
  const panel = page.getByTestId("panel-prefab");
  await expect(panel).toBeVisible();
  await expect(panel.getByTestId("data-table-grid")).toBeVisible();
  await expect(panel.getByTestId("prefab-empty-state")).toHaveCount(0);
  await expectNoFatalFallback(page);
  expect(pageErrors).toEqual([]);
});

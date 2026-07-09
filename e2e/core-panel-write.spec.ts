import { expect, test, type Page } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ProjectSandbox } from "./utils/projectSandbox";
import {
  clickMapCell,
  clickMaterialCell,
  doubleClickMapCell,
  editTextareaByField,
  editTextareaContaining,
  expectTextareaByFieldValue,
  expectTextareaContaining,
  rightClickMapCell,
  selectFloor,
  selectPanel,
} from "./utils/tableEditing";

const PROJECT_ROOT = path.resolve(process.cwd(), "public/project");

async function collectProjectSnapshot(dir: string = PROJECT_ROOT): Promise<Map<string, string>> {
  const entries = await readdir(dir, { withFileTypes: true });
  const snapshot = new Map<string, string>();

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const [filePath, content] of await collectProjectSnapshot(absolute)) {
        snapshot.set(filePath, content);
      }
    } else if (entry.isFile()) {
      const projectPath = path.relative(PROJECT_ROOT, absolute).split(path.sep).join("/");
      snapshot.set(projectPath, await readFile(absolute, "utf-8"));
    }
  }

  return snapshot;
}

async function expectPublicProjectUnchanged(snapshot: Map<string, string>): Promise<void> {
  const current = await collectProjectSnapshot();
  expect(current.size).toBe(snapshot.size);
  for (const [filePath, content] of snapshot) {
    expect(current.get(filePath), `public/project/${filePath} changed`).toBe(content);
  }
}

function readFloorData(sandbox: ProjectSandbox, floorId: string): Record<string, any> {
  const text = sandbox.readText(`project/floors/${floorId}.js`);
  return JSON.parse(text.replace(new RegExp(`^main\\.floors\\.${floorId}\\s*=\\s*`), ""));
}

function writeFloorData(sandbox: ProjectSandbox, floorId: string, data: Record<string, any>): void {
  sandbox.writeText(`project/floors/${floorId}.js`, `main.floors.${floorId} = \n${JSON.stringify(data, null, "\t")}`);
}

function readTowerData(sandbox: ProjectSandbox): Record<string, any> {
  const text = sandbox.readText("project/data.js");
  return JSON.parse(text.replace(/^var\s+\w+\s*=\s*/, ""));
}

async function bootWithSandbox(page: Page): Promise<{ sandbox: ProjectSandbox; pageErrors: string[] }> {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  const sandbox = await ProjectSandbox.create(page);
  await page.goto("/");
  await expect(page.getByTestId("edit-mode-select")).toBeVisible();
  await expect(page.getByText("编辑器启动失败")).toHaveCount(0);
  await expect(page.getByText("面板暂不可用")).toHaveCount(0);
  return { sandbox, pageErrors };
}

test.describe("core panels write to sandbox project", () => {
  let publicProjectSnapshot: Map<string, string>;

  test.beforeAll(async () => {
    publicProjectSnapshot = await collectProjectSnapshot();
  });

  test.afterEach(async () => {
    await expectPublicProjectUnchanged(publicProjectSnapshot);
  });

  test("Tower panel edits firstData.title and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const panel = await selectPanel(page, "tower", "panel-tower");

    const waitForWrite = sandbox.waitForWrite("project/data.js");
    await editTextareaByField(panel, "firstData-title", "UI Tower Title");
    await waitForWrite;

    expect(sandbox.readText("project/data.js")).toContain("UI Tower Title");

    await page.reload();
    const reloadedPanel = await selectPanel(page, "tower", "panel-tower");
    await expectTextareaByFieldValue(reloadedPanel, "firstData-title", "UI Tower Title");
    expect(pageErrors).toEqual([]);
  });

  test("Functions panel edits a function body and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const panel = await selectPanel(page, "functions", "panel-functions");

    const waitForWrite = sandbox.waitForWrite("project/functions.js");
    await editTextareaContaining(
      panel,
      "core.clearStatus()",
      "function () { return '__uiFunctionWrite'; }",
    );
    await waitForWrite;

    expect(sandbox.readText("project/functions.js")).toContain("__uiFunctionWrite");

    await page.reload();
    const reloadedPanel = await selectPanel(page, "functions", "panel-functions");
    await expectTextareaContaining(reloadedPanel, "__uiFunctionWrite");
    expect(pageErrors).toEqual([]);
  });

  test("CommonEvent panel edits an event leaf without dropping sibling data", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const panel = await selectPanel(page, "commonevent", "panel-common-event");

    const waitForWrite = sandbox.waitForWrite("project/events.js");
    await editTextareaContaining(panel, "通过传参，flag:arg1", [
      { type: "comment", text: "UI common event write" },
    ]);
    await waitForWrite;

    const eventsText = sandbox.readText("project/events.js");
    expect(eventsText).toContain("UI common event write");
    expect(eventsText).toContain("回收钥匙商店");
    expect(eventsText).toContain("commonEvent");

    await page.reload();
    const reloadedPanel = await selectPanel(page, "commonevent", "panel-common-event");
    await expectTextareaContaining(reloadedPanel, "UI common event write");
    expect(pageErrors).toEqual([]);
  });

  test("Plugin panel edits plugin source and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const panel = await selectPanel(page, "plugins", "panel-plugins");

    const waitForWrite = sandbox.waitForWrite("project/plugins.js");
    await editTextareaContaining(
      panel,
      "this.drawLight = function",
      "function () { this.__uiPluginWrite = true; }",
    );
    await waitForWrite;

    expect(sandbox.readText("project/plugins.js")).toContain("__uiPluginWrite");

    await page.reload();
    const reloadedPanel = await selectPanel(page, "plugins", "panel-plugins");
    await expectTextareaContaining(reloadedPanel, "__uiPluginWrite");
    expect(pageErrors).toEqual([]);
  });

  test("Floor panel edits sample0.title and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    const panel = await selectPanel(page, "floor", "panel-floor");

    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await editTextareaByField(panel, "title", "UI Floor Title");
    await waitForWrite;

    expect(sandbox.readText("project/floors/sample0.js")).toContain("UI Floor Title");

    await page.reload();
    await selectFloor(page, "sample0");
    const reloadedPanel = await selectPanel(page, "floor", "panel-floor");
    await expectTextareaByFieldValue(reloadedPanel, "title", "UI Floor Title");
    expect(pageErrors).toEqual([]);
  });

  test("Floor panel renames sample0 without touching the real project", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    const panel = await selectPanel(page, "floor", "panel-floor");

    const waitForNewFloor = sandbox.waitForWrite("project/floors/sample0_UI_RENAMED.js");
    const waitForOldFloorDelete = sandbox.waitForDelete("project/floors/sample0.js");
    const waitForTowerWrite = sandbox.waitForWrite("project/data.js");

    await panel.getByTestId("floor-rename-input").fill("sample0_UI_RENAMED");
    await panel.getByTestId("floor-rename-submit").click();

    await waitForNewFloor;
    await waitForOldFloorDelete;
    await waitForTowerWrite;

    expect(sandbox.hasFile("project/floors/sample0.js")).toBe(false);
    expect(sandbox.hasFile("project/floors/sample0_UI_RENAMED.js")).toBe(true);
    expect(sandbox.readText("project/floors/sample0_UI_RENAMED.js")).toContain(
      '"floorId": "sample0_UI_RENAMED"',
    );
    expect(sandbox.readText("project/data.js")).toContain('"sample0_UI_RENAMED"');
    expect(sandbox.readText("project/data.js")).not.toContain('"sample0",');

    await page.reload();
    await selectFloor(page, "sample0_UI_RENAMED");
    const reloadedPanel = await selectPanel(page, "floor", "panel-floor");
    await expectTextareaByFieldValue(reloadedPanel, "floorId", "sample0_UI_RENAMED");
    expect(pageErrors).toEqual([]);
  });

  test("Loc panel edits selected cell events and reads them back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await clickMapCell(page, 2, 10);
    const panel = await selectPanel(page, "loc", "panel-loc");

    const nextEvents = [{ type: "comment", text: "UI loc event write" }];
    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await editTextareaByField(panel, "events", nextEvents);
    await waitForWrite;

    expect(sandbox.readText("project/floors/sample0.js")).toContain("UI loc event write");
    expect(sandbox.readText("project/floors/sample0.js")).toContain('"2,10"');

    await page.reload();
    await selectFloor(page, "sample0");
    await clickMapCell(page, 2, 10);
    const reloadedPanel = await selectPanel(page, "loc", "panel-loc");
    await expectTextareaByFieldValue(reloadedPanel, "events", nextEvents);
    expect(pageErrors).toEqual([]);
  });

  test("Loc cursor follows floor changes before writing", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await clickMapCell(page, 2, 10);
    await selectFloor(page, "sample1");
    const panel = await selectPanel(page, "loc", "panel-loc");
    await expect(panel.getByTestId("loc-selected-position")).toHaveText("2,10");

    const nextEvents = [{ type: "comment", text: "UI loc cursor sample1 write" }];
    const waitForWrite = sandbox.waitForWrite("project/floors/sample1.js");
    await editTextareaByField(panel, "events", nextEvents);
    await waitForWrite;

    expect(sandbox.readText("project/floors/sample1.js")).toContain("UI loc cursor sample1 write");
    expect(sandbox.readText("project/floors/sample0.js")).not.toContain("UI loc cursor sample1 write");

    await page.reload();
    await selectFloor(page, "sample1");
    await clickMapCell(page, 2, 10);
    const reloadedPanel = await selectPanel(page, "loc", "panel-loc");
    await expectTextareaByFieldValue(reloadedPanel, "events", nextEvents);
    expect(pageErrors).toEqual([]);
  });

  test("Prefab panel edits a selected item and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 8, 8);
    const panel = await selectPanel(page, "enemyitem", "panel-prefab");

    const waitForWrite = sandbox.waitForWrite("project/items.js");
    await editTextareaByField(panel, "name", "UI 黄钥匙");
    await waitForWrite;

    expect(sandbox.readText("project/items.js")).toContain("UI 黄钥匙");
    expect(sandbox.readText("project/items.js")).toContain('"yellowKey"');

    await page.reload();
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 8, 8);
    const reloadedPanel = await selectPanel(page, "enemyitem", "panel-prefab");
    await expectTextareaByFieldValue(reloadedPanel, "name", "UI 黄钥匙");
    expect(pageErrors).toEqual([]);
  });

  test("Prefab panel edits a selected enemy and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 0, 7);
    const panel = await selectPanel(page, "enemyitem", "panel-prefab");

    const waitForWrite = sandbox.waitForWrite("project/enemys.js");
    await editTextareaByField(panel, "name", "UI 绿头怪");
    await waitForWrite;

    expect(sandbox.readText("project/enemys.js")).toContain("UI 绿头怪");
    expect(sandbox.readText("project/enemys.js")).toContain('"greenSlime"');

    await page.reload();
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 0, 7);
    const reloadedPanel = await selectPanel(page, "enemyitem", "panel-prefab");
    await expectTextareaByFieldValue(reloadedPanel, "name", "UI 绿头怪");
    expect(pageErrors).toEqual([]);
  });

  test("Map editor paints a selected prefab into the floor map and reads it back after reload", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 8, 8);

    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await clickMapCell(page, 6, 5);
    await waitForWrite;

    expect(readFloorData(sandbox, "sample0").map[5][6]).toBe(21);

    await page.reload();
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 6, 5);
    const reloadedPanel = await selectPanel(page, "enemyitem", "panel-prefab");
    await expectTextareaByFieldValue(reloadedPanel, "name", "黄钥匙");
    expect(pageErrors).toEqual([]);
  });

  test("Map editor paints a material palette selection into the floor map", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    await clickMaterialCell(page, "items", 0, 0);

    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await clickMapCell(page, 6, 5);
    await waitForWrite;

    expect(readFloorData(sandbox, "sample0").map[5][6]).toBe(21);

    await page.reload();
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 6, 5);
    const reloadedPanel = await selectPanel(page, "enemyitem", "panel-prefab");
    await expectTextareaByFieldValue(reloadedPanel, "name", "黄钥匙");
    expect(pageErrors).toEqual([]);
  });

  test("Map context menu binds the start point through commands", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");

    await rightClickMapCell(page, 6, 5);
    await expect(page.getByTestId("context-menu")).toBeVisible();
    await expect(page.getByTestId("context-menu-extraEvent")).toBeVisible();
    const waitForWrite = sandbox.waitForWrite("project/data.js");
    await page.getByTestId("context-menu-extraEvent").click();
    await waitForWrite;

    const tower = readTowerData(sandbox);
    expect(tower.firstData.floorId).toBe("sample0");
    expect(tower.firstData.hero.loc).toMatchObject({ x: 6, y: 5 });
    await expect(page.getByTestId("event-overlay")).toBeVisible();

    await page.reload();
    await selectFloor(page, "sample0");
    expect(readTowerData(sandbox).firstData.hero.loc).toMatchObject({ x: 6, y: 5 });
    expect(pageErrors).toEqual([]);
  });

  test("Map context menu binds a stair changeFloor through commands", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const floor = readFloorData(sandbox, "sample0");
    delete floor.changeFloor["6,0"];
    writeFloorData(sandbox, "sample0", floor);
    await page.reload();
    await selectFloor(page, "sample0");

    await rightClickMapCell(page, 6, 0);
    await expect(page.getByTestId("context-menu")).toBeVisible();
    await expect(page.getByTestId("context-menu-extraEvent")).toBeVisible();
    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await page.getByTestId("context-menu-extraEvent").click();
    await waitForWrite;

    expect(readFloorData(sandbox, "sample0").changeFloor["6,0"]).toEqual({
      floorId: ":next",
      stair: "downFloor",
    });
    expect(pageErrors).toEqual([]);
  });

  test("Map panel imports map text into the sandbox floor file", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    const panel = await selectPanel(page, "map", "panel-map");

    const matrix = Array.from({ length: 13 }, () => Array.from({ length: 13 }, () => 0));
    matrix[5][6] = 21;

    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    await panel.getByTestId("map-panel-textarea").fill(JSON.stringify(matrix));
    await panel.getByTestId("map-import-submit").click();
    await waitForWrite;

    expect(readFloorData(sandbox, "sample0").map[5][6]).toBe(21);

    await page.reload();
    await selectFloor(page, "sample0");
    await doubleClickMapCell(page, 6, 5);
    const reloadedPanel = await selectPanel(page, "enemyitem", "panel-prefab");
    await expectTextareaByFieldValue(reloadedPanel, "name", "黄钥匙");
    expect(pageErrors).toEqual([]);
  });

  test("Map panel clears the current floor map and event data", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    await selectFloor(page, "sample0");
    const panel = await selectPanel(page, "map", "panel-map");

    const waitForWrite = sandbox.waitForWrite("project/floors/sample0.js");
    page.once("dialog", (dialog) => dialog.accept());
    await panel.getByTestId("map-clear-submit").click();
    await waitForWrite;

    const floor = readFloorData(sandbox, "sample0");
    expect(floor.map.every((row: number[]) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.bgmap.every((row: number[]) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.fgmap.every((row: number[]) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.events).toEqual({});
    expect(floor.changeFloor).toEqual({});
    expect(floor.cannotMove).toEqual({});
    expect(pageErrors).toEqual([]);
  });

  test("Map panel creates and deletes a floor through commands", async ({ page }) => {
    const { sandbox, pageErrors } = await bootWithSandbox(page);
    const panel = await selectPanel(page, "map", "panel-map");

    const waitForNewFloor = sandbox.waitForWrite("project/floors/UI_MAP_NEW.js");
    const waitForTowerWrite = sandbox.waitForWrite("project/data.js");
    await panel.getByTestId("map-create-id").fill("UI_MAP_NEW");
    await panel.getByTestId("map-create-width").fill("4");
    await panel.getByTestId("map-create-height").fill("3");
    await panel.getByTestId("map-create-submit").click();
    await waitForNewFloor;
    await waitForTowerWrite;

    expect(sandbox.hasFile("project/floors/UI_MAP_NEW.js")).toBe(true);
    expect(sandbox.readText("project/data.js")).toContain('"UI_MAP_NEW"');
    await expect(page.getByTestId("floor-select")).toHaveValue("UI_MAP_NEW");

    const waitForDelete = sandbox.waitForDelete("project/floors/UI_MAP_NEW.js");
    const waitForTowerDeleteWrite = sandbox.waitForWrite("project/data.js");
    page.once("dialog", (dialog) => dialog.accept());
    await panel.getByTestId("map-delete-submit").click();
    await waitForDelete;
    await waitForTowerDeleteWrite;

    expect(sandbox.hasFile("project/floors/UI_MAP_NEW.js")).toBe(false);
    expect(sandbox.readText("project/data.js")).not.toContain('"UI_MAP_NEW"');
    expect(pageErrors).toEqual([]);
  });
});

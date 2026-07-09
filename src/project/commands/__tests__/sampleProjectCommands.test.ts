import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FileHandlerManager } from "@/fs/FileHandlerManager";
import { projectData } from "@/project/data/projectData";
import { floorCommands } from "@/project/commands/floorCommands";
import { locCommands } from "@/project/commands/locCommands";
import { mapCommands } from "@/project/commands/mapCommands";
import { materialCommands } from "@/project/commands/materialCommands";
import { prefabCommands } from "@/project/commands/prefabCommands";
import { runtimeCommands } from "@/project/commands/runtimeCommands";
import { tableCommands } from "@/project/commands/tableCommands";
import type { PrefabInfo } from "@/services/prefab";
import { loadSampleProject, type SampleProjectContext } from "@test/utils/sampleProject";

describe("ProjectData + Commands with real sample project", () => {
  let project: SampleProjectContext;

  beforeEach(async () => {
    project = await loadSampleProject();
  });

  afterEach(() => {
    FileHandlerManager.clear();
    projectData.resetForTests();
  });

  it("patches functions and persists after reload", async () => {
    const functions = await project.loadResource(projectData.functions());
    expect(functions.events).toBeDefined();

    const result = await tableCommands.patchFunctions([
      ["add", "['events']['__commandTest']", "function () { return 'ok'; }"],
    ]);

    expect(result).toEqual({ ok: true });
    await projectData.functions().waitForIdle();
    await projectData.functions().reload();
    const updated = projectData.functions().value();
    expect(updated.events?.__commandTest).toContain("function __commandTest");
    expect(updated.events?.__commandTest).toContain("return 'ok'");
    expect(project.readText("project/functions.js")).toContain("__commandTest");
  });

  it("patches common events through events.commonEvent without dropping sibling event data", async () => {
    await project.loadResource(projectData.events());
    await projectData.events().mutate((draft) => {
      draft.__commandSentinel = { keep: true };
    });

    const result = await tableCommands.patchCommonEvents([
      ["add", "['__commandEvent']", [{ type: "comment", text: "created by commands test" }]],
    ]);

    expect(result).toEqual({ ok: true });
    await projectData.commonEvents().waitForIdle();
    await projectData.events().reload();
    const events = projectData.events().value();
    expect(events.__commandSentinel).toEqual({ keep: true });
    expect(events.commonEvent.__commandEvent).toEqual([
      { type: "comment", text: "created by commands test" },
    ]);
  });

  it("patches plugins and persists after reload", async () => {
    await project.loadResource(projectData.plugins());

    const result = await tableCommands.patchPlugins([
      ["add", "['__commandPlugin']", "function () { this.__commandPlugin = true; }"],
    ]);

    expect(result).toEqual({ ok: true });
    await projectData.plugins().waitForIdle();
    await projectData.plugins().reload();
    const plugins = projectData.plugins().value();
    expect(plugins.__commandPlugin).toContain("function __commandPlugin");
    expect(plugins.__commandPlugin).toContain("this.__commandPlugin = true");
    expect(project.readText("project/plugins.js")).toContain("__commandPlugin");
  });

  it("patches a real floor field and persists after reload", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const result = await tableCommands.patchFloor("sample0", [
      ["change", "['title']", "Commands Sample 0"],
    ]);

    expect(result).toEqual({ ok: true });
    await projectData.floor("sample0").waitForIdle();
    await projectData.floor("sample0").reload();
    expect(projectData.floor("sample0").value().title).toBe("Commands Sample 0");
    expect(project.readText("project/floors/sample0.js")).toContain("Commands Sample 0");
  });

  it("routes loc actions to x,y floor paths including autoEvent pages", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const eventResult = await locCommands.patch("sample0", { x: 4, y: 4 }, [
      ["change", "['events']", [{ type: "comment", text: "loc event" }]],
    ]);
    const autoResult = await locCommands.patch("sample0", { x: 4, y: 4 }, [
      ["add", "['autoEvent']['2']", { condition: "true", data: [] }],
    ]);

    expect(eventResult).toEqual({ ok: true });
    expect(autoResult).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.events?.["4,4"]).toEqual([{ type: "comment", text: "loc event" }]);
    expect(floor.autoEvent?.["4,4"]?.["2"]).toEqual({ condition: "true", data: [] });
  });

  it("adds the next autoEvent page id for a location", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["add", "['autoEvent']['5,5']['2']", { condition: "true", data: [] }],
    ]);

    const result = await locCommands.addAutoEventPage("sample0", { x: 5, y: 5 });

    expect(result).toEqual({ ok: true, pageId: "3" });
    expect(projectData.floor("sample0").value().autoEvent?.["5,5"]?.["3"]).toBeNull();
  });

  it("paints map cells through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const result = await mapCommands.paint({
      floorId: "sample0",
      positions: [
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ],
      idnum: 21,
    });

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.map[5][6]).toBe(21);
    expect(floor.map[5][7]).toBe(21);
  });

  it("adds stair changeFloor events while painting stairs", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const result = await mapCommands.paint({
      floorId: "sample0",
      pos: { x: 6, y: 5 },
      block: { id: "upFloor", idnum: 87 },
    });

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.map[5][6]).toBe(87);
    expect(floor.changeFloor?.["6,5"]).toEqual({
      floorId: ":next",
      stair: "downFloor",
    });
  });

  it("binds the tower start point through mapCommands", async () => {
    await project.loadResource(projectData.tower());

    const result = await mapCommands.bindStartPoint("sample1", { x: 3, y: 4 });

    expect(result).toEqual({ ok: true });
    await projectData.tower().waitForIdle();
    await projectData.tower().reload();
    const tower = projectData.tower().value();
    expect(tower.firstData.floorId).toBe("sample1");
    expect(tower.firstData.hero.loc).toMatchObject({ x: 3, y: 4 });
    expect(project.readText("project/data.js")).toContain('"sample1"');
  });

  it("binds stair and portal changeFloor events through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const cases: Array<[string, Record<string, unknown>]> = [
      ["upFloor", { floorId: ":next", stair: "downFloor" }],
      ["downFloor", { floorId: ":before", stair: "upFloor" }],
      ["leftPortal", { floorId: ":next", stair: ":symmetry_x" }],
      ["rightPortal", { floorId: ":next", stair: ":symmetry_x" }],
      ["upPortal", { floorId: ":next", stair: ":symmetry_y" }],
      ["downPortal", { floorId: ":next", stair: ":symmetry_y" }],
    ];

    for (const [index, [blockId, expected]] of cases.entries()) {
      const result = await mapCommands.bindStair("sample0", { x: index, y: 10 }, blockId);
      expect(result).toEqual({ ok: true });
      expect(projectData.floor("sample0").value().changeFloor?.[`${index},10`]).toEqual(expected);
    }

    const unsupported = await mapCommands.bindStair("sample0", { x: 12, y: 10 }, "yellowKey");
    expect(unsupported).toMatchObject({ ok: false, stage: "bind-stair" });
  });

  it("binds special door auto events and enemy counters through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const result = await mapCommands.bindSpecialDoor(
      "sample0",
      { x: 11, y: 10 },
      [{ x: 0, y: 7 }, { x: 1, y: 7 }],
    );

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    const flag = "flag:door_sample0_11_10";
    expect(floor.autoEvent?.["11,10"]?.["0"]).toMatchObject({
      condition: `${flag}==2`,
      currentFloor: true,
      data: [
        { type: "openDoor" },
        { type: "setValue", name: flag, operator: "=", value: "null" },
      ],
    });
    expect(floor.afterBattle?.["0,7"]).toContainEqual({
      type: "setValue",
      name: flag,
      operator: "+=",
      value: "1",
    });
    expect(floor.afterBattle?.["1,7"]).toContainEqual({
      type: "setValue",
      name: flag,
      operator: "+=",
      value: "1",
    });
  });

  it("resolves static changeFloor targets through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['changeFloor']['1,1']", { floorId: "sample1", loc: [2, 3] }],
      ["change", "['changeFloor']['2,1']", { floorId: ":next" }],
      ["change", "['changeFloor']['3,1']", { floorId: ":before" }],
      ["change", "['changeFloor']['4,1']", { floorId: ":now" }],
    ]);

    const explicit = mapCommands.resolveChangeFloorTarget("sample0", { x: 1, y: 1 }, ["sample0", "sample1"]);
    expect(explicit).toEqual({ ok: true, target: { floorId: "sample1", pos: { x: 2, y: 3 } } });

    const next = mapCommands.resolveChangeFloorTarget("sample0", { x: 2, y: 1 }, ["sample0", "sample1"]);
    expect(next).toEqual({ ok: true, target: { floorId: "sample1", pos: undefined } });

    const before = mapCommands.resolveChangeFloorTarget("sample0", { x: 3, y: 1 }, ["sampleBefore", "sample0", "sample1"]);
    expect(before).toEqual({ ok: true, target: { floorId: "sampleBefore", pos: undefined } });

    const dynamic = mapCommands.resolveChangeFloorTarget("sample0", { x: 4, y: 1 }, ["sample0", "sample1"]);
    expect(dynamic).toMatchObject({ ok: false, stage: "resolve-change-floor-target" });
  });

  it("reports map paint failures before mutating floor data", async () => {
    await project.loadResource(projectData.floor("sample0"));
    const before = projectData.floor("sample0").value().map[5][6];

    const result = await mapCommands.paint({
      floorId: "sample0",
      pos: { x: 6, y: 5 },
      block: { id: "missingIdnum" },
    });

    expect(result).toMatchObject({ ok: false, stage: "paint-map" });
    expect(projectData.floor("sample0").value().map[5][6]).toBe(before);
  });

  it("clears map blocks and location events through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['map']['5']['6']", 21],
      ["change", "['events']['6,5']", [{ type: "comment", text: "event" }]],
      ["change", "['changeFloor']['6,5']", { floorId: "sample1" }],
      ["change", "['cannotMove']['6,5']", ["up"]],
    ]);

    const clearBlockResult = await mapCommands.clearBlock("sample0", "map", { x: 6, y: 5 });

    expect(clearBlockResult).toEqual({ ok: true });
    expect(projectData.floor("sample0").value().map[5][6]).toBe(0);
    expect(projectData.floor("sample0").value().events?.["6,5"]).toEqual([
      { type: "comment", text: "event" },
    ]);

    const clearEventsResult = await mapCommands.clearEvents("sample0", { x: 6, y: 5 });

    expect(clearEventsResult).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.events?.["6,5"]).toBeUndefined();
    expect(floor.changeFloor?.["6,5"]).toBeUndefined();
    expect(floor.cannotMove?.["6,5"]).toBeUndefined();
  });

  it("clears a map location and its events through mapCommands", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['map']['5']['6']", 21],
      ["change", "['events']['6,5']", [{ type: "comment", text: "event" }]],
    ]);

    const result = await mapCommands.clearLoc("sample0", "map", { x: 6, y: 5 });

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.map[5][6]).toBe(0);
    expect(floor.events?.["6,5"]).toBeUndefined();
  });

  it("pastes copied map info and replaces target location events", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['map']['5']['6']", 0],
      ["change", "['events']['6,5']", [{ type: "comment", text: "old" }]],
      ["change", "['cannotMove']['6,5']", ["up"]],
    ]);

    const result = await mapCommands.pasteInfo({
      floorId: "sample0",
      layer: "map",
      pos: { x: 6, y: 5 },
      info: {
        w: 1,
        h: 1,
        layer: "map",
        data: [{
          map: 21,
          events: {
            events: [{ type: "comment", text: "new" }],
            changeFloor: { floorId: "sample1", loc: [1, 1] },
          },
        }],
      },
    });

    expect(result).toEqual({ ok: true });
    await projectData.floor("sample0").waitForIdle();
    await projectData.floor("sample0").reload();
    const floor = projectData.floor("sample0").value();
    expect(floor.map[5][6]).toBe(21);
    expect(floor.events?.["6,5"]).toEqual([{ type: "comment", text: "new" }]);
    expect(floor.changeFloor?.["6,5"]).toEqual({ floorId: "sample1", loc: [1, 1] });
    expect(floor.cannotMove?.["6,5"]).toBeUndefined();
    expect(project.readText("project/floors/sample0.js")).toContain("new");
  });

  it("replaces a map layer after validating dimensions", async () => {
    await project.loadResource(projectData.floor("sample0"));
    const floor = projectData.floor("sample0").value();
    const nextMap = floor.map.map((row) => row.map(() => 0));
    nextMap[5][6] = 21;

    const result = await mapCommands.replaceLayer("sample0", "map", nextMap);

    expect(result).toEqual({ ok: true });
    await projectData.floor("sample0").waitForIdle();
    await projectData.floor("sample0").reload();
    expect(projectData.floor("sample0").value().map[5][6]).toBe(21);
    expect(project.readText("project/floors/sample0.js")).toContain("21");
  });

  it("rejects mismatched map layer replacement without mutating the floor", async () => {
    await project.loadResource(projectData.floor("sample0"));
    const before = projectData.floor("sample0").value().map[0][0];

    const result = await mapCommands.replaceLayer("sample0", "map", [[1, 2, 3]]);

    expect(result).toMatchObject({ ok: false, stage: "replace-map-layer" });
    expect(projectData.floor("sample0").value().map[0][0]).toBe(before);
  });

  it("clears all floor map layers and location event data", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['bgmap']", [[1]]],
      ["change", "['fgmap']", [[2]]],
      ["change", "['firstArrive']", [{ type: "comment", text: "first" }]],
      ["change", "['eachArrive']", [{ type: "comment", text: "each" }]],
      ["change", "['events']['6,5']", [{ type: "comment", text: "event" }]],
      ["change", "['changeFloor']['6,5']", { floorId: "sample1" }],
      ["change", "['cannotMove']['6,5']", ["up"]],
    ]);

    const result = await mapCommands.clearFloorMap("sample0");

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.map.every((row) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.bgmap?.every((row) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.fgmap?.every((row) => row.every((cell) => cell === 0))).toBe(true);
    expect(floor.firstArrive).toEqual([]);
    expect(floor.eachArrive).toEqual([]);
    expect(floor.events).toEqual({});
    expect(floor.changeFloor).toEqual({});
    expect(floor.cannotMove).toEqual({});
  });

  it("moves and exchanges map cells with location events", async () => {
    await project.loadResource(projectData.floor("sample0"));
    await floorCommands.patch("sample0", [
      ["change", "['map']['5']['6']", 21],
      ["change", "['map']['5']['7']", 22],
      ["change", "['events']['6,5']", [{ type: "comment", text: "from" }]],
      ["change", "['events']['7,5']", [{ type: "comment", text: "to" }]],
    ]);

    const moveResult = await mapCommands.moveLoc({
      floorId: "sample0",
      from: { x: 6, y: 5 },
      to: { x: 8, y: 5 },
    });

    expect(moveResult).toEqual({ ok: true });
    let floor = projectData.floor("sample0").value();
    expect(floor.map[5][6]).toBe(0);
    expect(floor.map[5][8]).toBe(21);
    expect(floor.events?.["6,5"]).toBeUndefined();
    expect(floor.events?.["8,5"]).toEqual([{ type: "comment", text: "from" }]);

    const exchangeResult = await mapCommands.exchangeLoc({
      floorId: "sample0",
      from: { x: 8, y: 5 },
      to: { x: 7, y: 5 },
    });

    expect(exchangeResult).toEqual({ ok: true });
    floor = projectData.floor("sample0").value();
    expect(floor.map[5][8]).toBe(22);
    expect(floor.map[5][7]).toBe(21);
    expect(floor.events?.["8,5"]).toEqual([{ type: "comment", text: "to" }]);
    expect(floor.events?.["7,5"]).toEqual([{ type: "comment", text: "from" }]);
  });

  it("routes prefab patches to enemy, item, and mapBlock resources", async () => {
    await project.loadResource(projectData.enemys());
    await project.loadResource(projectData.items());
    await project.loadResource(projectData.mapBlocks());

    const enemyInfo: PrefabInfo = { images: "enemys", id: "greenSlime" };
    const itemInfo: PrefabInfo = { images: "items", id: "yellowKey" };
    const mapBlockInfo: PrefabInfo = { images: "terrains", idnum: 1 };

    expect(await prefabCommands.patch(enemyInfo, [["change", "['name']", "测试绿头怪"]])).toEqual({ ok: true });
    expect(await prefabCommands.patch(itemInfo, [["change", "['name']", "测试黄钥匙"]])).toEqual({ ok: true });
    expect(await prefabCommands.patch(mapBlockInfo, [["change", "['id']", "testYellowWall"]])).toEqual({ ok: true });

    expect(projectData.enemys().value().greenSlime.name).toBe("测试绿头怪");
    expect(projectData.items().value().yellowKey.name).toBe("测试黄钥匙");
    expect(projectData.mapBlocks().value()[1].id).toBe("testYellowWall");
  });

  it("copies and replaces enemy prefab data through prefabCommands", async () => {
    await project.loadResource(projectData.enemys());
    await projectData.enemys().patch([
      ["change", "['greenSlime']", {
        id: "greenSlime",
        name: "绿头怪",
        hp: 50,
        displayIdInBook: 1,
      }],
      ["change", "['redSlime']", {
        id: "redSlime",
        name: "红头怪",
        hp: 80,
        displayIdInBook: 2,
      }],
    ]);

    const copy = prefabCommands.getClipboardData(
      { images: "enemys", id: "greenSlime" },
      projectData.enemys().value(),
    );
    expect(copy).toMatchObject({ ok: true, data: { type: "enemy" } });

    const result = await prefabCommands.replaceFromClipboard(
      { images: "enemys", id: "redSlime" },
      copy.data!,
      projectData.enemys().value(),
    );

    expect(result).toEqual({ ok: true });
    expect(projectData.enemys().value().redSlime).toMatchObject({
      id: "redSlime",
      name: "红头怪",
      hp: 50,
      displayIdInBook: 2,
    });
  });

  it("clears enemy and item prefab data through prefabCommands", async () => {
    await project.loadResource(projectData.enemys());
    await project.loadResource(projectData.items());
    await projectData.enemys().patch([
      ["change", "['greenSlime']", {
        id: "greenSlime",
        name: "绿头怪",
        hp: 50,
        atk: 20,
        displayIdInBook: 1,
      }],
    ]);
    await projectData.items().patch([
      ["change", "['yellowKey']", {
        id: "yellowKey",
        cls: "keys",
        name: "黄钥匙",
        text: "remove me",
      }],
    ]);

    const enemyResult = await prefabCommands.clear(
      { images: "enemys", id: "greenSlime" },
      { enemy: { hp: 0, atk: 0, money: 0 } },
      projectData.enemys().value(),
    );
    const itemResult = await prefabCommands.clear(
      { images: "items", id: "yellowKey" },
      {},
      projectData.items().value(),
    );

    expect(enemyResult).toEqual({ ok: true });
    expect(projectData.enemys().value().greenSlime).toEqual({
      hp: 0,
      atk: 0,
      money: 0,
      id: "greenSlime",
      name: "绿头怪",
      displayIdInBook: 1,
    });
    expect(itemResult).toEqual({ ok: true });
    expect(projectData.items().value().yellowKey).toEqual({
      id: "yellowKey",
      cls: "keys",
      name: "黄钥匙",
    });
  });

  it("clears all auto registered item prefabs through prefabCommands", async () => {
    await project.loadResource(projectData.items());
    await projectData.items().patch([
      ["change", "['I100']", { id: "I100", cls: "items", name: "Auto Item", text: "remove" }],
      ["change", "['yellowKey']", { id: "yellowKey", cls: "keys", name: "黄钥匙", text: "keep" }],
    ]);

    const result = await prefabCommands.clearAll(
      { images: "items", id: "I100" },
      {},
      projectData.items().value(),
    );

    expect(result).toEqual({ ok: true });
    expect(projectData.items().value().I100).toEqual({
      id: "I100",
      cls: "items",
      name: "Auto Item",
    });
    expect(projectData.items().value().yellowKey.text).toBe("keep");
  });

  it("returns failures for invalid prefab routing inputs", async () => {
    expect(await tableCommands.patchPrefab({ images: "enemys" }, [["change", "['name']", "x"]])).toMatchObject({
      ok: false,
      stage: "patch-prefab",
    });
    expect(await tableCommands.patchPrefab({ images: "terrains" }, [["change", "['id']", "x"]])).toMatchObject({
      ok: false,
      stage: "patch-prefab",
    });
  });

  it("registers and renames materials through modern materialCommands", async () => {
    await project.loadResource(projectData.icons());
    await project.loadResource(projectData.mapBlocks());
    await project.loadResource(projectData.items());
    await project.loadResource(projectData.enemys());

    const templates = {
      item: { cls: "items", name: "新物品", canUseItemEffect: "true" },
      enemy: { name: "新敌人", hp: 0, atk: 0, def: 0, money: 0, exp: 0, point: 0, special: [] },
    };
    const newResult = await materialCommands.changeIdAndIdnum(
      "commandItem",
      399,
      { images: "items", y: 399 },
      { templates },
    );

    expect(newResult).toEqual({ ok: true });
    expect(projectData.mapBlocks().value()["399"]).toEqual({ cls: "items", id: "commandItem" });
    expect(projectData.icons().value().items.commandItem).toBe(399);
    expect(projectData.items().value().commandItem).toEqual(templates.item);

    const renameResult = await materialCommands.changeIdAndIdnum(
      "commandYellowKey",
      null,
      { images: "items", id: "yellowKey", idnum: 21, y: 0 },
      { templates },
    );

    expect(renameResult).toEqual({ ok: true });
    expect(projectData.mapBlocks().value()["21"].id).toBe("commandYellowKey");
    expect(projectData.icons().value().items.commandYellowKey).toBeDefined();
    expect(projectData.icons().value().items.yellowKey).toBeUndefined();
    expect(projectData.items().value().commandYellowKey).toBeDefined();
    expect(projectData.items().value().yellowKey).toBeUndefined();
  });

  it("auto-registers material rows and autotiles through materialCommands", async () => {
    await project.loadResource(projectData.icons());
    await project.loadResource(projectData.mapBlocks());
    await project.loadResource(projectData.items());

    await projectData.icons().patch([
      ["delete", "['items']['yellowKey']", undefined],
    ]);
    const result = await materialCommands.register(
      { images: "items" },
      {
        rowCount: 1,
        templates: {
          item: { cls: "items", name: "新物品" },
          enemy: {},
        },
      },
    );

    expect(result).toEqual({ ok: true });
    const autoId = Object.entries(projectData.icons().value().items)
      .find(([, row]) => row === 0)?.[0];
    expect(autoId).toBeDefined();
    expect(projectData.items().value()[autoId!]).toBeDefined();

    const autotile = await materialCommands.registerAutotile("commandAutotile");
    expect(autotile).toEqual({ ok: true });
    expect(projectData.icons().value().autotile.commandAutotile).toBe(0);
    expect(Object.values(projectData.mapBlocks().value())).toContainEqual({
      cls: "autotile",
      id: "commandAutotile",
    });
  });

  it("returns controlled failures for remaining runtime-only material removal and edit mode commands", async () => {
    const info: PrefabInfo = { images: "items", id: "yellowKey", idnum: 21 };

    expect(await materialCommands.remove(info)).toMatchObject({
      ok: false,
      stage: "material-runtime-remove",
    });
    expect(runtimeCommands.changeDoubleClickMode("add")).toMatchObject({
      ok: false,
      stage: "runtime-double-click-mode",
    });
  });

  it("renames a floor and updates tower floor ids", async () => {
    await project.loadResource(projectData.tower());
    await project.loadResource(projectData.floor("MT0"));
    await project.registerPath("project/floors/MT0_RENAMED.js");
    await projectData.tower().mutate((draft) => {
      draft.firstData.floorId = "MT0";
    });

    const result = await floorCommands.rename("MT0", "MT0_RENAMED");

    expect(result).toEqual({ ok: true });
    await projectData.tower().waitForIdle();
    expect(project.hasFile("project/floors/MT0.js")).toBe(false);
    expect(project.hasFile("project/floors/MT0_RENAMED.js")).toBe(true);
    const tower = projectData.tower().value();
    expect(tower.main.floorIds).toContain("MT0_RENAMED");
    expect(tower.main.floorIds).not.toContain("MT0");
    expect(tower.firstData.floorId).toBe("MT0_RENAMED");
  });

  it("creates and deletes a floor in the sample project copy", async () => {
    await project.loadResource(projectData.tower());
    await project.registerPath("project/floors/COMMAND_NEW.js");

    const createResult = await floorCommands.create("COMMAND_NEW", {
      title: "Command New Floor",
      width: 4,
      height: 3,
    });

    expect(createResult).toEqual({ ok: true });
    expect(project.hasFile("project/floors/COMMAND_NEW.js")).toBe(true);
    expect(projectData.tower().value().main.floorIds).toContain("COMMAND_NEW");
    expect(projectData.floor("COMMAND_NEW").value().map).toHaveLength(3);

    const deleteResult = await floorCommands.delete("COMMAND_NEW");

    expect(deleteResult).toEqual({ ok: true });
    expect(project.hasFile("project/floors/COMMAND_NEW.js")).toBe(false);
    expect(projectData.tower().value().main.floorIds).not.toContain("COMMAND_NEW");
  });

  it("batch creates floors after validating all inputs", async () => {
    await project.loadResource(projectData.tower());
    await project.registerPath("project/floors/COMMAND_BATCH_1.js");
    await project.registerPath("project/floors/COMMAND_BATCH_2.js");

    const result = await floorCommands.batchCreate([
      { floorId: "COMMAND_BATCH_1", title: "Batch 1", name: "B1", width: 3, height: 2 },
      { floorId: "COMMAND_BATCH_2", title: "Batch 2", name: "B2", width: 4, height: 3 },
    ]);

    expect(result).toEqual({ ok: true });
    expect(project.hasFile("project/floors/COMMAND_BATCH_1.js")).toBe(true);
    expect(project.hasFile("project/floors/COMMAND_BATCH_2.js")).toBe(true);
    expect(projectData.tower().value().main.floorIds).toEqual(
      expect.arrayContaining(["COMMAND_BATCH_1", "COMMAND_BATCH_2"]),
    );
  });

  it("rejects batch create precheck failures without writing earlier floors", async () => {
    await project.loadResource(projectData.tower());
    await project.registerPath("project/floors/COMMAND_BATCH_OK.js");

    const result = await floorCommands.batchCreate([
      { floorId: "COMMAND_BATCH_OK", width: 3, height: 2 },
      { floorId: "sample0", width: 3, height: 2 },
    ]);

    expect(result).toMatchObject({ ok: false, stage: "precheck-batch-create-floors" });
    expect(project.hasFile("project/floors/COMMAND_BATCH_OK.js")).toBe(false);
    expect(projectData.tower().value().main.floorIds).not.toContain("COMMAND_BATCH_OK");
  });

  it("reports floor command failure stages for duplicate create and rename targets", async () => {
    await project.loadResource(projectData.tower());
    await project.loadResource(projectData.floor("sample0"));
    await project.loadResource(projectData.floor("sample1"));

    expect(await floorCommands.create("sample0")).toMatchObject({
      ok: false,
      stage: "check-new-floor",
    });
    expect(await floorCommands.rename("sample0", "sample1")).toMatchObject({
      ok: false,
      stage: "check-new-floor",
    });
  });

  it("resizes a real floor and shifts map/event structures", async () => {
    await project.loadResource(projectData.floor("sample0"));

    const result = await floorCommands.resize("sample0", {
      width: 14,
      height: 14,
      offsetX: 1,
      offsetY: 1,
    });

    expect(result).toEqual({ ok: true });
    const floor = projectData.floor("sample0").value();
    expect(floor.width).toBe(14);
    expect(floor.height).toBe(14);
    expect(floor.map).toHaveLength(14);
    expect(floor.map[0]).toHaveLength(14);
    expect(floor.map[1][1]).toBe(0);
    expect(floor.events?.["3,11"]).toBeDefined();
    expect(floor.events?.["2,10"]).toBeUndefined();
  });
});

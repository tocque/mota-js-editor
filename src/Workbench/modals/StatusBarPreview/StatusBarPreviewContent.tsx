import { useCallback, useEffect, useState, type FC } from "react";
import { useNode } from "@/hooks/useNode";

interface StatusBarPreviewContentProps {
  code: string;
  orientation: "horizontal" | "vertical";
}

const extractFlags = (code: string): Record<string, number> => {
  const flags: Record<string, number> = {};
  code.replace(/flag:([a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]+)/g, (s0, s1) => {
    flags[s1] = 0;
    return s0;
  });
  code.replace(/(core\.)?flags.([a-zA-Z0-9_]+)/g, (s0, s1, s2) => {
    if (!s1) flags[s2] = 0;
    return s0;
  });
  code.replace(/core\.(has|get|set|add|remove)Flag\('(.*?)'/g, (s0, _s1, s2) => {
    flags[s2] = 0;
    return s0;
  });
  code.replace(/core\.(has|get|set|add|remove)Flag\("(.*?)"/g, (s0, _s1, s2) => {
    flags[s2] = 0;
    return s0;
  });
  return flags;
};

export const StatusBarPreviewContent: FC<StatusBarPreviewContentProps> = ({ code, orientation }) => {
  const [canvas, setCanvas] = useNode<HTMLCanvasElement>();
  const [values, setValues] = useState({
    name: "阳光",
    hp: "1000",
    hpmax: "9999",
    atk: "10",
    def: "10",
    mdef: "0",
    mana: "0",
    manamax: "-1",
    money: "0",
    exp: "0",
    lv: "1",
    items: "yellowKey,yellowKey,blueKey",
    equips: "sword1,sheild1",
    flags: "{}",
  });

  useEffect(() => {
    if (!/^function\s*\(\)\s*{/.test(code)) return;
    setValues((prev) => ({
      ...prev,
      flags: JSON.stringify(extractFlags(code)),
    }));
  }, [code]);

  const preview = useCallback(() => {
    if (!canvas) return;
    const domStyle = core.clone(core.domStyle);
    const hero = core.clone(core.status.hero);
    core.status.hero.flags.__statistics__ = true;

    const statusCanvasCtx = core.dom.statusCanvasCtx;
    const enable = core.flags.statusCanvas;
    core.domStyle.showStatusBar = true;
    core.flags.statusCanvas = true;
    core.domStyle.isVertical = orientation === "vertical";

    const canvas2 = document.createElement("canvas");
    const ctx = canvas2.getContext("2d");
    if (!ctx) return;

    if (core.domStyle.isVertical) {
      canvas.width = canvas2.width = core.__PIXELS__;
      canvas.height = canvas2.height = 32 * (core.values.statusCanvasRowsOnMobile || 3) + 9;
    } else if (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.flags.extendToolbar) {
      canvas.width = canvas2.width = Math.round(core.__PIXELS__ * 0.31);
      canvas.height = canvas2.height = core.__PIXELS__ + 3 + 38;
    } else {
      canvas.width = canvas2.width = Math.round(core.__PIXELS__ * 0.31);
      canvas.height = canvas2.height = core.__PIXELS__;
    }

    core.dom.statusCanvasCtx = ctx;

    core.status.hero.name = values.name;
    core.status.hero.hp = parseFloat(values.hp);
    core.status.hero.hpmax = parseFloat(values.hpmax);
    core.status.hero.atk = parseFloat(values.atk);
    core.status.hero.def = parseFloat(values.def);
    core.status.hero.mdef = parseFloat(values.mdef);
    core.status.hero.mana = parseFloat(values.mana);
    core.status.hero.manamax = parseFloat(values.manamax);
    core.status.hero.money = parseFloat(values.money);
    core.status.hero.exp = parseFloat(values.exp);
    core.status.hero.lv = parseFloat(values.lv);

    values.items.split(",").forEach((itemId) => {
      if (!core.material.items[itemId]) return;
      const itemCls = core.material.items[itemId].cls;
      if (itemCls === "items") return;
      core.status.hero.items[itemCls][itemId] = (core.status.hero.items[itemCls][itemId] || 0) + 1;
    });
    core.status.hero.equipment = values.equips.split(",");

    try {
      const flagValues = JSON.parse(values.flags || "{}");
      for (const flag in flagValues) {
        core.status.hero.flags[flag] = flagValues[flag];
      }
    } catch (error) {
      console.error(error);
    }

    try {
      // eslint-disable-next-line no-eval
      eval(`(${code})()`);
    } catch (error) {
      console.error(error);
    }

    const toCtx = canvas.getContext("2d");
    if (toCtx) {
      core.fillRect(toCtx, 0, 0, canvas.width, canvas.height, "black");
      core.drawImage(toCtx, canvas2, 0, 0);
    }

    core.dom.statusCanvasCtx = statusCanvasCtx;
    core.domStyle = domStyle;
    core.flags.statusCanvas = enable;
    core.status.hero = hero;
    window.hero = hero;
    window.flags = core.status.hero.flags;
  }, [canvas, code, orientation, values]);

  useEffect(() => {
    preview();
  }, [canvas, orientation, preview]);

  return (
    <div id="uieventExtraBody" style={{ display: "block", marginTop: "-10px" }}>
      <p style={{ marginLeft: 10, marginRight: 10 }}>
        <b>注：此处预览效果与实际游戏内效果会有所出入，仅供参考，请以游戏内实际效果为准。</b>
      </p>
      <p id="_previewStatusBarP" style={{ display: "flex", flexWrap: orientation === "vertical" ? "wrap" : "nowrap" }}>
        <canvas id="_previewStatusBarCanvas" style={{ maxWidth: "100%" }} ref={setCanvas} />
        <span style={{ margin: 10 }} id="_previewStatusBarValue">
          属性设置: <button onClick={preview}>确定</button>
          <br />
          名称:
          <input style={{ width: 50 }} value={values.name} onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))} />
          生命:
          <input style={{ width: 50 }} value={values.hp} onChange={(event) => setValues((prev) => ({ ...prev, hp: event.target.value }))} />
          上限:
          <input style={{ width: 50 }} value={values.hpmax} onChange={(event) => setValues((prev) => ({ ...prev, hpmax: event.target.value }))} />
          攻击:
          <input style={{ width: 50 }} value={values.atk} onChange={(event) => setValues((prev) => ({ ...prev, atk: event.target.value }))} />
          防御:
          <input style={{ width: 50 }} value={values.def} onChange={(event) => setValues((prev) => ({ ...prev, def: event.target.value }))} />
          护盾:
          <input style={{ width: 50 }} value={values.mdef} onChange={(event) => setValues((prev) => ({ ...prev, mdef: event.target.value }))} />
          魔力:
          <input style={{ width: 50 }} value={values.mana} onChange={(event) => setValues((prev) => ({ ...prev, mana: event.target.value }))} />
          上限:
          <input style={{ width: 50 }} value={values.manamax} onChange={(event) => setValues((prev) => ({ ...prev, manamax: event.target.value }))} />
          金币:
          <input style={{ width: 50 }} value={values.money} onChange={(event) => setValues((prev) => ({ ...prev, money: event.target.value }))} />
          经验:
          <input style={{ width: 50 }} value={values.exp} onChange={(event) => setValues((prev) => ({ ...prev, exp: event.target.value }))} />
          等级:
          <input style={{ width: 50 }} value={values.lv} onChange={(event) => setValues((prev) => ({ ...prev, lv: event.target.value }))} />
          <br />
          当前道具ID（以逗号分隔）：
          <br />
          <textarea
            style={{ width: 300, height: 40 }}
            value={values.items}
            onChange={(event) => setValues((prev) => ({ ...prev, items: event.target.value }))}
          />
          <br />
          当前装备ID（以逗号分隔）：
          <br />
          <textarea
            style={{ width: 300, height: 40 }}
            value={values.equips}
            onChange={(event) => setValues((prev) => ({ ...prev, equips: event.target.value }))}
          />
          <br />
          当前变量值（JSON格式）：
          <br />
          <textarea
            style={{ width: 300, height: 80 }}
            value={values.flags}
            onChange={(event) => setValues((prev) => ({ ...prev, flags: event.target.value }))}
          />
        </span>
      </p>
    </div>
  );
};

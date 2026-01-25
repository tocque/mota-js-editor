import { useMemo, type FC } from "react";

interface SearchFlagsContentProps {
  selectedFlag: string;
}

const hasUsedFlags = (obj: unknown, flag: string): boolean => {
  if (obj == null) return false;
  if (typeof obj !== "string") return hasUsedFlags(JSON.stringify(obj), flag);
  let index = -1;
  const length = flag.length;
  while (true) {
    index = obj.indexOf(flag, index + 1);
    if (index < 0) return false;
    if (!/^[a-zA-Z0-9_\u4E00-\u9FCC\u3040-\u30FF\u2160-\u216B\u0391-\u03C9]$/.test(obj.charAt(index + length))) {
      return true;
    }
  }
};

const searchUsedFlags = (flag: string): string[] => {
  const list: string[] = [];
  const events = ["events", "autoEvent", "changeFloor", "beforeBattle", "afterBattle", "afterGetItem", "afterOpenDoor"];

  for (const floorId in core.floors) {
    const floor = core.floors[floorId];
    if (hasUsedFlags(floor.firstArrive, flag)) list.push(`${floorId},firstArrive`);
    if (hasUsedFlags(floor.eachArrive, flag)) list.push(`${floorId},eachArrive`);
    events.forEach((event) => {
      if (floor[event]) {
        for (const loc in floor[event]) {
          if (hasUsedFlags(floor[event][loc], flag)) {
            list.push(`${floorId} 层 ${event} 的 (${loc}) 点`);
          }
        }
      }
    });
  }

  for (const name in events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent) {
    if (hasUsedFlags(events_c12a15a8_c380_4b28_8144_256cba95f760.commonEvent[name], flag)) {
      list.push(`公共事件 ${name}`);
    }
  }

  for (const id in items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a) {
    const item = items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a[id];
    if (hasUsedFlags(item.equip, flag)) {
      list.push(`道具 ${(item.name || id)} 的装备属性`);
    }
    if (hasUsedFlags(item.useItemEvent, flag)) {
      list.push(`道具 ${(item.name || id)} 的使用事件`);
    }
  }

  for (const id in enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80) {
    const enemy = enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80[id];
    if (hasUsedFlags(enemy.beforeBattle, flag)) {
      list.push(`怪物 ${(enemy.name || id)} 的战前事件`);
    }
    if (hasUsedFlags(enemy.afterBattle, flag)) {
      list.push(`怪物 ${(enemy.name || id)} 的战后事件`);
    }
  }

  for (const id in maps_90f36752_8815_4be8_b32b_d7fad1d0542e) {
    const mapInfo = maps_90f36752_8815_4be8_b32b_d7fad1d0542e[id];
    if (hasUsedFlags(mapInfo.doorInfo, flag)) {
      list.push(`图块 ${(mapInfo.name || mapInfo.id)} 的门信息`);
    }
    if (hasUsedFlags(mapInfo.event, flag)) {
      list.push(`图块 ${(mapInfo.name || mapInfo.id)} 碰触事件`);
    }
  }

  if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.main.levelChoose, flag)) {
    list.push("难度分歧");
  }
  if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.startCanvas, flag)) {
    list.push("标题事件");
  }
  if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.startText, flag)) {
    list.push("开场剧情");
  }
  if (hasUsedFlags(data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.levelUp, flag)) {
    list.push("等级提升");
  }
  (data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d.firstData.shops || []).forEach((shop: { id: string }) => {
    if (hasUsedFlags(shop, flag)) list.push(`商店 ${shop.id}`);
  });

  return list;
};

export const SearchFlagsContent: FC<SearchFlagsContentProps> = ({ selectedFlag }) => {
  const list = useMemo(() => {
    if (!selectedFlag) return [];
    return searchUsedFlags(selectedFlag);
  }, [selectedFlag]);

  return (
    <div id="uieventExtraBody" style={{ display: "block", marginTop: "-10px" }}>
      <p style={{ marginLeft: 10 }}>该变量出现的所有位置如下：</p>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

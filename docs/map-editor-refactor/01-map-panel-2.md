# 地图绘制区功能清单 (续)

> 源文件: `src/scripts/editor_mappanel.ts`

## 8. 菜单操作

### 8.1 附加事件
| 函数 | 位置 | 说明 |
|------|------|------|
| `extraEvent_click` | L542-550 | 菜单入口 |
| `_extraEvent_bindStartPoint` | L556-573 | 绑定出生点 |
| `_extraEvent_changeFloor` | L575-592 | 跳转传送点 |
| `_extraEvent_bindStair` | L598-625 | 绑定楼梯事件 |
| `_extraEvent_bindSpecialDoor` | L631-639 | 绑定机关门 |
| `_extraEvent_bindSpecialDoor_doAction` | L646-687 | 执行机关门绑定 |

### 8.2 选点操作
| 函数 | 位置 | 说明 |
|------|------|------|
| `chooseThis_click` | L693-706 | 选中此点 |
| `chooseInRight_click` | L712-722 | 在素材区选中此图块 |

### 8.3 复制粘贴
| 函数 | 位置 | 说明 |
|------|------|------|
| `copyLoc_click` | L728-738 | 复制此事件 |
| `pasteLoc_click` | L744-765 | 粘贴到此事件 |

### 8.4 清除操作
| 函数 | 位置 | 说明 |
|------|------|------|
| `clearEvent_click` | L771-779 | 仅清空事件 |
| `clearLoc_click` | L785-793 | 清空位置和事件 |

## 9. 显示控制

| 函数 | 位置 | 说明 |
|------|------|------|
| `showMovable_onchange` | L799-803 | 显示通行度 |
| `highlightSaveFloorButton` | L953-956 | 高亮保存按钮 |
| `unhighlightSaveFloorButton` | L958-961 | 取消高亮 |
| `saveFloor_func` | L963-977 | 保存楼层 |

## 10. 最近使用

| 函数 | 位置 | 说明 |
|------|------|------|
| `lastUsed_click` | L991-1025 | 点击最近使用 |
| `clearLastUsedBtn_click` | L1027-1036 | 清空最近使用 |

## 11. 数据操作 (prototype 扩展)

| 函数 | 位置 | 说明 |
|------|------|------|
| `copyFromPos` | L1042-1062 | 复制位置数据 |
| `pasteToPos` | L1065-1084 | 粘贴位置数据 |
| `movePos` | L1087-1103 | 移动位置 |
| `exchangePos` | L1106-1123 | 交换两点 |
| `savePreMap` | L1126-1138 | 保存撤销数据 |
| `clearPos` | L1141-1174 | 清除位置 |

## 状态变量依赖 (uivalues)

| 变量 | 用途 |
|------|------|
| `startPos` / `endPos` | 拖拽起止点 |
| `holdingPath` | 是否正在绘制 |
| `stepPostfix` | 绘制路径点队列 |
| `mouseOutCheck` | 鼠标移出检测计数 |
| `lastMoveE` | 最后移动事件 |
| `bigmap` / `bigmapInfo` | 大地图模式 |
| `tileSize` | tileset 尺寸 [w, h] |
| `selectedArea` | 选中区域 |
| `copyedInfo` | 复制的数据 |
| `bindSpecialDoor` | 机关门绑定状态 |
| `recentFloors` | 楼层历史栈 |
| `lastUsed` / `lastUsedType` | 最近使用素材 |
| `preMapData` / `preMapMax` | 撤销数据栈 |
| `showMovable` | 是否显示通行度 |

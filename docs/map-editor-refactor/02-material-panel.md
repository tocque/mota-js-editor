# 素材选择区功能清单 (MaterialPanel)

> 源文件: `src/scripts/editor_materialpanel.ts` (243行)

## 1. 全局状态初始化

| 位置 | 说明 |
|------|------|
| L6-14 | 初始化 `window.selectBox` 全局变量 |

```js
// 全局变量
selectBox._isSelected  // 是否已选中素材
selectBox.isSelected() // getter/setter
```

## 2. 工具函数

| 函数 | 位置 | 说明 |
|------|------|------|
| `locToPos` | L16-18 | 坐标转格子位置 |
| `getScrollBarHeight` | L20-42 | 获取滚动条高度 |

## 3. 折叠/展开素材

| 函数 | 位置 | 触发 |
|------|------|------|
| `fold_material_click` | L47-62 | `iconExpandBtn.onclick` |

**功能:**
- L48-53: 展开素材 → reload
- L54-61: 折叠素材 → 设置 `foldPerCol` 后 reload

## 4. 素材区鼠标交互

### 4.1 鼠标按下
| 函数 | 位置 | 触发 |
|------|------|------|
| `material_ondown` | L68-82 | `iconLib.onmousedown` |

**功能:**
- 记录起始位置 `startLoc`
- 包含 px/py (原始像素位置)

### 4.2 鼠标移动
| 函数 | 位置 | 触发 |
|------|------|------|
| `material_onmove` | L88-101 | `iconLib.onmousemove` |

**功能:**
- 更新选择框 `dataSelection` 样式
- 实现拖拽框选视觉反馈

### 4.3 鼠标抬起
| 函数 | 位置 | 触发 |
|------|------|------|
| `material_onup` | L107-243 | `iconLib.onmouseup` |

**核心逻辑 (L120-243):**

1. **遍历素材列 `widthsX`** (L120)
2. **处理 autotile** (L128-145)
   - 折叠模式: 按行选
   - 展开模式: 4行一组
3. **处理普通素材** (L147-158)
   - 计算行数限制
   - 折叠模式的列映射
4. **更新选择框样式** (L160-166)
5. **确定 `editor.info`** (L168-199)
   - 清除块: (0,0)
   - 默认块: (0,1)
   - autotile / tileset / 普通素材
6. **tileset 多选** (L201-232)
   - 右键/移动端: 弹窗输入尺寸
   - 左键拖拽: 框选区域
7. **触发后续** (L236-240)
   - `showBlockInfo` 显示信息
   - `updateLastUsedMap` 更新最近使用

## 5. 数据结构

### editor.widthsX
素材列配置，结构: `{ [spriteName]: [imageName, startX, endX, height] }`

### editor.info
当前选中素材信息:
```js
// 清除块
editor.info = 0

// 普通素材
editor.info = { images: string, y: number, x?: number }

// 完整素材 (从 editor.ids 获取)
editor.info = {
  idnum, id, images, y, x?,
  isTile?, cls?, ...
}
```

## 6. 状态变量依赖 (uivalues)

| 变量 | 用途 |
|------|------|
| `startLoc` | 拖拽起点 |
| `lastMoveMaterE` | 最后移动事件 |
| `tileSize` | 选中素材尺寸 [w, h] |
| `folded` | 是否折叠模式 |
| `foldPerCol` | 折叠时每列个数 |
| `scrollBarHeight` | 滚动条高度 |

## 7. DOM 依赖

| DOM ID | 用途 |
|--------|------|
| `iconLib` | 素材区容器 |
| `iconImages` | 素材图片容器 |
| `selectBox` | 选择框容器 |
| `dataSelection` | 选择框指示器 |
| `iconExpandBtn` | 折叠/展开按钮 |

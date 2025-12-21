# 代码风格指南

## 注释

请使用中文

## 导入路径

- 跨模块导入使用 `@` 绝对路径：`import { x } from '@/utils/xxx'`
- 同模块内可用相对路径：`./DataStore`、`../types`

## 类型声明

- 全局变量类型集中在 `src/vite-env.d.ts`
- 优先使用 `@types/xxx` 包
- 类型从源模块导入：`import type { Xxx } from "@/path/to/module"`

## React 组件

- 使用 `const XX: FC<Props> = (props) => {}` 声明组件
- props 在函数体内解构：`const { ... } = props;`

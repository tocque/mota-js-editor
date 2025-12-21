# 代码风格指南

## 项目背景

重构迁移项目，原始代码在 `public` 中备用，大部分已提取到 `src/scripts`。目标是逐步从 `src/scripts` 提取模块完成重构。

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

## 单元测试

### 执行方式

`pnpm run test`

### 不要编写

- 针对常量的测试
- 针对接口/类型定义的测试
- 只验证 mock 被调用的测试
- 测试语言基础特性的测试
- 没有实际被测代码的测试

### 应该编写

- 函数的实际行为和边界情况
- 复杂业务逻辑的正确性
- 错误处理和异常情况
- 异步操作的正确性

## 工具函数

- 不依赖业务上下文的函数提取到 `src/utils`
- 不要从原模块重导出，提取时一并修改引用
- `src/utils` 按职责划分：`encoding.ts`、`json.ts`、`string.ts`

## 依赖管理

- 发现缺少依赖时，应在计划中加入安装依赖的步骤，或在执行阶段提出安装请求
- 不要因为缺少依赖而更换技术方案，这是不合理的
- 使用 `pnpm add <package>` 安装依赖

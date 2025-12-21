# Implementation Plan: Tower Comment Sync

## Overview

将 TowerDataStore 的 commentObj 数据源从 `editor.file.dataComment` 迁移到 `useTowerTableMeta`，实现数据同步。

## Tasks

- [x] 1. 重构 TowerDataStore
  - [x] 1.1 引入 useTowerTableMeta 获取 commentObj
    - 导入 `useTowerTableMeta` from `@/services/tableMeta`
    - 使用 `metaQuery = useTowerTableMeta()` 获取 commentObj
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 添加 processMainFields 函数
    - 将 main 字段处理逻辑从 towerDataService 移到 TowerDataStore
    - 根据 commentObj 中定义的字段对 data.main 进行 null 填充
    - _Requirements: 1.1_
  - [x] 1.3 合并 data 和 commentObj
    - 使用 `dataQuery.data` 和 `metaQuery.meta` 合并为 towerData
    - 合并 isLoading 和 error 状态
    - _Requirements: 1.2, 1.3_

- [x] 2. 简化 towerDataService
  - [x] 2.1 移除 getCommentObject 函数
    - 删除 `getCommentObject` 函数及其相关类型
    - _Requirements: 1.1_
  - [x] 2.2 简化 readTowerData 和 fetchTowerData
    - 移除 `readTowerData` 函数
    - `fetchTowerData` 直接返回 `getDataObject()`
    - 移除 `TowerData` 类型定义
    - _Requirements: 1.1_
  - [x] 2.3 更新 index.ts 导出
    - 移除 `getCommentObject` 和 `readTowerData` 的导出
    - _Requirements: 2.2_

- [x] 3. Checkpoint - 验证功能
  - 确保 TowerPanel 正常显示数据
  - 确保通过 useTableMetaEditor 修改配置后 commentObj 自动更新
  - 确保保存数据功能正常工作

## Notes

- TowerPanel 无需修改，API 保持不变
- 数据处理逻辑集中在 TowerDataStore 中
- 服务层只负责读写原始数据

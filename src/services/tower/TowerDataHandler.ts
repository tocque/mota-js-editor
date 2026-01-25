/**
 * TowerDataHandler - 全塔数据处理器
 *
 * 使用 JsonDataHandler 处理 project/data.js 文件
 */

import { JsonDataHandler } from "@/fs/JsonDataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import type { TowerData } from "./towerService";

/** 数据变量名 */
const DATA_VAR_NAME = "data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d";

/**
 * TowerDataHandler - 全塔数据处理器
 */
export class TowerDataHandler extends JsonDataHandler<TowerData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, DATA_VAR_NAME, "Tower Data");
  }
}

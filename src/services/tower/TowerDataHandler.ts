/**
 * TowerDataHandler - 全塔数据处理器
 * 
 * 职责：
 * - 继承 DataHandler，实现全塔数据的 parse 和 stringify
 * - 提供类型安全的全塔数据访问
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import { serializeToJsDataFile } from "@/utils/serialize";
import type { TowerData } from "./towerService";

/** 数据变量名 */
const DATA_VAR_NAME = "data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d";

/**
 * 解析全塔数据文件内容
 * 
 * 全塔数据文件格式：var data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d = \n{json}
 */
function parseTowerDataContent(content: string): TowerData {
  try {
    // 移除 "var data_xxx =" 前缀
    const prefix = `var ${DATA_VAR_NAME} =`;
    let jsonStr = content.trim();

    if (jsonStr.startsWith(prefix)) {
      jsonStr = jsonStr.substring(prefix.length).trim();
    }

    // 解析 JSON
    const data = JSON.parse(jsonStr) as TowerData;

    return data;
  } catch (err) {
    throw new Error(
      `Failed to parse tower data file: ${(err as Error).message}`,
    );
  }
}

/**
 * 序列化全塔数据为文件内容
 */
function stringifyTowerData(data: TowerData): string {
  return serializeToJsDataFile(DATA_VAR_NAME, data);
}

/**
 * TowerDataHandler - 全塔数据处理器
 */
export class TowerDataHandler extends DataHandler<TowerData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, "Tower Data");
  }

  /**
   * 解析文本为全塔数据
   */
  protected parse(text: string): TowerData {
    return parseTowerDataContent(text);
  }

  /**
   * 序列化全塔数据为文本
   */
  protected stringify(data: TowerData): string {
    return stringifyTowerData(data);
  }
}

/**
 * EnemysDataHandler - 怪物数据处理器
 *
 * 职责：
 * - 继承 DataHandler，实现怪物数据的 parse 和 stringify
 * - 提供类型安全的怪物数据访问
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import { serializeToJsDataFile } from "@/utils/serialize";
import type { EnemysData } from "./enemyService";

/** 数据变量名 */
const DATA_VAR_NAME = "enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80";

/**
 * 解析怪物数据文件内容
 *
 * 怪物数据文件格式：var enemys_fcae963b_31c9_42b4_b48c_bb48d09f3f80 = \n{json}
 */
function parseEnemysDataContent(content: string): EnemysData {
  try {
    // 移除 "var enemys_xxx =" 前缀
    const prefix = `var ${DATA_VAR_NAME} =`;
    let jsonStr = content.trim();

    if (jsonStr.startsWith(prefix)) {
      jsonStr = jsonStr.substring(prefix.length).trim();
    }

    // 解析 JSON
    const data = JSON.parse(jsonStr) as EnemysData;

    return data;
  } catch (err) {
    throw new Error(
      `Failed to parse enemys data file: ${(err as Error).message}`
    );
  }
}

/**
 * 序列化怪物数据为文件内容
 */
function stringifyEnemysData(data: EnemysData): string {
  return serializeToJsDataFile(DATA_VAR_NAME, data);
}

/**
 * EnemysDataHandler - 怪物数据处理器
 */
export class EnemysDataHandler extends DataHandler<EnemysData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, "Enemys Data");
  }

  /**
   * 解析文本为怪物数据
   */
  protected parse(text: string): EnemysData {
    return parseEnemysDataContent(text);
  }

  /**
   * 序列化怪物数据为文本
   */
  protected stringify(data: EnemysData): string {
    return stringifyEnemysData(data);
  }
}

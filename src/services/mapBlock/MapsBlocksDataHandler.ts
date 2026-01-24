/**
 * MapsBlocksDataHandler - 地图块数据处理器
 *
 * 职责：
 * - 继承 DataHandler，实现地图块数据的 parse 和 stringify
 * - 提供类型安全的地图块数据访问
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import { serializeToJsDataFile } from "@/utils/serialize";
import type { MapsBlocksData } from "./mapBlockService";

/** 数据变量名 */
const DATA_VAR_NAME = "maps_90f36752_8815_4be8_b32b_d7fad1d0542e";

/**
 * 解析地图块数据文件内容
 *
 * 地图块数据文件格式：var maps_90f36752_8815_4be8_b32b_d7fad1d0542e = \n{json}
 */
function parseMapsBlocksDataContent(content: string): MapsBlocksData {
  try {
    // 移除 "var maps_xxx =" 前缀
    const prefix = `var ${DATA_VAR_NAME} =`;
    let jsonStr = content.trim();

    if (jsonStr.startsWith(prefix)) {
      jsonStr = jsonStr.substring(prefix.length).trim();
    }

    // 解析 JSON
    const data = JSON.parse(jsonStr) as MapsBlocksData;

    return data;
  } catch (err) {
    throw new Error(
      `Failed to parse maps blocks data file: ${(err as Error).message}`
    );
  }
}

/**
 * 序列化地图块数据为文件内容
 */
function stringifyMapsBlocksData(data: MapsBlocksData): string {
  return serializeToJsDataFile(DATA_VAR_NAME, data);
}

/**
 * MapsBlocksDataHandler - 地图块数据处理器
 */
export class MapsBlocksDataHandler extends DataHandler<MapsBlocksData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, "Maps Blocks Data");
  }

  /**
   * 解析文本为地图块数据
   */
  protected parse(text: string): MapsBlocksData {
    return parseMapsBlocksDataContent(text);
  }

  /**
   * 序列化地图块数据为文本
   */
  protected stringify(data: MapsBlocksData): string {
    return stringifyMapsBlocksData(data);
  }
}

/**
 * FloorDataHandler - 楼层数据处理器
 * 
 * 职责：
 * - 继承 DataHandler，实现楼层数据的 parse 和 stringify
 * - 提供类型安全的楼层数据访问
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import { serializeToJsMapFile } from "@/utils/serialize";
import type { FloorData } from "@/types";

/**
 * 解析楼层文件内容
 * 
 * 楼层文件格式：main.floors.{floorId} = \n{json}
 */
function parseFloorContent(content: string, floorId: string): FloorData {
  try {
    // 移除 "main.floors.{floorId} =" 前缀
    const prefix = `main.floors.${floorId} =`;
    let jsonStr = content.trim();

    if (jsonStr.startsWith(prefix)) {
      jsonStr = jsonStr.substring(prefix.length).trim();
    }

    // 解析 JSON
    const data = JSON.parse(jsonStr) as FloorData;

    // 确保 floorId 字段存在
    if (!data.floorId) {
      data.floorId = floorId;
    }

    return data;
  } catch (err) {
    throw new Error(
      `Failed to parse floor file ${floorId}: ${(err as Error).message}`,
    );
  }
}

/**
 * 序列化楼层数据为文件内容
 */
function stringifyFloorData(data: FloorData): string {
  return serializeToJsMapFile(data.floorId, data);
}

/**
 * FloorDataHandler - 楼层数据处理器
 */
export class FloorDataHandler extends DataHandler<FloorData> {
  constructor(fileHandler: FileHandler, private floorId: string) {
    super(fileHandler, `Floor ${floorId}`);
  }

  /**
   * 解析文本为楼层数据
   */
  protected parse(text: string): FloorData {
    return parseFloorContent(text, this.floorId);
  }

  /**
   * 序列化楼层数据为文本
   */
  protected stringify(data: FloorData): string {
    return stringifyFloorData(data);
  }
}

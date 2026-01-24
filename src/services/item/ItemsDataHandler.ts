/**
 * ItemsDataHandler - 道具数据处理器
 *
 * 职责：
 * - 继承 DataHandler，实现道具数据的 parse 和 stringify
 * - 提供类型安全的道具数据访问
 */

import { DataHandler } from "@/fs/DataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import { serializeToJsDataFile } from "@/utils/serialize";
import type { ItemsData } from "./itemService";

/** 数据变量名 */
const DATA_VAR_NAME = "items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a";

/**
 * 解析道具数据文件内容
 *
 * 道具数据文件格式：var items_296f5d02_12fd_4166_a7c1_b5e830c9ee3a = \n{json}
 */
function parseItemsDataContent(content: string): ItemsData {
  try {
    // 移除 "var items_xxx =" 前缀
    const prefix = `var ${DATA_VAR_NAME} =`;
    let jsonStr = content.trim();

    if (jsonStr.startsWith(prefix)) {
      jsonStr = jsonStr.substring(prefix.length).trim();
    }

    // 解析 JSON
    const data = JSON.parse(jsonStr) as ItemsData;

    return data;
  } catch (err) {
    throw new Error(
      `Failed to parse items data file: ${(err as Error).message}`
    );
  }
}

/**
 * 序列化道具数据为文件内容
 */
function stringifyItemsData(data: ItemsData): string {
  return serializeToJsDataFile(DATA_VAR_NAME, data);
}

/**
 * ItemsDataHandler - 道具数据处理器
 */
export class ItemsDataHandler extends DataHandler<ItemsData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, "Items Data");
  }

  /**
   * 解析文本为道具数据
   */
  protected parse(text: string): ItemsData {
    return parseItemsDataContent(text);
  }

  /**
   * 序列化道具数据为文本
   */
  protected stringify(data: ItemsData): string {
    return stringifyItemsData(data);
  }
}

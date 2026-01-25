/**
 * MapsBlocksDataHandler - 地图块数据处理器
 *
 * 使用 JsonDataHandler 处理 project/maps.js 文件
 */

import { JsonDataHandler } from "@/fs/JsonDataHandler";
import type { FileHandler } from "@/fs/FileHandler";
import type { MapsBlocksData } from "./mapBlockService";

/** 数据变量名 */
const DATA_VAR_NAME = "maps_90f36752_8815_4be8_b32b_d7fad1d0542e";

/**
 * MapsBlocksDataHandler - 地图块数据处理器
 */
export class MapsBlocksDataHandler extends JsonDataHandler<MapsBlocksData> {
  constructor(fileHandler: FileHandler) {
    super(fileHandler, DATA_VAR_NAME, "Maps Blocks Data");
  }
}

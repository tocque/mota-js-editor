/**
 * 游戏数据类型定义
 * 这些类型用于描述游戏核心对象和相关数据结构
 */

// ============== Core 相关类型 ==============

/** 简化的 core.material 类型 */
export interface CoreMaterial {
  enemys: Record<string, { name?: string }>;
  bgms: Record<string, unknown>;
  sounds: Record<string, unknown>;
  animates: Record<string, unknown>;
  images: Record<string, unknown>;
  items: Record<string, { name?: string }>;
}

/** 简化的 core.status 类型 */
export interface CoreStatus {
  maps: Record<string, { title?: string }>;
  shops: Record<string, { textInList?: string }>;
  textAttribute: Record<string, unknown>;
  bgmaps: Record<string, unknown>;
  fgmaps: Record<string, unknown>;
}

/** 简化的 core 类型 */
export interface CoreType {
  material: CoreMaterial;
  status: CoreStatus;
  canvas: Record<string, CanvasRenderingContext2D>;
  values: Record<string, unknown>;
  flags: Record<string, unknown>;
  [key: string]: unknown;
}

// ============== Functions 相关类型 ==============

/** 简化的 functions 类型 */
export interface FunctionsType {
  enemys: {
    getSpecials: () => Array<[number, string | ((arg: unknown) => string)]>;
  };
  [key: string]: unknown;
}

// ============== Data Comment 相关类型 ==============

/** 简化的 data_comment 类型 */
export interface DataCommentType {
  _data: {
    values: {
      _data: Record<string, { _data: string } | undefined>;
    };
    flags: {
      _data: Record<string, { _data: string } | undefined>;
    };
  };
}

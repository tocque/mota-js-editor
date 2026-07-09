export interface TableMetaRuntimeContext {
  editor: {
    mode: {
      checkFloorIds(value: unknown): boolean;
      checkImages(value: unknown, directory?: string): boolean;
      checkUnique(value: unknown): boolean;
    };
    core: {
      material: {
        images: Record<string, Record<string, unknown>>;
      };
    };
  };
  core: {
    material: {
      images: Record<string, Record<string, unknown>>;
    };
    subarray<T>(current: T[], previous: T[]): T[] | null;
  };
  main: Record<string, unknown>;
  data: {
    main: {
      floorIds: string[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  functions: {
    enemys: {
      getSpecials(): [number[], string[]] | { key: (string | number)[]; prefix: string[] };
    };
    [key: string]: unknown;
  };
  confirm(message: string): boolean;
}

function getGlobalRecord(name: string): Record<string, unknown> | undefined {
  if (typeof window === "undefined") return undefined;
  const value = (window as unknown as Record<string, unknown>)[name];
  return value && typeof value === "object" ? value as Record<string, unknown> : undefined;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function checkUnique(value: unknown): boolean {
  if (value == null) return true;
  if (!Array.isArray(value)) return false;
  return new Set(value).size === value.length;
}

function checkImages(value: unknown): boolean {
  return value == null || isStringArray(value);
}

function checkFloorIds(value: unknown): boolean {
  return isStringArray(value) && value.length > 0;
}

function subarray<T>(current: T[], previous: T[]): T[] | null {
  const previousSet = new Set(previous);
  return current.every((item) => previousSet.has(item)) ? current : null;
}

function createFallbackFunctions(): TableMetaRuntimeContext["functions"] {
  return {
    enemys: {
      getSpecials: () => [[], []],
    },
  };
}

export function createTableMetaRuntimeContext(): TableMetaRuntimeContext {
  const globalEditor = getGlobalRecord("editor");
  const globalCore = getGlobalRecord("core");
  const globalData = getGlobalRecord("data_a1e2fb4a_e986_4524_b0da_9b7ba7c0874d");
  const globalFunctions = getGlobalRecord("functions_d6ad677b_427a_4623_b50f_a445a3b0ef8a");

  const coreMaterial = {
    images: (
      (globalCore?.material as { images?: Record<string, Record<string, unknown>> } | undefined)?.images
      ?? {
        images: {},
        tilesets: {},
        animates: {},
        bgms: {},
        sounds: {},
        fonts: {},
      }
    ),
  };

  const context: TableMetaRuntimeContext = {
    editor: {
      mode: {
        checkFloorIds,
        checkImages,
        checkUnique,
      },
      core: {
        material: coreMaterial,
      },
    },
    core: {
      material: coreMaterial,
      subarray,
    },
    main: {},
    data: {
      main: {
        floorIds: [],
      },
    },
    functions: createFallbackFunctions(),
    confirm: (message) => {
      if (typeof window === "undefined" || typeof window.confirm !== "function") return true;
      return window.confirm(message);
    },
  };

  if (globalEditor) {
    context.editor = {
      ...context.editor,
      ...globalEditor,
      mode: {
        ...context.editor.mode,
        ...(globalEditor.mode as object | undefined),
      },
      core: {
        ...context.editor.core,
        ...(globalEditor.core as object | undefined),
      },
    } as TableMetaRuntimeContext["editor"];
  }

  if (globalCore) {
    context.core = {
      ...context.core,
      ...globalCore,
      material: {
        ...context.core.material,
        ...(globalCore.material as object | undefined),
      },
      subarray: (globalCore.subarray as TableMetaRuntimeContext["core"]["subarray"] | undefined)
        ?? context.core.subarray,
    } as TableMetaRuntimeContext["core"];
  }

  if (globalData) {
    context.data = {
      ...context.data,
      ...globalData,
      main: {
        ...context.data.main,
        ...(globalData.main as object | undefined),
      },
    } as TableMetaRuntimeContext["data"];
  }

  if (globalFunctions) {
    context.functions = {
      ...context.functions,
      ...globalFunctions,
    } as TableMetaRuntimeContext["functions"];
  }

  return context;
}

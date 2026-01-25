import type { FC } from "react";
import { GridCanvas } from "@/components/GridCanvas";
import { useFloorThumbnailSource } from "@/hooks/useFloorThumbnailSource";
import { useGameCore } from "@/stores/GameDataStore";
import type { CoreType } from "@/types";

interface FloorThumbnailProps {
  floorId: string;
  style?: React.CSSProperties;
}

export const FloorThumbnail: FC<FloorThumbnailProps> = (props) => {
  const { floorId, style } = props;
  const core = useGameCore<CoreType>();
  const source = useFloorThumbnailSource({ floorId, viewport: { mode: "all" } });

  return (
    <GridCanvas
      source={source}
      width={core?.__PIXELS__ ?? 0}
      height={core?.__PIXELS__ ?? 0}
      gridSize={[32, 32]}
      style={{ position: "relative", marginLeft: "-10px", marginTop: "5px", ...style }}
    />
  );
};

import { useMemo, useState, type FC } from "react";
import { FloorThumbnail } from "../shared/FloorThumbnail";

interface SelectFloorContentProps {
  value: string;
  onChange: (floorId: string) => void;
}

export const SelectFloorContent: FC<SelectFloorContentProps> = ({ value, onChange }) => {
  const [filterValue, setFilterValue] = useState("");
  const [previewFloorId, setPreviewFloorId] = useState<string | null>(null);

  const floors = useMemo(() => {
    return core.floorIds.filter((one) => {
      const floor = core.floors[one];
      if (!floor) return false;
      if (!filterValue) return true;
      return one.includes(filterValue)
        || (floor.title || "").includes(filterValue)
        || (floor.name || "").includes(filterValue);
    });
  }, [filterValue]);

  const togglePreview = (floorId: string) => {
    setPreviewFloorId((prev) => (prev === floorId ? null : floorId));
  };

  return (
    <div id="uieventExtraBody" style={{ display: "block", marginTop: "-10px" }}>
      <p style={{ marginLeft: 10, lineHeight: "25px" }}>
        搜索楼层：
        <input
          type="text"
          placeholder="楼层ID或楼层名..."
          style={{ verticalAlign: "text-bottom" }}
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
        />
        <br />
        <span id="selectFloor_floorList">
          {floors.map((one) => {
            const floor = core.floors[one];
            if (!floor) return null;
            const checked = one === value;
            const isPreviewing = previewFloorId === one;
            return (
              <div key={one}>
                <input
                  type="radio"
                  name="uievent_selectFloor"
                  checked={checked}
                  onChange={() => onChange(one)}
                />
                <span
                  style={{ cursor: "default" }}
                  onClick={() => onChange(one)}
                >
                  {one}（{floor.title}）
                </span>
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => togglePreview(one)}
                >
                  {isPreviewing ? "收起" : "预览"}
                </button>
                {isPreviewing && (
                  <span style={{ display: "inline" }}>
                    <FloorThumbnail floorId={one} />
                  </span>
                )}
                <br />
              </div>
            );
          })}
        </span>
      </p>
    </div>
  );
};

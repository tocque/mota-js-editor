import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { fs } from "@/services/fs";
import { ImagePreview } from "../shared/ImagePreview";
import { AudioPreview } from "../shared/AudioPreview";
import { AnimatePreview, type AnimateCache } from "../shared/AnimatePreview";

interface SelectMaterialContentProps {
  value: string[];
  directory: string;
  transform?: ((one: string) => string | null) | null;
  onChange: (value: string[]) => void;
}

interface MaterialEntry {
  name: string;
  source: "directory" | "appended";
  isImage: boolean;
  isAudio: boolean;
  isAnimate: boolean;
  disabled: boolean;
}

const isImageFile = (name: string) => /\.(png|jpg|jpeg|gif)$/i.test(name);
const isAudioFile = (name: string) => /\.(mp3|ogg|wav|m4a|flac)$/i.test(name);

export const SelectMaterialContent: FC<SelectMaterialContentProps> = ({
  value,
  directory,
  transform,
  onChange,
}) => {
  const [entries, setEntries] = useState<string[]>([]);
  const [extraEntries, setExtraEntries] = useState<string[]>([]);
  const [disabledBase, setDisabledBase] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<Record<string, boolean>>({});
  const [previewAppendedImages, setPreviewAppendedImages] = useState<Record<string, boolean>>({});
  const animateCacheRef = useRef<AnimateCache>({ parsed: {}, raw: {} });

  const [baseDirectory, appendedKey] = useMemo(() => {
    const parts = directory.split(":");
    return [parts[0], parts[1]];
  }, [directory]);

  const isTileset = baseDirectory.includes("project/tilesets");

  // Initialize disabled items for tileset
  useEffect(() => {
    if (isTileset) {
      setDisabledBase(value);
    }
  }, [isTileset, value]);

  // Load entries from directory
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fs.promises.readdir(baseDirectory);
        const list = (transform ? data.map(transform) : data)
          .filter((one): one is string => Boolean(one))
          .sort();
        setEntries(list);

        if (appendedKey === "images") {
          const appendedImages = Object.keys(core.material.images.images);
          const extra = (transform ? appendedImages.map(transform) : appendedImages)
            .filter((one): one is string => Boolean(one))
            .filter((one) => !list.includes(one))
            .sort();
          setExtraEntries(extra);
        } else {
          setExtraEntries([]);
        }
      } catch (error) {
        printe(`${baseDirectory}不存在！`);
        throw error;
      }
    };
    load();
  }, [appendedKey, baseDirectory, transform]);

  const selectedSet = useMemo(() => new Set(value), [value]);
  const disabledSet = useMemo(() => {
    if (!isTileset) return new Set<string>();
    return new Set(disabledBase);
  }, [disabledBase, isTileset]);

  const handleToggle = (name: string, checked: boolean) => {
    if (disabledSet.has(name)) return;
    const next = new Set(value);
    if (checked) next.add(name);
    else next.delete(name);
    onChange(Array.from(next));
  };

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      onChange(Array.from(disabledSet));
      return;
    }
    const next = new Set(value);
    entries.forEach((one) => {
      if (!disabledSet.has(one)) next.add(one);
    });
    extraEntries.forEach((one) => {
      if (!disabledSet.has(one)) next.add(one);
    });
    onChange(Array.from(next));
  };

  const buildEntries = (list: string[], source: "directory" | "appended"): MaterialEntry[] => {
    return list.map((name) => ({
      name,
      source,
      isImage: isImageFile(name),
      isAudio: isAudioFile(name),
      isAnimate: baseDirectory.includes("animates"),
      disabled: disabledSet.has(name),
    }));
  };

  const materials = useMemo(() => buildEntries(entries, "directory"), [entries, baseDirectory, disabledSet]);
  const appendedMaterials = useMemo(() => buildEntries(extraEntries, "appended"), [extraEntries, baseDirectory, disabledSet]);

  const toggleImagePreview = (name: string, isAppended: boolean) => {
    if (isAppended) {
      setPreviewAppendedImages((prev) => ({ ...prev, [name]: !prev[name] }));
      return;
    }
    setPreviewImages((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div id="uieventExtraBody" style={{ display: "block", marginTop: "-10px" }}>
      <p style={{ marginLeft: 10, lineHeight: "25px" }}>
        <button onClick={() => handleSelectAll(true)}>全选</button>
        <button style={{ marginLeft: 10 }} onClick={() => handleSelectAll(false)}>全不选</button>
        <br />
        {isTileset && (
          <>
            <b style={{ marginTop: 5 }}>
              警告！额外素材一旦注册成功将不可删除，否则可能会导致素材错位风险！如果你不再想用某个额外素材，
              但又不想让它出现在素材区，可以考虑使用空气墙同名替换该额外素材文件。
            </b>
            <br />
          </>
        )}
        {materials.map((entry) => (
          <span key={`${entry.source}-${entry.name}`} style={{ display: "block" }}>
            <input
              type="checkbox"
              className="materialCheckbox"
              checked={selectedSet.has(entry.name)}
              disabled={entry.disabled}
              onChange={(event) => handleToggle(entry.name, event.target.checked)}
            />
            {" "}{entry.name}
            {entry.isImage && (
              <>
                <button style={{ marginLeft: 10 }} onClick={() => toggleImagePreview(entry.name, false)}>
                  {previewImages[entry.name] ? "折叠" : "预览"}
                </button>
                {previewImages[entry.name] && <ImagePreview src={`${baseDirectory}${entry.name}`} />}
              </>
            )}
            {entry.isAudio && (
              <AudioPreview src={`${baseDirectory}${entry.name}`} />
            )}
            {entry.isAnimate && (
              <AnimatePreview
                fileKey={`${baseDirectory}${entry.name}.animate`}
                displayName={entry.name}
                cacheRef={animateCacheRef}
              />
            )}
          </span>
        ))}
        {appendedMaterials.map((entry) => (
          <span key={`${entry.source}-${entry.name}`} style={{ display: "block" }}>
            <input
              type="checkbox"
              className="materialCheckbox"
              checked={selectedSet.has(entry.name)}
              disabled={entry.disabled}
              onChange={(event) => handleToggle(entry.name, event.target.checked)}
            />
            {" "}{entry.name}
            {entry.isImage && (
              <>
                <button style={{ marginLeft: 10 }} onClick={() => toggleImagePreview(entry.name, true)}>
                  {previewAppendedImages[entry.name] ? "折叠" : "预览"}
                </button>
                {previewAppendedImages[entry.name] && (
                  <ImagePreview src={core.material.images.images[entry.name]?.src || ""} />
                )}
              </>
            )}
          </span>
        ))}
      </p>
      <p style={{ marginLeft: 10 }}>
        <small>如果文件未在此列表显示，请检查文件名是否合法（只能由数字字母下划线横线和点组成），后缀名是否正确。</small>
      </p>
    </div>
  );
};

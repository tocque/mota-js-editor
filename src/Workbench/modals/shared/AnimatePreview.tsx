import { clamp } from "es-toolkit";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { fs } from "@/services/fs";
import { useCurrentFloorId } from "@/stores/editorState";

interface AnimateCache {
  parsed: Record<string, unknown>;
  raw: Record<string, unknown>;
}

interface SoundRow {
  frame: number;
  sound: string;
  pitch: number;
}

interface AnimatePreviewProps {
  fileKey: string;
  displayName: string;
  cacheRef: React.MutableRefObject<AnimateCache>;
}

export const AnimatePreview: FC<AnimatePreviewProps> = ({ fileKey, displayName, cacheRef }) => {
  const storeFloorId = useCurrentFloorId();
  const [open, setOpen] = useState(false);
  const [frames, setFrames] = useState(1);
  const [soundRows, setSoundRows] = useState<SoundRow[]>([]);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animateCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const buildSoundRows = useCallback((content: { se?: Record<string, string> | string; pitch?: Record<string, number>; frame?: number }) => {
    const sounds = content.se || {};
    const pitch = content.pitch || {};
    const rows: SoundRow[] = [];
    const framesCount = content.frame || 1;
    setFrames(framesCount);
    const normalized = typeof sounds === "string" ? { 1: sounds } : sounds;
    Object.keys(normalized).forEach((frame) => {
      rows.push({
        frame: parseInt(frame, 10),
        sound: normalized[frame],
        pitch: pitch[frame] || 100,
      });
    });
    setSoundRows(rows);
  }, []);

  const ensureContent = useCallback(async () => {
    if (cacheRef.current.parsed[fileKey]) return;
    try {
      const data = await fs.promises.readFile(fileKey, "utf-8");
      cacheRef.current.parsed[fileKey] = core.loader._loadAnimate(data);
      cacheRef.current.raw[fileKey] = JSON.parse(data);
    } catch (error) {
      alert(`无法打开动画文件！${String(error)}`);
    }
  }, [cacheRef, fileKey]);

  const startAnimation = useCallback(() => {
    const ctx = animateCanvasRef.current?.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    intervalRef.current = window.setInterval(() => {
      if (!open) return;
      const content = cacheRef.current.parsed[fileKey];
      if (!content) return;
      core.clearMap(ctx);
      core.maps._drawAnimateFrame(ctx, content, core.__PIXELS__ / 2, core.__PIXELS__ / 2, frame++);
    }, 50);
  }, [cacheRef, fileKey, open]);

  useEffect(() => {
    if (!open) return;
    ensureContent().then(() => {
      const content = cacheRef.current.parsed[fileKey] as { se?: Record<string, string> | string; pitch?: Record<string, number>; frame?: number } | undefined;
      if (!content) return;
      buildSoundRows(content);
      if (backgroundCanvasRef.current) {
        const ctx = backgroundCanvasRef.current.getContext("2d");
        if (ctx) {
          core.drawThumbnail(storeFloorId || core.status.floorId, null, { ctx });
        }
      }
      startAnimation();
    });
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [buildSoundRows, cacheRef, ensureContent, fileKey, open, startAnimation, storeFloorId]);

  const handlePreviewSound = (row: SoundRow) => {
    if (!row.sound) return;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = `./project/sounds/${row.sound}`;
    audio.preservesPitch = false;
    audio.playbackRate = clamp((row.pitch || 100) / 100, 0.3, 3.0);
    audio.play();
  };

  const handleSaveSounds = async () => {
    const content = cacheRef.current.parsed[fileKey] as { se?: Record<string, string>; pitch?: Record<string, number> } | undefined;
    const raw = cacheRef.current.raw[fileKey] as { se?: Record<string, string>; pitch?: Record<string, number> } | undefined;
    if (!content || !raw) return;
    const se: Record<string, string> = {};
    const pitch: Record<string, number> = {};
    soundRows.forEach((row) => {
      if (row.sound) {
        se[String(row.frame)] = row.sound;
        pitch[String(row.frame)] = clamp(row.pitch || 100, 30, 300);
      }
    });
    content.se = se;
    raw.se = se;
    content.pitch = pitch;
    raw.pitch = pitch;
    try {
      await fs.promises.writeFile(fileKey, JSON.stringify(raw), "utf-8");
      alert("动画音效修改成功！别忘了在全塔属性中注册音效哦！");
    } catch (error) {
      alert(`无法修改音效文件！${String(error)}`);
    }
  };

  const handleAddSound = () => {
    setSoundRows((prev) => [...prev, { frame: 1, sound: "", pitch: 100 }]);
  };

  const handleDeleteSound = (index: number) => {
    setSoundRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof SoundRow, value: string | number) => {
    setSoundRows((prev) => prev.map((row, idx) => {
      if (idx !== index) return row;
      return { ...row, [field]: value };
    }));
  };

  useEffect(() => {
    if (!open) return;
    const audios = Object.keys(core.material.sounds).sort().join(",");
    const inputs = document.querySelectorAll<HTMLInputElement>(`[data-audio-for="${displayName}"]`);
    const AwesompleteClass = window.Awesomplete as undefined | (new (input: HTMLInputElement) => void);
    inputs.forEach((input) => {
      if (input.getAttribute("data-awesomplete") === "1") return;
      input.setAttribute("data-awesomplete", "1");
      input.setAttribute("data-list", audios);
      if (AwesompleteClass) {
        new AwesompleteClass(input);
      }
    });
  }, [displayName, open, soundRows]);

  return (
    <span style={{ display: "block" }}>
      <button onClick={() => setOpen((prev) => !prev)} style={{ marginLeft: 10 }}>
        {open ? "收起" : "预览"}
      </button>
      {open && (
        <span style={{ display: "inline", marginLeft: 10 }}>
          <span style={{ position: "relative", marginLeft: "-10px", display: "inline-block" }}>
            <canvas
              ref={backgroundCanvasRef}
              width={core.__PIXELS__}
              height={core.__PIXELS__}
              style={{ position: "absolute" }}
            />
            <canvas
              ref={animateCanvasRef}
              width={core.__PIXELS__}
              height={core.__PIXELS__}
              style={{ position: "absolute" }}
            />
            <canvas width={core.__PIXELS__} height={core.__PIXELS__} />
          </span>
          <br />
          {soundRows.map((row, index) => (
            <span key={`${row.frame}-${index}`} style={{ display: "block" }}>
              第{" "}
              <select value={row.frame} onChange={(event) => handleRowChange(index, "frame", parseInt(event.target.value, 10))}>
                {Array.from({ length: frames }).map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                ))}
              </select>{" "}
              帧：
              <input
                type="text"
                value={row.sound}
                data-audio-for={displayName}
                style={{ width: 110 }}
                onChange={(event) => handleRowChange(index, "sound", event.target.value)}
              />
              <button style={{ marginLeft: 10 }} onClick={() => handlePreviewSound(row)}>试听</button>
              <small>
                {" "}音调：
                <input
                  value={row.pitch}
                  style={{ width: 28 }}
                  onChange={(event) => handleRowChange(index, "pitch", parseInt(event.target.value, 10) || 100)}
                />
              </small>
              <button style={{ marginLeft: 10 }} onClick={() => handleDeleteSound(index)}>删除</button>
              <br />
            </span>
          ))}
          <button onClick={handleAddSound}>添加音效</button>
          <button style={{ marginLeft: 10 }} onClick={handleSaveSounds}>保存</button>
          <br />
          <br />
        </span>
      )}
    </span>
  );
};

export type { AnimateCache };

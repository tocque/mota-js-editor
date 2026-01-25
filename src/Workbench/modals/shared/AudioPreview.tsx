import { clamp } from "es-toolkit";
import { useRef, useState, type ChangeEvent, type FC, type MouseEvent } from "react";

interface AudioPreviewProps {
  src: string;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = String(Math.floor(time) % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const AudioPreview: FC<AudioPreviewProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pitch, setPitch] = useState("100");
  const [progress, setProgress] = useState(0);
  const [timeText, setTimeText] = useState("0:00 / 0:00");

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!open) {
      audio.play();
      setOpen(true);
    } else {
      audio.pause();
      setOpen(false);
    }
  };

  const handlePitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setPitch(next);
    const audio = audioRef.current;
    if (!audio) return;
    audio.preservesPitch = false;
    audio.playbackRate = clamp((parseInt(next, 10) || 100) / 100, 0.3, 3.0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || audio.duration <= 0) return;
    setTimeText(`${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`);
    setProgress(audio.currentTime / audio.duration);
  };

  const handleSeek = (event: MouseEvent<HTMLProgressElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const element = event.currentTarget;
    const value = (event.nativeEvent.offsetX * element.max) / element.offsetWidth;
    setProgress(value);
    audio.currentTime = audio.duration * value;
    if (audio.paused) audio.play();
  };

  return (
    <span>
      <button onClick={toggle} style={{ marginLeft: 10 }}>{open ? "暂停" : "播放"}</button>
      <small>
        {" "}音调：
        <input value={pitch} style={{ width: 28 }} onChange={handlePitchChange} />
      </small>
      {open && (
        <>
          <small style={{ marginLeft: 15 }}>{timeText}</small>
          <br />
          <audio ref={audioRef} preload="none" src={src} onTimeUpdate={handleTimeUpdate} />
          <progress value={progress} max={1} style={{ width: "100%" }} onClick={handleSeek} />
        </>
      )}
    </span>
  );
};

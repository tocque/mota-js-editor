import type { FC } from "react";

export const ColorPanel: FC = () => {

  return (
    <div id="colorPanel" className="cpPanel" style={{ display: "none" }}>
      <input className="color" id="colorPicker" defaultValue="255,215,0,1" />
      <button onClick={() => confirmColor()}>确定</button>
    </div>
  );
}
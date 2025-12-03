import type { FC } from "react";
import { MapPanel } from "./MapPanel";
import { AppendPicPanel } from "./AppendPicPanel";
import { LocPanel } from "./LocPanel";
import { PrefabPanel } from "./PrefabPanel";
import { FloorPanel } from "./FloorPanel";
import { TowerPanel } from "./TowerPanel";
import { EventsEditor } from "./EventsEditor";
import { ColorPanel } from "./ColorPanel";
import { PluginPanel } from "./PluginPanel";
import { CommonEventPanel } from "./CommonEventPanel";
import { FunctionsPanel } from "./FunctionsPanel";
import { CodeEditor } from "./CodeEditor";
import { MapEditor } from "@/MapEditor";

export const Workbench: FC = () => {

  return (
    <div className="main">
      <MapPanel />
      <AppendPicPanel />
      <LocPanel />
      <PrefabPanel />
      <FloorPanel />
      <TowerPanel />
      <EventsEditor />
      <ColorPanel />
      <CodeEditor />
      <FunctionsPanel />
      <CommonEventPanel />
      <PluginPanel />
      <MapEditor />
    </div>
  );
}

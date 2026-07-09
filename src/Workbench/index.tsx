import type { FC } from "react";
import { PanelSlot } from "./components/PanelSlot";
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
import { ContentBoundary } from "@/components/ContentBoundary";

export const Workbench: FC = () => {
  return (
    <ContentBoundary>
      <div className="main">
        <PanelSlot panelId="map">
          <MapPanel />
        </PanelSlot>
        <PanelSlot panelId="appendpic">
          <AppendPicPanel />
        </PanelSlot>
        <PanelSlot panelId="loc">
          <LocPanel />
        </PanelSlot>
        <PanelSlot panelId="enemyitem">
          <PrefabPanel />
        </PanelSlot>
        <PanelSlot panelId="floor">
          <FloorPanel />
        </PanelSlot>
        <PanelSlot panelId="tower">
          <TowerPanel />
        </PanelSlot>
        <EventsEditor />
        <ColorPanel />
        <CodeEditor />
        <PanelSlot panelId="functions">
          <FunctionsPanel />
        </PanelSlot>
        <PanelSlot panelId="commonevent">
          <CommonEventPanel />
        </PanelSlot>
        <PanelSlot panelId="plugins">
          <PluginPanel />
        </PanelSlot>
        <MapEditor />
      </div>
    </ContentBoundary>
  );
}

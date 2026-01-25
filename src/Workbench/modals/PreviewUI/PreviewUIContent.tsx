import type { FC } from "react";
import { useCurrentFloorId } from "@/stores/editorState";
import { useCanvasDrawing } from "../shared/useCanvasDrawing";
import type { UIData } from "../shared/types";

interface PreviewUIContentProps {
  list: UIData[];
  background: string;
}

export const PreviewUIContent: FC<PreviewUIContentProps> = ({ list, background }) => {
  const storeFloorId = useCurrentFloorId();

  useCanvasDrawing(() => {
    core.setAlpha("uievent", 1);
    core.clearMap("uievent");
    core.setFilter("uievent", null);

    if (background === "thumbnail") {
      core.drawThumbnail(storeFloorId || core.status.floorId, null, { ctx: "uievent" });
    } else {
      core.fillRect("uievent", 0, 0, core.__PIXELS__, core.__PIXELS__, background);
    }

    if (!Array.isArray(list)) return;
    list.forEach((raw) => {
      let data: UIData = raw;
      if (typeof data === "string") {
        data = { type: "text", text: data };
      }
      if (typeof data !== "object" || data === null) return;
      const type = (data as { type?: string }).type;
      if (type === "text") {
        (data as Record<string, unknown>).ctx = "uievent";
        core.saveCanvas("uievent");
        core.drawTextBox((data as { text: string }).text, data);
        core.loadCanvas("uievent");
        return;
      }
      if (type === "choices") {
        const choices = (data as { choices: Array<string | Record<string, unknown>> }).choices || [];
        choices.forEach((choice, index) => {
          if (typeof choice === "string") {
            choices[index] = { text: choice };
          }
          if (typeof choices[index] === "object") {
            (choices[index] as { text?: string }).text = core.replaceText(
              (choices[index] as { text?: string }).text || "",
            );
          }
        });
        core.saveCanvas("uievent");
        core.status.event.selection = (data as { selected?: number }).selected || 0;
        core.drawChoices(
          core.replaceText((data as { text: string }).text),
          choices,
          (data as { width?: number }).width,
          "uievent",
        );
        core.status.event.selection = null;
        core.loadCanvas("uievent");
        return;
      }
      if (type === "confirm") {
        core.saveCanvas("uievent");
        core.drawConfirmBox((data as { text: string }).text, null, null, "uievent");
        core.loadCanvas("uievent");
        return;
      }
      const customDrawer = core.ui[`_uievent_${type || ""}`];
      if (customDrawer) {
        customDrawer(data);
      }
    });
  }, [background, list, storeFloorId]);

  return (
    <>
      <canvas className="gameCanvas" id="uievent" />
      <div id="uieventExtraBody" style={{ display: "none", marginTop: "-10px" }} />
    </>
  );
};

import { useEffect, type FC, type ReactNode } from "react";
import { useEditorInitialized } from "@/stores/EditorStore";
import { useSelectFloorModal } from "./SelectFloor";
import { useCheckboxSetModal } from "./CheckboxSet";
import { usePreviewUIModal } from "./PreviewUI";
import { useSearchFlagsModal } from "./SearchFlags";
import { useStatusBarPreviewModal } from "./StatusBarPreview";
import { useSelectMaterialModal } from "./SelectMaterial";
import { useSelectPointModal } from "./SelectPoint";

interface ModalsProviderProps {
  children?: ReactNode;
}

export const ModalsProvider: FC<ModalsProviderProps> = ({ children }) => {
  const [, selectFloorHolder] = useSelectFloorModal();
  const [, checkboxSetHolder] = useCheckboxSetModal();
  const [, previewUIHolder] = usePreviewUIModal();
  const [, searchFlagsHolder] = useSearchFlagsModal();
  const [, statusBarPreviewHolder] = useStatusBarPreviewModal();
  const [, selectMaterialHolder] = useSelectMaterialModal();
  const [, selectPointHolder] = useSelectPointModal();

  // Register isOpen getter
  useEditorInitialized(() => {
    editor.uievent = editor.uievent || {};
    Object.defineProperty(editor.uievent, "isOpen", {
      get() {
        // Check if any modal is open by checking DOM
        const uieventDiv = document.getElementById("uieventDiv");
        return uieventDiv?.style.display === "block";
      },
      configurable: true,
    });
  });

  return (
    <>
      {children}
      {selectFloorHolder}
      {checkboxSetHolder}
      {previewUIHolder}
      {searchFlagsHolder}
      {statusBarPreviewHolder}
      {selectMaterialHolder}
      {selectPointHolder}
    </>
  );
};

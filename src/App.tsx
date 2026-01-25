import { useEffect, type FC } from "react";
import { setupEditor } from "./setupEditor";
import { Workbench } from "./Workbench";
import { ModalsProvider } from "./Workbench/modals";
import { EditorStore } from "./stores/EditorStore";
import { editorHandler } from "./fs/EditorHandler";

const App: FC = () => {

  const { setEditorInitialized } = EditorStore.useStore();

  useEffect(() => {
    setupEditor().then(() => {
      editorHandler.markReady();
      setEditorInitialized(true);
    });
  }, []);

  return (
    <>
      <link id="color_css" rel="stylesheet" />

      <Workbench />
      {/* <script>/* */}
      <div id="gameInject" style={{ display: "none" }} />
      <ModalsProvider />
    </>
  );
}

export default App;

import { useEffect, type FC } from "react";
import { Workbench } from "./Workbench";
import { ModalsProvider } from "./Workbench/modals";
import { EditorStore } from "./stores/EditorStore";
import { editorHandler } from "./fs/EditorHandler";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

const App: FC = () => {

  const { setEditorInitialized, theme } = EditorStore.useStore();

  useEffect(() => {
    // Modern editor startup is independent from the legacy game runtime.
    editorHandler.markReady();
    setEditorInitialized(true);
  }, [setEditorInitialized]);

  // 响应主题变化，更新 CSS 链接
  useEffect(() => {
    const colorCss = document.getElementById("color_css") as HTMLLinkElement | null;
    if (colorCss) {
      colorCss.href = `./theme/${theme}.css`;
    }
  }, [theme]);

  return (
    <>
      <link id="color_css" rel="stylesheet" />

      <AppErrorBoundary>
        <Workbench />
      </AppErrorBoundary>
      {/* <script>/* */}
      <div id="gameInject" style={{ display: "none" }} />
      <ModalsProvider />
    </>
  );
}

export default App;

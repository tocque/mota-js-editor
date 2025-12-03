import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { EditorStore } from './stores/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EditorStore>
      <App />
    </EditorStore>
  </StrictMode>,
);

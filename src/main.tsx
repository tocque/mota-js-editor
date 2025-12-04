import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { GlobalStore } from './stores/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStore>
      <App />
    </GlobalStore>
  </StrictMode>,
);

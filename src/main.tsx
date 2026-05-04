import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import { GlobalStore } from './stores/index.ts';
import { queryClient } from './queryClient.ts';
import "@/css/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStore>
        <App />
      </GlobalStore>
    </QueryClientProvider>
  </StrictMode>,
);

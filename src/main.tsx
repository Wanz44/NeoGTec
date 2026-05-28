import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './frontend/App.tsx';
import './frontend/index.css';
import { LanguageProvider } from './frontend/lib/LanguageContext.tsx';
import { AppProvider } from './frontend/lib/AppContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LanguageProvider>
  </StrictMode>,
);

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './frontend/App.tsx';
import './frontend/index.css';
import { LanguageProvider } from './frontend/lib/LanguageContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

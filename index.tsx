import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { SettingsProvider } from './src/context/PrayerContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocaleProvider } from './src/context/LocaleContext';
import * as serviceWorkerRegistration from './src/serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <LocaleProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </LocaleProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

// Register the service worker to enable PWA features
serviceWorkerRegistration.register();
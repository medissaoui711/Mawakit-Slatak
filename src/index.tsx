import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// تسجيل Service Worker للعمل دون اتصال ودعم الإشعارات
// الآن يمكن تفعيله بأمان للنشر على Vercel
serviceWorkerRegistration.register({
  onSuccess: () => console.log('SW Registered: App is offline-ready'),
  onUpdate: () => console.log('SW Updated: New content available')
});
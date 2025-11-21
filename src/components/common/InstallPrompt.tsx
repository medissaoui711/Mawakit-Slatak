
import React from 'react';
import { Download, X } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

const InstallPrompt: React.FC = () => {
  const { isInstallable, promptInstall } = usePwaInstall();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isInstallable || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl text-red-600 dark:text-red-400">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">تثبيت التطبيق</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">للوصول السريع والعمل بدون إنترنت</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={promptInstall}
            className="bg-red-900 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform"
          >
            تثبيت
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

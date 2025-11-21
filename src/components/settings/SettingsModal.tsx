
import React from 'react';
import { X, Bell, Clock, Volume2, VolumeX } from 'lucide-react';
import { usePrayerData } from '../../context/PrayerContext';

const PRAYER_NAMES_AR: { [key: string]: string } = {
  Fajr: 'صلاة الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'صلاة الظهر / الجمعة',
  Asr: 'صلاة العصر',
  Maghrib: 'صلاة المغرب',
  Isha: 'صلاة العشاء',
};

const PRE_ADHAN_OPTIONS = [0, 5, 10, 15, 20, 30];

const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, setIsSettingsOpen, 
    settings, updateGlobalEnabled, updatePrayerSetting,
    notificationsEnabled, requestPermission
  } = usePrayerData();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-red-900 dark:bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bell className="text-yellow-400" size={20} />
            <h2 className="text-lg font-bold">إعدادات التنبيهات</h2>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          
          {/* Browser Permission Status */}
          {!notificationsEnabled && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg flex items-center justify-between text-sm">
              <span>يجب السماح بالإشعارات من المتصفح</span>
              <button 
                onClick={requestPermission}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                تفعيل
              </button>
            </div>
          )}

          {/* Global Toggle */}
          <div className="flex items-center justify-between mb-6 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-xl">
            <span className="font-bold text-gray-800 dark:text-gray-100">تفعيل التنبيهات</span>
            <button
              onClick={() => updateGlobalEnabled(!settings.globalEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                settings.globalEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.globalEnabled ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
          </div>

          {/* Prayers List */}
          <div className="space-y-3">
            {Object.keys(PRAYER_NAMES_AR).map((prayer) => {
              const setting = settings.prayers[prayer];
              const isEnabled = setting.enabled && settings.globalEnabled;

              return (
                <div 
                  key={prayer} 
                  className={`p-3 rounded-xl border transition-colors ${
                    isEnabled 
                      ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800' 
                      : 'border-transparent bg-gray-50 dark:bg-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                       <button
                         onClick={() => updatePrayerSetting(prayer, 'enabled', !setting.enabled)}
                         className={`p-2 rounded-full transition-colors ${
                            setting.enabled ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-400'
                         }`}
                       >
                         {setting.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                       </button>
                       <span className="font-medium text-gray-800 dark:text-gray-200">
                         {PRAYER_NAMES_AR[prayer]}
                       </span>
                    </div>
                  </div>

                  {/* Pre-Notification Select */}
                  {setting.enabled && (
                    <div className="mr-11 flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">التنبيه قبل:</span>
                      <select
                        value={setting.preAdhanMinutes}
                        onChange={(e) => updatePrayerSetting(prayer, 'preAdhanMinutes', Number(e.target.value))}
                        className="bg-gray-100 dark:bg-slate-700 border-none rounded-md text-gray-700 dark:text-gray-200 text-xs py-1 pr-6 pl-2 focus:ring-1 focus:ring-red-500 cursor-pointer"
                        dir="rtl"
                      >
                        {PRE_ADHAN_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>
                            {opt === 0 ? 'عند الأذان فقط' : `${opt} دقائق`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-center">
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="w-full py-2 bg-red-900 hover:bg-red-800 text-white rounded-lg font-medium transition-colors"
          >
            حفظ وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;


import React from 'react';
import { Settings, MapPin, ChevronDown, Calendar, Compass, Moon, Sun } from 'lucide-react';

// Contexts
import { PrayerProvider, usePrayerData } from './context/PrayerContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DeviceProvider } from './context/DeviceContext';

// Components
import PrayerCard from './components/PrayerCard';
import CountdownTimer from './components/CountdownTimer';
import StatusBanner from './components/common/StatusBanner';
import SettingsModal from './components/settings/SettingsModal';
import QiblaCompass from './components/QiblaCompass';
import InstallPrompt from './components/common/InstallPrompt';
import AudioPermissionModal from './components/common/AudioPermissionModal';
import RamadanImsakiya from './components/RamadanImsakiya';
import { Logo } from './components/common/Logo';

// Data & Utils
import { CITIES } from './constants/data';
import { useViewportHeight } from './hooks/useViewportHeight';
import { getArabicDateString } from './utils';

const AppLayout: React.FC = () => {
  const { 
    timings, loading, error,
    nextPrayer, nextPrayerEn, countdown, isUrgent,
    selectedCity, setSelectedCity,
    setIsSettingsOpen, iqamaSettings,
    isQiblaOpen, setIsQiblaOpen,
    settings: notifSettings, updateGlobalEnabled,
    audioUnlocked, enableAudio,
    hijriDate
  } = usePrayerData();

  const { isDark, toggleDarkMode } = useTheme();

  useViewportHeight();

  // التعامل مع تغيير المدينة
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = CITIES.find(c => c.apiName === e.target.value);
    if (city) setSelectedCity(city);
  };

  // تفعيل الصوت عند أول تفاعل
  const handleInteraction = () => {
    if (!audioUnlocked) enableAudio();
  };

  return (
    <div 
      className="w-full h-screen bg-red-600 dark:bg-slate-950 text-white font-tajawal flex flex-col overflow-hidden relative transition-colors duration-500"
      onClick={handleInteraction}
      style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <div className="absolute inset-x-0 top-0 z-50">
         <StatusBanner />
      </div>
      
      <SettingsModal />
      <QiblaCompass isOpen={isQiblaOpen} onClose={() => setIsQiblaOpen(false)} />
      <RamadanImsakiya isOpen={false} onClose={() => {}} />
      <InstallPrompt />
      <AudioPermissionModal />

      {/* --- Top Buttons (Absolute) --- */}
      <div className="absolute top-0 left-0 right-0 pt-safe-top px-6 flex justify-between items-center z-20 mt-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors text-white shadow-sm"
          >
            <Settings size={20} />
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors text-white shadow-sm"
          >
            {isDark ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} />}
          </button>
        </div>
        
         <button 
          onClick={() => setIsQiblaOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors text-white shadow-sm"
        >
           <Compass size={20} />
        </button>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-6 relative z-10 min-h-0 pt-14">
        
        {/* 1. Branding (More Compact) */}
        <div className="flex flex-col items-center justify-center mb-3 shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
          <Logo className="w-14 h-14 text-white drop-shadow-lg" />
          <h1 className="text-lg font-bold text-white tracking-wide mt-1 drop-shadow-md opacity-90">مواقيت تونس</h1>
        </div>

        {/* 2. Information Cards (Compact Height) */}
        <div className="w-full space-y-2 mb-2 shrink-0">
          
          {/* City Selector Card */}
          <div className="relative w-full bg-white/95 dark:bg-slate-900/90 backdrop-blur rounded-xl h-11 shadow-md flex items-center px-4 overflow-hidden group transition-transform active:scale-98 border border-transparent dark:border-slate-700">
             <MapPin className="text-red-600 dark:text-red-400 ml-2" size={18} />
             <select 
               value={selectedCity.apiName}
               onChange={handleCityChange}
               className="w-full h-full bg-transparent text-gray-800 dark:text-white font-bold text-base text-center appearance-none outline-none cursor-pointer dir-rtl z-10"
             >
               {CITIES.map(city => (
                 <option key={city.apiName} value={city.apiName} className="text-gray-900 dark:text-white dark:bg-slate-800">{city.nameAr}</option>
               ))}
             </select>
             <div className="absolute left-4 pointer-events-none text-gray-400">
               <ChevronDown size={16} />
             </div>
          </div>

          {/* Date Card */}
          <div className="w-full bg-white/95 dark:bg-slate-900/90 backdrop-blur rounded-xl h-12 shadow-md flex flex-col items-center justify-center text-gray-800 dark:text-white border border-transparent dark:border-slate-700">
             <span className="font-bold text-sm text-gray-900 dark:text-white">
               {getArabicDateString(new Date())}
             </span>
             <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
               <Calendar size={10} />
               <span>{timings ? hijriDate : '...'}</span>
             </div>
          </div>
        </div>

        {/* 3. Notification Toggle */}
        <div className="w-full flex items-center justify-center mb-1 shrink-0">
            <button 
              onClick={(e) => {
                  e.stopPropagation();
                  updateGlobalEnabled(!notifSettings.globalEnabled);
              }}
              className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm hover:bg-black/30 transition-colors border border-white/10"
            >
              <span className="text-xs font-medium text-white/90">التنبيهات</span>
              <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-300 flex items-center ${notifSettings.globalEnabled ? 'bg-green-400' : 'bg-white/30'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notifSettings.globalEnabled ? '-translate-x-3' : 'translate-x-0'}`} />
              </div>
            </button>
        </div>

        {/* 4. Hero Countdown (Flex-1 to take prominent center space) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pb-4 min-h-0">
          {loading ? (
            <div className="animate-pulse text-white/60 text-lg">جاري التحميل...</div>
          ) : error ? (
            <div className="text-red-200 bg-red-900/50 px-4 py-2 rounded-lg text-sm text-center">{error}</div>
          ) : (
            <CountdownTimer 
              nextPrayerName={nextPrayer || ''} 
              countdown={countdown} 
              isUrgent={isUrgent} 
            />
          )}
        </div>

      </div>

      {/* --- Bottom Sheet (Reduced Height) --- */}
      <div className="bg-white dark:bg-slate-900 w-full rounded-t-[2rem] px-5 pt-6 pb-safe-area-pb shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-30 h-[38vh] flex flex-col shrink-0 relative transition-colors duration-500 border-t border-transparent dark:border-slate-800">
         {/* Handle Bar */}
         <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 dark:bg-slate-700 rounded-full opacity-60"></div>
         
         {/* Prayer Cards Grid */}
         <div className="grid grid-cols-3 grid-rows-2 gap-3 h-full pb-4">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-slate-800 rounded-xl animate-pulse h-full w-full" />
              ))
            ) : timings ? (
              <>
                <PrayerCard name="الفجر" time={timings.Fajr} iqamaOffset={iqamaSettings.Fajr} isNext={nextPrayerEn === 'Fajr'} />
                <PrayerCard name="الشروق" time={timings.Sunrise} iqamaOffset={0} isNext={nextPrayerEn === 'Sunrise'} />
                <PrayerCard name="الظهر" time={timings.Dhuhr} iqamaOffset={iqamaSettings.Dhuhr} isNext={nextPrayerEn === 'Dhuhr'} />
                <PrayerCard name="العصر" time={timings.Asr} iqamaOffset={iqamaSettings.Asr} isNext={nextPrayerEn === 'Asr'} />
                <PrayerCard name="المغرب" time={timings.Maghrib} iqamaOffset={iqamaSettings.Maghrib} isNext={nextPrayerEn === 'Maghrib'} />
                <PrayerCard name="العشاء" time={timings.Isha} iqamaOffset={iqamaSettings.Isha} isNext={nextPrayerEn === 'Isha'} />
              </>
            ) : null}
         </div>
         
         {/* Footer Decoration */}
          <div className="absolute bottom-safe-area-pb w-full left-0 text-center pb-2 pt-1 opacity-80">
            <div className="flex items-center justify-center gap-2 text-red-900/80 dark:text-red-200/80">
               <span className="text-lg">۞</span>
               <span className="font-quran text-sm">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا</span>
               <span className="text-lg">۞</span>
            </div>
          </div>
      </div>

    </div>
  );
};

const App: React.FC = () => {
  return (
    <DeviceProvider>
      <ThemeProvider>
        <PrayerProvider>
          <AppLayout />
        </PrayerProvider>
      </ThemeProvider>
    </DeviceProvider>
  );
};

export default App;

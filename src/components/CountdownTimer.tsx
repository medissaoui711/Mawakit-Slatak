
import React from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  nextPrayerName: string;
  countdown: string;
  isUrgent: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextPrayerName, countdown, isUrgent }) => {
  if (!nextPrayerName) return null;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 mx-auto shadow-xl
      transform transition-all duration-500 w-full max-w-md md:max-w-lg
      ${isUrgent 
        ? 'bg-gradient-to-br from-orange-600 via-red-600 to-red-700 animate-pulse ring-4 ring-red-300/30' 
        : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'
      }
    `}>
      {/* Background decorative elements - Scaled for mobile */}
      {!isUrgent && (
        <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-[0.03]">
          <Timer size={120} className="text-brand-light dark:text-white rotate-12" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className={`text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 ${isUrgent ? 'text-red-100' : 'text-gray-400 dark:text-gray-500'}`}>
          الصلاة القادمة
        </div>
        
        <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-3 ${isUrgent ? 'text-white' : 'text-brand-light dark:text-red-400'}`}>
          {nextPrayerName}
        </div>
        
        {/* Responsive Font Size for Timer Digits */}
        <div className={`
          text-4xl sm:text-5xl md:text-6xl font-mono font-bold tracking-wider dir-ltr leading-none
          ${isUrgent ? 'text-white drop-shadow-md' : 'text-gray-800 dark:text-white'}
        `}>
          {countdown}
        </div>

        {isUrgent && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
             <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span className="text-white text-xs sm:text-sm font-bold">اقترب وقت الأذان</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;

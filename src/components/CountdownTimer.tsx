
import React from 'react';

interface CountdownTimerProps {
  nextPrayerName: string;
  countdown: string;
  isUrgent: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextPrayerName, countdown, isUrgent }) => {
  if (!nextPrayerName) return null;

  return (
    <div className="flex flex-col items-center justify-center text-center w-full select-none animate-in zoom-in-90 duration-500">
      <div className="text-red-100/90 dark:text-slate-300 text-base sm:text-lg font-medium mb-1 sm:mb-2 drop-shadow-sm transition-colors">
        المتبقي لصلاة {nextPrayerName}
      </div>
      
      {/* Responsive large text */}
      <div className={`
        text-[5rem] xs:text-[5.5rem] sm:text-[6.5rem] font-bold text-white leading-[0.9] tracking-tighter dir-ltr font-sans
        ${isUrgent ? 'animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]' : 'drop-shadow-xl'}
      `}
      style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {countdown}
      </div>
      
      {isUrgent && (
        <div className="mt-4 text-white text-xs sm:text-sm font-bold bg-red-800/40 dark:bg-red-900/60 px-4 py-1.5 rounded-full border border-red-400/30 animate-bounce-subtle backdrop-blur-sm shadow-lg">
          اقترب وقت الأذان
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;

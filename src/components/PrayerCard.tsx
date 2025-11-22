
import React from 'react';
import { formatTime12Hour } from '../utils';

interface PrayerCardProps {
  name: string;
  time: string;
  iqamaOffset: number;
  isNext?: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, iqamaOffset, isNext }) => {
  const cleanTime = time.split(' ')[0];
  const formattedTime = formatTime12Hour(cleanTime);

  return (
    <div className={`
      flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-500 h-full
      ${isNext 
        ? 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-100 dark:ring-red-900/30 scale-[1.02] shadow-sm' 
        : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
      }
    `}>
      <span className={`text-xs font-bold mb-0.5 transition-colors ${isNext ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>
        {name}
      </span>
      
      <span className={`text-2xl sm:text-3xl font-bold font-sans dir-ltr leading-none tracking-tight transition-colors ${isNext ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
        {formattedTime}
      </span>
      
      {iqamaOffset > 0 && (
        <span className={`text-[9px] mt-1 font-bold px-1.5 py-0.5 rounded-md transition-colors ${isNext ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500'}`}>
           +{iqamaOffset}
        </span>
      )}
    </div>
  );
};

export default PrayerCard;

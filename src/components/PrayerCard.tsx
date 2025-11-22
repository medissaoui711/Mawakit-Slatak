
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
        ? 'bg-red-50 ring-1 ring-red-100 scale-[1.02] shadow-sm' 
        : 'hover:bg-gray-50'
      }
    `}>
      <span className={`text-xs font-bold mb-0.5 transition-colors ${isNext ? 'text-red-600' : 'text-gray-400'}`}>
        {name}
      </span>
      
      <span className={`text-2xl sm:text-3xl font-bold font-sans dir-ltr leading-none tracking-tight transition-colors ${isNext ? 'text-gray-900' : 'text-gray-700'}`}>
        {formattedTime}
      </span>
      
      {iqamaOffset > 0 && (
        <span className={`text-[9px] mt-1 font-bold px-1.5 py-0.5 rounded-md transition-colors ${isNext ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
           +{iqamaOffset}
        </span>
      )}
    </div>
  );
};

export default PrayerCard;


import React from 'react';
import { formatTime12Hour } from '../utils';
import { useDevice } from '../context/DeviceContext';
import Tooltip from './common/Tooltip';

interface PrayerCardProps {
  name: string;
  time: string;
  iqamaOffset: string;
  isNext?: boolean;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, iqamaOffset, isNext }) => {
  const cleanTime = time.split(' ')[0];
  const formattedTime = formatTime12Hour(cleanTime);
  const { connectionQuality, inputType } = useDevice();

  const content = (
    <div className="cq-container h-full w-full group cursor-default">
      <div className={`
        cq-card-content
        relative flex flex-col items-center justify-center 
        p-3 transition-all duration-300 h-full w-full
        touch-manipulation select-none
        rounded-xl overflow-hidden
        ${isNext 
          ? 'bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-slate-900/50 shadow-md ring-1 ring-red-100 dark:ring-red-900/30' 
          : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750'
        }
        ${connectionQuality === 'good' && isNext ? 'shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]' : ''}
        ${inputType === 'mouse' ? 'hover:-translate-y-1 hover:shadow-xl' : ''}
      `}>
        
        {/* Next Indicator */}
        {isNext && (
          <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
        )}

        {/* Background Icon (Faint) */}
        <div className="absolute right-2 bottom-2 opacity-[0.03] dark:opacity-[0.05] transform rotate-12 scale-150 pointer-events-none">
           {/* Could dynamically add icon based on prayer name */}
           <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
        </div>

        <span className={`
          cq-label-text
          font-bold mb-1 transition-colors whitespace-nowrap z-10
          ${isNext ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
        `} style={{ fontSize: 'var(--text-fluid-base)' }}>
          {name}
        </span>
        
        <span className={`
          cq-time-text
          font-bold mb-1 dir-ltr font-sans tracking-tight z-10
          ${isNext ? 'text-gray-900 dark:text-white scale-110 font-extrabold' : 'text-gray-800 dark:text-gray-100'}
          transition-transform duration-300
        `} style={{ fontSize: 'var(--text-fluid-lg)' }}>
          {formattedTime}
        </span>
        
        <div className={`
          cq-iqama-badge
          flex items-center justify-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full dir-ltr z-10
          ${isNext ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}
        `}>
          <span>+{iqamaOffset.replace('+', '')}</span>
          <span className="opacity-70">min</span>
        </div>
      </div>
    </div>
  );

  // On desktop, wrap in tooltip showing full prayer info or Iqama time detail
  if (inputType === 'mouse') {
    return (
      <Tooltip content={`الإقامة بعد ${iqamaOffset} دقيقة`}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default PrayerCard;

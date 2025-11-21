
import React from 'react';
import { PrayerTimings } from '../../types';
import { Sun, Moon } from 'lucide-react';

interface DayTimelineProps {
  timings: PrayerTimings;
}

const DayTimeline: React.FC<DayTimelineProps> = ({ timings }) => {
  // Helper to convert time string to percentage (0-24h)
  const timeToPercent = (time: string) => {
    const [h, m] = time.split(' ')[0].split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  };

  const now = new Date();
  const currentPercent = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;

  const prayers = [
    { key: 'Fajr', label: 'الفجر', icon: Moon },
    { key: 'Sunrise', label: 'الشروق', icon: Sun },
    { key: 'Dhuhr', label: 'الظهر', icon: Sun },
    { key: 'Asr', label: 'العصر', icon: Sun },
    { key: 'Maghrib', label: 'المغرب', icon: Moon },
    { key: 'Isha', label: 'العشاء', icon: Moon },
  ];
  
  return (
    <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-slate-700 mb-6 animate-in fade-in zoom-in-95 duration-700 delay-150">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          مسار اليوم
        </h3>
        <span className="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">24 ساعة</span>
      </div>
      
      <div className="relative h-16 w-full select-none" dir="ltr">
        {/* Background Track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
           {/* Night/Day shading */}
           <div 
             className="absolute h-full bg-indigo-900/20 dark:bg-indigo-500/20" 
             style={{ width: `${timeToPercent(timings.Sunrise)}%`, left: 0 }} 
           />
           <div 
             className="absolute h-full bg-orange-400/20 dark:bg-orange-500/10" 
             style={{ left: `${timeToPercent(timings.Sunrise)}%`, right: `${100 - timeToPercent(timings.Maghrib)}%` }} 
           />
           <div 
             className="absolute h-full bg-indigo-900/20 dark:bg-indigo-500/20" 
             style={{ left: `${timeToPercent(timings.Maghrib)}%`, right: 0 }} 
           />
        </div>

        {/* Current Time Indicator */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 z-30 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-1000 ease-out"
          style={{ left: `${currentPercent}%` }}
        >
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
             الآن
           </div>
        </div>

        {/* Prayer Markers */}
        {prayers.map((p) => {
            const percent = timeToPercent(timings[p.key as keyof PrayerTimings]);
            return (
                <div 
                    key={p.key}
                    className="absolute top-1/2 -translate-y-1/2 -ml-3 group cursor-help z-20"
                    style={{ left: `${percent}%` }}
                >
                    <div className="w-6 h-6 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-md hover:scale-125 transition-transform">
                        {/* Dot */}
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-gray-200 dark:border-b-slate-600 mb-1"></div>
                      <span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded shadow-sm">{p.label}</span>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default DayTimeline;


import React from 'react';
import { CalendarData } from '../../types';
import { formatTime12Hour } from '../../utils';

interface WeeklyScheduleProps {
  schedule: CalendarData[];
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  const todayDateStr = new Date().getDate().toString();
  
  // Find today in schedule (API returns gregorian date as DD-MM-YYYY)
  const todayIndex = schedule.findIndex(d => parseInt(d.date.gregorian.date.split('-')[0]) === new Date().getDate());
  const startIndex = todayIndex !== -1 ? Math.max(0, todayIndex) : 0;
  
  // Show next 5 days
  const weekData = schedule.slice(startIndex, startIndex + 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-5 border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-red-600 rounded-full"></span>
        الجدول القادم
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="text-gray-500 dark:text-gray-400 font-medium border-b dark:border-slate-700/50">
            <tr>
              <th className="pb-3 text-right px-2">اليوم</th>
              <th className="pb-3">الفجر</th>
              <th className="pb-3">الظهر</th>
              <th className="pb-3">العصر</th>
              <th className="pb-3">المغرب</th>
              <th className="pb-3">العشاء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-5 dark:divide-slate-700/50">
            {weekData.map((day, idx) => (
              <tr 
                key={idx} 
                className={`
                  transition-colors duration-200 group
                  ${idx === 0 ? 'bg-red-50/80 dark:bg-red-900/20 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}
                `}
              >
                <td className="py-4 px-2 text-right whitespace-nowrap text-gray-800 dark:text-gray-200 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                  <div className="flex flex-col">
                    <span>{day.date.hijri.weekday.ar}</span>
                    <span className="text-[10px] opacity-60">{day.date.gregorian.date}</span>
                  </div>
                </td>
                <td className="py-4 px-1 text-gray-600 dark:text-gray-300">{formatTime12Hour(day.timings.Fajr.split(' ')[0])}</td>
                <td className="py-4 px-1 text-gray-600 dark:text-gray-300">{formatTime12Hour(day.timings.Dhuhr.split(' ')[0])}</td>
                <td className="py-4 px-1 text-gray-600 dark:text-gray-300">{formatTime12Hour(day.timings.Asr.split(' ')[0])}</td>
                <td className="py-4 px-1 text-gray-600 dark:text-gray-300">{formatTime12Hour(day.timings.Maghrib.split(' ')[0])}</td>
                <td className="py-4 px-1 text-gray-600 dark:text-gray-300">{formatTime12Hour(day.timings.Isha.split(' ')[0])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedule;

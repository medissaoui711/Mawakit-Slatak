
import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { usePrayerData } from '../../context/PrayerContext';

const StatusBanner: React.FC = () => {
  const { isOffline, isStale } = usePrayerData();

  if (!isOffline && !isStale) return null;

  return (
    <div className={`w-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 text-white ${isOffline ? 'bg-red-600' : 'bg-yellow-600'}`}>
      {isOffline ? <WifiOff size={16} /> : <AlertTriangle size={16} />}
      <span>
        {isOffline 
          ? 'لا يوجد اتصال بالإنترنت. يتم عرض البيانات المحفوظة.' 
          : 'يتم عرض بيانات مخزنة مؤقتاً. جاري محاولة التحديث...'}
      </span>
    </div>
  );
};

export default StatusBanner;

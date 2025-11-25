import React from 'react';
import { PrayerTimings } from '../types';
import { useLocale } from '../context/LocaleContext';

interface PrayerCardProps {
  name: string;
  time: string;
  isNext: boolean;
  isRamadan: boolean;
  prayerKey: keyof PrayerTimings;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, isNext, isRamadan, prayerKey }) => {
  const { locale } = useLocale();

  const formatTimeForLocale = (timeStr: string) => {
    // Only format for Arabic and if it's a valid time string
    if (locale === 'ar' && /^\d{2}:\d{2}$/.test(timeStr)) {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
      // Use Intl.DateTimeFormat to get locale-specific numerals for the time
      return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false // Keep 24h format for consistency
      }).format(date);
    }
    return timeStr;
  };

  const isIftarCard = isRamadan && prayerKey === 'Maghrib';
  
  return (
    <div className={`prayer-card ${isNext ? 'next-prayer' : ''} ${isIftarCard ? 'iftar-card' : ''}`}>
      <h3 className="prayer-card-name">{name}</h3>
      <p className="prayer-card-time">{formatTimeForLocale(time)}</p>
    </div>
  );
};

export default PrayerCard;
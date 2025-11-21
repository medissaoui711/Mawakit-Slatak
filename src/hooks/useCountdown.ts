
import { useState, useEffect } from 'react';
import { PrayerTimings } from '../types';

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const ARABIC_NAMES: {[key: string]: string} = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export const useCountdown = (timings: PrayerTimings | null) => {
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [nextPrayerEn, setNextPrayerEn] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>('--:--:--');
  const [isUrgent, setIsUrgent] = useState<boolean>(false); // true إذا بقي أقل من 15 دقيقة

  useEffect(() => {
    if (!timings) return;

    const calculateCountdown = () => {
      const now = new Date();
      let upcomingPrayer = null;
      let minDiff = Infinity;

      // 1. البحث عن الصلاة القادمة في نفس اليوم
      for (const prayer of PRAYER_ORDER) {
        const timeStr = timings[prayer].split(' ')[0];
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        
        const diff = prayerDate.getTime() - now.getTime();

        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          upcomingPrayer = prayer;
        }
      }

      // 2. إذا لم توجد صلاة متبقية اليوم، فالقادمة هي فجر الغد
      if (!upcomingPrayer) {
        upcomingPrayer = 'Fajr';
        const timeStr = timings['Fajr'].split(' ')[0];
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);
        
        minDiff = tomorrow.getTime() - now.getTime();
      }

      // 3. الحسابات
      const totalSeconds = Math.floor(minDiff / 1000);
      const hours = Math.floor((minDiff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((minDiff / (1000 * 60)) % 60);
      const secs = Math.floor((minDiff / 1000) % 60);

      setNextPrayer(ARABIC_NAMES[upcomingPrayer] || upcomingPrayer);
      setNextPrayerEn(upcomingPrayer);
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
      
      // يعتبر الوقت "ملحاً" إذا بقي أقل من 15 دقيقة (900 ثانية)
      setIsUrgent(totalSeconds < 900 && totalSeconds > 0);
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  return { nextPrayer, nextPrayerEn, countdown, isUrgent };
};

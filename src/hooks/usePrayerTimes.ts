import { useState, useEffect, useRef } from 'react';
import { DailyPrayerData, PrayerTimings, Settings } from '../types';
import { useSettings } from '../context/PrayerContext';
import { fetchPrayerTimesByCoords, fetchPrayerTimesByCity } from '../utils';
import { useTranslation } from '../context/LocaleContext';
import audioManager from '../utils/audioManager';
import { muezzins } from '../constants/data';

// Prayer order for logical checking, including Sunrise for accurate period tracking
const PRAYER_ORDER: (keyof PrayerTimings)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
// Prayers that have an Iqama countdown
export const PRAYERS_WITH_ADHAN: (keyof Settings['adhanFor'])[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];


export const usePrayerTimes = () => {
  const { settings } = useSettings();
  const [monthlyData, setMonthlyData] = useState<DailyPrayerData[] | null>(null);
  const [dailyData, setDailyData] = useState<DailyPrayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; countdown: string } | null>(null);
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState<{ name: string; } | null>(null);
  const [iqamaCountdown, setIqamaCountdown] = useState<string | null>(null);
  
  const [isRamadan, setIsRamadan] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { t } = useTranslation();
  const iqamaIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    const fetchTimes = async () => {
      if (!settings.location) {
        setError(t('error_location_not_set'));
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setDailyData(null);
      setMonthlyData(null);
      setIsRamadan(false);

      try {
        const { location, calculationMethod, asrMethod } = settings;
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const data = location.latitude 
          ? await fetchPrayerTimesByCoords(location.latitude, location.longitude, calculationMethod, asrMethod, month, year)
          : await fetchPrayerTimesByCity(location.city, location.country, calculationMethod, asrMethod, month, year);
        
        setMonthlyData(data);

        const today = new Date();
        if (currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) {
            const todaysData = data.find(d => Number(d.date.gregorian.day) === today.getDate());
            if (todaysData) {
                setDailyData(todaysData);
                setIsRamadan(todaysData.date.hijri.month.number === 9);
            } else {
                 setError(t('error_find_times_today'));
            }
        } else {
            setDailyData(data[0]);
        }
      } catch (err: any) {
        setError(err.message || t('error_unknown_fetching'));
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [settings.location, settings.calculationMethod, settings.asrMethod, currentDate, t]);

  useEffect(() => {
    if (!dailyData || new Date().getDate() !== Number(dailyData.date.gregorian.day)) {
        setNextPrayerInfo(null);
        setCurrentPrayerInfo(null);
        return;
    };
    
    const timings = dailyData.timings;
    const todayStr = new Date().toISOString().split('T')[0];

    const mainIntervalId = setInterval(() => {
      // If an iqama countdown is active, don't calculate the next prayer.
      if (iqamaIntervalRef.current) {
        setNextPrayerInfo(null);
        return;
      };

      const now = new Date();
      let nextPrayerName: keyof PrayerTimings | null = null;
      let nextPrayerTime: Date | null = null;
      let currentPrayerName: keyof PrayerTimings | null = null;
      
      const prayerOrderToCheck: (keyof PrayerTimings)[] = isRamadan
        ? ['Imsak', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        : PRAYER_ORDER;

      // Check for current and next prayer
      for (const prayerName of prayerOrderToCheck) {
        const prayerTimeStr = timings[prayerName];
        if (!prayerTimeStr) continue;
        const prayerDateTime = new Date(`${todayStr}T${String(prayerTimeStr).split(' ')[0]}:00`);
        
        if (prayerDateTime > now) {
          if (!nextPrayerName) {
            nextPrayerName = prayerName;
            nextPrayerTime = prayerDateTime;
          }
        } else {
          currentPrayerName = prayerName;
        }
      }
      
      // Handle the transition to Iqama countdown
      if (
        currentPrayerName &&
        PRAYERS_WITH_ADHAN.includes(currentPrayerName as keyof Settings['adhanFor']) && // It's a prayer with Adhan/Iqama
        currentPrayerInfo?.name !== currentPrayerName // It's a new prayer
      ) {
         const prayerTimeStr = timings[currentPrayerName as keyof PrayerTimings];
         const prayerStartTime = new Date(`${todayStr}T${String(prayerTimeStr).split(' ')[0]}:00`);
         const iqamaEndTime = new Date(prayerStartTime.getTime() + settings.iqamaTime * 60000);
         
         // Only trigger if we are still within the Iqama window to avoid re-triggering
         if (now < iqamaEndTime) {
            setCurrentPrayerInfo({ name: currentPrayerName });
            setNextPrayerInfo(null); // Stop next prayer countdown

            // Play Adhan sound if enabled for this specific prayer
            const prayerKey = currentPrayerName as keyof Settings['adhanFor'];
            if(settings.adhanFor[prayerKey] && settings.adhanMode !== 'silent') {
                const selectedMuezzin = muezzins.find(m => m.id === settings.muezzin);
                if (selectedMuezzin) {
                    const audioUrl = selectedMuezzin.files[settings.adhanMode];
                    if (audioUrl) {
                      audioManager.play(audioUrl);
                    }
                }
            }
         }
      }


      // If after Isha, next prayer is Fajr (or Imsak) of the next day
      if (!nextPrayerTime) {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const nextPrayerOnDeck: keyof PrayerTimings = isRamadan ? 'Imsak' : 'Fajr';
        nextPrayerName = nextPrayerOnDeck;
        nextPrayerTime = new Date(`${tomorrowStr}T${String(timings[nextPrayerOnDeck]).split(' ')[0]}:00`);
      }

      if (nextPrayerName && nextPrayerTime) {
        const diff = nextPrayerTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setNextPrayerInfo({
          name: String(nextPrayerName),
          countdown: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        });
      } else {
        setNextPrayerInfo(null);
      }
    }, 1000);

    return () => clearInterval(mainIntervalId);
  }, [dailyData, settings, currentPrayerInfo, isRamadan]); // Simplified dependencies


  useEffect(() => {
    // If there's no current prayer or no daily data, do nothing and ensure any existing timer is cleaned up.
    if (!currentPrayerInfo || !dailyData) {
      return;
    }

    const prayerTimeStr = dailyData.timings[currentPrayerInfo.name as keyof PrayerTimings];
    const todayStr = new Date().toISOString().split('T')[0];
    const prayerStartTime = new Date(`${todayStr}T${String(prayerTimeStr).split(' ')[0]}:00`);
    const iqamaEndTime = new Date(prayerStartTime.getTime() + settings.iqamaTime * 60000);
    
    const intervalId = setInterval(() => {
        const now = new Date();
        const diff = iqamaEndTime.getTime() - now.getTime();

        if (diff > 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setIqamaCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        } else {
            // Timer finished, clear state, which will trigger this effect's cleanup
            setCurrentPrayerInfo(null);
            setIqamaCountdown(null);
        }
    }, 1000);
    
    iqamaIntervalRef.current = intervalId;

    // Cleanup function: This is crucial. It runs when the component unmounts
    // or when any dependency in the dependency array changes.
    return () => {
      clearInterval(intervalId);
      iqamaIntervalRef.current = null;
    };
  }, [currentPrayerInfo, dailyData, settings.iqamaTime]);
  
  const changeMonth = (offset: number) => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setDate(1);
          newDate.setMonth(prev.getMonth() + offset);
          return newDate;
      });
  };

  return { dailyData, monthlyData, loading, error, nextPrayerInfo, currentPrayerInfo, iqamaCountdown, isRamadan, currentDate, changeMonth };
};
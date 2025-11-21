
import { useState, useEffect, useCallback } from 'react';
import { AlAdhanResponse, PrayerTimings, CityOption } from '../types';
import { cacheUtils } from '../utils/cache';

const CACHE_KEY_PREFIX = 'mawakit_tn_v2_';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 ساعة صلاحية للكاش

// ذاكرة مؤقتة على مستوى التطبيق (In-Memory Cache) لتجنب الطلبات المتكررة في نفس الجلسة
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export const usePrayerTimes = (selectedCity: CityOption) => {
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [isStale, setIsStale] = useState<boolean>(false);

  const fetchTimings = useCallback(async (forceUpdate = false) => {
    const todayDate = new Date().toISOString().split('T')[0];
    const cacheKey = `${CACHE_KEY_PREFIX}${selectedCity.apiName}_${todayDate}`;
    
    setLoading(true);
    setError(null);

    // 1. التحقق من الذاكرة الحية (Memory Cache) أولاً - الأسرع
    if (!forceUpdate && memoryCache.has(cacheKey)) {
      const cached = memoryCache.get(cacheKey);
      if (cached) {
        setTimings(cached.data.timings);
        setHijriDate(cached.data.hijriDate);
        setLoading(false);
        setIsStale(false);
        return;
      }
    }

    // 2. التحقق من التخزين المحلي (LocalStorage)
    const localCachedData = cacheUtils.get<{ timings: PrayerTimings; hijriDate: string }>(cacheKey);
    
    if (!forceUpdate && localCachedData) {
      setTimings(localCachedData.timings);
      setHijriDate(localCachedData.hijriDate);
      setLoading(false);
      setIsStale(false);
      
      // تحديث الذاكرة الحية
      memoryCache.set(cacheKey, { data: localCachedData, timestamp: Date.now() });
      return; 
    }

    // إذا كنا غير متصلين بالإنترنت، نحاول جلب بيانات قديمة (Stale)
    if (!navigator.onLine) {
      const staleData = cacheUtils.getStale<{ timings: PrayerTimings; hijriDate: string }>(cacheKey);
      if (staleData) {
        setTimings(staleData.timings);
        setHijriDate(staleData.hijriDate);
        setIsStale(true); // تنبيه أن البيانات قديمة
        setLoading(false);
        return;
      }
    }

    // 3. طلب البيانات من الشبكة
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.apiName}&country=Tunisia&method=2`
      );
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data: AlAdhanResponse = await response.json();
      
      if (data.code === 200) {
        const fetchedTimings = data.data.timings;
        const h = data.data.date.hijri;
        const fetchedHijri = `${h.day} ${h.month.ar} ${h.year} هـ`;
        const resultData = { timings: fetchedTimings, hijriDate: fetchedHijri };

        setTimings(fetchedTimings);
        setHijriDate(fetchedHijri);
        setIsStale(false);
        setIsOffline(false);

        // حفظ في الكاش (محلي + ذاكرة)
        cacheUtils.set(cacheKey, resultData, CACHE_TTL);
        memoryCache.set(cacheKey, { data: resultData, timestamp: Date.now() });
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      console.error(err);
      // في حالة فشل الشبكة، نحاول استرجاع أي بيانات قديمة كخطة طوارئ
      const staleFallback = cacheUtils.getStale<{ timings: PrayerTimings; hijriDate: string }>(cacheKey);
      if (staleFallback) {
        setTimings(staleFallback.timings);
        setHijriDate(staleFallback.hijriDate);
        setIsStale(true);
        setError(null); // لا نعرض خطأ إذا استطعنا عرض بيانات قديمة
      } else {
        setError('تعذر الاتصال بالخادم. يرجى التحقق من الإنترنت.');
        setIsOffline(true);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  // التأثيرات الجانبية (Event Listeners)
  useEffect(() => {
    fetchTimings();

    const handleOnline = () => {
      setIsOffline(false);
      fetchTimings(true); // تحديث اجباري عند عودة النت
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchTimings]);

  return { timings, hijriDate, loading, error, isOffline, isStale, refetch: () => fetchTimings(true) };
};

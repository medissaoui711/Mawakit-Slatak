
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 ساعة افتراضياً

export const cacheUtils = {
  set: <T>(key: string, data: T, ttl: number = DEFAULT_TTL): void => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
      // يمكن هنا التعامل مع خطأ QuotaExceededError بتنظيف الكاش القديم
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const entry: CacheEntry<T> = JSON.parse(itemStr);
      const now = Date.now();

      // التحقق من الصلاحية
      if (now > entry.expiry) {
        localStorage.removeItem(key);
        return null; // البيانات منتهية الصلاحية
      }

      return entry.data;
    } catch (e) {
      console.error('Error parsing cache', e);
      return null;
    }
  },

  // استرجاع البيانات حتى لو كانت منتهية الصلاحية (للاستخدام عند انقطاع النت)
  getStale: <T>(key: string): T | null => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      const entry: CacheEntry<T> = JSON.parse(itemStr);
      return entry.data;
    } catch (e) {
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  }
};

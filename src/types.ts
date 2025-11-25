export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface HijriDateInfo {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;

    ar: string;
  };
  year: string;
}

export interface GregorianDateInfo {
    date: string;
    format: string;
    day: string;
    weekday: {
        en: string;
    };
    month: {
        number: number;
        en: string;
    };
    year: string;
}

export interface DailyPrayerData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: HijriDateInfo;
    gregorian: GregorianDateInfo;
  };
  meta: any;
}

export interface AlAdhanMonthlyResponse {
  code: number;
  status: string;
  data: DailyPrayerData[];
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: DailyPrayerData;
}


export interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string;
  country: string;
}

export interface Settings {
  location: Location | null;
  calculationMethod: number;
  asrMethod: number;
  iqamaTime: number; // in minutes
  muezzin: string;
  adhanFor: {
    Fajr: boolean;
    Dhuhr: boolean;
    Asr: boolean;
    Maghrib: boolean;
    Isha: boolean;
  };
  adhanVolume: number; // Volume from 0.0 to 1.0
  adhanMode: 'full' | 'takbeer' | 'silent'; // Type of adhan sound
}

// i18n Types
export type Locale = 'ar' | 'en';

export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

// Adhkar Types
export interface Translatable {
  ar: string;
  en: string;
}

export interface Dhikr {
  id: number;
  text: Translatable;
  count?: number;
  reference: Translatable;
}

export interface AdhkarCategory {
  id: string;
  title: Translatable;
  items: Dhikr[];
  audioSrc?: string;
}

// Quran Types
export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  tafseer?: string; // Tafseer text is optional and will be merged in
}

export interface Tafseer {
  surah: number;
  ayah: number;
  text: string;
}

export interface SurahDetailData extends SurahInfo {
  ayahs: Ayah[];
}

// Tasbih Types
export interface TasbihSession {
  date: string;
  count: number;
}
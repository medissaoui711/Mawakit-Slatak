export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriDate {
  date: string;
  day: string;
  weekday: {
    ar: string;
    en: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
}

export interface AlAdhanResponse {
  code: number;
  data: {
    timings: PrayerTimings;
    date: {
      hijri: HijriDate;
      gregorian: {
        date: string;
        weekday: { en: string };
      };
    };
  };
}

export interface CityOption {
  nameAr: string;
  apiName: string;
}

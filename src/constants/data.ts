
import { CityOption, IqamaSettings } from '../types';

export const CITIES: CityOption[] = [
  { nameAr: 'تونس', apiName: 'Tunis' },
  { nameAr: 'صفاقس', apiName: 'Sfax' },
  { nameAr: 'سوسة', apiName: 'Sousse' },
  { nameAr: 'قابس', apiName: 'Gabes' },
  { nameAr: 'القيروان', apiName: 'Kairouan' },
  { nameAr: 'بنزرت', apiName: 'Bizerte' },
  { nameAr: 'نابل', apiName: 'Nabeul' },
  { nameAr: 'مدنين', apiName: 'Medenine' },
];

// Legacy string exports for backward compatibility if needed, but we will move to numbers
export const IQAMA_OFFSETS = {
  Fajr: '+25',
  Sunrise: '--',
  Dhuhr: '+20',
  Asr: '+25',
  Maghrib: '+10',
  Isha: '+20',
};

// Numeric Defaults for Calculation
export const DEFAULT_IQAMA_SETTINGS: IqamaSettings = {
  Fajr: 30,
  Dhuhr: 20,
  Asr: 25,
  Maghrib: 15,
  Isha: 20,
};

// Ramadan Preset Example
export const RAMADAN_IQAMA_SETTINGS: IqamaSettings = {
  Fajr: 15, // Usually shorter in Ramadan
  Dhuhr: 15,
  Asr: 15,
  Maghrib: 10, // Very short for Iftar
  Isha: 15, // Short before Taraweeh
};

export const ADHAN_AUDIO_URL = "https://media.blubrry.com/muslim_central_quran/podcasts.qurancentral.com/adhan/adhan-makkah-2.mp3";

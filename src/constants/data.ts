
import { CityOption } from '../types';

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

export const IQAMA_OFFSETS = {
  Fajr: '+25',
  Sunrise: '--',
  Dhuhr: '+20',
  Asr: '+25',
  Maghrib: '+10',
  Isha: '+20',
};

export const ADHAN_AUDIO_URL = "https://media.blubrry.com/muslim_central_quran/podcasts.qurancentral.com/adhan/adhan-makkah-2.mp3";

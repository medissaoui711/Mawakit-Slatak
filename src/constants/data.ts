import { PrayerTimings } from '../types';

export const displayPrayers: (keyof PrayerTimings)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const calculationMethods = [
  { id: 2, name_key: 'method_isna' },
  { id: 4, name_key: 'method_umm_al_qura' },
  { id: 3, name_key: 'method_mwl' },
  { id: 5, name_key: 'method_egyptian' },
  { id: 1, name_key: 'method_karachi' },
];

const GENERIC_TAKBEER_URL = 'https://archive.org/download/AllahuAkbar_201701/Allahu%20Akbar.mp3';

export const muezzins = [
  { 
    id: 'alafasy', 
    name: 'Mishary Alafasy', 
    files: {
      full: 'https://archive.org/download/AdhanByMisharyAlafasy/Adhan%20by%20Mishary%20Alafasy.mp3',
      takbeer: GENERIC_TAKBEER_URL
    }
  },
  { 
    id: 'makkah', 
    name: 'Makkah Adhan', 
    files: {
      full: 'https://archive.org/download/AdhanMakkah/Adhan%20Makkah.mp3',
      takbeer: GENERIC_TAKBEER_URL
    }
  },
  { 
    id: 'madina', 
    name: 'Madina Adhan', 
    files: {
      full: 'https://archive.org/download/AdhanAlMadinah/Adhan%20Al-Madinah.mp3',
      takbeer: GENERIC_TAKBEER_URL
    }
  },
];
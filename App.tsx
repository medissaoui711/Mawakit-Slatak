import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Info, Clock } from 'lucide-react';
import { AlAdhanResponse, CityOption, PrayerTimings } from './types';
import PrayerCard from './components/PrayerCard';
import { getArabicDateString } from './utils';

const CITIES: CityOption[] = [
  { nameAr: 'تونس', apiName: 'Tunis' },
  { nameAr: 'صفاقس', apiName: 'Sfax' },
  { nameAr: 'سوسة', apiName: 'Sousse' },
  { nameAr: 'قابس', apiName: 'Gabes' },
  { nameAr: 'القيروان', apiName: 'Kairouan' },
  { nameAr: 'بنزرت', apiName: 'Bizerte' },
  { nameAr: 'نابل', apiName: 'Nabeul' },
  { nameAr: 'مدنين', apiName: 'Medenine' },
];

const IQAMA_OFFSETS = {
  Fajr: '+25',
  Sunrise: '--',
  Dhuhr: '+20',
  Asr: '+25',
  Maghrib: '+10',
  Isha: '+20',
};

const PRAYER_NAMES_AR = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// Public Adhan URL (Short version or placeholder)
const ADHAN_AUDIO_URL = "https://media.blubrry.com/muslim_central_quran/podcasts.qurancentral.com/adhan/adhan-makkah-2.mp3";

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityOption>(CITIES[0]);
  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [hijriDateString, setHijriDateString] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  
  // Ref for audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Ref to track notified prayers to avoid spamming
  const notifiedPrayers = useRef<Set<string>>(new Set());

  const fetchTimings = async () => {
    setLoading(true);
    try {
      // method=2 is ISNA/Generic, often used for Tunisia standard approximation in basic apps
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${selectedCity.apiName}&country=Tunisia&method=2`
      );
      const data: AlAdhanResponse = await response.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        const h = data.data.date.hijri;
        setHijriDateString(`${h.day} ${h.month.ar} ${h.year} هـ`);
      }
    } catch (error) {
      console.error('Error fetching timings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimings();
    // Reset notified prayers on city change
    notifiedPrayers.current.clear();
  }, [selectedCity]);

  // Request Notification Permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then((perm) => {
        setNotificationsEnabled(perm === 'granted');
      });
    }
  }, []);

  // Timer for Notifications
  useEffect(() => {
    if (!timings) return;

    const checkTime = () => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5); // HH:mm

      (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).forEach((prayer) => {
        const timeStr = timings[prayer].split(' ')[0]; // "05:30"
        const [pHour, pMin] = timeStr.split(':').map(Number);
        
        const prayerDate = new Date();
        prayerDate.setHours(pHour, pMin, 0, 0);

        const diffMs = prayerDate.getTime() - now.getTime();
        const diffMinutes = Math.round(diffMs / 60000);

        const prayerKey = `${prayer}-${now.getDate()}`;

        // 5 Minutes Before
        if (diffMinutes === 5 && !notifiedPrayers.current.has(prayerKey + '_pre')) {
          if (notificationsEnabled) {
            new Notification(`اقترب وقت صلاة ${PRAYER_NAMES_AR[prayer]}`, {
              body: 'بقي 5 دقائق على الأذان',
            });
          }
          notifiedPrayers.current.add(prayerKey + '_pre');
        }

        // At Time (Window of 1 minute)
        if (Math.abs(diffMinutes) < 1 && !notifiedPrayers.current.has(prayerKey + '_at')) {
           if (notificationsEnabled) {
            new Notification(`حان الآن وقت صلاة ${PRAYER_NAMES_AR[prayer]}`, {
              body: `الله أكبر، الله أكبر`,
            });
          }
          // Play Adhan
          if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
          }
          notifiedPrayers.current.add(prayerKey + '_at');
        }
      });
    };

    const interval = setInterval(checkTime, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [timings, notificationsEnabled]);

  const today = new Date();
  const gregorianDateString = getArabicDateString(today);

  return (
    <div className="min-h-screen bg-[#7f1d1d] text-white font-tajawal flex flex-col">
      <audio ref={audioRef} src={ADHAN_AUDIO_URL} preload="auto" />

      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-red-800">
        <div className="flex items-center gap-2">
             <button 
               onClick={fetchTimings}
               className="p-2 rounded-full hover:bg-red-800 transition-colors"
               aria-label="Refresh"
             >
                <RefreshCw size={24} />
             </button>
             <div className="bg-white/10 px-3 py-1 rounded text-sm flex items-center gap-1">
                <Info size={16} />
                <span>{notificationsEnabled ? 'التنبيهات مفعلة' : 'التنبيهات غير مفعلة'}</span>
             </div>
        </div>

        <div className="flex flex-col items-end">
            {/* Logo Container with Tunisian Flag Background */}
            <div className="relative w-20 h-20 mb-2 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-red-900">
                {/* Flag Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: "url('https://flagcdn.com/tn.svg')" }}
                />
                {/* Clock Icon */}
                <Clock className="text-white relative z-10 drop-shadow-lg" size={44} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold">مواقيت الصلاة</h1>
        </div>
      </header>

      {/* City Selection & Date */}
      <div className="bg-[#5a1313] p-4 text-center shadow-inner">
        
        {/* City Selector */}
        <div className="mb-4 flex justify-center">
          <select 
            value={selectedCity.apiName}
            onChange={(e) => {
              const city = CITIES.find(c => c.apiName === e.target.value);
              if (city) setSelectedCity(city);
            }}
            className="bg-red-900 text-white border border-red-700 rounded-lg px-6 py-2 text-lg outline-none focus:ring-2 focus:ring-white cursor-pointer"
          >
            {CITIES.map(c => (
              <option key={c.apiName} value={c.apiName}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-medium">
          {gregorianDateString} <span className="mx-2">/</span> {hijriDateString}
        </h2>
      </div>

      {/* Main Content - Prayer Grid */}
      <div className="flex-1 bg-white p-4 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            جاري التحميل...
          </div>
        ) : timings ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden max-w-3xl mx-auto shadow-lg">
             {/* Using gap-px with bg-gray-200 creates a nice grid border effect */}
             <div className="bg-white"><PrayerCard name="الفجر" time={timings.Fajr} iqamaOffset={IQAMA_OFFSETS.Fajr} /></div>
             <div className="bg-white"><PrayerCard name="الشروق" time={timings.Sunrise} iqamaOffset={IQAMA_OFFSETS.Sunrise} /></div>
             <div className="bg-white"><PrayerCard name="الظهر" time={timings.Dhuhr} iqamaOffset={IQAMA_OFFSETS.Dhuhr} /></div>
             <div className="bg-white"><PrayerCard name="العصر" time={timings.Asr} iqamaOffset={IQAMA_OFFSETS.Asr} /></div>
             <div className="bg-white"><PrayerCard name="المغرب" time={timings.Maghrib} iqamaOffset={IQAMA_OFFSETS.Maghrib} /></div>
             <div className="bg-white"><PrayerCard name="العشاء" time={timings.Isha} iqamaOffset={IQAMA_OFFSETS.Isha} /></div>
          </div>
        ) : (
           <div className="text-center text-red-800 mt-10">فشل تحميل البيانات</div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-600">
          <p className="mb-4 text-sm font-medium">( ما بين القوسين هو وقت الإقامة )</p>
          <p className="font-quran text-2xl text-[#7f1d1d] leading-relaxed">
            &#123; إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا &#125;
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
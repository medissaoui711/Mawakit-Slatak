import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Locale, LocaleContextType } from '../types';

// Embed JSON content directly to avoid import issues with 'assert'
const ar = {
  "app_title": "مواقيت الصلاة",
  "notifications_enabled": "التنبيهات مفعلة",
  "loading_times": "جاري تحميل المواقيت...",
  "error_prefix": "حدث خطأ",
  "time_left_for": "متبقي على صلاة",
  "iqama_countdown_title": "متبقي على إقامة الصلاة",
  "iftar_countdown_title": "متبقي على الإفطار",
  "imsak_countdown_title": "متبقي على الإمساك",
  "Fajr": "الفجر",
  "Sunrise": "الشروق",
  "Dhuhr": "الظهر",
  "Asr": "العصر",
  "Maghrib": "المغرب",
  "Isha": "العشاء",
  "Imsak": "الإمساك",
  "ramadan_mode": "وضع رمضان",
  "iftar_dua_title": "دعاء الإفطار",
  "iftar_dua_text": "ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله",
  "settings": "الإعدادات",
  "qibla_compass": "بوصلة القبلة",
  "language": "اللغة",
  "location": "الموقع",
  "location_loading": "جاري التحديد...",
  "location_detect": "تحديد الموقع الحالي",
  "location_description": "يتم استخدام الموقع لتوفير أوقات دقيقة.",
  "location_prompt_title": "مرحباً بك في مواقيت الصلاة",
  "location_prompt_desc": "نحتاج إلى الوصول لموقعك الجغرافي لعرض أوقات الصلاة الدقيقة واتجاه القبلة. خصوصيتك تهمنا.",
  "location_prompt_button": "تفعيل الموقع",
  "location_detecting_auto": "جاري تحديد موقعك تلقائيًا...",
  "location_denied_title": "تم رفض الوصول إلى الموقع",
  "location_denied_desc": "لاستخدام التطبيق، يجب السماح بالوصول إلى الموقع. يرجى تفعيله من إعدادات الموقع في متصفحك ثم إعادة تحميل الصفحة.",
  "calculation_method": "طريقة الحساب",
  "method_isna": "ISNA (أمريكا الشمالية)",
  "method_umm_al_qura": "أم القرى، مكة",
  "method_mwl": "رابطة العالم الإسلامي",
  "method_egyptian": "الهيئة المصرية العامة للمساحة",
  "method_karachi": "جامعة العلوم الإسلامية بكراتشي",
  "asr_method_title": "مذهب صلاة العصر",
  "asr_method_standard": "شافعي، مالكي، حنبلي (قياسي)",
  "asr_method_hanafi": "حنفي",
  "iqama_time_setting_title": "وقت الإقامة بعد الأذان",
  "minutes": "دقائق",
  "close": "إغلاق",
  "error_location_not_set": "لم يتم تعيين الموقع. يرجى تفعيل خدمات الموقع أو تعيينه يدويًا.",
  "error_find_times_today": "لم نتمكن من العثور على مواقيت الصلاة لهذا اليوم.",
  "error_unknown_fetching": "حدث خطأ غير معروف أثناء جلب مواقيت الصلاة.",
  "calibrating_compass": "جاري معايرة البوصلة...",
  "qibla": "القبلة",
  "device": "الجهاز",
  "compass_instructions": "أدر جهازك حتى تتطابق أيقونة الكعبة الفيروزية مع المؤشر الأحمر في الأعلى.",
  "try_ar_compass": "تجربة البوصلة بالواقع المعزز",
  "determining_direction": "جاري تحديد الاتجاه...",
  "km": "كم",
  "error_sensor_access": "لا يمكن الوصول إلى مستشعرات الاتجاه. يرجى التأكد من أن جهازك يدعمها وأن لديك الأذونات اللازمة.",
  "error_sensor_support": "هذا الجهاز لا يدعم مستشعرات تحديد الاتجاه اللازمة للبوصلة.",
  "error_camera_permission": "يرجى السماح بالوصول إلى الكاميرا لاستخدام هذه الميزة.",
  "tasbih_counter": "عداد التسبيح",
  "adhkar": "الأذكار",
  "session_count": "العدد الحالي",
  "total_count": "الإجمالي",
  "reset": "إعادة تعيين",
  "dua_of_the_day": "دعاء اليوم",
  "hadith_of_the_day": "حديث اليوم",
  "search": "بحث...",
  "adhkar_morning": "أذكار الصباح",
  "adhkar_evening": "أذكار المساء",
  "adhkar_post_prayer": "أذكار بعد الصلاة",
  "read": "اقرأ",
  "times": "مرات",
  "no_results": "لا توجد نتائج.",
  "quran": "القرآن الكريم",
  "continue_reading": "متابعة القراءة",
  "search_surah_placeholder": "ابحث عن سورة بالاسم أو الرقم...",
  "meccan": "مكية",
  "medinan": "مدنية",
  "ayahs_count": "آيات",
  "tafseer_title": "التفسير الميسر للآية",
  "copy_tafseer": "نسخ الآية مع التفسير",
  "copied": "تم النسخ!",
  "error_loading_surah": "خطأ في تحميل السورة. يرجى المحاولة مرة أخرى.",
  "privacy_policy": "سياسة الخصوصية",
  "privacy_policy_title": "سياسة الخصوصية",
  "privacy_policy_intro": "نحن نهتم بخصوصيتك. إليك كيفية تعاملنا مع بياناتك:",
  "privacy_policy_location_title": "بيانات الموقع الجغرافي",
  "privacy_policy_location_desc": "نطلب إذن الوصول إلى موقعك الجغرافي لحساب أوقات الصلاة واتجاه القبلة بدقة. لا يتم تخزين هذه البيانات على خوادمنا ولا نشاركها مع أي طرف ثالث.",
  "privacy_policy_camera_title": "الوصول إلى الكاميرا",
  "privacy_policy_camera_desc": "نطلب إذن الوصول إلى الكاميرا فقط عند استخدامك لميزة \"بوصلة الواقع المعزز\" (AR). تتم معالجة صور الكاميرا على جهازك مباشرة لعرض اتجاه القبلة ولا يتم تخزينها أو إرسالها إلى أي مكان.",
  "privacy_policy_storage_title": "التخزين المحلي",
  "privacy_policy_storage_desc": "يتم تخزين إعداداتك (مثل طريقة الحساب والموقع المفضل) وبيانات القرآن التي تتصفحها محليًا على جهازك باستخدام مساحة تخزين المتصفح (localStorage) لتحسين تجربتك وتوفير الوصول دون اتصال بالإنترنت. هذه البيانات لا تغادر جهازك أبدًا.",
  "privacy_policy_conclusion": "خصوصيتك هي أولويتنا. نحن ملتزمون بتقليل جمع البيانات إلى الحد الأدنى الضروري لعمل التطبيق.",
  "muezzin": "المؤذن",
  "adhan_notifications_title": "أذان الصلوات",
  "tasbih_history": "سجل التسبيح",
  "no_sessions_yet": "لا توجد جلسات مسجلة بعد.",
  "history": "السجل",
  "counter": "العداد",
  "worship_tracker_title": "متابعة العبادات",
  "prayer_tracker_title": "متتبع الصلاة",
  "prayer_tracker_desc": "حدد الصلوات التي أديتها اليوم.",
  "theme_title": "المظهر",
  "theme_light": "فاتح",
  "theme_dark": "داكن",
  "error_geolocation_unsupported": "خدمة تحديد المواقع غير مدعومة في متصفحك.",
  "error_position_unavailable": "تعذر تحديد موقعك. يرجى التأكد من تفعيل خدمات الموقع على جهازك والمحاولة مرة أخرى.",
  "error_timeout": "انتهت مهلة طلب تحديد موقعك. يرجى المحاولة مرة أخرى.",
  "error_unknown_location": "حدث خطأ غير معروف أثناء محاولة تحديد موقعك.",
  "adhan_sound_settings": "إعدادات صوت الأذان",
  "volume": "مستوى الصوت",
  "test_adhan": "تجربة",
  "adhan_mode": "نوع التنبيه",
  "adhan_mode_full": "أذان كامل",
  "adhan_mode_takbeer": "تكبيرات فقط",
  "adhan_mode_silent": "صامت",
  "play_surah": "تشغيل السورة",
  "stop_recitation": "إيقاف التلاوة"
};

const en = {
  "app_title": "Prayer Times",
  "notifications_enabled": "Notifications Enabled",
  "loading_times": "Loading prayer times...",
  "error_prefix": "An error occurred",
  "time_left_for": "Time left for",
  "iqama_countdown_title": "Time left for Iqama",
  "iftar_countdown_title": "Time until Iftar",
  "imsak_countdown_title": "Time until Imsak",
  "Fajr": "Fajr",
  "Sunrise": "Sunrise",
  "Dhuhr": "Dhuhr",
  "Asr": "Asr",
  "Maghrib": "Maghrib",
  "Isha": "Isha",
  "Imsak": "Imsak",
  "ramadan_mode": "Ramadan Mode",
  "iftar_dua_title": "Dua for Breaking Fast",
  "iftar_dua_text": "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
  "settings": "Settings",
  "qibla_compass": "Qibla Compass",
  "language": "Language",
  "location": "Location",
  "location_loading": "Detecting...",
  "location_detect": "Detect Current Location",
  "location_description": "Location is used to provide accurate times.",
  "location_prompt_title": "Welcome to Prayer Times",
  "location_prompt_desc": "We need access to your location to provide accurate prayer times and Qibla direction. Your privacy is important to us.",
  "location_prompt_button": "Enable Location",
  "location_detecting_auto": "Automatically detecting your location...",
  "location_denied_title": "Location Access Denied",
  "location_denied_desc": "To use this app, location access is required. Please enable it in your browser's site settings, then reload the page.",
  "calculation_method": "Calculation Method",
  "method_isna": "ISNA (North America)",
  "method_umm_al_qura": "Umm Al-Qura, Makkah",
  "method_mwl": "Muslim World League",
  "method_egyptian": "Egyptian General Authority",
  "method_karachi": "University of Islamic Sciences, Karachi",
  "asr_method_title": "Asr Juristic Method",
  "asr_method_standard": "Shafi, Maliki, Hanbali (Standard)",
  "asr_method_hanafi": "Hanafi",
  "iqama_time_setting_title": "Iqama Time After Adhan",
  "minutes": "Minutes",
  "close": "Close",
  "error_location_not_set": "Location not set. Please enable location services or set it manually.",
  "error_find_times_today": "Could not find prayer times for today.",
  "error_unknown_fetching": "An unknown error occurred while fetching prayer times.",
  "calibrating_compass": "Calibrating compass...",
  "qibla": "Qibla",
  "device": "Device",
  "compass_instructions": "Rotate your device until the turquoise Kaaba icon aligns with the red marker at the top.",
  "try_ar_compass": "Try AR Compass",
  "determining_direction": "Determining direction...",
  "km": "km",
  "error_sensor_access": "Could not access orientation sensors. Please ensure your device supports them and permissions are granted.",
  "error_sensor_support": "This device does not support the orientation sensors required for the compass.",
  "error_camera_permission": "Please allow camera access to use this feature.",
  "tasbih_counter": "Tasbih Counter",
  "adhkar": "Adhkar",
  "session_count": "Session",
  "total_count": "Total",
  "reset": "Reset",
  "dua_of_the_day": "Du'a of the Day",
  "hadith_of_the_day": "Hadith of the Day",
  "search": "Search...",
  "adhkar_morning": "Morning",
  "adhkar_evening": "Evening",
  "adhkar_post_prayer": "After Prayer",
  "read": "Read",
  "times": "times",
  "no_results": "No results found.",
  "quran": "Al-Quran",
  "continue_reading": "Continue Reading",
  "search_surah_placeholder": "Search surah by name or number...",
  "meccan": "Meccan",
  "medinan": "Medinan",
  "ayahs_count": "Ayahs",
  "tafseer_title": "Tafseer Al-Muyassar for Ayah",
  "copy_tafseer": "Copy Ayah with Tafseer",
  "copied": "Copied!",
  "error_loading_surah": "Error loading surah. Please try again.",
  "privacy_policy": "Privacy Policy",
  "privacy_policy_title": "Privacy Policy",
  "privacy_policy_intro": "We care about your privacy. Here's how we handle your data:",
  "privacy_policy_location_title": "Geolocation Data",
  "privacy_policy_location_desc": "We request access to your location to accurately calculate prayer times and the Qibla direction. This data is not stored on our servers and is not shared with any third parties.",
  "privacy_policy_camera_title": "Camera Access",
  "privacy_policy_camera_desc": "We request camera access only when you use the Augmented Reality (AR) Compass feature. The camera feed is processed directly on your device to display the Qibla direction and is never stored or sent anywhere.",
  "privacy_policy_storage_title": "Local Storage",
  "privacy_policy_storage_desc": "Your settings (like calculation method and preferred location) and browsed Quran data are stored locally on your device using your browser's storage (localStorage) to improve your experience and provide offline access. This data never leaves your device.",
  "privacy_policy_conclusion": "Your privacy is our priority. We are committed to minimizing data collection to only what is essential for the app to function.",
  "muezzin": "Muezzin",
  "adhan_notifications_title": "Prayer Adhans",
  "tasbih_history": "Tasbih History",
  "no_sessions_yet": "No sessions recorded yet.",
  "history": "History",
  "counter": "Counter",
  "worship_tracker_title": "Worship Tracker",
  "prayer_tracker_title": "Prayer Tracker",
  "prayer_tracker_desc": "Mark the prayers you've performed today.",
  "theme_title": "Theme",
  "theme_light": "Light",
  "theme_dark": "Dark",
  "error_geolocation_unsupported": "Geolocation is not supported by your browser.",
  "error_position_unavailable": "Could not detect your location. Please ensure location services are enabled on your device and try again.",
  "error_timeout": "The request to get your location timed out. Please try again.",
  "error_unknown_location": "An unknown error occurred while trying to get your location.",
  "adhan_sound_settings": "Adhan Sound Settings",
  "volume": "Volume",
  "test_adhan": "Test",
  "adhan_mode": "Alert Type",
  "adhan_mode_full": "Full Adhan",
  "adhan_mode_takbeer": "Takbeer Only",
  "adhan_mode_silent": "Silent",
  "play_surah": "Play Surah",
  "stop_recitation": "Stop Recitation"
};


const translations = { ar, en };

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const getInitialLocale = (): Locale => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedLocale = window.localStorage.getItem('app-locale');
    if (storedLocale === 'ar' || storedLocale === 'en') {
      return storedLocale;
    }
  }
  // Default to Arabic for the first launch if no preference is stored.
  return 'ar';
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    localStorage.setItem('app-locale', locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { locale } = useLocale();
  const t = useCallback((key: string): string => {
    return translations[locale][key as keyof typeof translations[Locale]] || key;
  }, [locale]);
  return { t };
};
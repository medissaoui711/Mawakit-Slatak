
import { useState, useEffect } from 'react';
import { NotificationSettings } from '../types';

const STORAGE_KEY = 'mawakit_notification_settings_v1';

const DEFAULT_SETTINGS: NotificationSettings = {
  globalEnabled: true,
  prayers: {
    Fajr: { enabled: true, preAdhanMinutes: 15 }, // الفجر يحتاج تنبيه مبكر
    Sunrise: { enabled: false, preAdhanMinutes: 10 }, // الشروق افتراضياً معطل
    Dhuhr: { enabled: true, preAdhanMinutes: 5 },
    Asr: { enabled: true, preAdhanMinutes: 5 },
    Maghrib: { enabled: true, preAdhanMinutes: 5 },
    Isha: { enabled: true, preAdhanMinutes: 10 },
  },
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // حفظ الإعدادات عند التغيير
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateGlobalEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, globalEnabled: enabled }));
  };

  const updatePrayerSetting = (prayer: string, field: 'enabled' | 'preAdhanMinutes', value: any) => {
    setSettings(prev => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [prayer]: {
          ...prev.prayers[prayer],
          [field]: value
        }
      }
    }));
  };

  return {
    settings,
    updateGlobalEnabled,
    updatePrayerSetting
  };
};

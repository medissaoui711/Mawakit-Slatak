
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { CityOption, PrayerTimings, NotificationSettings } from '../types';
import { CITIES } from '../constants/data';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useCountdown } from '../hooks/useCountdown';
import { useAdhanNotification } from '../hooks/useAdhanNotification';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import { ADHAN_AUDIO_URL } from '../constants/data';

interface PrayerContextType {
  selectedCity: CityOption;
  setSelectedCity: (city: CityOption) => void;
  timings: PrayerTimings | null;
  hijriDate: string;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  isStale: boolean;
  refetch: () => void;
  nextPrayer: string | null;
  nextPrayerEn: string | null;
  countdown: string;
  isUrgent: boolean;
  
  // Notification logic
  notificationsEnabled: boolean;
  requestPermission: () => void;
  enableAudio: () => void;
  audioUnlocked: boolean;

  // Settings
  settings: NotificationSettings;
  updateGlobalEnabled: (val: boolean) => void;
  updatePrayerSetting: (prayer: string, field: 'enabled' | 'preAdhanMinutes', value: any) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean) => void;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<CityOption>(CITIES[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // 1. Data Hooks
  const { timings, hijriDate, loading, error, isOffline, isStale, refetch } = usePrayerTimes(selectedCity);
  const { nextPrayer, nextPrayerEn, countdown, isUrgent } = useCountdown(timings);
  
  // 2. Settings Hook
  const { settings, updateGlobalEnabled, updatePrayerSetting } = useNotificationSettings();

  // 3. Notification Logic (Consumes settings)
  const { notificationsEnabled, requestPermission, enableAudio, audioUnlocked } = useAdhanNotification(
    timings, 
    ADHAN_AUDIO_URL,
    settings // Pass settings to logic
  );

  const value = useMemo(() => ({
    selectedCity,
    setSelectedCity,
    timings,
    hijriDate,
    loading,
    error,
    isOffline,
    isStale,
    refetch,
    nextPrayer,
    nextPrayerEn,
    countdown,
    isUrgent,
    notificationsEnabled,
    requestPermission,
    enableAudio,
    audioUnlocked,
    settings,
    updateGlobalEnabled,
    updatePrayerSetting,
    isSettingsOpen,
    setIsSettingsOpen
  }), [
    selectedCity, timings, hijriDate, loading, error, isOffline, isStale, 
    nextPrayer, nextPrayerEn, countdown, isUrgent, 
    notificationsEnabled, audioUnlocked, settings, isSettingsOpen
  ]);

  return (
    <PrayerContext.Provider value={value}>
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayerData = () => {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayerData must be used within a PrayerProvider');
  }
  return context;
};

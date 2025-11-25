import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Settings, Location, Locale } from '../types';
import { fetchCityAndCountry } from '../utils';
import { useLocale, useTranslation } from './LocaleContext';
import audioManager from '../utils/audioManager';

const defaultSettings: Settings = {
  location: null,
  calculationMethod: 4, // Umm Al-Qura, Makkah
  asrMethod: 0, // Standard
  iqamaTime: 20, // Default 20 minutes for Iqama
  muezzin: 'alafasy',
  adhanFor: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  },
  adhanVolume: 1,
  adhanMode: 'full',
};

type PermissionStatus = 'loading' | 'prompt' | 'granted' | 'denied';
interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  fetchAndSetLocation: (locale: Locale) => void;
  isLocationLoading: boolean;
  updateLocationName: (locale: Locale) => Promise<void>;
  permissionStatus: PermissionStatus;
  locationError: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem('prayerAppSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Ensure all default keys exist on the loaded object
        return { ...defaultSettings, ...parsed };
      }
      return defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  });

  const [isLocationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(() => {
    const savedStatus = localStorage.getItem('prayerAppPermissionStatus');
    if (savedStatus === 'denied') {
      return 'denied';
    }
    return 'loading';
  });
  
  const { locale } = useLocale();
  const { t } = useTranslation();

  // Effect to synchronize audio volume with settings on app load
  useEffect(() => {
    audioManager.setVolume(settings.adhanVolume);
  }, [settings.adhanVolume]);

  useEffect(() => {
    if (settings.location) {
      localStorage.setItem('prayerAppSettings', JSON.stringify(settings));
      localStorage.removeItem('prayerAppPermissionStatus');
    }
  }, [settings]);

  const fetchAndSetLocation = useCallback((currentLocale: Locale) => {
    if (!navigator.geolocation) {
      setLocationError(t('error_geolocation_unsupported'));
      return;
    }
    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
            const locationInfo = await fetchCityAndCountry(latitude, longitude, currentLocale);
            setSettings(prev => ({ ...prev, location: { latitude, longitude, ...locationInfo } }));
            setPermissionStatus('granted');
        } catch (error) {
            console.error("Failed to fetch city and country", error);
            const fallbackCity = currentLocale === 'ar' ? 'موقع حالي' : 'Current Location';
            setSettings(prev => ({ ...prev, location: { latitude, longitude, city: fallbackCity, country: '' } }));
        } finally {
            setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location: ", error);
        setLocationLoading(false);
        switch (error.code) {
            case error.PERMISSION_DENIED:
                setPermissionStatus('denied');
                localStorage.setItem('prayerAppPermissionStatus', 'denied');
                setLocationError(null);
                break;
            case error.POSITION_UNAVAILABLE:
                setLocationError(t('error_position_unavailable'));
                break;
            case error.TIMEOUT:
                setLocationError(t('error_timeout'));
                break;
            default:
                setLocationError(t('error_unknown_location'));
                break;
        }
      }
    );
  }, [t]);

  useEffect(() => {
    if (settings.location || permissionStatus === 'denied') return;

    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        if (result.state === 'denied') {
            localStorage.setItem('prayerAppPermissionStatus', 'denied');
        }

        if (result.state === 'granted') {
          localStorage.removeItem('prayerAppPermissionStatus');
          fetchAndSetLocation(locale);
        }

        result.onchange = () => {
          setPermissionStatus(result.state);
          if (result.state === 'denied') {
            localStorage.setItem('prayerAppPermissionStatus', 'denied');
          } else if (result.state === 'granted') {
            localStorage.removeItem('prayerAppPermissionStatus');
            fetchAndSetLocation(locale);
          }
        };
      }).catch(err => {
        console.warn('Permission API query failed, falling back to prompt.', err);
        setPermissionStatus('prompt');
      });
    } else {
      if (localStorage.getItem('prayerAppPermissionStatus') !== 'denied') {
        setPermissionStatus('prompt');
      }
    }
  }, [settings.location, locale, fetchAndSetLocation, permissionStatus]);
  
  const updateLocationName = useCallback(async (locale: Locale) => {
    if (!settings.location?.latitude || !settings.location?.longitude) return;
    
    try {
      const { latitude, longitude } = settings.location;
      const locationInfo = await fetchCityAndCountry(latitude, longitude, locale);
      setSettings(prev => {
        if (!prev.location) return prev;
        return {
          ...prev,
          location: {
            ...prev.location,
            city: locationInfo.city,
            country: locationInfo.country,
          }
        };
      });
    } catch (error) {
      console.error("Failed to update location name:", error);
    }
  }, [settings.location?.latitude, settings.location?.longitude]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, fetchAndSetLocation, isLocationLoading, updateLocationName, permissionStatus, locationError }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
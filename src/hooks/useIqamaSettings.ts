
import { useState, useEffect } from 'react';
import { IqamaSettings } from '../types';
import { DEFAULT_IQAMA_SETTINGS, RAMADAN_IQAMA_SETTINGS } from '../constants/data';

const STORAGE_KEY = 'mawakit_iqama_settings_v1';

export const useIqamaSettings = () => {
  const [iqamaSettings, setIqamaSettings] = useState<IqamaSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_IQAMA_SETTINGS;
    } catch {
      return DEFAULT_IQAMA_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(iqamaSettings));
  }, [iqamaSettings]);

  const updateIqamaTime = (prayer: string, minutes: number) => {
    setIqamaSettings(prev => ({
      ...prev,
      [prayer]: minutes
    }));
  };

  const resetToDefaults = () => {
    setIqamaSettings(DEFAULT_IQAMA_SETTINGS);
  };

  const applyRamadanPreset = () => {
    setIqamaSettings(RAMADAN_IQAMA_SETTINGS);
  };

  return {
    iqamaSettings,
    updateIqamaTime,
    resetToDefaults,
    applyRamadanPreset
  };
};

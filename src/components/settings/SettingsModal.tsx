
import React, { useEffect, useRef } from 'react';
import { useSettings } from '../../context/PrayerContext';
import { calculationMethods, muezzins } from '../../constants/data';
import { useTranslation, useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import { PRAYERS_WITH_ADHAN } from '../../hooks/usePrayerTimes';
import { Settings } from '../../types';
import LanguageSelector from './LanguageSelector';
import CustomDropdown from './CustomDropdown';
import audioManager from '../../utils/audioManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onOpenPrivacyPolicy }) => {
  const { settings, setSettings, fetchAndSetLocation, isLocationLoading } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      const focusableElement = modalRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElement instanceof HTMLElement) {
        focusableElement.focus();
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  const handleAsrMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, asrMethod: Number(e.target.value) }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setSettings(prev => ({ ...prev, adhanVolume: newVolume }));
    audioManager.setVolume(newVolume);
  };

  const handleTestAdhan = () => {
      const selectedMuezzin = muezzins.find(m => m.id === settings.muezzin);
      if (selectedMuezzin) {
          const audioUrl = settings.adhanMode === 'full' 
              ? selectedMuezzin.files.full 
              : selectedMuezzin.files.takbeer;
          if (audioUrl) audioManager.play(audioUrl);
      }
  };

  const handleAdhanToggle = (prayer: keyof Settings['adhanFor']) => {
    setSettings(prev => ({
      ...prev,
      adhanFor: {
        ...prev.adhanFor,
        [prayer]: !prev.adhanFor[prayer]
      }
    }));
  };

  const muezzinOptions = muezzins.map(m => ({ value: m.id, label: m.name }));
  const adhanModeOptions = [
      { value: 'full', label: t('adhan_mode_full') },
      { value: 'takbeer', label: t('adhan_mode_takbeer') },
      { value: 'silent', label: t('adhan_mode_silent') }
  ];
  const calculationMethodOptions = calculationMethods.map(m => ({ value: m.id, label: t(m.name_key)}));
  const iqamaTimeOptions = [5, 10, 15, 20, 25, 30].map(val => ({ value: val, label: `${val} ${t('minutes')}` }));


  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div 
        className={`modal-content ${isOpen ? 'open' : ''}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
            <h2 id="modal-title">{t('settings')}</h2>
            <button className="close-icon-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-scroll-container">
          {/* General Settings */}
          <div className="setting-item">
              <label>{t('language')}</label>
              <LanguageSelector />
          </div>
          
          <div className="setting-item">
            <label>{t('theme_title')}</label>
            <div className="adhan-toggle-item" style={{ marginBottom: 0 }}>
                <span>{theme === 'light' ? t('theme_light') : t('theme_dark')}</span>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={theme === 'dark'} 
                        onChange={toggleTheme}
                    />
                    <span className="slider"></span>
                </label>
            </div>
          </div>

          <div className="setting-item">
              <label>{t('location')}</label>
              <button onClick={() => fetchAndSetLocation(locale)} disabled={isLocationLoading}>
                  {isLocationLoading ? t('location_loading') : t('location_detect')}
              </button>
              <small>{t('location_description')}</small>
          </div>
          
          {/* Adhan Sound Settings */}
          <div className="adhan-settings-container">
            <div className="settings-group-title">{t('adhan_sound_settings')}</div>
              <div className="setting-item">
                <label htmlFor="muezzin-select">{t('muezzin')}</label>
                <CustomDropdown
                    id="muezzin-select"
                    options={muezzinOptions}
                    value={settings.muezzin}
                    onChange={(value) => setSettings(prev => ({ ...prev, muezzin: value as string }))}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="adhan-mode-select">{t('adhan_mode')}</label>
                 <CustomDropdown
                    id="adhan-mode-select"
                    options={adhanModeOptions}
                    value={settings.adhanMode}
                    onChange={(value) => setSettings(prev => ({ ...prev, adhanMode: value as Settings['adhanMode'] }))}
                />
              </div>

              <div className="setting-item">
                <label htmlFor="volume-slider">{t('volume')}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input
                        type="range"
                        id="volume-slider"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.adhanVolume}
                        onChange={handleVolumeChange}
                    />
                    <button 
                        onClick={handleTestAdhan} 
                        className="test-adhan-button"
                    >
                        {t('test_adhan')}
                    </button>
                </div>
              </div>
              
              <div className="setting-item" style={{marginTop: '20px'}}>
                <label>{t('adhan_notifications_title')}</label>
                {PRAYERS_WITH_ADHAN.map(prayer => (
                    <div key={prayer} className="adhan-toggle-item">
                        <span>{t(prayer)}</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={settings.adhanFor[prayer]} 
                                onChange={() => handleAdhanToggle(prayer)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                ))}
              </div>
          </div>
          
          {/* Calculation Settings */}
          <div className="adhan-settings-container">
            <div className="settings-group-title">{t('calculation_method')}</div>
            <div className="setting-item">
                <label htmlFor="calc-method">{t('calculation_method')}</label>
                <CustomDropdown
                    id="calc-method"
                    options={calculationMethodOptions}
                    value={settings.calculationMethod}
                    onChange={(value) => setSettings(prev => ({ ...prev, calculationMethod: Number(value) }))}
                />
            </div>
            <div className="setting-item">
                <label>{t('asr_method_title')}</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="asr-method" 
                            value={0}
                            checked={settings.asrMethod === 0}
                            onChange={handleAsrMethodChange}
                        />
                        {t('asr_method_standard')}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="asr-method" 
                            value={1}
                            checked={settings.asrMethod === 1}
                            onChange={handleAsrMethodChange}
                        />
                        {t('asr_method_hanafi')}
                    </label>
                </div>
            </div>
          </div>

          <div className="setting-item">
              <label htmlFor="iqama-time">{t('iqama_time_setting_title')}</label>
              <CustomDropdown
                  id="iqama-time"
                  options={iqamaTimeOptions}
                  value={settings.iqamaTime}
                  onChange={(value) => setSettings(prev => ({ ...prev, iqamaTime: Number(value) }))}
              />
          </div>

          <div className="setting-item" style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                  onClick={onOpenPrivacyPolicy} 
                  style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-secondary)', 
                      textDecoration: 'underline', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: 0
                  }}
              >
                  {t('privacy_policy')}
              </button>
          </div>
        </div>

        <div className="modal-footer">
            <button className="close-button" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;

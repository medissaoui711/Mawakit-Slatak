
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import Header from './components/layout/Header';
import CountdownTimer from './components/CountdownTimer';
import PrayerCard from './components/PrayerCard';
import RamadanInfo from './components/ramadan/RamadanInfo';
import DuaOfTheDay from './components/adhkar/DuaOfTheDay';
import HadithOfTheDay from './components/adhkar/HadithOfTheDay';
import { displayPrayers } from './constants/data';
import { useSettings } from './context/PrayerContext';
import { useTranslation, useLocale } from './context/LocaleContext';
import audioManager from './utils/audioManager';

// Lazy load modals and views
const SettingsModal = React.lazy(() => import('./components/settings/SettingsModal'));
const QiblaCompass = React.lazy(() => import('./components/QiblaCompass'));
const TasbihCounter = React.lazy(() => import('./components/tasbih/TasbihCounter'));
const AdhkarModal = React.lazy(() => import('./components/adhkar/AdhkarModal'));
const QuranView = React.lazy(() => import('./components/quran/QuranView'));
const FloatingActionButton = React.lazy(() => import('./components/layout/FloatingActionButton'));
const LocationPrompt = React.lazy(() => import('./components/common/LocationPrompt'));
const AudioPermissionModal = React.lazy(() => import('./components/common/AudioPermissionModal'));


// --- Privacy Policy Modal Component ---
interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { locale } = useLocale();

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div
        className={`modal-content ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
      >
        <h2 id="privacy-policy-title">{t('privacy_policy_title')}</h2>
        
        <div style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: locale === 'ar' ? 'right' : 'left', padding: '0 10px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{t('privacy_policy_intro')}</p>

            <div className="setting-item">
                <label style={{ fontSize: '16px', color: 'var(--text-dark)' }}>{t('privacy_policy_location_title')}</label>
                <small style={{ display: 'block', fontSize: '14px', lineHeight: '1.6' }}>{t('privacy_policy_location_desc')}</small>
            </div>
            
            <div className="setting-item">
                <label style={{ fontSize: '16px', color: 'var(--text-dark)' }}>{t('privacy_policy_storage_title')}</label>
                <small style={{ display: 'block', fontSize: '14px', lineHeight: '1.6' }}>{t('privacy_policy_storage_desc')}</small>
            </div>

            <p style={{ fontWeight: 'bold', marginTop: '16px' }}>{t('privacy_policy_conclusion')}</p>
        </div>

        <button className="close-button" onClick={onClose} style={{ marginTop: '10px' }}>{t('close')}</button>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const { dailyData, monthlyData, loading, error, nextPrayerInfo, currentPrayerInfo, iqamaCountdown, isRamadan, currentDate, changeMonth } = usePrayerTimes();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isQiblaOpen, setQiblaOpen] = useState(false);
  const [isTasbihOpen, setTasbihOpen] = useState(false);
  const [isAdhkarOpen, setAdhkarOpen] = useState(false);
  const [isQuranOpen, setQuranOpen] = useState(false);
  const [isPrivacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [showAudioPermission, setShowAudioPermission] = useState(false);


  const { settings, updateLocationName, permissionStatus } = useSettings();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.body.setAttribute('data-locale', locale);

    if (settings.location?.latitude && settings.location?.longitude) {
      updateLocationName(locale);
    }
  }, [locale, updateLocationName, settings.location?.latitude, settings.location?.longitude]);

  useEffect(() => {
    const audioPermission = localStorage.getItem('audioPermissionGranted');
    if (!audioPermission) {
      setShowAudioPermission(true);
    }

    // Global interaction listener to unlock audio context silently
    // This ensures that if the user clicks ANYWHERE in the app, we unlock the audio engine
    // for the current session, satisfying browser autoplay policies.
    const unlockAudioOnInteraction = () => {
        audioManager.unlock();
        // Remove listeners once triggered
        window.removeEventListener('click', unlockAudioOnInteraction);
        window.removeEventListener('touchstart', unlockAudioOnInteraction);
        window.removeEventListener('keydown', unlockAudioOnInteraction);
    };

    window.addEventListener('click', unlockAudioOnInteraction);
    window.addEventListener('touchstart', unlockAudioOnInteraction);
    window.addEventListener('keydown', unlockAudioOnInteraction);

    return () => {
        window.removeEventListener('click', unlockAudioOnInteraction);
        window.removeEventListener('touchstart', unlockAudioOnInteraction);
        window.removeEventListener('keydown', unlockAudioOnInteraction);
    };
  }, []);

  const handleAudioEnable = () => {
    audioManager.unlock();
    localStorage.setItem('audioPermissionGranted', 'true');
    setShowAudioPermission(false);
  };

  const handleOpenSettings = () => {
    if (document.activeElement instanceof HTMLButtonElement) {
        settingsTriggerRef.current = document.activeElement;
    }
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setTimeout(() => {
        settingsTriggerRef.current?.focus();
    }, 0);
  };
  
  if (!settings.location) {
     switch (permissionStatus) {
      case 'loading':
        return (
          <div className="status-container">
            <div className="spinner"></div>
          </div>
        );
      case 'granted':
        return (
          <div className="status-container">
            <div className="spinner"></div>
            <span>{t('location_detecting_auto')}</span>
          </div>
        );
      case 'denied':
        return (
          <Suspense fallback={<div className="status-container"><div className="spinner"></div></div>}>
            <LocationPrompt status="denied" />
          </Suspense>
        );
      case 'prompt':
      default:
        return (
          <Suspense fallback={<div className="status-container"><div className="spinner"></div></div>}>
            <LocationPrompt />
          </Suspense>
        );
    }
  }


  const renderContent = () => {
    if (loading || (!dailyData && !error)) {
        return (
            <div className="status-container">
                <div className="spinner"></div>
                <span>{t('loading_times')}</span>
            </div>
        );
    }
    
    if (error) {
        return <div className="status-container error">{t('error_prefix')}: {error}</div>;
    }

    if (dailyData) {
      const timings = dailyData.timings;
      const prayerToHighlight = currentPrayerInfo?.name || nextPrayerInfo?.name;
      
      return (
        <>
          {isRamadan && <RamadanInfo timings={timings} />}
          
          <CountdownTimer 
             nextPrayerInfo={nextPrayerInfo}
             currentPrayerInfo={currentPrayerInfo}
             iqamaCountdown={iqamaCountdown}
             isRamadan={isRamadan}
          />

          <DuaOfTheDay />
          <HadithOfTheDay />

          <div className="prayer-grid">
            {displayPrayers.map((prayer) => (
              <PrayerCard
                key={prayer}
                name={t(prayer)}
                time={String(timings[prayer]).split(' ')[0]}
                isNext={prayerToHighlight === prayer}
                isRamadan={isRamadan}
                prayerKey={prayer}
              />
            ))}
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="app-container">
      <Header 
        locationName={settings.location?.city || "..."}
        onSettingsClick={handleOpenSettings}
        onQiblaClick={() => setQiblaOpen(true)}
        onQuranClick={() => setQuranOpen(true)}
        onAdhkarClick={() => setAdhkarOpen(true)}
        onTasbihClick={() => setTasbihOpen(true)}
      />

      <main className="main-content">
        {renderContent()}
      </main>

      {isPrivacyPolicyOpen && <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => setPrivacyPolicyOpen(false)} />}
      
      <Suspense fallback={<div />}>
        {showAudioPermission && (
            <AudioPermissionModal onEnable={handleAudioEnable} />
        )}
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={handleCloseSettings} 
            onOpenPrivacyPolicy={() => {
              setSettingsOpen(false);
              setPrivacyPolicyOpen(true);
            }}
          />
        )}
        {isQiblaOpen && <QiblaCompass isOpen={isQiblaOpen} onClose={() => setQiblaOpen(false)} userLocation={settings.location} />}
        {isTasbihOpen && <TasbihCounter isOpen={isTasbihOpen} onClose={() => setTasbihOpen(false)} />}
        {isAdhkarOpen && <AdhkarModal isOpen={isAdhkarOpen} onClose={() => setAdhkarOpen(false)} />}
        {isQuranOpen && <QuranView isOpen={isQuranOpen} onClose={() => setQuranOpen(false)} />}
        
        <FloatingActionButton 
            onQiblaClick={() => setQiblaOpen(true)}
            onTasbihClick={() => setTasbihOpen(true)}
            onAdhkarClick={() => setAdhkarOpen(true)}
            onQuranClick={() => setQuranOpen(true)}
        />
      </Suspense>
    </div>
  );
};

export default App;

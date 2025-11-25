import React, { useState, useEffect } from 'react';
import { useTranslation, useLocale } from '../../context/LocaleContext';
import { TasbihSession } from '../../types';

interface TasbihCounterProps {
  isOpen: boolean;
  onClose: () => void;
}

const TASBIH_PHRASES = [
  { ar: 'سبحان الله', en: 'Subhan Allah' },
  { ar: 'الحمد لله', en: 'Alhamdulillah' },
  { ar: 'الله اكبر', en: 'Allahu Akbar' }
];

const PRAYERS_TO_TRACK = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
type PrayerTrackState = Record<string, boolean>;

const getTodayKey = () => new Date().toISOString().split('T')[0];

const TasbihCounter: React.FC<TasbihCounterProps> = ({ isOpen, onClose }) => {
  // --- Component State ---
  const [sessionCount, setSessionCount] = useState(0);
  const [totalCount, setTotalCount] = useState(() => {
    const savedTotal = typeof window !== 'undefined' ? localStorage.getItem('tasbihTotalCount') : null;
    return savedTotal ? parseInt(savedTotal, 10) : 0;
  });
  const [history, setHistory] = useState<TasbihSession[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [prayersToday, setPrayersToday] = useState<PrayerTrackState>({});

  const { t } = useTranslation();
  const { locale } = useLocale();

  // --- Effects for Data Management ---

  // Load and manage total tasbih count
  useEffect(() => {
    localStorage.setItem('tasbihTotalCount', String(totalCount));
  }, [totalCount]);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (isOpen) {
      // Tasbih History
      try {
        const savedHistory = localStorage.getItem('tasbihHistory');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error("Could not parse tasbih history:", e); }

      // Prayer Tracker Data
      try {
        const todayKey = getTodayKey();
        const savedPrayers = localStorage.getItem(`prayers_${todayKey}`);
        if (savedPrayers) {
          setPrayersToday(JSON.parse(savedPrayers));
        } else {
          // Initialize for today if not present
          const initialPrayers = PRAYERS_TO_TRACK.reduce((acc, p) => ({...acc, [p]: false}), {});
          setPrayersToday(initialPrayers);
        }
      } catch (e) { console.error("Could not parse prayer data:", e); }
    }
  }, [isOpen]);
  
  // --- Handlers ---
  
  const handleIncrement = () => {
    setSessionCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleResetSession = () => {
    setTotalCount(prev => prev - sessionCount);
    setSessionCount(0);
  };
  
  const handlePhraseChange = () => {
    setPhraseIndex(prev => (prev + 1) % TASBIH_PHRASES.length);
    setSessionCount(0);
  };
  
  const saveSession = () => {
    if (sessionCount > 0) {
        const newSession: TasbihSession = { date: new Date().toISOString(), count: sessionCount };
        const updatedHistory = [newSession, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('tasbihHistory', JSON.stringify(updatedHistory));
    }
    setSessionCount(0); // Reset for next time
  };

  const handleClose = () => {
    saveSession();
    onClose();
  };

  const handlePrayerToggle = (prayer: string) => {
    const updatedPrayers = { ...prayersToday, [prayer]: !prayersToday[prayer] };
    setPrayersToday(updatedPrayers);
    localStorage.setItem(`prayers_${getTodayKey()}`, JSON.stringify(updatedPrayers));
  };

  const currentPhrase = TASBIH_PHRASES[phraseIndex];

  return (
    <div className={`tasbih-overlay ${isOpen ? 'open' : ''}`}>
      <button onClick={handleClose} className="tasbih-close-button" aria-label={t('close')}>&times;</button>
      
      <div className="worship-tracker-container">
        {/* --- Top Part: Tasbih Counter --- */}
        <div className="tasbih-device">
          <div className="tasbih-screen">
            <div className="tasbih-display-main">{sessionCount}</div>
            <div className="tasbih-phrase" onClick={handlePhraseChange}>{currentPhrase[locale]}</div>
            <div className="tasbih-display-total">{t('total_count')}: {totalCount}</div>
          </div>
          <button className="tasbih-count-button" onClick={handleIncrement} aria-label={t('tasbih_counter')}></button>
          <button onClick={handleResetSession} className="tasbih-button">{t('reset')}</button>
        </div>

        {/* --- Bottom Part: Worship Tracker Section --- */}
        <div className="worship-tracker-section">
          <h2>{t('worship_tracker_title')}</h2>

          {/* Prayer Tracker Card */}
          <div className="tracker-card">
            <h3>{t('prayer_tracker_title')}</h3>
            <p>{t('prayer_tracker_desc')}</p>
            <div className="prayer-tracker-list">
              {PRAYERS_TO_TRACK.map(prayer => (
                <label key={prayer} className="prayer-tracker-item">
                  <input
                    type="checkbox"
                    className="prayer-checkbox"
                    checked={prayersToday[prayer] || false}
                    onChange={() => handlePrayerToggle(prayer)}
                  />
                  <span>{t(prayer)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tasbih History Card */}
          <div className="tracker-card">
            <h3>{t('tasbih_history')}</h3>
            <div className="tasbih-history-list">
              {history.length > 0 ? history.map((session, index) => (
                <div key={index} className="tasbih-history-item">
                  <span className="tasbih-history-date">
                    {new Date(session.date).toLocaleString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="tasbih-history-count">{session.count}</span>
                </div>
              )) : <p style={{ textAlign: 'center', color: '#9ab' }}>{t('no_sessions_yet')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihCounter;
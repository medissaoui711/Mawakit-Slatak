import React from 'react';
import { useTranslation } from '../context/LocaleContext';

interface CountdownTimerProps {
  nextPrayerInfo: { name: string; countdown: string; } | null;
  currentPrayerInfo: { name: string; } | null;
  iqamaCountdown: string | null;
  isRamadan: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ nextPrayerInfo, currentPrayerInfo, iqamaCountdown, isRamadan }) => {
  const { t } = useTranslation();

  // Render Iqama countdown if active
  if (currentPrayerInfo && iqamaCountdown) {
    const prayerKey = currentPrayerInfo.name;
    return (
      <div className="countdown-container">
        <h2 className="countdown-title">
          {t(prayerKey)} - {t('iqama_countdown_title')}
        </h2>
        <p className="countdown-timer">{iqamaCountdown}</p>
      </div>
    );
  }

  // Render next prayer countdown
  if (nextPrayerInfo) {
    const prayerKey = nextPrayerInfo.name;
    let title: string;

    if (isRamadan && prayerKey === 'Maghrib') {
      title = t('iftar_countdown_title');
    } else if (isRamadan && prayerKey === 'Imsak') {
      title = t('imsak_countdown_title');
    } else {
      title = `${t('time_left_for')} ${t(prayerKey)}`;
    }
    
    return (
      <div className="countdown-container">
        <h2 className="countdown-title">{title}</h2>
        <p className="countdown-timer">{nextPrayerInfo.countdown}</p>
      </div>
    );
  }

  // Render nothing if no timer is active
  return null;
};

export default CountdownTimer;
import React from 'react';
import { PrayerTimings } from '../../types';
import { useTranslation } from '../../context/LocaleContext';

interface RamadanInfoProps {
  timings: PrayerTimings;
}

const RamadanInfo: React.FC<RamadanInfoProps> = ({ timings }) => {
  const { t } = useTranslation();
  return (
    <div className="ramadan-info-container">
      <div className="ramadan-badge">{t('ramadan_mode')}</div>
      <div className="ramadan-card">
        <h4>{t('Imsak')}</h4>
        <p>{timings.Imsak.split(' ')[0]}</p>
      </div>
      <div className="ramadan-card dua-card">
        <h4>{t('iftar_dua_title')}</h4>
        <p>{t('iftar_dua_text')}</p>
      </div>
    </div>
  );
};

export default RamadanInfo;
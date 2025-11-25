import React from 'react';
import { useFormattedDates } from '../../utils/dateUtils';
import NotificationControl from '../common/NotificationControl';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface HeaderProps {
    locationName: string;
    onSettingsClick: () => void;
}

const DateDisplay: React.FC = () => {
    const { locale } = useLocale();
    const { gregorianDate, hijriDate } = useFormattedDates(locale);

    if (locale === 'ar') {
        return (
            <div className="info-card date-card">
                <span className="date-primary">{hijriDate}</span>
                <span className="date-secondary">الموافق {gregorianDate}</span>
            </div>
        );
    }

    return (
        <div className="info-card date-card">
            <span className="date-primary">{gregorianDate}</span>
            <span className="date-secondary">{hijriDate}</span>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ locationName, onSettingsClick }) => {
  const { t } = useTranslation();

  return (
    <header className="header">
        <div className="header-controls">
            <div className="header-controls-right">
                <button onClick={onSettingsClick} className="header-button" aria-label={t('settings')}>
                    <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
        </div>

        <div className="header-content">
            <svg className="mosque-icon" viewBox="0 0 512 512" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M256,72 C154.2,72 72,154.2 72,256 C72,357.8 154.2,440 256,440 C357.8,440 440,357.8 440,256 C440,154.2 357.8,72 256,72 Z M256,408 C172.2,408 104,339.8 104,256 C104,172.2 172.2,104 256,104 C339.8,104 408,172.2 408,256 C408,339.8 339.8,408 256,408 Z"/>
                <path stroke="white" strokeWidth="20" fill="none" strokeLinecap="round" d="M256 256 V 110"/>
                <path stroke="white" strokeWidth="20" fill="none" strokeLinecap="round" d="M256 256 L 334 301"/>
                <circle cx="256" cy="256" r="14"/>
                <path stroke="white" strokeWidth="12" strokeLinecap="round" d="M416 256h-16 M359.5 359.5l-11.3-11.3 M256 416v-16 M152.5 359.5l11.3-11.3 M96 256h16 M152.5 152.5l11.3 11.3 M256 96v16 M359.5 152.5l-11.3 11.3"/>
            </svg>
            <h1 className="title">{t('app_title')}</h1>
            
            <div className="info-card location-card">
                <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                <span>{locationName}</span>
            </div>
            
            <DateDisplay />
            
            <NotificationControl />
        </div>
    </header>
  );
};

export default Header;
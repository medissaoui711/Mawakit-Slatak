
import React from 'react';
import { useFormattedDates } from '../../utils/dateUtils';
import NotificationControl from '../common/NotificationControl';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface HeaderProps {
    locationName: string;
    onSettingsClick: () => void;
    onQiblaClick: () => void;
    onTasbihClick: () => void;
    onAdhkarClick: () => void;
    onQuranClick: () => void;
}

// SVG Icons for desktop nav
const QiblaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M14.77,17.29,12,19.25,9.23,17.29a.51.51,0,0,0-.71.45V19a1,1,0,0,0,1,1h4.94a1,1,0,0,0,1-1v-1.26a.51.51,0,0,0-.71-.45ZM18,10a6,6,0,1,0-6,6A6,6,0,0,0,18,10Zm-6-4a4,4,0,1,1-4,4A4,4,0,0,1,12,6Zm0-4A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm8.71,11.25-1.54,1.54-1.24-1.24a8,8,0,0,1-10.86,0L6,14.79,l-1.54-1.54,1.24-1.24a8,8,0,0,1,12.1,1.24Z"/></svg>;
const QuranIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const AdhkarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.135 48.773 48.773 0 0 0 1.178 8.247M5.25 6h9m-9 0a2.25 2.25 0 0 0-2.25 2.25v11.25a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25h-9Z" /></svg>;
const TasbihIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="20" height="20"><path strokeLinecap="round" strokeLinejoin="round" d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M8 7h8v3H8V7z M15 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>;


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


const Header: React.FC<HeaderProps> = ({ locationName, onSettingsClick, onQiblaClick, onQuranClick, onAdhkarClick, onTasbihClick }) => {
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
               <circle cx="256" cy="256" r="240" fill="#d62828" />
               <path d="M256 72 C154.2 72 72 154.2 72 256 C72 357.8 154.2 440 256 440 C357.8 440 440 357.8 440 256 C440 154.2 357.8 72 256 72 Z M256 408 C172.2 408 104 339.8 104 256 C104 172.2 172.2 104 256 104 C339.8 104 408 172.2 408 256 C408 339.8 339.8 408 256 408 Z" fill="white"/>
               <path stroke="white" strokeWidth="20" fill="none" strokeLinecap="round" d="M256 256 V 110"/>
               <path stroke="white" strokeWidth="20" fill="none" strokeLinecap="round" d="M256 256 L 334 301"/>
               <circle cx="256" cy="256" r="14" fill="white"/>
               <path stroke="white" strokeWidth="12" strokeLinecap="round" d="M416 256h-16 M359.5 359.5l-11.3-11.3 M256 416v-16 M152.5 359.5l11.3-11.3 M96 256h16 M152.5 152.5l11.3 11.3 M256 96v16 M359.5 152.5l-11.3 11.3"/>
            </svg>
            <h1 className="title">{t('app_title')}</h1>
            
            {/* Desktop Navigation - Visible only on large screens via CSS */}
            <div className="desktop-nav">
                <button onClick={onQiblaClick} className="desktop-nav-btn"><QiblaIcon /> {t('qibla')}</button>
                <button onClick={onQuranClick} className="desktop-nav-btn"><QuranIcon /> {t('quran')}</button>
                <button onClick={onAdhkarClick} className="desktop-nav-btn"><AdhkarIcon /> {t('adhkar')}</button>
                <button onClick={onTasbihClick} className="desktop-nav-btn"><TasbihIcon /> {t('tasbih_counter')}</button>
            </div>
            
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

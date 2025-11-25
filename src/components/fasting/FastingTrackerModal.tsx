import React, { useState, useEffect, useMemo } from 'react';
import { DailyPrayerData } from '../../types';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface FastingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyData: DailyPrayerData[] | null;
  currentDate: Date;
  changeMonth: (offset: number) => void;
}

const getInitialFastedDays = (): Set<string> => {
    try {
        const saved = localStorage.getItem('fastedDays');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
        return new Set();
    }
};

const FastingTrackerModal: React.FC<FastingTrackerModalProps> = ({
  isOpen,
  onClose,
  monthlyData,
  currentDate,
  changeMonth,
}) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [fastedDays, setFastedDays] = useState<Set<string>>(getInitialFastedDays);

  useEffect(() => {
    try {
        localStorage.setItem('fastedDays', JSON.stringify(Array.from(fastedDays)));
    } catch (e) {
        console.error('Failed to save fasted days', e);
    }
  }, [fastedDays]);

  if (!isOpen) return null;

  const handleDayClick = (dateStr: string) => {
    setFastedDays(prev => {
        const newSet = new Set(prev);
        if (newSet.has(dateStr)) {
            newSet.delete(dateStr);
        } else {
            newSet.add(dateStr);
        }
        return newSet;
    });
  };

  const monthName = currentDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short' });
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(2023, 0, 1 + i); // A Sunday
        return formatter.format(date);
    });
  }, [locale]);
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayISO = today.toISOString().split('T')[0];

  const firstDayOfMonth = monthlyData ? new Date(monthlyData[0].date.gregorian.date.split('-').reverse().join('-') + 'T00:00:00') : new Date();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div
        className={`modal-content fasting-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fasting-tracker-title"
      >
        <div className="calendar-nav">
          <button onClick={() => changeMonth(1)}>→ {t('next_month')}</button>
          <h3 id="fasting-tracker-title">{monthName}</h3>
          <button onClick={() => changeMonth(-1)}>{t('previous_month')} ←</button>
        </div>
        
        {monthlyData ? (
          <>
            <div className="calendar-grid">
              {weekdays.map(day => <div key={day} className="weekday-header">{day}</div>)}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`}></div>)}
              {monthlyData.map(dayData => {
                  const dayDate = new Date(dayData.date.gregorian.date.split('-').reverse().join('-') + 'T00:00:00');
                  const dayISO = dayDate.toISOString().split('T')[0];
                  const dayOfWeek = dayDate.getDay();
                  const hijriDay = dayData.date.hijri.day;

                  const isFasted = fastedDays.has(dayISO);
                  const isToday = dayISO === todayISO;
                  const isMonThu = dayOfWeek === 1 || dayOfWeek === 4;
                  const isWhiteDay = ['13', '14', '15'].includes(hijriDay);
                  
                  const classes = `day-cell ${isFasted ? 'fasted' : ''} ${isToday ? 'today' : ''}`;

                  return (
                    <div key={dayISO} className={classes} onClick={() => handleDayClick(dayISO)} role="button">
                        <span>{dayData.date.gregorian.day}</span>
                        <div className="recommendation-dots">
                            {isMonThu && <div className="dot mon-thu"></div>}
                            {isWhiteDay && <div className="dot white-day"></div>}
                        </div>
                    </div>
                  )
              })}
            </div>
            <div className="calendar-legend">
                <div className="legend-item"><div className="color-box fasted"></div>{t('fasted')}</div>
                <div className="legend-item"><div className="color-box mon-thu"></div>{t('mondays_thursdays')}</div>
                <div className="legend-item"><div className="color-box white-day"></div>{t('the_white_days')}</div>
            </div>
          </>
        ) : (
          <div className="status-container" style={{ minHeight: '30vh' }}>
            <div className="spinner"></div>
            <span>{t('loading_month_data')}</span>
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>{t('close')}</button>
      </div>
    </>
  );
};

export default FastingTrackerModal;
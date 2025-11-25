import React from 'react';
import { DailyPrayerData, PrayerTimings } from '../../types';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface MonthlyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyData: DailyPrayerData[] | null;
  currentDate: Date;
  changeMonth: (offset: number) => void;
}

const prayerKeys: (keyof PrayerTimings)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const MonthlyCalendarModal: React.FC<MonthlyCalendarModalProps> = ({
  isOpen,
  onClose,
  monthlyData,
  currentDate,
  changeMonth,
}) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  if (!isOpen) return null;

  const monthName = currentDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isCurrentMonthView = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  const nextMonthText = locale === 'ar' ? `${t('next_month')} →` : `${t('next_month')} →`;
  const prevMonthText = locale === 'ar' ? `← ${t('previous_month')}` : `← ${t('previous_month')}`;


  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div
        className={`modal-content monthly-calendar-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-title"
      >
        <div className="calendar-nav">
          <button onClick={() => changeMonth(1)}>{nextMonthText}</button>
          <h3 id="calendar-title">{monthName}</h3>
          <button onClick={() => changeMonth(-1)}>{prevMonthText}</button>
        </div>
        <div className="calendar-table-container">
          {monthlyData ? (
            <table className="calendar-table">
              <thead>
                <tr>
                  <th>{t('day')}</th>
                  <th>{t('hijri')}</th>
                  {prayerKeys.map(p => <th key={p}>{t(p)}</th>)}
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((dayData) => {
                  const dayNumber = Number(dayData.date.gregorian.day);
                  const isToday = isCurrentMonthView && dayNumber === today.getDate();
                  return (
                    <tr key={dayData.date.gregorian.date} className={isToday ? 'today-row' : ''}>
                      <td>{dayData.date.gregorian.day}</td>
                      <td>{dayData.date.hijri.day} {locale === 'ar' ? dayData.date.hijri.month.ar.split(' ')[0] : dayData.date.hijri.month.en}</td>
                      {prayerKeys.map(p => <td key={p}>{dayData.timings[p].split(' ')[0]}</td>)}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="status-container" style={{minHeight: '40vh'}}>
              <div className="spinner"></div>
              <span>{t('loading_month_data')}</span>
            </div>
          )}
        </div>
        <button className="close-button" onClick={onClose}>{t('close')}</button>
      </div>
    </>
  );
};

export default MonthlyCalendarModal;
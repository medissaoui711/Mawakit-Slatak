import React, { useMemo } from 'react';
import { HADITHS_OF_THE_DAY } from '../../constants/hadiths';
import { useTranslation, useLocale } from '../../context/LocaleContext';

const HadithOfTheDay: React.FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();

    const dailyHadith = useMemo(() => {
        // Ensure the array is not empty to prevent modulo by zero
        if (!HADITHS_OF_THE_DAY || HADITHS_OF_THE_DAY.length === 0) {
            return null;
        }
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const hadithIndex = dayOfYear % HADITHS_OF_THE_DAY.length;
        return HADITHS_OF_THE_DAY[hadithIndex];
    }, []);
    
    // If no hadith could be determined, render nothing to avoid crashing.
    if (!dailyHadith) {
        return null;
    }

    const hadithText = dailyHadith[locale] || '';
    const hadithRef = dailyHadith.reference ? (dailyHadith.reference[locale] || '') : '';

    return (
        <div className="hadith-of-the-day-card">
            <h3>{t('hadith_of_the_day')}</h3>
            <p>"{hadithText}"</p>
            <small>{hadithRef}</small>
        </div>
    );
};

export default HadithOfTheDay;
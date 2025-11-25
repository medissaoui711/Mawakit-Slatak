import React, { useMemo } from 'react';
import { DUAS_OF_THE_DAY } from '../../constants/adhkar';
import { useTranslation, useLocale } from '../../context/LocaleContext';

const DuaOfTheDay: React.FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();

    const dailyDua = useMemo(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const duaIndex = dayOfYear % DUAS_OF_THE_DAY.length;
        return DUAS_OF_THE_DAY[duaIndex];
    }, []);

    return (
        <div className="dua-of-the-day-card">
            <h3>{t('dua_of_the_day')}</h3>
            <p>{dailyDua[locale]}</p>
        </div>
    );
};

export default DuaOfTheDay;
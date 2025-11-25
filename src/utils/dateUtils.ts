import { useState, useEffect } from 'react';
import { Locale } from '../types';

export const useFormattedDates = (locale: Locale) => {
    const [gregorianDate, setGregorianDate] = useState('');
    const [hijriDate, setHijriDate] = useState('');

    useEffect(() => {
        const now = new Date();
        
        // --- Gregorian Date Formatting ---
        // Explicitly set Gregorian calendar for 'ar' locale to avoid system defaults
        const gregorianLocale = locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US';
        const gregorianOptions: Intl.DateTimeFormatOptions = {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        };
        // For English, show the full date with weekday
        if (locale === 'en') {
            gregorianOptions.weekday = 'long';
        }
        const gregorianFormatter = new Intl.DateTimeFormat(gregorianLocale, gregorianOptions);
        
        let formattedGregorian = gregorianFormatter.format(now);
        if (locale === 'ar') {
            formattedGregorian += ' م'; // Add Miladi symbol for Arabic
        }
        setGregorianDate(formattedGregorian);


        // --- Hijri Date Formatting ---
        const hijriLocale = locale === 'ar' ? 'ar-SA-u-ca-islamic-nu-latn' : 'en-US-u-ca-islamic';
        const hijriOptions: Intl.DateTimeFormatOptions = {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        };
        // For Arabic, show the full date with weekday as the primary display
        if (locale === 'ar') {
            hijriOptions.weekday = 'long';
        }
        
        const hijriFormatter = new Intl.DateTimeFormat(hijriLocale, hijriOptions);
        let formattedHijri = hijriFormatter.format(now);

        // Manually add 'هـ' suffix for Arabic for consistency
        if (locale === 'ar') {
            formattedHijri = formattedHijri.replace('هـ', '').trim() + ' هـ';
        }
        setHijriDate(formattedHijri);

    }, [locale]);

    return { gregorianDate, hijriDate };
};
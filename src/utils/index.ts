import { AlAdhanMonthlyResponse, DailyPrayerData, Locale } from '../types';

const API_BASE_URL = 'https://api.aladhan.com/v1';

const fetchMonthlyData = async (url: string): Promise<DailyPrayerData[]> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok.');
    const data: AlAdhanMonthlyResponse = await response.json();
    if (data.code === 200) {
        return data.data;
    } else {
        throw new Error(data.status || 'Failed to fetch prayer times from the API.');
    }
};

export const fetchPrayerTimesByCoords = async (lat: number, lon: number, method: number, school: number, month: number, year: number): Promise<DailyPrayerData[]> => {
    const url = `${API_BASE_URL}/calendar?latitude=${lat}&longitude=${lon}&method=${method}&school=${school}&month=${month}&year=${year}`;
    return fetchMonthlyData(url);
};

export const fetchPrayerTimesByCity = async (city: string, country: string, method: number, school: number, month: number, year: number): Promise<DailyPrayerData[]> => {
    const url = `${API_BASE_URL}/calendarByCity?city=${city}&country=${country}&method=${method}&school=${school}&month=${month}&year=${year}`;
    return fetchMonthlyData(url);
};


export const fetchCityAndCountry = async (lat: number, lon: number, locale: Locale): Promise<{ city: string, country: string }> => {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${locale}`);
    if (!response.ok) {
        throw new Error('Failed to fetch location name.');
    }
    const data = await response.json();

    const city = data.city || data.locality || (locale === 'ar' ? 'موقع غير معروف' : 'Unknown Location');
    const country = data.countryName || '';
    
    if (!data.city && !data.locality) {
        console.warn('Could not determine city from location data.', data);
    }

    return { city, country };
}
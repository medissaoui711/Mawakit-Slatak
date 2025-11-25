import { SurahInfo, SurahDetailData, Ayah, Tafseer } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

interface ApiSurahListResponse {
    code: number;
    status: string;
    data: SurahInfo[];
}

interface ApiSurahContentResponse {
    code: number;
    status: string;
    data: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: 'Meccan' | 'Medinan';
        numberOfAyahs: number;
        ayahs: Ayah[];
        edition: object;
    }[];
}


export const fetchSurahList = async (language: 'ar' | 'en'): Promise<SurahInfo[]> => {
    const cacheKey = `quran_surah_list_${language}`;
    try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (e) {
        console.error("Failed to read from localStorage", e);
    }

    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    const data: ApiSurahListResponse = await response.json();
    if (data.code === 200) {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data.data));
        } catch (e) {
            console.error("Failed to write to localStorage", e);
        }
        return data.data;
    } else {
        throw new Error(data.status || 'Failed to fetch surah list from the API.');
    }
};


export const fetchSurahContent = async (surahNumber: number): Promise<SurahDetailData> => {
    const cacheKey = `quran_surah_${surahNumber}`;
    try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (e) {
        console.error("Failed to read from localStorage", e);
    }

    // Fetch both Quran text (quran-uthmani) and Tafseer (ar.muyassar) in one call
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,ar.muyassar`);
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    const data: ApiSurahContentResponse = await response.json();

    if (data.code === 200 && data.data.length >= 2) {
        const quranData = data.data[0];
        const tafseerData = data.data[1];

        // Merge Tafseer into the main Ayah objects
        const mergedAyahs = quranData.ayahs.map((ayah, index) => ({
            ...ayah,
            tafseer: tafseerData.ayahs[index].text
        }));

        const surahDetail: SurahDetailData = {
            ...quranData,
            ayahs: mergedAyahs,
        };

        try {
            localStorage.setItem(cacheKey, JSON.stringify(surahDetail));
        } catch (e) {
            console.error("Failed to write to localStorage", e);
        }

        return surahDetail;
    } else {
        throw new Error(data.status || 'Failed to fetch surah content from the API.');
    }
};

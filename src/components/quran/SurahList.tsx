import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SurahInfo } from '../../types';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface SurahListProps {
  surahs: SurahInfo[];
  onSelectSurah: (surah: SurahInfo) => void;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah }) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(null);

  useEffect(() => {
    const lastRead = localStorage.getItem('quran_last_read');
    if (lastRead) {
      setLastReadSurah(parseInt(lastRead, 10));
    }
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!searchTerm) return surahs;
    const lowercasedFilter = searchTerm.toLowerCase();
    return surahs.filter(surah =>
      surah.name.toLowerCase().includes(lowercasedFilter) ||
      surah.englishName.toLowerCase().includes(lowercasedFilter) ||
      String(surah.number).includes(lowercasedFilter)
    );
  }, [searchTerm, surahs]);

  const handleContinueReading = () => {
    if (lastReadSurah) {
      const surahToContinue = surahs.find(s => s.number === lastReadSurah);
      if (surahToContinue) {
        onSelectSurah(surahToContinue);
      }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div>
      <input
        type="search"
        className="quran-search-bar"
        placeholder={t('search_surah_placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {lastReadSurah && (
        <button onClick={handleContinueReading} className="continue-reading-btn">
          {t('continue_reading')} (سورة {surahs.find(s => s.number === lastReadSurah)?.name})
        </button>
      )}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {filteredSurahs.map(surah => (
          <motion.div
            key={surah.number}
            className="surah-list-item"
            onClick={() => onSelectSurah(surah)}
            variants={itemVariants}
          >
            <div className="surah-number-badge">{surah.number}</div>
            <div className="surah-info">
              <div className="surah-name-ar">{surah.name}</div>
              <div className="surah-name-en">{surah.englishName}</div>
            </div>
            <div className="surah-metadata">
              <div>{t(surah.revelationType === 'Meccan' ? 'meccan' : 'medinan')}</div>
              <div>{surah.numberOfAyahs} {t('ayahs_count')}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SurahList;

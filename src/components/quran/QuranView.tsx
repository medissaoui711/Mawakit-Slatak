import React, { useState, useEffect } from 'react';
import { useTranslation, useLocale } from '../../context/LocaleContext';
import { fetchSurahList } from '../../utils/quranApi';
import { SurahInfo } from '../../types';
import SurahList from './SurahList';
import SurahDetail from './SurahDetail';

interface QuranViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuranView: React.FC<QuranViewProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [surahs, setSurahs] = useState<SurahInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<SurahInfo | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const surahList = await fetchSurahList(locale);
        setSurahs(surahList);
      } catch (err) {
        setError(t('error_unknown_fetching'));
      } finally {
        setLoading(false);
      }
    };
    loadSurahs();
  }, [locale, t]);
  
  const handleSelectSurah = (surah: SurahInfo) => {
    setSelectedSurah(surah);
  };
  
  const handleBack = () => {
    setSelectedSurah(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="status-container">
          <div className="spinner"></div>
        </div>
      );
    }
    if (error) {
      return <div className="status-container error">{error}</div>;
    }
    if (selectedSurah) {
        return <SurahDetail surah={selectedSurah} onBack={handleBack} />;
    }
    if (surahs) {
      return <SurahList surahs={surahs} onSelectSurah={handleSelectSurah} />;
    }
    return null;
  };

  return (
    <div className={`quran-view-overlay ${isOpen ? 'open' : ''}`}>
      <div className="quran-view-content">
        <header className="quran-header">
           <button 
                onClick={selectedSurah ? handleBack : onClose} 
                aria-label={selectedSurah ? 'Back to list' : t('close')}
                style={{ transform: locale === 'ar' ? 'scaleX(-1)' : 'scaleX(1)' }}
            >
             {selectedSurah ? '→' : '×'}
           </button>
           <h2>{selectedSurah ? selectedSurah.name : t('quran')}</h2>
           <div style={{ width: '24px' }}></div> {/* Spacer */}
        </header>
        <div className="quran-body">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default QuranView;

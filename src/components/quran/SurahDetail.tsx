import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SurahInfo, SurahDetailData, Ayah } from '../../types';
import { fetchSurahContent } from '../../utils/quranApi';
import { useTranslation } from '../../context/LocaleContext';
import TafseerModal from './TafseerModal';
import audioManager from '../../utils/audioManager';

interface SurahDetailProps {
  surah: SurahInfo;
  onBack: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M8 5v14l11-7z" />
    </svg>
);
const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M6 6h12v12H6z" />
    </svg>
);
const BigPlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 5v14l11-7z" />
    </svg>
);
const BigStopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M6 6h12v12H6z" />
    </svg>
);

const SurahDetail: React.FC<SurahDetailProps> = ({ surah, onBack }) => {
  const [surahData, setSurahData] = useState<SurahDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [isContinuous, setIsContinuous] = useState(false);
  
  const activeAyahRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Fetch Surah Data
  useEffect(() => {
    const loadSurah = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSurahContent(surah.number);
        setSurahData(data);
        localStorage.setItem('quran_last_read', String(surah.number));
      } catch (err) {
        setError(t('error_loading_surah'));
      } finally {
        setLoading(false);
      }
    };
    loadSurah();

    return () => {
        audioManager.stop();
    };
  }, [surah.number, t]);

  // Scroll to active ayah
  useEffect(() => {
      if (playingAyahNumber && activeAyahRef.current) {
          activeAyahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [playingAyahNumber]);

  // Audio Logic
  const playAyahAudio = useCallback((ayahNumber: number) => {
      const audioSrc = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
      audioManager.play(audioSrc);
      setPlayingAyahNumber(ayahNumber);
  }, []);

  const handleNextAyah = useCallback(() => {
      if (!surahData || !playingAyahNumber) return;

      const currentIndex = surahData.ayahs.findIndex(a => a.number === playingAyahNumber);
      if (currentIndex !== -1 && currentIndex < surahData.ayahs.length - 1) {
          const nextAyah = surahData.ayahs[currentIndex + 1];
          playAyahAudio(nextAyah.number);
      } else {
          // End of Surah
          setPlayingAyahNumber(null);
          setIsContinuous(false);
          audioManager.stop();
      }
  }, [surahData, playingAyahNumber, playAyahAudio]);

  // Audio Event Listeners
  useEffect(() => {
      const audioEl = audioManager.getAudioElement();

      const onEnded = () => {
          if (isContinuous) {
              handleNextAyah();
          } else {
              setPlayingAyahNumber(null);
          }
      };

      const onPause = () => {
          // Only clear state if explicitly paused by user action not handled by manager switching tracks
          // But here we rely on isPlaying check in manager. 
          // We'll keep state active for UI, but if audio actually stops without next track, onEnded handles it.
      };
      
      audioEl.addEventListener('ended', onEnded);
      
      return () => {
          audioEl.removeEventListener('ended', onEnded);
      }
  }, [isContinuous, handleNextAyah]);


  const togglePlaySurah = () => {
      if (!surahData) return;

      if (isContinuous && playingAyahNumber) {
          // Stop
          audioManager.stop();
          setPlayingAyahNumber(null);
          setIsContinuous(false);
      } else {
          // Start from beginning or current
          const startAyah = playingAyahNumber 
            ? surahData.ayahs.find(a => a.number === playingAyahNumber) 
            : surahData.ayahs[0];
          
          if (startAyah) {
              setIsContinuous(true);
              playAyahAudio(startAyah.number);
          }
      }
  };

  const handleAyahClickPlay = (ayahNumber: number) => {
      if (playingAyahNumber === ayahNumber) {
          audioManager.stop();
          setPlayingAyahNumber(null);
          setIsContinuous(false);
      } else {
          // Playing a specific ayah stops continuous mode unless we want to start continuous FROM here
          // For simple UX: clicking a specific ayah plays just that ayah (or starts continuous from there? let's do single for control)
          // User request: "Continuous reading". Let's assume manual click starts continuous from that point.
          setIsContinuous(true); 
          playAyahAudio(ayahNumber);
      }
  }

  // Helper to clean text (Remove Basmalah from first Ayah if it exists and isn't Fatiha/Naml)
  const getAyahText = (text: string, surahNum: number, ayahInSurah: number) => {
      if (surahNum === 1 || surahNum === 27) return text; // Fatiha and Naml keep it
      const basmalah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
      if (ayahInSurah === 1 && text.startsWith(basmalah)) {
          return text.replace(basmalah, '').trim();
      }
      return text;
  };

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
  if (!surahData) return null;

  return (
    <>
      <div className="surah-detail-view">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button 
                onClick={togglePlaySurah}
                className="continue-reading-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: 'auto', padding: '10px 24px' }}
            >
                {isContinuous && playingAyahNumber ? <BigStopIcon /> : <BigPlayIcon />}
                <span>{isContinuous && playingAyahNumber ? t('stop_recitation') : t('play_surah')}</span>
            </button>
        </div>

        {surah.number !== 1 && surah.number !== 9 && (
          <p className="basmalah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        )}

        {surahData.ayahs.map((ayah) => {
            const isPlaying = playingAyahNumber === ayah.number;
            return (
                <div 
                    key={ayah.numberInSurah} 
                    className={`ayah-wrapper ${isPlaying ? 'active-ayah' : ''}`}
                    ref={isPlaying ? activeAyahRef : null}
                >
                    <button className="ayah-play-button" onClick={() => handleAyahClickPlay(ayah.number)}>
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                    </button>
                    <span className="ayah-container" onClick={() => setSelectedAyah(ayah)}>
                        {getAyahText(ayah.text, surah.number, ayah.numberInSurah)}
                        <span className="ayah-number-badge-inline">{ayah.numberInSurah}</span>
                    </span>
                </div>
            );
        })}
      </div>
      <AnimatePresence>
        {selectedAyah && (
          <TafseerModal 
              key="tafseer_modal"
              ayah={selectedAyah}
              onClose={() => setSelectedAyah(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SurahDetail;
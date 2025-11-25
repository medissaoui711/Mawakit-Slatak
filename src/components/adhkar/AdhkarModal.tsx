import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation, useLocale } from '../../context/LocaleContext';
import { ADHKAR_DATA } from '../../constants/adhkar';
import { Dhikr } from '../../types';
import audioManager from '../../utils/audioManager';

interface AdhkarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6 6h12v12H6z" />
    </svg>
);


const AdhkarModal: React.FC<AdhkarModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState(ADHKAR_DATA[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isOpen) {
        audioManager.stop();
    }
  }, [isOpen]);

  useEffect(() => {
    const audioEl = audioManager.getAudioElement();
    const handleAudioStateChange = () => {
        const currentCategory = ADHKAR_DATA.find(cat => cat.id === activeTab);
        if (currentCategory?.audioSrc) {
            setIsPlaying(audioManager.isPlaying(currentCategory.audioSrc));
        } else {
            setIsPlaying(false);
        }
    };
    
    audioEl.addEventListener('play', handleAudioStateChange);
    audioEl.addEventListener('pause', handleAudioStateChange);
    audioEl.addEventListener('ended', handleAudioStateChange);

    return () => {
        audioEl.removeEventListener('play', handleAudioStateChange);
        audioEl.removeEventListener('pause', handleAudioStateChange);
        audioEl.removeEventListener('ended', handleAudioStateChange);
    };
  }, [activeTab]);

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return ADHKAR_DATA;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return ADHKAR_DATA.map(category => {
      const filteredItems = category.items.filter(item => 
        item.text[locale].toLowerCase().includes(lowercasedFilter)
      );
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [searchTerm, locale]);

  const currentCategory = useMemo(() => {
    return filteredData.find(cat => cat.id === activeTab) || filteredData[0];
  }, [activeTab, filteredData]);
  
  const handlePlayToggle = () => {
    if (currentCategory?.audioSrc) {
        if (isPlaying) {
            audioManager.stop();
        } else {
            audioManager.play(currentCategory.audioSrc);
        }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div
        className={`modal-content adhkar-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="adhkar-title"
      >
        <h2 id="adhkar-title">{t('adhkar')}</h2>
        
        <input 
          type="search"
          className="adhkar-search-bar"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="adhkar-tabs-container">
            <div className="adhkar-tabs">
            {filteredData.map(category => (
                <button
                key={category.id}
                className={`adhkar-tab ${currentCategory?.id === category.id ? 'active' : ''}`}
                onClick={() => setActiveTab(category.id)}
                >
                {category.title[locale]}
                </button>
            ))}
            </div>
             {currentCategory?.audioSrc && (
                <button onClick={handlePlayToggle} className="adhkar-play-button" aria-label="Play Adhkar">
                    {isPlaying ? <StopIcon/> : <PlayIcon />}
                </button>
            )}
        </div>

        <div className="adhkar-content">
          {currentCategory && currentCategory.items.map((item: Dhikr) => (
            <div key={item.id} className="dhikr-item">
              <p>{item.text[locale]}</p>
              <small>
                {item.count && item.count > 1 ? `${t('read')} ${item.count} ${t('times')}` : ''}
                {item.count && item.reference[locale] ? ' - ' : ''}
                {item.reference[locale]}
              </small>
            </div>
          ))}
          {filteredData.length === 0 && <p>{t('no_results')}</p>}
        </div>

        <button className="close-button" onClick={onClose}>{t('close')}</button>
      </div>
    </>
  );
};

export default AdhkarModal;
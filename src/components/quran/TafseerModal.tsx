import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ayah } from '../../types';
import { useTranslation } from '../../context/LocaleContext';

interface TafseerModalProps {
  ayah: Ayah;
  onClose: () => void;
}

// Icon Components
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;


const TafseerModal: React.FC<TafseerModalProps> = ({ ayah, onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const textToShare = `${ayah.text} [${ayah.numberInSurah}]\n\n${t('tafseer_title')} ${ayah.numberInSurah}:\n${ayah.tafseer}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t('quran')} - Ayah ${ayah.numberInSurah}`,
          text: textToShare,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // User canceled the share. Do nothing.
        } else {
          console.error('Error sharing:', error);
        }
      }
    }
  };

  const backdropVariants = {
    visible: { opacity: 1, pointerEvents: 'auto' },
    hidden: { opacity: 0, pointerEvents: 'none' },
  };

  const modalVariants = {
    hidden: {
      scale: 0.9,
      opacity: 0,
      x: '-50%',
      y: '-50%',
      pointerEvents: 'none',
    },
    visible: {
      scale: 1,
      opacity: 1,
      x: '-50%',
      y: '-50%',
      pointerEvents: 'auto',
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      x: '-50%',
      y: '-50%',
      pointerEvents: 'none',
      transition: { duration: 0.15, ease: 'easeIn' },
    }
  };


  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      style={{ zIndex: 600 }}
    >
      <motion.div
        className="modal-content tafseer-modal"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        style={{ zIndex: 601 }}
      >
        <h2 id="tafseer-title">{t('tafseer_title')} {ayah.numberInSurah}</h2>
        <div className="tafseer-ayah-text">{ayah.text}</div>
        <div className="tafseer-content">
          <p>{ayah.tafseer}</p>
        </div>
        
        <div className="tafseer-actions-container">
          <button onClick={handleCopy} className="tafseer-action-button" aria-label={t('copy_tafseer')}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          {navigator.share && (
             <button onClick={handleShare} className="tafseer-action-button" aria-label="Share">
                <ShareIcon />
             </button>
          )}
        </div>
        
        <button className="close-button" onClick={onClose}>{t('close')}</button>
      </motion.div>
    </motion.div>
  );
};

export default TafseerModal;
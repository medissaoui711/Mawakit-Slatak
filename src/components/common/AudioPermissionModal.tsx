
import React from 'react';
import { useTranslation } from '../../context/LocaleContext';

interface AudioPermissionModalProps {
  onEnable: () => void;
}

const AudioPermissionModal: React.FC<AudioPermissionModalProps> = ({ onEnable }) => {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay open" style={{ zIndex: 2000 }}>
      <div className="modal-content open" style={{ maxWidth: '300px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>{t('enable_audio_title')}</h2>
        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{t('enable_audio_desc')}</p>
        <button 
            className="close-button" 
            onClick={onEnable}
            style={{ width: '100%', marginTop: '0', backgroundColor: 'var(--primary-red)' }}
        >
            {t('enable_audio_button')}
        </button>
      </div>
    </div>
  );
};

export default AudioPermissionModal;

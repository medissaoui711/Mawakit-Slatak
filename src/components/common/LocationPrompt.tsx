import React from 'react';
import { useSettings } from '../../context/PrayerContext';
import { useTranslation, useLocale } from '../../context/LocaleContext';

interface LocationPromptProps {
  status?: 'prompt' | 'denied';
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ status = 'prompt' }) => {
  const { fetchAndSetLocation, isLocationLoading, locationError } = useSettings();
  const { t } = useTranslation();
  const { locale } = useLocale();

  if (status === 'denied') {
    return (
      <div className="location-prompt-container">
        <div className="location-prompt-card">
          <svg className="location-prompt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
          <h2>{t('location_denied_title')}</h2>
          <p>{t('location_denied_desc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-prompt-container">
      <div className="location-prompt-card">
        <svg className="location-prompt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
        <h2>{t('location_prompt_title')}</h2>
        <p>{t('location_prompt_desc')}</p>
        
        {locationError && (
            <div 
                className="error" 
                style={{ 
                    margin: '16px 0 0', 
                    padding: '10px', 
                    backgroundColor: 'var(--highlight-pink)', 
                    borderRadius: '8px',
                    fontWeight: 500
                }}
            >
                {locationError}
            </div>
        )}

        <button onClick={() => fetchAndSetLocation(locale)} disabled={isLocationLoading} style={{ marginTop: '24px' }}>
          {isLocationLoading ? (
            <div className="spinner-small"></div>
          ) : (
            t('location_prompt_button')
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationPrompt;
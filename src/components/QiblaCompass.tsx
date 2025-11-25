import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useQibla } from '../hooks/useQibla';
import { Location } from '../types';
import { useTranslation } from '../context/LocaleContext';

const KaabaIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25ZM6 5.25a.75.75 0 0 0-.75.75v12.75c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H6Zm3.75 3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
);


// --- Standard Compass Component (Luxury Watch Style) ---
interface StandardCompassProps {
    onSwitchToAR: () => void;
    qiblaDirection: number | null;
    deviceAngle: number | null;
    sensorError: string | null;
}

const StandardCompass: React.FC<StandardCompassProps> = ({ onSwitchToAR, qiblaDirection, deviceAngle, sensorError }) => {
    const dialRotation = deviceAngle !== null ? -deviceAngle : 0;
    const qiblaMarkerInitialRotation = qiblaDirection !== null ? qiblaDirection : 0;
    const { t } = useTranslation();
    
    const isAligned = useMemo(() => {
        if (qiblaDirection === null || deviceAngle === null) return false;
        const diff = Math.abs(qiblaDirection - deviceAngle);
        return diff < 5 || diff > 355; // aligned if within ~5 degrees
    }, [qiblaDirection, deviceAngle]);

    const renderContent = () => {
        if (sensorError) {
            return <p className="error">{sensorError}</p>;
        }
        if (qiblaDirection === null || deviceAngle === null) {
            return (
                <>
                    <div className="spinner" style={{borderColor: '#374151', borderBottomColor: '#d62828'}}></div>
                    <p>{t('calibrating_compass')}</p>
                </>
            );
        }

        return (
            <>
                <div className="digital-readout-lux">
                    <span>{t('qibla')}: {Math.round(qiblaDirection)}°</span>
                    <span>{t('device')}: {Math.round(deviceAngle)}°</span>
                </div>

                <div className="compass-bezel">
                    <div className="heading-marker-lux"></div>
                    <div className="compass-dial-lux" style={{ transform: `rotate(${dialRotation}deg)` }}>
                        <div className="north-arrow"></div>
                        <div 
                            className={`qibla-icon-lux ${isAligned ? 'glow' : ''}`}
                            style={{ transform: `rotate(${qiblaMarkerInitialRotation}deg) translateY(-120px)` }}
                        >
                            <KaabaIconSVG />
                        </div>
                    </div>
                </div>

                <div className="compass-instructions">
                    <p>{t('compass_instructions')}</p>
                </div>
                <button onClick={onSwitchToAR} className="ar-switch-button">
                    {t('try_ar_compass')}
                </button>
            </>
        );
    }
    
    return renderContent();
};


// --- AR Compass Component (Immersive Experience) ---
interface ARCompassProps {
  onClose: () => void;
  qiblaDirection: number | null;
  distanceToKaaba: number | null;
  deviceAngle: number | null;
  sensorError: string | null;
}

const ARCompass: React.FC<ARCompassProps> = ({ onClose, qiblaDirection, distanceToKaaba, deviceAngle, sensorError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const HORIZONTAL_FOV = 60; // Estimated field of view for mobile cameras
  const { t } = useTranslation();

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setCameraError(t('error_camera_permission'));
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [t]);
  
  const finalError = cameraError || sensorError;

  const renderARContent = () => {
    if (finalError) return <p className="error" style={{ background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '12px' }}>{finalError}</p>;
    if (qiblaDirection === null || deviceAngle === null) {
      return (
        <div style={{ background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '12px' }}>
          <p>{t('determining_direction')}</p>
        </div>
      );
    }

    let angleDiff = qiblaDirection - deviceAngle;
    // Normalize angle to be between -180 and 180
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    
    const isVisible = Math.abs(angleDiff) < HORIZONTAL_FOV / 2;
    const isLockedOn = Math.abs(angleDiff) < 2.5; // Tighter threshold for lock-on
    const screenXPercent = 50 + (angleDiff / (HORIZONTAL_FOV / 2)) * 50;

    return (
      <div className="ar-content-wrapper">
        {!isVisible && angleDiff > 0 && <div className="ar-guidance-arrow right">{'<'}</div>}
        
        <div
          className={`ar-qibla-target ${isLockedOn ? 'locked-on' : ''}`}
          style={{ 
            left: `${screenXPercent}%`,
            opacity: isVisible ? 1 : 0
          }}
        >
            <div className="ar-lockon-circle"></div>
            <div className="ar-qibla-icon"><KaabaIconSVG /></div>
            {distanceToKaaba !== null && (
                <div className="ar-distance-display">{Math.round(distanceToKaaba)} {t('km')}</div>
            )}
        </div>

        {!isVisible && angleDiff < 0 && <div className="ar-guidance-arrow left">{'>'}</div>}
      </div>
    );
  }

  return (
    <div className="ar-compass-overlay">
      <video ref={videoRef} className="qibla-video" autoPlay playsInline muted></video>
      <button onClick={onClose} className="compass-close-button">&times;</button>
      {renderARContent()}
    </div>
  );
};


// --- Container Component (Main Export) ---
interface QiblaCompassContainerProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: Location | null;
}

const QiblaCompassContainer: React.FC<QiblaCompassContainerProps> = ({ isOpen, onClose, userLocation }) => {
  const [mode, setMode] = useState<'standard' | 'ar'>('standard');
  const { qiblaDirection, distanceToKaaba, deviceAngle, sensorError } = useQibla(userLocation);
  
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setMode('standard'), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  if (mode === 'ar') {
    return (
        <ARCompass
          onClose={onClose}
          qiblaDirection={qiblaDirection}
          distanceToKaaba={distanceToKaaba}
          deviceAngle={deviceAngle}
          sensorError={sensorError}
        />
    )
  }

  return (
    <div className={`compass-container-overlay ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className="compass-close-button">&times;</button>
      <StandardCompass
          onSwitchToAR={() => setMode('ar')}
          qiblaDirection={qiblaDirection}
          deviceAngle={deviceAngle}
          sensorError={sensorError}
      />
    </div>
  );
};

export default QiblaCompassContainer;
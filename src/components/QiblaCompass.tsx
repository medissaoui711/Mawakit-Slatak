
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQibla } from '../hooks/useQibla';
import { Location } from '../types';
import { useTranslation } from '../context/LocaleContext';

const KaabaIconSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v13.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18.75V5.25ZM6 5.25a.75.75 0 0 0-.75.75v12.75c0 .414.336.75.75.75h12a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H6Zm3.75 3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
);


// --- Standard Compass Component ---
interface StandardCompassProps {
    qiblaDirection: number | null;
    deviceAngle: number | null;
    sensorError: string | null;
}

const StandardCompass: React.FC<StandardCompassProps> = ({ qiblaDirection, deviceAngle, sensorError }) => {
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
            </>
        );
    }
    
    return renderContent();
};

// --- AR Compass Component ---
interface ARCompassProps {
    qiblaDirection: number | null;
    deviceAngle: number | null;
}

const ARCompass: React.FC<ARCompassProps> = ({ qiblaDirection, deviceAngle }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                setCameraError(t('ar_permission_denied'));
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [t]);

    // Calculate position of the Kaaba target on screen
    const getTargetStyle = () => {
        if (qiblaDirection === null || deviceAngle === null) return { display: 'none' };

        // Difference between Qibla direction and where phone is pointing
        let diff = qiblaDirection - deviceAngle;
        // Normalize to -180 to 180
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Assume approx 60 degree horizontal FOV for phone camera
        const fov = 60; 
        // Map degrees to horizontal percentage (50% is center)
        // If diff is 0, left is 50%. If diff is -30, left is 0%. If diff is +30, left is 100%.
        let leftPercent = 50 + (diff / (fov / 2)) * 50;
        
        // Clamp for when target is off-screen, but we want to show arrows
        const isOffScreenLeft = leftPercent < 0;
        const isOffScreenRight = leftPercent > 100;
        
        return {
            leftPercent,
            isOffScreenLeft,
            isOffScreenRight,
            isAligned: Math.abs(diff) < 5
        };
    };

    const { leftPercent, isOffScreenLeft, isOffScreenRight, isAligned } = getTargetStyle();

    if (cameraError) {
        return <div className="error" style={{color: 'white', textAlign: 'center', marginTop: '50%'}}>{cameraError}</div>;
    }

    return (
        <div className="ar-compass-container">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="ar-video-background"
            />
            <div className="ar-compass-overlay open">
                <div className="ar-status-text">
                    {qiblaDirection !== null && deviceAngle !== null 
                        ? `${t('qibla')}: ${Math.round(qiblaDirection)}° | ${t('device')}: ${Math.round(deviceAngle)}°`
                        : t('determining_direction')
                    }
                </div>

                <div className="ar-overlay-ui">
                    {/* Central fixed ring (reticle) */}
                    <div className="ar-target-ring"></div>

                    {/* Moving Target (Kaaba) */}
                    {!isOffScreenLeft && !isOffScreenRight && (
                        <div 
                            className="ar-qibla-indicator" 
                            style={{ 
                                left: `${leftPercent}%`,
                                opacity: 1,
                                transform: isAligned ? 'scale(1.2)' : 'scale(1)'
                            }}
                        >
                            <div className={`ar-qibla-icon ${isAligned ? 'glow' : ''}`}>
                                <KaabaIconSVG />
                            </div>
                        </div>
                    )}

                    {/* Guide Arrows */}
                    {isOffScreenLeft && <div className="ar-guide-arrow left">◄</div>}
                    {isOffScreenRight && <div className="ar-guide-arrow right">►</div>}
                </div>
            </div>
        </div>
    );
};


// --- Main Container ---
interface QiblaCompassContainerProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: Location | null;
}

const QiblaCompassContainer: React.FC<QiblaCompassContainerProps> = ({ isOpen, onClose, userLocation }) => {
  const { qiblaDirection, deviceAngle, sensorError } = useQibla(userLocation);
  const [mode, setMode] = useState<'standard' | 'ar'>('standard');
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className={`compass-container-overlay ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className="compass-close-button">&times;</button>
      
      {mode === 'standard' ? (
          <StandardCompass
              qiblaDirection={qiblaDirection}
              deviceAngle={deviceAngle}
              sensorError={sensorError}
          />
      ) : (
          <ARCompass 
              qiblaDirection={qiblaDirection}
              deviceAngle={deviceAngle}
          />
      )}

      <div className="ar-overlay-controls">
          <button 
            className="compass-mode-switch"
            onClick={() => setMode(prev => prev === 'standard' ? 'ar' : 'standard')}
          >
            {mode === 'standard' ? t('try_ar_compass') : t('switch_to_classic')}
          </button>
      </div>
    </div>
  );
};

export default QiblaCompassContainer;

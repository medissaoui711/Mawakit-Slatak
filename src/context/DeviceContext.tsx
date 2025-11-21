
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DeviceContextType {
  inputType: 'touch' | 'mouse';
  connectionQuality: 'good' | 'poor';
  prefersReducedMotion: boolean;
  isHighContrast: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputType, setInputType] = useState<'touch' | 'mouse'>('mouse');
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor'>('good');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // 1. Detect Input Mechanism (Pointer Coarse = Touch usually)
    const updateInputType = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setInputType(isTouch ? 'touch' : 'mouse');
    };

    // 2. Detect Network Status (Save Data or Slow Connection)
    const updateConnectionStatus = () => {
      const nav: any = navigator;
      if (nav.connection) {
        const { saveData, effectiveType } = nav.connection;
        // Treat 2g/3g or saveData as "poor" to reduce heavy assets
        if (saveData || effectiveType === '2g' || effectiveType === '3g') {
          setConnectionQuality('poor');
        } else {
          setConnectionQuality('good');
        }
      }
    };

    // 3. Accessibility Preferences
    const updateA11y = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      setIsHighContrast(window.matchMedia('(prefers-contrast: more)').matches);
    };

    // Initial Checks
    updateInputType();
    updateConnectionStatus();
    updateA11y();

    // Listeners
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');

    const handleTouchChange = (e: MediaQueryListEvent) => setInputType(e.matches ? 'touch' : 'mouse');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handleContrastChange = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);

    touchQuery.addEventListener('change', handleTouchChange);
    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ inputType, connectionQuality, prefersReducedMotion, isHighContrast }}>
      <div className={`
        ${inputType === 'touch' ? 'mode-touch' : 'mode-mouse'}
        ${isHighContrast ? 'mode-high-contrast' : ''}
      `}>
        {children}
      </div>
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

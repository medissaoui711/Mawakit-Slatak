
import { useState, useEffect, useCallback } from 'react';
import { calculateQiblaAngle } from '../utils/qiblaUtils';

export const useQibla = () => {
  const [qiblaAngle, setQiblaAngle] = useState<number>(0); // اتجاه القبلة بالنسبة للشمال
  const [compassHeading, setCompassHeading] = useState<number>(0); // اتجاه الهاتف بالنسبة للشمال
  const [error, setError] = useState<string | null>(null);
  const [calibrationRequired, setCalibrationRequired] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // 1. الحصول على الموقع وحساب زاوية القبلة الثابتة
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('الموقع الجغرافي غير مدعوم');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const angle = calculateQiblaAngle(latitude, longitude);
        setQiblaAngle(angle);
      },
      (err) => {
        console.error(err);
        setError('يرجى تفعيل الموقع الجغرافي لحساب القبلة');
      }
    );
  }, []);

  // 2. التعامل مع حساسات الحركة
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading = 0;

    // Android (Chrome) & iOS (Webkit) logic differentiation
    // @ts-ignore - webkitCompassHeading is iOS specific
    if (event.webkitCompassHeading) {
       // iOS
       // @ts-ignore
       heading = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android - alpha is strictly not compass heading without calculation, 
      // but for absolute orientation events it represents degrees from North
      // Note: 'deviceorientationabsolute' is preferred on Android if available
      heading = 360 - event.alpha;
    }

    setCompassHeading(heading);
  }, []);

  const requestCompassPermission = async () => {
    // @ts-ignore - iOS 13+ specific permission request
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setError('تم رفض إذن البوصلة');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Non-iOS 13+ devices (Android, older iOS) don't need permission request
      setPermissionGranted(true);
      // Try absolute orientation first (Android)
      if ('ondeviceorientationabsolute' in (window as any)) {
        (window as any).addEventListener('deviceorientationabsolute', (e: any) => handleOrientation(e), true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      // @ts-ignore
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, [handleOrientation]);

  return {
    qiblaAngle,
    compassHeading,
    error,
    calibrationRequired,
    permissionGranted,
    requestCompassPermission
  };
};

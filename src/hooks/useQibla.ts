import { useState, useEffect, useRef } from 'react';
import { Location } from '../types';
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/qiblaUtils';
import { useTranslation } from '../context/LocaleContext';

export const useQibla = (userLocation: Location | null) => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [distanceToKaaba, setDistanceToKaaba] = useState<number | null>(null);
    const [deviceAngle, setDeviceAngle] = useState<number | null>(null);
    const [sensorError, setSensorError] = useState<string | null>(null);
    const lastUpdate = useRef(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (userLocation?.latitude && userLocation?.longitude) {
            const direction = calculateQiblaDirection(userLocation.latitude, userLocation.longitude);
            const distance = calculateDistanceToKaaba(userLocation.latitude, userLocation.longitude);
            setQiblaDirection(direction);
            setDistanceToKaaba(distance);
        }
    }, [userLocation]);

    useEffect(() => {
        const throttleMs = 100; // Update max 10 times per second

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const now = Date.now();
            if (now - lastUpdate.current < throttleMs) {
                return;
            }
            lastUpdate.current = now;

            const webkitHeading = (event as any).webkitCompassHeading;
            const alpha = event.alpha;
            
            let finalHeading: number | null = null;
            
            if (webkitHeading !== undefined && webkitHeading !== null) {
                // On iOS, webkitCompassHeading is already compensated for device orientation.
                finalHeading = webkitHeading;
            } else if (alpha !== null) {
                // On other devices (like Android), alpha is often inverted by 180 degrees.
                // We compensate for this inversion and then for screen orientation.
                const correctedAlpha = (alpha + 180) % 360; // Correct the inversion
                finalHeading = (correctedAlpha + (screen.orientation?.angle || 0)) % 360;
            }
            
            if (finalHeading !== null) {
                setDeviceAngle(finalHeading);
                if (sensorError) setSensorError(null);
            } else if (!sensorError) {
                 setSensorError(t('error_sensor_access'));
            }
        };

        // Check for support before adding listener
        if ('DeviceOrientationEvent' in window) {
             window.addEventListener('deviceorientation', handleOrientation);
        } else {
            setSensorError(t('error_sensor_support'));
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [sensorError, t]);

    return { qiblaDirection, distanceToKaaba, deviceAngle, sensorError };
};
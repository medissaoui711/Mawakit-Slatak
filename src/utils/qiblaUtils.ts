// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function calculateQiblaDirection(userLat: number, userLon: number): number {
  const userLatRad = toRadians(userLat);
  const userLonRad = toRadians(userLon);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const kaabaLonRad = toRadians(KAABA_LON);

  const lonDiff = kaabaLonRad - userLonRad;

  const y = Math.sin(lonDiff) * Math.cos(kaabaLatRad);
  const x = Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
            Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(lonDiff);

  const initialBearingRad = Math.atan2(y, x);
  const initialBearingDeg = toDegrees(initialBearingRad);

  // Normalize to a 0-360 degree range
  return (initialBearingDeg + 360) % 360;
}

/**
 * Calculates the distance to the Kaaba from user's location using the Haversine formula.
 * @param userLat User's latitude.
 * @param userLon User's longitude.
 * @returns Distance to Kaaba in kilometers.
 */
export function calculateDistanceToKaaba(userLat: number, userLon: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(KAABA_LAT - userLat);
    const dLon = toRadians(KAABA_LON - userLon);
    const lat1 = toRadians(userLat);
    const lat2 = toRadians(KAABA_LAT);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

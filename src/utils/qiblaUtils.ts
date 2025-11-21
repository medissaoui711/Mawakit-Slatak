
// إحداثيات الكعبة المشرفة
const MAKKAH_LAT = 21.422487;
const MAKKAH_LNG = 39.826206;

const toRadians = (degrees: number) => degrees * (Math.PI / 180);
const toDegrees = (radians: number) => radians * (180 / Math.PI);

/**
 * حساب زاوية القبلة بالنسبة للشمال الجغرافي
 * باستخدام معادلة الدائرة العظمى (Great Circle)
 */
export const calculateQiblaAngle = (latitude: number, longitude: number): number => {
  const phiK = toRadians(MAKKAH_LAT);
  const lambdaK = toRadians(MAKKAH_LNG);
  const phi = toRadians(latitude);
  const lambda = toRadians(longitude);

  const y = Math.sin(lambdaK - lambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  
  let angle = toDegrees(Math.atan2(y, x));
  
  // التطبيع لتكون الزاوية بين 0 و 360
  return (angle + 360) % 360;
};

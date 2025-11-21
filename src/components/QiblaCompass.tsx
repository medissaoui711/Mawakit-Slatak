
import React from 'react';
import { Compass, MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { useQibla } from '../hooks/useQibla';

interface QiblaCompassProps {
  isOpen: boolean;
  onClose: () => void;
}

const QiblaCompass: React.FC<QiblaCompassProps> = ({ isOpen, onClose }) => {
  const { 
    qiblaAngle, 
    compassHeading, 
    permissionGranted, 
    requestCompassPermission,
    error 
  } = useQibla();

  if (!isOpen) return null;

  // حساب زاوية دوران السهم (الفرق بين القبلة واتجاه الهاتف)
  // عندما يكون الهاتف موجهاً للقبلة، يجب أن يكون الدوران 0
  // Rotation Logic: We rotate the DISC opposite to heading so North stays Up visually, 
  // OR we rotate the NEEDLE.
  
  // Approach: Rotate the entire COMPASS DISC so North matches real North relative to phone top.
  // Then place Qibla marker at `qiblaAngle` degrees on that disc.
  const discRotation = -compassHeading; 

  const isAligned = Math.abs(((qiblaAngle - compassHeading + 360) % 360)) < 5;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl text-center overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Navigation className="text-red-600" />
          القبلة
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          قم بمعايرة الهاتف بتحريكه على شكل رقم 8
        </p>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex flex-col items-center gap-2">
            <AlertTriangle />
            <span>{error}</span>
          </div>
        ) : !permissionGranted ? (
          <div className="py-12">
            <button
              onClick={requestCompassPermission}
              className="bg-brand-light dark:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              تفعيل البوصلة
            </button>
            <p className="mt-4 text-xs text-gray-400">يتطلب السماح بالوصول لمستشعرات الجهاز</p>
          </div>
        ) : (
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Compass Disc */}
            <div 
              className="w-full h-full rounded-full border-4 border-gray-200 dark:border-slate-700 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 shadow-inner relative transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${discRotation}deg)` }}
            >
              {/* North Marker */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-red-600 font-bold text-lg">N</span>
                <div className="w-1 h-2 bg-red-600 rounded-full"></div>
              </div>
              
              {/* Directions */}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">E</span>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400">S</span>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">W</span>

              {/* Kaaba Icon / Qibla Marker placed at Qibla Angle */}
              <div 
                className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                 {/* The marker is placed at the TOP (0 deg) of this container, 
                     but the container is rotated to qiblaAngle. 
                     So relative to North (which is 0 on the disc), this points to Qibla. */}
                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-8 h-8 bg-black border-2 border-yellow-500 rounded-md shadow-lg z-10 relative flex items-center justify-center">
                           <div className="w-full h-[1px] bg-yellow-500 absolute top-2"></div>
                        </div>
                        {/* Arrow pointing to Kaaba */}
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black absolute -top-3 left-1/2 -translate-x-1/2"></div>
                    </div>
                 </div>
                 
                 {/* Line to center */}
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-[calc(50%-32px)] bg-yellow-500/30 dashed"></div>
              </div>
            </div>

            {/* Phone indicator (Static center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white z-20 shadow-md"></div>
            
            {/* Crosshair */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-500"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-500"></div>
            </div>
          </div>
        )}

        {permissionGranted && (
          <div className={`text-lg font-bold transition-colors ${isAligned ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
            {isAligned ? 'أنت تواجه القبلة الآن' : `${Math.round(qiblaAngle)}° درجة عن الشمال`}
          </div>
        )}
      </div>
    </div>
  );
};

export default QiblaCompass;

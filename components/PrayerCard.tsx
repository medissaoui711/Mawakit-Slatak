import React from 'react';
import { formatTime12Hour } from '../utils';

interface PrayerCardProps {
  name: string;
  time: string;
  iqamaOffset: string;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ name, time, iqamaOffset }) => {
  const cleanTime = time.split(' ')[0]; // Remove timezone info
  const formattedTime = formatTime12Hour(cleanTime);

  return (
    <div className="flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition-colors">
      <span className="text-xl font-bold text-red-900 mb-1">{name}</span>
      <span className="text-2xl font-bold text-black mb-1 dir-ltr font-sans">{formattedTime}</span>
      <span className="text-sm text-gray-500 dir-ltr">({iqamaOffset})</span>
    </div>
  );
};

export default PrayerCard;
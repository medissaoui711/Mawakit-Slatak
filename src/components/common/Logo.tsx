import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    className={className}
  >
    {/* خلفية حمراء بزوايا مستديرة */}
    <rect x="0" y="0" width="200" height="200" rx="30" fill="#D80027"/>

    {/* الهلال */}
    <path d="M70 100a30 30 0 1 1 0-60a25 25 0 1 0 0 60z" fill="white"/>

    {/* النجمة */}
    <polygon points="90,70 94,80 105,80 96,86 100,96 90,90 80,96 84,86 75,80 86,80" fill="white"/>

    {/* قبة المسجد */}
    <path d="M130 130 a20 20 0 0 1 40 0 v20 h-40z" fill="white"/>
    <circle cx="150" cy="130" r="3" fill="white"/>

    {/* المئذنة */}
    <rect x="120" y="90" width="8" height="60" fill="white"/>
    <path d="M124 80 L128 90 L120 90 Z" fill="white"/>
  </svg>
);
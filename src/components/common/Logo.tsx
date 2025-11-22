import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <g fill="currentColor">
      <path d="M210 120c-32 22-52 58-52 98s20 76 52 98c-46-10-82-52-82-98s36-88 82-98z"/>
      <polygon points="260,150 272,182 306,182 278,202 290,234 260,214 230,234 242,202 214,182 248,182"/>
      <path d="M330 110h30v260h-30z"/>
      <path d="M345 70l15 30h-30l15-30z"/>
      <path d="M420 370H260v-60c0-55 45-100 100-100s100 45 100 100v60h-40zM360 190l10-20 10 20z"/>
    </g>
  </svg>
);

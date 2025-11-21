
import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="group relative flex flex-col items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2 hidden flex-col items-center group-hover:flex z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-nowrap bg-gray-900 dark:bg-slate-700 shadow-lg rounded-md">
          {content}
        </span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-900 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};

export default Tooltip;

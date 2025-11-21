
import { useEffect } from 'react';

interface KeyboardNavProps {
  onNextCity: () => void;
  onPrevCity: () => void;
  toggleTheme: () => void;
  toggleSettings: () => void;
}

export const useKeyboardNavigation = ({ onNextCity, onPrevCity, toggleTheme, toggleSettings }: KeyboardNavProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch(e.key) {
        case 'ArrowRight':
          // In RTL, Right arrow usually means "Next" visually if items are laid out R to L?
          // Or "Back" in history?
          // Let's stick to logical Previous for array index
          onPrevCity(); 
          break;
        case 'ArrowLeft':
          onNextCity();
          break;
        case 'm':
        case 'M':
          toggleTheme();
          break;
        case 's':
        case 'S':
          toggleSettings();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextCity, onPrevCity, toggleTheme, toggleSettings]);
};

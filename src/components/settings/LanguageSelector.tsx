import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../../context/LocaleContext';
import { Locale } from '../../types';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = languages.find(lang => lang.code === locale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (langCode: Locale) => {
    setLocale(langCode);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: 'none', transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.2 } },
  };

  return (
    <div className="custom-select-container" ref={containerRef}>
      <button
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLanguage?.name}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="custom-select-arrow"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="custom-select-options"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="listbox"
          >
            {languages.map(lang => (
              <li
                key={lang.code}
                className={`custom-select-option ${locale === lang.code ? 'selected' : ''}`}
                onClick={() => handleSelect(lang.code as Locale)}
                role="option"
                aria-selected={locale === lang.code}
              >
                {lang.name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;

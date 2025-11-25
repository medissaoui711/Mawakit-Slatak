import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string | number;
  label: string;
}

interface CustomDropdownProps {
  id: string;
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ id, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

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

  const handleSelect = (newValue: string | number) => {
    onChange(newValue);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, pointerEvents: 'none', transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, pointerEvents: 'auto', transition: { duration: 0.2, staggerChildren: 0.03 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="custom-dropdown-container" ref={containerRef}>
      <button
        id={id}
        className="custom-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="custom-dropdown-arrow"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="custom-dropdown-options"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="listbox"
            aria-labelledby={id}
          >
            {options.map(option => (
              <motion.li
                key={option.value}
                className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={value === option.value}
                variants={itemVariants}
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LocaleContext';

interface FloatingActionButtonProps {
    onQiblaClick: () => void;
    onTasbihClick: () => void;
    onAdhkarClick: () => void;
    onQuranClick: () => void;
}

// SVG Icons for actions
const QiblaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.77,17.29,12,19.25,9.23,17.29a.51.51,0,0,0-.71.45V19a1,1,0,0,0,1,1h4.94a1,1,0,0,0,1-1v-1.26a.51.51,0,0,0-.71-.45ZM18,10a6,6,0,1,0-6,6A6,6,0,0,0,18,10Zm-6-4a4,4,0,1,1-4,4A4,4,0,0,1,12,6Zm0-4A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm8.71,11.25-1.54,1.54-1.24-1.24a8,8,0,0,1-10.86,0L6,14.79,l-1.54-1.54,1.24-1.24a8,8,0,0,1,12.1,1.24Z"/></svg>;
const QuranIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const AdhkarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.135 48.773 48.773 0 0 0 1.178 8.247M5.25 6h9m-9 0a2.25 2.25 0 0 0-2.25 2.25v11.25a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25h-9Z" /></svg>;
const TasbihIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M8 7h8v3H8V7z M15 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></svg>;

const GridIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="28" height="28">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onQiblaClick, onTasbihClick, onAdhkarClick, onQuranClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const actions = [
        { label: t('qibla_compass'), icon: <QiblaIcon />, action: onQiblaClick },
        { label: t('quran'), icon: <QuranIcon />, action: onQuranClick },
        { label: t('adhkar'), icon: <AdhkarIcon />, action: onAdhkarClick },
        { label: t('tasbih_counter'), icon: <TasbihIcon />, action: onTasbihClick },
    ];
    
    const wrapperVariants = {
        open: {
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        },
        closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };
    
    const itemVariants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        }
    };
    
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <>
            <AnimatePresence>
              {isOpen && <motion.div className="fab-backdrop" onClick={toggleOpen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
            </AnimatePresence>
            <div className="fab-container">
                 <AnimatePresence>
                    {isOpen && (
                         <motion.div 
                            className="fab-actions-list"
                            variants={wrapperVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                         >
                            {actions.map((action, index) => (
                                <motion.div key={index} className="fab-action-item-wrapper" variants={itemVariants}>
                                    <span className="fab-action-label">{action.label}</span>
                                    <button className="fab-action-button" onClick={() => { action.action(); toggleOpen(); }} aria-label={action.label}>
                                        {action.icon}
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                 </AnimatePresence>
                <motion.button 
                    className="fab-main-button" 
                    onClick={toggleOpen}
                    aria-label="Open tools menu"
                    aria-expanded={isOpen}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'grid'}
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {isOpen ? <CloseIcon /> : <GridIcon />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </div>
        </>
    );
};

export default FloatingActionButton;
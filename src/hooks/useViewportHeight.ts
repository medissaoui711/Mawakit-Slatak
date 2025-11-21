
import { useEffect } from 'react';

/**
 * هوك مخصص لحل مشكلة 100vh في متصفحات الهواتف (خاصة Safari iOS).
 * يقوم بحساب 1% من ارتفاع النافذة الفعلي ويضعه في متغير CSS.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // الحساب الأولي
    setVh();

    // إعادة الحساب عند تغيير حجم النافذة أو تدوير الشاشة
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
};

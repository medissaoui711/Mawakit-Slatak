
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, AlertCircle } from 'lucide-react';
import { requestNotificationPermission, sendNotification, isNotificationSupported } from '../../utils/notificationUtils';
import { usePrayerData } from '../../context/PrayerContext';

const NotificationControl: React.FC = () => {
  // نستخدم الحالة من Context للربط مع الإعدادات العامة للتطبيق
  const { settings, updateGlobalEnabled } = usePrayerData();
  
  // حالة محلية لمتابعة إذن المتصفح
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState<boolean>(true);

  // التحقق من الحالة عند تحميل المكون
  useEffect(() => {
    if (!isNotificationSupported()) {
      setSupported(false);
      return;
    }
    setPermission(Notification.permission);
  }, []);

  // التعامل مع طلب الإذن
  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);

    if (result === 'granted') {
      // تفعيل الإعداد العام في التطبيق تلقائياً عند منح الإذن
      updateGlobalEnabled(true);
      sendNotification('تم تفعيل التنبيهات بنجاح', 'ستصلك تنبيهات أوقات الصلاة الآن.');
    }
  };

  // التعامل مع التبديل (Toggle) عندما يكون الإذن ممنوحاً
  const handleToggle = () => {
    if (permission !== 'granted') return;
    
    const newState = !settings.globalEnabled;
    updateGlobalEnabled(newState);
    
    if (newState) {
      sendNotification('التنبيهات مفعلة', 'نظام التنبيهات يعمل الآن');
    }
  };

  // التعامل مع حالة الرفض
  const handleDeniedClick = () => {
    alert('تم حظر الإشعارات من إعدادات المتصفح.\n\nلإعادة تفعيلها، اضغط على أيقونة القفل 🔒 بجانب رابط الموقع في المتصفح واختر "السماح" للإشعارات.');
  };

  if (!supported) return null;

  // 1. حالة الرفض (Denied)
  if (permission === 'denied') {
    return (
      <button
        onClick={handleDeniedClick}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
        title="الإشعارات محظورة من المتصفح"
      >
        <BellOff size={18} />
        <span>الإشعارات محظورة</span>
      </button>
    );
  }

  // 2. حالة لم يطلب بعد (Default)
  if (permission === 'default') {
    return (
      <button
        onClick={handleRequestPermission}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 bg-white/10 hover:bg-white/20 text-white animate-pulse ring-1 ring-white/30"
      >
        <Bell size={18} />
        <span>تفعيل التنبيهات</span>
      </button>
    );
  }

  // 3. حالة ممنوح (Granted) - زر تبديل
  const isActive = settings.globalEnabled;
  
  return (
    <button
      onClick={handleToggle}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm active:scale-95
        ${isActive 
          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
        }
      `}
    >
      {isActive ? <BellRing size={18} /> : <BellOff size={18} />}
      <span>{isActive ? 'التنبيهات مفعلة' : 'التنبيهات متوقفة'}</span>
    </button>
  );
};

export default NotificationControl;

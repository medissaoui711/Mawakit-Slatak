import React, { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing } from 'lucide-react';
import { usePrayerData } from '../../context/PrayerContext';
import { sendNotification } from '../../utils/notificationUtils';

const NotificationControl: React.FC = () => {
  const { 
    notificationsEnabled, 
    requestPermission, 
    settings, 
    updateGlobalEnabled 
  } = usePrayerData();

  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!('Notification' in window)) {
      setSupported(false);
      return;
    }
    setPermissionState(Notification.permission);
  }, [notificationsEnabled]); // Update when context updates state

  const handleClick = async () => {
    // Case 1: Permission Denied
    if (permissionState === 'denied') {
       alert('تم حظر الإشعارات من إعدادات المتصفح. يرجى السماح بها لتلقي التنبيهات.');
       return;
    }

    // Case 2: Default (Ask Permission)
    if (permissionState === 'default') {
      await requestPermission();
      return;
    }

    // Case 3: Granted
    if (permissionState === 'granted') {
      if (!settings.globalEnabled) {
        // If turned off in app settings, turn on
        updateGlobalEnabled(true);
        sendNotification('تم تفعيل التنبيهات', 'سيقوم التطبيق بتنبيهك عند أوقات الصلاة');
      } else {
        // If active, send test
        sendNotification('نظام التنبيهات يعمل', 'الإشعارات مفعلة بنجاح');
      }
    }
  };

  if (!supported) return null;

  // Render State Logic
  let buttonContent;

  if (permissionState === 'denied') {
    buttonContent = {
      icon: <BellOff size={18} />,
      text: 'الإشعارات محظورة',
      className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    };
  } else if (permissionState === 'default') {
    buttonContent = {
      icon: <Bell size={18} />,
      text: 'تفعيل التنبيهات',
      className: 'bg-white/10 hover:bg-white/20 text-white animate-pulse'
    };
  } else {
    // Granted
    if (settings.globalEnabled) {
      buttonContent = {
        icon: <BellRing size={18} />,
        text: 'التنبيهات مفعلة',
        className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm'
      };
    } else {
      buttonContent = {
        icon: <BellOff size={18} />,
        text: 'التنبيهات متوقفة',
        className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      };
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
        active:scale-95 touch-manipulation
        ${buttonContent.className}
      `}
    >
      {buttonContent.icon}
      <span>{buttonContent.text}</span>
    </button>
  );
};

export default NotificationControl;
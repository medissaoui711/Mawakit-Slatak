
/**
 * يتحقق مما إذا كان المتصفح يدعم الإشعارات
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * دالة لطلب إذن الإشعارات من المستخدم
 * تعيد Promise يحتوي على حالة الإذن الجديدة
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  // 1. التحقق من دعم المتصفح
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser.');
    return 'denied';
  }

  // 2. التحقق مما إذا كان الإذن ممنوحاً مسبقاً
  if (Notification.permission === 'granted') {
    return 'granted';
  }

  // 3. طلب الإذن من المستخدم
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

/**
 * دالة لإرسال إشعار
 * تحاول استخدام Service Worker أولاً لضمان الأداء والموثوقية (خاصة على Android)،
 * وتعود للطريقة التقليدية (new Notification) إذا لم يكن الـ SW متاحاً.
 */
export const sendNotification = async (title: string, body: string, icon?: string) => {
  if (!isNotificationSupported()) return;
  
  if (Notification.permission !== 'granted') {
    console.warn('Cannot send notification: Permission not granted.');
    return;
  }

  const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/2319/2319865.png'; // أيقونة التطبيق

  try {
    // محاولة الإرسال عبر Service Worker (الأفضل لـ PWA والهواتف)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.active) {
        // نستخدم postMessage للتواصل مع SW لأن showNotification من داخل الصفحة
        // قد لا تعمل ببعض المتصفحات الحديثة دون تفاعل مباشر
        registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title,
            body,
            icon: icon || defaultIcon
          }
        });
        return;
      }
    }
  
    // Fallback: الطريقة التقليدية (Main Thread)
    // ملاحظة: قد لا تظهر في بعض هواتف أندرويد إذا لم يكن التطبيق نشطاً
    // نستخدم any لأن خاصية vibrate قد لا تكون موجودة في تعريف Typescript القياسي لـ NotificationOptions
    const options: any = {
      body,
      icon: icon || defaultIcon,
      dir: 'rtl',
      lang: 'ar-TN',
      vibrate: [200, 100, 200], // نمط الاهتزاز
      badge: defaultIcon,
    };
    
    new Notification(title, options);

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

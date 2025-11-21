
/**
 * يتحقق مما إذا كان المتصفح يدعم الإشعارات
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

/**
 * دالة لطلب إذن الإشعارات من المستخدم
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('حدث خطأ أثناء طلب إذن الإشعارات:', error);
    return 'denied';
  }
};

/**
 * دالة لإرسال إشعار
 * تحاول استخدام Service Worker أولاً لضمان الأداء والموثوقية،
 * وتعود للطريقة التقليدية إذا لم يكن الـ SW متاحاً.
 */
export const sendNotification = async (title: string, body: string, icon?: string) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  try {
    // محاولة الإرسال عبر Service Worker (الأفضل للهواتف)
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.active) {
        // إرسال رسالة للـ SW ليقوم هو بعرض الإشعار
        registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: {
            title,
            body,
            icon
          }
        });
        return;
      }
    }
  
    // Fallback: الطريقة التقليدية (Main Thread)
    // ملاحظة: هذه الطريقة أقل استقراراً على أندرويد الحديث
    const options: any = {
      body,
      icon: icon || 'https://cdn-icons-png.flaticon.com/512/2319/2319865.png',
      dir: 'rtl',
      lang: 'ar-TN',
      vibrate: [200, 100, 200],
    };
    new Notification(title, options);

  } catch (e) {
    console.error("Failed to send notification:", e);
  }
};

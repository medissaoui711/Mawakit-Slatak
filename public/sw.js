
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'mawakit-tn-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // في بيئة الإنتاج، سيقوم نظام البناء بتوليد قائمة الملفات
];

const APP_LOGO = "https://cdn-icons-png.flaticon.com/512/2319/2319865.png";

// المجالات الخارجية المسموح بتخزينها
const EXTERNAL_DOMAINS = [
  'cdn.tailwindcss.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'aistudiocdn.com',
  'flagcdn.com',
  'cdn-icons-png.flaticon.com'
];

// 1. التثبيت (Install)
self.addEventListener('install', (event) => {
  // تخطي الانتظار لتفعيل الـ SW فوراً
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // محاولة تخزين الملفات الأساسية، وعدم الفشل إذا لم تنجح بعضها
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Some assets failed to cache:', err);
      });
    })
  );
});

// 2. التفعيل (Activate) وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // السيطرة على الصفحات المفتوحة فوراً
    })
  );
});

// 3. استراتيجية الكاش (Network First with Cache Fallback)
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات API (تدار عبر التطبيق) وطلبات غير GET
  if (event.request.method !== 'GET' || event.request.url.includes('api.aladhan.com')) {
    return;
  }

  const isExternalResource = EXTERNAL_DOMAINS.some(domain => event.request.url.includes(domain));
  const isInternalResource = event.request.url.startsWith(self.location.origin);

  if (isInternalResource || isExternalResource) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // تحديث الكاش بالنسخة الجديدة من الشبكة
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // الفشل (أوفلاين) -> العودة للكاش
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // صفحة احتياطية إذا لم يوجد كاش (يمكن إضافتها لاحقاً)
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return null;
          });
        })
    );
  }
});

// 4. الاستماع لرسائل من التطبيق (Message Event)
// يستخدم هذا لعرض الإشعارات المجدولة محلياً من التطبيق
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // عرض إشعار فوري (يأتي الطلب من التطبيق)
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data.payload;
    const options = {
      body,
      icon: icon || APP_LOGO,
      vibrate: [200, 100, 200],
      badge: APP_LOGO, // تظهر في شريط الحالة في أندرويد
      dir: 'rtl',
      lang: 'ar-TN',
      tag: 'prayer-notification', // يمنع تكرار نفس الإشعار
      renotify: true,
      data: {
        url: self.location.origin // رابط لفتحه عند النقر
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// 5. التعامل مع إشعارات Push (من الخادم - Future Proofing)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'مواقيت الصلاة', body: event.data.text() };
    }
  }

  const options = {
    body: data.body || 'تنبيه جديد',
    icon: APP_LOGO,
    badge: APP_LOGO,
    vibrate: [100, 50, 100],
    data: {
      url: self.location.origin
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'تنبيه', options)
  );
});

// 6. التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // فتح التطبيق أو التركيز عليه إذا كان مفتوحاً
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // إذا كان هناك نافذة مفتوحة، ركز عليها
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // إذا لم يكن مفتوحاً، افتح نافذة جديدة
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

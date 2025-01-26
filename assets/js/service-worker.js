// PWA를 위한 서비스 워커
const CACHE_NAME = 'streaming-app-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/css/responsive.css',
    '/assets/js/scripts.js',
    '/manifest.json',
    '/assets/img/favicon-32x32.png',
    '/assets/img/apple-touch-icon.png'
];

// 서비스 워커 설치
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('캐시 생성 완료');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('캐시 생성 실패:', error);
            })
    );
});

// 네트워크 요청 처리
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // 캐시된 응답이 있으면 반환
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 네트워크 요청
                return fetch(event.request)
                    .then(response => {
                        // 유효하지 않은 응답은 그대로 반환
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 응답을 캐시에 저장
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // 오프라인이고 이미지 요청인 경우 기본 이미지 제공
                        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                            return caches.match('/assets/img/offline-image.png');
                        }
                    });
            })
    );
});

// 캐시 정리
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

// 푸시 알림 처리
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/assets/img/notification-icon.png',
        badge: '/assets/img/notification-badge.png'
    };

    event.waitUntil(
        self.registration.showNotification('스트리밍 알림', options)
    );
}); 
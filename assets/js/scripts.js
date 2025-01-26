// 전역 상태 관리
const APP = {
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    init() {
        this.setupDarkMode();
        this.setupServiceWorker();
        this.setupEventListeners();
    },

    setupDarkMode() {
        const darkModeToggle = document.querySelector('#dark-mode-toggle');
        if (darkModeToggle) {
            // 초기 다크모드 상태 설정
            if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark-mode');
                this.isDarkMode = true;
            }

            // 다크모드 토글 이벤트
            darkModeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                this.isDarkMode = !this.isDarkMode;
                localStorage.setItem('darkMode', this.isDarkMode);

                // 테마 색상 업데이트
                const themeColor = this.isDarkMode ? '#1a1a1a' : '#ffffff';
                document.querySelector('meta[name="theme-color"]')
                    .setAttribute('content', themeColor);
            });
        }
    },

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker
                        .register('/assets/js/service-worker.js');
                    console.log('ServiceWorker registered:', registration.scope);
                } catch (error) {
                    console.error('ServiceWorker registration failed:', error);
                }
            });
        }
    },

    setupEventListeners() {
        // 모바일 메뉴 토글
        const menuButton = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (menuButton && navMenu) {
            menuButton.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                menuButton.setAttribute('aria-expanded',
                    navMenu.classList.contains('active'));
            });
        }
    }
};

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => APP.init());

// 이미지 지연 로딩
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // 폴백 지연 로딩 구현
    }
}); 
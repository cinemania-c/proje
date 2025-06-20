document.addEventListener('DOMContentLoaded', () => {
    const scrollThreshold = 100; // Show button after scrolling this many pixels

    // Scroll davranışlarını tanımlayan fonksiyon
    function initScrollToTop(scrollToTopButton) {
        // Buton görünürlüğünü ayarlayan fonksiyon
        function toggleScrollButton() {
            if (window.scrollY > scrollThreshold) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        }

        // Scroll to top fonksiyonu
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Event listener'lar
        window.addEventListener('scroll', toggleScrollButton);
        scrollToTopButton.addEventListener('click', scrollToTop);
        toggleScrollButton(); // İlk yüklemede kontrol
    }

    // Eğer buton DOM'da yoksa, sonradan eklenmesini izle
    function observeScrollButton() {
        const observer = new MutationObserver(() => {
            const button = document.querySelector('.scroll-to-top');
            if (button) {
                observer.disconnect(); // İzlemeyi durdur
                initScrollToTop(button);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Başlangıçta scroll-to-top butonunu bul
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    if (scrollToTopButton) {
        initScrollToTop(scrollToTopButton);
    } else {
        console.warn("scroll-to-top butonu bulunamadı. DOM gözlemleniyor...");
        observeScrollButton();
    }
});

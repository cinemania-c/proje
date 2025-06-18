document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    const scrollThreshold = 100;

    if (!scrollToTopButton) return; // Element yoksa hiçbir işlem yapma

    function toggleScrollButton() {
        if (window.scrollY > scrollThreshold) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('scroll', toggleScrollButton);
    scrollToTopButton.addEventListener('click', scrollToTop);
    toggleScrollButton();
});

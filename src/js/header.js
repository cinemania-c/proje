document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuIcon = document.querySelector('.mobile-menu-icon use');
    const body = document.body;


    

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('is-open');
        const svgHref = menuIcon.getAttribute("href").split('#')[0];
        // Toggle menu visibility
        mobileMenu.classList.toggle('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
        
        // Toggle menu icon
        menuIcon.setAttribute('href', 
            //isOpen ? './img/icons.svg#icon-menu' : './img/icons.svg#icon-close'
            isOpen ? svgHref+'#icon-menu' : svgHref+'#icon-close'
        );
        
        
        // Toggle body scroll
        body.style.overflow = isOpen ? '' : 'hidden';

    }

    if (mobileMenuBtn && mobileMenu) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            toggleMenu();
        });

        // Close menu when clicking on mobile navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('is-open') && 
                !e.target.closest('.mobile-menu') && 
                !e.target.closest('.mobile-menu-btn')) {
                toggleMenu();
            }
        });

        // Prevent clicks inside menu from closing it
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    }

    // Active page highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class based on current page
    if (currentPath.includes('catalog.html')) {
        document.querySelectorAll('[data-page="catalog"]').forEach(link => {
            link.classList.add('active');
        });
    } else if (currentPath.includes('mylibrary.html')) {
        document.querySelectorAll('[data-page="library"]').forEach(link => {
            link.classList.add('active');
        });
    } else {
        // Default to home for index.html or root path
        document.querySelectorAll('[data-page="home"]').forEach(link => {
            link.classList.add('active');
        });
    }
    
});
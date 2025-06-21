document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const html = document.documentElement;
    const body = document.body;

    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.classList.add(savedTheme);
        body.classList.add(savedTheme);
        themeSwitch.checked = savedTheme === 'light-theme';
    } else {
        // Default to dark theme
        html.classList.add('dark-theme');
        body.classList.add('dark-theme');
        themeSwitch.checked = false;
        localStorage.setItem('theme', 'dark-theme');
    }

    // Add theme-loaded class after initial theme is set
    requestAnimationFrame(() => {
        html.classList.add('theme-loaded');
    });

    // Handle theme switch
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            html.classList.remove('dark-theme');
            html.classList.add('light-theme');
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        } else {
            html.classList.remove('light-theme');
            html.classList.add('dark-theme');
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        }
    });
});
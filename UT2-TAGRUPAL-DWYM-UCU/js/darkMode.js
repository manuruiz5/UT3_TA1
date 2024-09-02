document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setTheme(isDark) {
        if (isDark) {
            body.setAttribute('data-theme', 'dark');
            body.classList.add('theme-dark');
            body.classList.remove('theme-light');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            body.classList.add('theme-light');
            body.classList.remove('theme-dark');
            localStorage.setItem('theme', 'light');
        }
        updateButtonAppearance(isDark);
    }

    function updateButtonAppearance(isDark) {
        if (isDark) {
            darkModeToggle.textContent = '☀️';
            darkModeToggle.style.backgroundColor = '#ffffff';
            darkModeToggle.style.color = '#000000';
        } else {
            darkModeToggle.textContent = '🌙';
            darkModeToggle.style.backgroundColor = '#000000';
            darkModeToggle.style.color = '#ffffff';
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

    setTheme(defaultDark);

    darkModeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        setTheme(!isDark);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
        if (localStorage.getItem('theme') === null) {
            setTheme(e.matches);
        }
    });
});
import { initDashboard } from './dashboard.js';
import { initAdmin } from './admin.js';

function main() {
    const path = window.location.pathname;

    if (path === '/' || path === '/index') {
        console.log("Inicjalizacja Dashboardu");
        initDashboard();
    } 
    else if (path === '/config') {
        console.log("Inicjalizacja Panelu Admina");
        initAdmin();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', currentTheme);

    toggleBtn.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

main();
// ========== Инициализация меню ==========
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

function toggleMenu() {
    const isActive = !sidebar.classList.contains('active');
    menuToggle.classList.toggle('active', isActive);
    sidebar.classList.toggle('active', isActive);
    overlay.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
}

function closeMenu() {
    menuToggle.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle && sidebar && overlay) {
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) closeMenu();
        });
    });
}
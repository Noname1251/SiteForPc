document.addEventListener('DOMContentLoaded', function() {
    // Инициализация меню
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

    // Логика формы помощи
    const form = document.getElementById('pc-help-form');
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budget-value');
    const submitBtn = document.getElementById('submit-btn');
    const purposeCards = document.querySelectorAll('.purpose-card');
    const purposeInput = document.getElementById('purpose');

    // Обновление отображения бюджета
    budgetSlider.addEventListener('input', function() {
        budgetValue.textContent = parseInt(this.value).toLocaleString('ru-RU') + ' ₽';
    });

    // Выбор назначения ПК
    purposeCards.forEach(card => {
        card.addEventListener('click', function() {
            purposeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            purposeInput.value = this.dataset.value;
        });
    });

    // Валидация формы
    form.addEventListener('submit', function(e) {
        // Проверка телефона
        const phone = document.getElementById('phone').value;
        if (!/^\+7\s?[\(]?\d{3}[\)]?\s?\d{3}[-]?\d{2}[-]?\d{2}$/.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            e.preventDefault();
            return;
        }

        // Проверка выбора назначения
        if (!purposeInput.value) {
            alert('Пожалуйста, выберите назначение ПК');
            e.preventDefault();
            return;
        }

        // Индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
    });

    // Обновление счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    // Инициализация при загрузке
    updateCartCount();
});
// helpwithcreating.js
document.addEventListener('DOMContentLoaded', function() {
    // Код из configurator.js для меню
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
});
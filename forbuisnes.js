// Скрипт для формы бизнес-заказа
    // Логика бизнес-формы
    const businessForm = document.getElementById('business-form');
    const orgTypeCards = document.querySelectorAll('#business-form .purpose-card');
    const orgTypeInput = document.getElementById('org-type');
    const submitBtn = document.getElementById('business-submit-btn');

    // Выбор типа организации
    orgTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            orgTypeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            orgTypeInput.value = this.dataset.value;
        });
    });

    // Валидация формы
    businessForm.addEventListener('submit', function(e) {
        // Проверка телефона
        const phone = document.getElementById('business-phone').value;
        if (!/^\+7\s?[\(]?\d{3}[\)]?\s?\d{3}[-]?\d{2}[-]?\d{2}$/.test(phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            e.preventDefault();
            return;
        }

        // Проверка ИНН
        const inn = document.getElementById('inn').value;
        if (!/^\d{10,12}$/.test(inn)) {
            alert('Пожалуйста, введите корректный ИНН (10 или 12 цифр)');
            e.preventDefault();
            return;
        }

        // Проверка выбора типа организации
        if (!orgTypeInput.value) {
            alert('Пожалуйста, выберите тип организации');
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

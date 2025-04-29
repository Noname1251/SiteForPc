document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления меню
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // Функция переключения меню
    function toggleMenu() {
        const isActive = !sidebar.classList.contains('active');
        
        menuToggle.classList.toggle('active', isActive);
        sidebar.classList.toggle('active', isActive);
        overlay.classList.toggle('active', isActive);
        
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    // Функция закрытия меню
    function closeMenu() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Обработчики событий меню
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    closeMenu();
                }
            });
        });
    }

    // Логика конфигуратора
    const steps = document.querySelectorAll('.step');
    const componentLists = document.querySelectorAll('.components-list');
    const componentCards = document.querySelectorAll('.component-card');
    
    let selectedComponents = {
        cpu: { id: 'intel-i9', name: 'Intel Core i9-13900K', price: 49990 },
        gpu: null,
        ram: null,
        motherboard: null,
        storage: null,
        cooling: null
    };
    
    let totalPrice = 0; // Начальная цена с выбранным процессором

    // Переключение между шагами
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepId = this.getAttribute('data-step');
            
            steps.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            componentLists.forEach(list => {
                list.classList.add('hidden');
                if (list.id === stepId) {
                    list.classList.remove('hidden');
                }
            });
        });
    });
    
    // Выбор компонента
    componentCards.forEach(card => {
        card.addEventListener('click', function() {
            const componentType = this.getAttribute('data-component');
            const componentId = this.getAttribute('data-id');
            const componentPrice = parseInt(this.getAttribute('data-price'));
            const componentName = this.querySelector('h3').textContent;
            const componentImage = this.querySelector('img').src;
            
            // Обновляем выбранный компонент
            selectedComponents[componentType] = { 
                id: componentId, 
                name: componentName, 
                price: componentPrice,
                image: componentImage
            };
            
            // Обновляем UI
            this.parentElement.querySelectorAll('.component-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            
            updateSelectedComponentUI(componentType, componentName, componentPrice);
            updateTotalPrice();
            checkAddToCartButton();
        });
    });
    
    // Обновление UI выбранного компонента
    function updateSelectedComponentUI(type, name, price) {
        const componentElement = document.querySelector(`.selected-component[data-component="${type}"]`);
        if (!componentElement) return;
        
        componentElement.classList.remove('empty');
        componentElement.querySelector('.component-name').textContent = name;
        
        const priceElement = componentElement.querySelector('.component-price');
        priceElement.textContent = `${price.toLocaleString('ru-RU')} ₽`;
        priceElement.classList.remove('hidden');
    }
    
    // Обновление итоговой цены
    function updateTotalPrice() {
        totalPrice = Object.values(selectedComponents)
            .filter(component => component !== null)
            .reduce((sum, component) => sum + component.price, 0);
        
        document.getElementById('total-price').textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }
    
    // Проверка кнопки "Добавить в корзину"
    function checkAddToCartButton() {
        const allSelected = Object.values(selectedComponents).every(component => component !== null);
        document.getElementById('add-to-cart').disabled = !allSelected;
    }
    

    // Инициализация конфигуратора
    updateTotalPrice();
    checkAddToCartButton();

    // Обработчик события для кнопки "Добавить в корзину"
    document.getElementById('add-to-cart').addEventListener('click', addToCart);

    // Функция добавления выбранных компонентов в корзину
    function addToCart() {
        const cartItems = document.querySelector('.cart-items');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const checkoutButton = document.querySelector('.checkout-btn');

        // Очистка корзины перед добавлением новых компонентов
        cartItems.innerHTML = '';

        // Добавление выбранных компонентов в корзину
        Object.values(selectedComponents).forEach(component => {
            if (component) {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${component.image}" alt="${component.name}">
                    <div class="item-details">
                        <h3>${component.name}</h3>
                        <p>${component.price.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <button class="remove-item-btn">Удалить</button>
                `;
                cartItems.appendChild(cartItem);
            }
        });

        // Обновление итоговой цены в корзине
        const totalPriceElement = document.querySelector('.total-price');
        totalPriceElement.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;

        // Обновление количества товаров в корзине
        const itemsCountElement = document.querySelector('.items-price');
        const itemsCount = Object.values(selectedComponents).filter(component => component !== null).length;
        itemsCountElement.textContent = `${itemsCount} товар(ов)`;

        // Скрытие сообщения о пустой корзине и активация кнопки оформления заказа
        emptyCartMessage.classList.add('hidden');
        checkoutButton.disabled = false;

        // Добавление обработчиков событий для кнопок удаления
        const removeButtons = document.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeItemFromCart);
        });
    }

    // Функция удаления компонента из корзины
    function removeItemFromCart(event) {
        const cartItem = event.target.closest('.cart-item');
        const componentName = cartItem.querySelector('h3').textContent;
        const componentType = Object.keys(selectedComponents).find(key => selectedComponents[key]?.name === componentName);

        if (componentType) {
            selectedComponents[componentType] = null;
            cartItem.remove();
            updateTotalPrice();
            checkAddToCartButton();
            addToCart();
        }
    }
});

// Для помощи со сборкой
// Обработчик для ползунка бюджета
const budgetSlider = document.getElementById('budget');
const budgetValue = document.getElementById('budget-value');

budgetSlider.addEventListener('input', function() {
    const value = parseInt(this.value).toLocaleString('ru-RU');
    budgetValue.textContent = `${value} ₽`;
});

// Обработчик отправки формы
const helpForm = document.getElementById('pc-help-form');

helpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Здесь можно добавить AJAX-запрос для отправки данных
    alert('Ваша заявка принята! Наш специалист свяжется с вами в ближайшее время.');
    helpForm.reset();
    budgetValue.textContent = '100 000 ₽';
});
document.addEventListener('DOMContentLoaded', function() {
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

    // ========== Логика конфигуратора ==========
    const componentTypes = [
        'cpu', 'gpu', 'ram', 'motherboard', 
        'storage', 'cooling', 'frame', 'powerunit'
    ];

    // Инициализация выбранных компонентов
    let selectedComponents = {
        cpu: { 
            id: 'intel-i9', 
            name: 'Intel Core i9-13900K', 
            price: 49990, 
            image: 'images/cpu-intel.jpg' 
        }
    };
    
    componentTypes.forEach(type => {
        if (!selectedComponents[type]) {
            selectedComponents[type] = null;
        }
    });

    let totalPrice = calculateTotalPrice();

    // ========== DOM элементы ==========
    const steps = document.querySelectorAll('.step');
    const componentLists = document.querySelectorAll('.components-list');
    const componentCards = document.querySelectorAll('.component-card');
    const addToCartBtn = document.getElementById('add-to-cart');

    // ========== Основные функции ==========
    function calculateTotalPrice() {
        return Object.values(selectedComponents)
            .filter(comp => comp !== null)
            .reduce((sum, comp) => sum + comp.price, 0);
    }

    function updateTotalPriceDisplay() {
        document.getElementById('total-price').textContent = 
            `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }

    function updateHorizontalPreview() {
        const container = document.querySelector('.selected-components-horizontal');
        container.innerHTML = '';

        componentTypes.forEach(type => {
            const component = selectedComponents[type];
            if (component) {
                const element = document.createElement('div');
                element.className = 'selected-component-horizontal';
                element.innerHTML = `
                    <img src="${component.image}" alt="${component.name}">
                    <span>${component.name}</span>
                `;
                container.appendChild(element);
            }
        });
    }

    function updateComponentSelectionUI() {
        // Сбрасываем выделение всех карточек
        componentCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Выделяем выбранные компоненты
        componentTypes.forEach(type => {
            const component = selectedComponents[type];
            if (component) {
                const selectedCard = document.querySelector(
                    `.component-card[data-component="${type}"][data-id="${component.id}"]`
                );
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                }
            }
        });
    }

    function checkCompleteness() {
        const isComplete = componentTypes.every(
            type => selectedComponents[type] !== null
        );
        addToCartBtn.disabled = !isComplete;
        return isComplete;
    }

    // ========== Обработчики событий ==========
    // Переключение между шагами (типами компонентов)
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepId = this.getAttribute('data-step');
            
            // Обновляем активный шаг
            steps.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            // Скрываем все списки компонентов
            componentLists.forEach(list => {
                list.classList.add('hidden');
            });
            
            // Показываем только выбранный список компонентов
            const activeList = document.getElementById(stepId);
            if (activeList) {
                activeList.classList.remove('hidden');
            }
        });
    });

    // Выбор конкретного компонента
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
            
            // Пересчитываем общую стоимость
            totalPrice = calculateTotalPrice();
            
            // Обновляем UI
            updateComponentSelectionUI();
            updateHorizontalPreview();
            updateTotalPriceDisplay();
            checkCompleteness();
        });
    });

    // Добавление в корзину
    addToCartBtn.addEventListener('click', function() {
        if (!checkCompleteness()) return;
        
        // Здесь должна быть логика добавления в корзину
        console.log('Добавлено в корзину:', selectedComponents);
        alert(`Сборка добавлена в корзину! Общая стоимость: ${totalPrice.toLocaleString('ru-RU')} ₽`);
        
        // Можно добавить редирект на страницу корзины
        // window.location.href = 'cart.html';
    });

        // ========== Инициализация ==========
        function initConfigurator() {
            updateComponentSelectionUI();
            updateHorizontalPreview();
            updateTotalPriceDisplay();
            checkCompleteness();
            
            // Скрываем все списки компонентов
            componentLists.forEach(list => {
                list.classList.add('hidden');
            });
            
            // Показываем первый шаг (процессоры)
            document.querySelector('.step[data-step="cpu"]').click();
        }
    });


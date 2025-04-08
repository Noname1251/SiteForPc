document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления меню
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    // Проверка наличия элементов
    if (!menuToggle || !sidebar || !overlay) {
        console.error('Не найдены необходимые элементы для работы меню');
        return;
    }

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

    // Обработчики событий
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

    // Остальной код конфигуратора...
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
    let totalPrice = 49990; // Начальная цена с выбранным процессором

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
            
            updateSelectedComponent(componentType, componentId, componentName, componentPrice);
            
            this.parentElement.querySelectorAll('.component-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            
            updateTotalPrice();
            checkAddToCartButton();
        });
    });
    
    // Обновление выбранного компонента
    function updateSelectedComponent(type, id, name, price) {
        selectedComponents[type] = { id, name, price };
        
        const componentElement = document.querySelector(`.selected-component[data-component="${type}"]`);
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
    
    // Обработка добавления в корзину
    document.getElementById('add-to-cart').addEventListener('click', function() {
        alert(`Сборка добавлена в корзину! Общая стоимость: ${totalPrice.toLocaleString('ru-RU')} ₽`);
        
        localStorage.setItem('currentBuild', JSON.stringify({
            components: selectedComponents,
            totalPrice: totalPrice,
            date: new Date().toISOString()
        }));
    });
});
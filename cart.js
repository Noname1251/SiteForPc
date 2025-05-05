// cart.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartIcon();
    
    // Обработчики для кнопок "В корзину" (делегирование событий)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e);
        }
        
        // Обработка кнопок в корзине
        if (e.target.classList.contains('quantity-btn') || e.target.classList.contains('item-remove')) {
            handleCartAction(e);
        }
    });
    
    // Функция добавления в корзину
    function addToCart(e) {
        const button = e.target;
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const image = button.dataset.image;
        
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        showNotification('Товар добавлен в корзину');
    }
    
    // Обработка действий в корзине
    function handleCartAction(e) {
        e.preventDefault();
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;
        
        const itemId = itemElement.dataset.id;
        const quantityElement = itemElement.querySelector('.quantity');
        const totalElement = itemElement.querySelector('.item-total');
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) return;
        
        if (e.target.classList.contains('plus')) {
            // Увеличиваем количество
            cart[itemIndex].quantity += 1;
            quantityElement.textContent = cart[itemIndex].quantity;
            totalElement.textContent = (cart[itemIndex].price * cart[itemIndex].quantity).toLocaleString() + ' ₽';
        } 
        else if (e.target.classList.contains('minus')) {
            // Уменьшаем количество или удаляем
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
                quantityElement.textContent = cart[itemIndex].quantity;
                totalElement.textContent = (cart[itemIndex].price * cart[itemIndex].quantity).toLocaleString() + ' ₽';
            } else {
                // Удаляем товар полностью
                itemElement.remove();
                cart.splice(itemIndex, 1);
            }
        } 
        else if (e.target.classList.contains('item-remove')) {
            // Удаляем товар полностью
            itemElement.remove();
            cart.splice(itemIndex, 1);
        }
        
        // Обновляем данные
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        updateCartSummary();
        
        // Проверяем, пуста ли корзина
        if (cart.length === 0) {
            document.querySelector('.empty-cart-message').classList.remove('hidden');
            document.querySelector('.checkout-btn').disabled = true;
        }
    }
    
    // Обновление иконки корзины
    function updateCartIcon() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = totalItems;
        });
    }
    
    // Показать уведомление
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Инициализация корзины на странице корзины
    if (document.querySelector('.cart-container')) {
        renderCartItems();
        updateCartSummary();
    }
    
    // Рендер товаров в корзине
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.innerHTML = '';
            checkoutBtn.disabled = true;
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        checkoutBtn.disabled = false;
        
        let itemsHTML = '';
        
        cart.forEach(item => {
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-price">${item.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <div class="item-total">${(item.price * item.quantity).toLocaleString()} ₽</div>
                    <button class="item-remove">×</button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        
        cart.forEach(item => {
            if (item.components) {
                // Это сборка из конфигуратора
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">${item.name}</h3>
                            <div class="components-list">
                                ${Object.values(item.components).map(comp => 
                                    `<div class="component">${comp.name}</div>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn minus">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="item-total">${(item.price * item.quantity).toLocaleString()} ₽</div>
                        <button class="item-remove">×</button>
                    </div>
                `;
            } else {
                // Обычный товар
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">${item.name}</h3>
                            <div class="item-price">${item.price.toLocaleString()} ₽</div>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn minus">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <div class="item-total">${(item.price * item.quantity).toLocaleString()} ₽</div>
                        <button class="item-remove">×</button>
                    </div>
                `;
            }
        });
    }
    
    // Обновление итоговой суммы
    function updateCartSummary() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelector('.items-price').textContent = `${total.toLocaleString()} ₽`;
        document.querySelector('.total-price').textContent = `${total.toLocaleString()} ₽`;
        document.querySelector('.summary-row span:first-child').textContent = `Товары (${totalItems})`;
    }
});
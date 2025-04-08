// Логика корзины
const cart = {
    items: [],
    total: 0,

    addItem(item) {
        this.items.push(item);
        this.calculateTotal();
        this.updateCartIcon();
    },

    removeItem(index) {
        this.items.splice(index, 1);
        this.calculateTotal();
        this.updateCartIcon();
    },

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
        document.querySelector('.total-price').textContent = `${this.total} ₽`;
    },

    updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = this.items.length;
        cartCount.style.display = this.items.length ? 'block' : 'none';
    }
};

// Инициализация корзины
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
});

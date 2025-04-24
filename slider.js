// slider.js
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 7000; // 5 секунд

    // Основная функция переключения слайдов
    function goToSlide(n) {
        // Скрываем все слайды
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Обновляем текущий слайд
        currentSlide = (n + slides.length) % slides.length;
        
        // Показываем текущий слайд
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Всегда перезапускаем таймер после изменения слайда
        restartTimer();
    }

    // Перезапуск таймера
    function restartTimer() {
        clearInterval(slideInterval); // Очищаем предыдущий таймер
        slideInterval = setInterval(() => goToSlide(currentSlide + 1), slideDuration);
    }

    // Инициализация слайдера
    function initSlider() {
        // Показываем первый слайд
        goToSlide(0);
        
        // Навешиваем обработчики событий
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        
        // Обработчики для точек навигации
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Пауза при наведении курсора
        const slider = document.querySelector('.slider-container');
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', restartTimer);
    }

    // Запускаем слайдер
    initSlider();
});
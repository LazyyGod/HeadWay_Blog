document.addEventListener('DOMContentLoaded', function() {
    // Анимация счетчиков
    const counters = document.querySelectorAll('.stat-value');
    const speed = 200;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText.replace('+', '');
            
            if (count < target) {
                counter.innerText = '+' + Math.ceil(count + target / speed);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = '+' + target;
            }
        };
        
        updateCount();
    });
    
    // Показать/скрыть модальное окно
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const startNowBtn = document.getElementById('startNow');
    const startFreeBtn = document.getElementById('startFree');
    const learnMoreBtn = document.getElementById('learnMore');
    
    function openModal() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (startNowBtn) startNowBtn.addEventListener('click', openModal);
    if (startFreeBtn) startFreeBtn.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => {
        alert('Подробная информация о системе Headway будет доступна на отдельной странице.');
    });
    
    // Закрыть модальное окно при клике вне его
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Эффект параллакса для частиц
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX * speed * 10) + 'px';
            const y = (mouseY * speed * 10) + 'px';
            particle.style.transform = `translate(${x}, ${y})`;
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    document.querySelectorAll('.cap-card, .evo-card, .cta-feature').forEach(el => {
        observer.observe(el);
    });
    
    // Эффект печати для терминала
    const terminalLines = document.querySelectorAll('.terminal-line');
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeIn 0.5s ${index * 0.5}s forwards`;
    });
    
    // Динамическое обновление статуса системы
    const statusDot = document.querySelector('.hologram-status');
    setInterval(() => {
        statusDot.style.animation = 'none';
        setTimeout(() => {
            statusDot.style.animation = 'pulse 2s infinite';
        }, 10);
    }, 5000);
    
    // Добавляем стили для анимаций
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Эффект наведения на кнопки навигации
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Случайное изменение значений в голограмме (для эффекта живых данных)
    setInterval(() => {
        const values = document.querySelectorAll('.data-value');
        values.forEach(value => {
            const current = parseInt(value.textContent);
            const change = Math.random() > 0.5 ? 1 : -1;
            const newValue = Math.max(1, current + change);
            value.textContent = `+${newValue}%`;
        });
    }, 3000);
});
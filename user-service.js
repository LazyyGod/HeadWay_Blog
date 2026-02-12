// user-service.js
class UserService {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('headway_users')) || [];
        this.initDefaultUsers();
    }

    initDefaultUsers() {
        if (this.users.length === 0) {
            const defaultUsers = [
                {
                    id: this.generateId(),
                    email: 'demo@headway.com',
                    password: 'demo123',
                    name: 'Демо Пользователь',
                    level: 1,
                    strength: 75,
                    endurance: 60,
                    discipline: 90,
                    avatar: '👤',
                    joined: new Date().toISOString(),
                    plan: 'premium'
                }
            ];
            this.users = defaultUsers;
            this.saveUsers();
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveUsers() {
        localStorage.setItem('headway_users', JSON.stringify(this.users));
    }

    register(email, password, name = 'Новый атлет') {
        // Проверяем, существует ли пользователь
        if (this.users.some(user => user.email === email)) {
            return { success: false, message: 'Пользователь с таким email уже существует' };
        }

        // Создаем нового пользователя
        const newUser = {
            id: this.generateId(),
            email,
            password, // В реальном приложении нужно хэшировать пароль!
            name,
            level: 1,
            strength: Math.floor(Math.random() * 30) + 10,
            endurance: Math.floor(Math.random() * 30) + 10,
            discipline: Math.floor(Math.random() * 30) + 10,
            avatar: this.getRandomAvatar(),
            joined: new Date().toISOString(),
            plan: 'free',
            stats: {
                workouts: 0,
                totalWeight: 0,
                streaks: 0
            }
        };

        this.users.push(newUser);
        this.saveUsers();
        this.login(email, password);

        return { 
            success: true, 
            message: 'Регистрация успешна!',
            user: newUser 
        };
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('headway_current_user', JSON.stringify(user));
            
            // Обновляем UI
            this.updateUI();
            
            return { success: true, user };
        }
        
        return { success: false, message: 'Неверный email или пароль' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('headway_current_user');
        this.updateUI();
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const saved = localStorage.getItem('headway_current_user');
            if (saved) {
                this.currentUser = JSON.parse(saved);
            }
        }
        return this.currentUser;
    }

    updateUserStats(stats) {
        const user = this.getCurrentUser();
        if (user) {
            user.stats = { ...user.stats, ...stats };
            this.saveUsers();
            localStorage.setItem('headway_current_user', JSON.stringify(user));
            this.updateUI();
        }
    }

    upgradeToPremium() {
        const user = this.getCurrentUser();
        if (user && user.plan === 'free') {
            user.plan = 'premium';
            this.saveUsers();
            localStorage.setItem('headway_current_user', JSON.stringify(user));
            this.updateUI();
            return true;
        }
        return false;
    }

    getRandomAvatar() {
        const avatars = ['👤', '💪', '🏃', '⚡', '🔥', '🚀', '🌟', '🎯'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    updateUI() {
        const user = this.getCurrentUser();
        const authButtons = document.querySelector('.nav-cta');
        
        if (user) {
            // Обновляем кнопку в навигации
            if (authButtons) {
                authButtons.innerHTML = `
                    <span class="cta-text">${user.name}</span>
                    <div class="cta-arrow">▼</div>
                `;
                authButtons.onclick = () => this.showUserMenu();
            }
            
            // Обновляем голограмму
            this.updateHologram(user);
            
            // Обновляем статистику
            this.updateStats(user);
        } else {
            if (authButtons) {
                authButtons.innerHTML = `
                    <span class="cta-text">ВХОД</span>
                    <div class="cta-arrow">→</div>
                `;
                authButtons.onclick = () => this.showLoginModal();
            }
            
            // Сбрасываем голограмму к демо-данным
            this.resetHologram();
        }
    }

    updateHologram(user) {
        const strengthBar = document.querySelector('.strength');
        const enduranceBar = document.querySelector('.endurance');
        const disciplineBar = document.querySelector('.discipline');
        const strengthValue = document.querySelector('.data-value:nth-child(1)');
        const enduranceValue = document.querySelector('.data-value:nth-child(2)');
        const disciplineValue = document.querySelector('.data-value:nth-child(3)');
        const userAvatar = document.querySelector('.avatar-ring span');
        const userName = document.querySelector('.user-avatar span');
        const userLevel = document.querySelector('.user-level');

        if (strengthBar) strengthBar.style.width = user.strength + '%';
        if (enduranceBar) enduranceBar.style.width = user.endurance + '%';
        if (disciplineBar) disciplineBar.style.width = user.discipline + '%';
        
        if (strengthValue) strengthValue.textContent = `+${user.strength}%`;
        if (enduranceValue) enduranceValue.textContent = `+${user.endurance}%`;
        if (disciplineValue) disciplineValue.textContent = `+${user.discipline}%`;
        
        if (userAvatar) userAvatar.textContent = user.avatar;
        if (userName) userName.textContent = user.name.split(' ')[0];
        if (userLevel) userLevel.textContent = `LEVEL ${user.level}`;
    }

    resetHologram() {
        // Возвращаем демо-данные
        const strengthBar = document.querySelector('.strength');
        const enduranceBar = document.querySelector('.endurance');
        const disciplineBar = document.querySelector('.discipline');
        const strengthValue = document.querySelectorAll('.data-value')[0];
        const enduranceValue = document.querySelectorAll('.data-value')[1];
        const disciplineValue = document.querySelectorAll('.data-value')[2];
        const userAvatar = document.querySelector('.avatar-ring span');
        const userName = document.querySelector('.user-avatar span');
        const userLevel = document.querySelector('.user-level');

        if (strengthBar) strengthBar.style.width = '75%';
        if (enduranceBar) enduranceBar.style.width = '60%';
        if (disciplineBar) disciplineBar.style.width = '90%';
        
        if (strengthValue) strengthValue.textContent = '+18.7%';
        if (enduranceValue) enduranceValue.textContent = '+12.3%';
        if (disciplineValue) disciplineValue.textContent = '+24.1%';
        
        if (userAvatar) userAvatar.innerHTML = '<i class="fa-regular fa-user"></i>';
        if (userName) userName.textContent = 'YOU';
        if (userLevel) userLevel.textContent = 'LEVEL 1';
    }

    updateStats(user) {
        // Обновляем статистику в интерфейсе
        const statElements = {
            workouts: document.querySelector('.stat-value[data-count="18950"]'),
            activeUsers: document.querySelector('.stat-value[data-count="247"]')
        };
        
        if (user.stats && statElements.workouts) {
            statElements.workouts.textContent = `+${user.stats.workouts || 0}`;
        }
    }

    showLoginModal() {
        // Показываем модальное окно с формой входа/регистрации
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Обновляем содержимое модального окна для регистрации/входа
            this.updateModalContent();
        }
    }

    updateModalContent() {
        const modalBody = document.querySelector('.modal-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">ВХОД</button>
                <button class="auth-tab" data-tab="register">РЕГИСТРАЦИЯ</button>
            </div>
            
            <div class="auth-content">
                <div class="auth-form active" id="login-form">
                    <div class="form-group">
                        <input type="email" id="login-email" placeholder="EMAIL" class="modal-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="login-password" placeholder="ПАРОЛЬ" class="modal-input">
                    </div>
                    <button class="modal-btn" id="login-btn">ВОЙТИ В СИСТЕМУ</button>
                    <p class="auth-switch">Нет аккаунта? <a href="#" class="switch-to-register">Зарегистрироваться</a></p>
                </div>
                
                <div class="auth-form" id="register-form">
                    <div class="form-group">
                        <input type="text" id="register-name" placeholder="ВАШЕ ИМЯ" class="modal-input">
                    </div>
                    <div class="form-group">
                        <input type="email" id="register-email" placeholder="EMAIL" class="modal-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-password" placeholder="ПАРОЛЬ" class="modal-input">
                    </div>
                    <div class="form-group">
                        <input type="password" id="register-confirm" placeholder="ПОДТВЕРДИТЕ ПАРОЛЬ" class="modal-input">
                    </div>
                    <button class="modal-btn" id="register-btn">СОЗДАТЬ АККАУНТ</button>
                    <p class="auth-switch">Уже есть аккаунт? <a href="#" class="switch-to-login">Войти</a></p>
                </div>
            </div>
            
            <div class="demo-credentials">
                <p>Демо доступ: demo@headway.com / demo123</p>
            </div>
        `;

        this.setupAuthEvents();
    }

    setupAuthEvents() {
        // Переключение между вкладками
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                e.target.classList.add('active');
                const tabId = e.target.dataset.tab;
                document.getElementById(`${tabId}-form`).classList.add('active');
            });
        });

        // Переключение между формами
        document.querySelectorAll('.auth-switch a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.classList.contains('switch-to-register') ? 'register' : 'login';
                
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                document.querySelector(`[data-tab="${target}"]`).classList.add('active');
                document.getElementById(`${target}-form`).classList.add('active');
            });
        });

        // Кнопка входа
        document.getElementById('login-btn')?.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = this.login(email, password);
            if (result.success) {
                this.closeModal();
                this.showNotification('Успешный вход!', 'success');
            } else {
                this.showNotification(result.message, 'error');
            }
        });

        // Кнопка регистрации
        document.getElementById('register-btn')?.addEventListener('click', () => {
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (!name || !email || !password) {
                this.showNotification('Заполните все поля', 'error');
                return;
            }
            
            if (password !== confirm) {
                this.showNotification('Пароли не совпадают', 'error');
                return;
            }
            
            if (password.length < 6) {
                this.showNotification('Пароль должен быть не менее 6 символов', 'error');
                return;
            }
            
            const result = this.register(email, password, name);
            if (result.success) {
                this.closeModal();
                this.showNotification('Регистрация успешна! Добро пожаловать в Headway!', 'success');
            } else {
                this.showNotification(result.message, 'error');
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Автоудаление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showUserMenu() {
        const user = this.getCurrentUser();
        if (!user) return;

        // Создаем меню пользователя
        const menu = document.createElement('div');
        menu.className = 'user-menu';
        menu.innerHTML = `
            <div class="user-menu-header">
                <div class="user-menu-avatar">${user.avatar}</div>
                <div class="user-menu-info">
                    <div class="user-menu-name">${user.name}</div>
                    <div class="user-menu-plan ${user.plan}">${user.plan === 'premium' ? 'PREMIUM' : 'FREE'}</div>
                </div>
            </div>
            <div class="user-menu-stats">
                <div class="user-menu-stat">
                    <span>Тренировок</span>
                    <span>${user.stats?.workouts || 0}</span>
                </div>
                <div class="user-menu-stat">
                    <span>Уровень</span>
                    <span>${user.level}</span>
                </div>
            </div>
            <div class="user-menu-actions">
                ${user.plan === 'free' ? 
                    `<button class="user-menu-btn upgrade-btn" id="upgradeBtn">
                        <i class="fas fa-rocket"></i> АПГРЕЙДНУТЬСЯ
                    </button>` : ''
                }
                <button class="user-menu-btn" id="profileBtn">
                    <i class="fas fa-user"></i> ПРОФИЛЬ
                </button>
                <button class="user-menu-btn logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> ВЫЙТИ
                </button>
            </div>
        `;

        // Удаляем старое меню, если есть
        const oldMenu = document.querySelector('.user-menu');
        if (oldMenu) oldMenu.remove();

        // Позиционируем меню
        const authButton = document.querySelector('.nav-cta');
        const rect = authButton.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = rect.bottom + 10 + 'px';
        menu.style.right = window.innerWidth - rect.right + 'px';
        
        document.body.appendChild(menu);

        // Обработчики событий
        menu.addEventListener('click', (e) => e.stopPropagation());
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
            menu.remove();
            this.showNotification('Вы вышли из системы', 'info');
        });
        
        document.getElementById('upgradeBtn')?.addEventListener('click', () => {
            if (this.upgradeToPremium()) {
                this.showNotification('Поздравляем! Теперь у вас Premium доступ!', 'success');
                this.updateUI();
                menu.remove();
            }
        });
        
        document.getElementById('profileBtn')?.addEventListener('click', () => {
            this.showProfileModal();
            menu.remove();
        });

        // Закрытие меню при клике вне его
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && !authButton.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    showProfileModal() {
        const user = this.getCurrentUser();
        if (!user) return;

        const modal = document.getElementById('modalOverlay');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div class="profile-header">
                    <div class="profile-avatar">${user.avatar}</div>
                    <div class="profile-info">
                        <h3>${user.name}</h3>
                        <p class="profile-email">${user.email}</p>
                        <div class="profile-plan ${user.plan}">${user.plan === 'premium' ? 'PREMIUM МЕМБЕР' : 'БАЗОВЫЙ ДОСТУП'}</div>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <h4>СТАТИСТИКА</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-card-value">${user.level}</div>
                            <div class="stat-card-label">Уровень</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-value">${user.stats?.workouts || 0}</div>
                            <div class="stat-card-label">Тренировок</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-value">${user.joined ? new Date(user.joined).toLocaleDateString('ru-RU') : '-'}</div>
                            <div class="stat-card-label">С нами с</div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-progress">
                    <h4>ПРОГРЕСС</h4>
                    <div class="progress-bars">
                        <div class="progress-item">
                            <span>Сила</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${user.strength}%"></div>
                            </div>
                            <span>${user.strength}%</span>
                        </div>
                        <div class="progress-item">
                            <span>Выносливость</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${user.endurance}%"></div>
                            </div>
                            <span>${user.endurance}%</span>
                        </div>
                        <div class="progress-item">
                            <span>Дисциплина</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${user.discipline}%"></div>
                            </div>
                            <span>${user.discipline}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="profile-actions">
                    ${user.plan === 'free' ? 
                        `<button class="modal-btn upgrade-profile-btn" id="upgradeProfileBtn">
                            <i class="fas fa-rocket"></i> ПЕРЕЙТИ НА PREMIUM
                        </button>` : 
                        `<button class="modal-btn" disabled>
                            <i class="fas fa-crown"></i> PREMIUM АКТИВИРОВАН
                        </button>`
                    }
                    <button class="modal-btn secondary-btn" id="closeProfileBtn">
                        ЗАКРЫТЬ
                    </button>
                </div>
            `;

            // Обработчики событий
            document.getElementById('upgradeProfileBtn')?.addEventListener('click', () => {
                if (this.upgradeToPremium()) {
                    this.showNotification('Поздравляем с переходом на Premium!', 'success');
                    this.updateUI();
                    this.closeModal();
                }
            });
            
            document.getElementById('closeProfileBtn')?.addEventListener('click', () => {
                this.closeModal();
            });
        }
    }
}

// Создаем глобальный экземпляр сервиса
window.userService = new UserService();
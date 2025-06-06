
// Authentication functionality
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Animate page elements on load
        this.animatePageLoad();
        
        // Bind form events
        this.bindEvents();
    }

    animatePageLoad() {
        // GSAP animations for page load
        const tl = gsap.timeline();
        
        tl.from('.auth-card', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.logo-icon', {
            duration: 0.5,
            scale: 0,
            rotation: 180,
            ease: 'back.out(1.7)'
        }, '-=0.3')
        .from('.logo h1', {
            duration: 0.4,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.auth-form > *', {
            duration: 0.4,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.2');
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Form input animations
        this.setupInputAnimations();
    }

    setupInputAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    gsap.to(label, {
                        duration: 0.3,
                        y: -12,
                        scale: 0.75,
                        color: '#007AFF',
                        ease: 'power2.out'
                    });
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        gsap.to(label, {
                            duration: 0.3,
                            y: 0,
                            scale: 1,
                            color: '#8E8E93',
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            this.showError('Veuillez remplir tous les champs');
            return;
        }

        // Simulate login process
        this.animateSubmit(e.target, () => {
            // Store user session
            localStorage.setItem('user', JSON.stringify({
                email: email,
                name: email.split('@')[0]
            }));
            
            // Redirect to tasks page
            window.location.href = 'task.html';
        });
    }

    handleRegister(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!firstName || !lastName || !email || !password) {
            this.showError('Veuillez remplir tous les champs');
            return;
        }

        // Simulate registration process
        this.animateSubmit(e.target, () => {
            // Store user session
            localStorage.setItem('user', JSON.stringify({
                email: email,
                name: `${firstName} ${lastName}`
            }));
            
            // Redirect to tasks page
            window.location.href = 'task.html';
        });
    }

    animateSubmit(form, callback) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Connexion...';
        
        // Animate button
        gsap.to(submitBtn, {
            duration: 0.3,
            scale: 0.95,
            ease: 'power2.out'
        });
        
        // Simulate API call delay
        setTimeout(() => {
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
            
            callback();
        }, 1500);
    }

    showError(message) {
        // Create error message element
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.style.cssText = `
            background: #FF3B30;
            color: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-size: 14px;
            opacity: 0;
        `;
        errorEl.textContent = message;
        
        const form = document.querySelector('.auth-form');
        form.insertBefore(errorEl, form.firstChild);
        
        // Animate error message
        gsap.to(errorEl, {
            duration: 0.3,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(errorEl, {
                duration: 0.3,
                opacity: 0,
                y: -10,
                ease: 'power2.out',
                onComplete: () => errorEl.remove()
            });
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

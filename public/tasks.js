
// Task management functionality
class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentTaskId = null;
        this.init();
    }

    init() {
        // Check if user is logged in
        this.checkAuth();
        
        // Animate page load
        this.animatePageLoad();
        
        // Bind events
        this.bindEvents();
        
        // Load tasks
        this.loadTasks();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        // Set user name in header
        document.getElementById('userName').textContent = user.name;
    }

    animatePageLoad() {
        const tl = gsap.timeline();
        
        tl.from('.app-header', {
            duration: 0.6,
            y: -100,
            opacity: 0,
            ease: 'power3.out'
        })
        .from('.content-header', {
            duration: 0.5,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.tasks-container', {
            duration: 0.5,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
    }

    bindEvents() {
        // New task button
        document.getElementById('newTaskBtn').addEventListener('click', () => {
            this.openTaskModal();
        });

        // Close modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeTaskModal();
        });

        // Modal overlay click
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeTaskModal();
            }
        });

        // Task form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            this.handleTaskSubmit(e);
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

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

    loadTasks() {
        const tasksBody = document.getElementById('tasksBody');
        const emptyState = document.getElementById('emptyState');
        
        if (this.tasks.length === 0) {
            emptyState.style.display = 'block';
            tasksBody.innerHTML = '';
            return;
        }
        
        emptyState.style.display = 'none';
        tasksBody.innerHTML = '';
        
        this.tasks.forEach(task => {
            const row = this.createTaskRow(task);
            tasksBody.appendChild(row);
        });
        
        // Animate rows
        gsap.from('.tasks-table tbody tr', {
            duration: 0.4,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    createTaskRow(task) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${task.title}</strong></td>
            <td>${task.details}</td>
            <td>${task.author}</td>
            <td>${task.assignee}</td>
            <td><span class="status-badge status-${task.status}">${this.getStatusText(task.status)}</span></td>
            <td>
                <div class="task-actions">
                    <button class="btn-small btn-edit" onclick="taskManager.editTask(${task.id})">Modifier</button>
                    <button class="btn-small btn-delete" onclick="taskManager.deleteTask(${task.id})">Supprimer</button>
                </div>
            </td>
        `;
        return row;
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'En attente',
            'in-progress': 'En cours',
            'completed': 'Terminée'
        };
        return statusMap[status] || status;
    }

    openTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        if (task) {
            // Edit mode
            modalTitle.textContent = 'Modifier la tâche';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDetails').value = task.details;
            document.getElementById('taskAuthor').value = task.author;
            document.getElementById('taskAssignee').value = task.assignee;
            document.getElementById('taskStatus').value = task.status;
            this.currentTaskId = task.id;
            
            // Trigger label animations for filled inputs
            this.animateFilledLabels();
        } else {
            // Create mode
            modalTitle.textContent = 'Nouvelle tâche';
            form.reset();
            this.currentTaskId = null;
        }
        
        // Show modal with animation
        modal.classList.add('active');
        
        gsap.fromTo(modal, 
            { opacity: 0 },
            { duration: 0.3, opacity: 1, ease: 'power2.out' }
        );
        
        gsap.fromTo('.modal-content', 
            { scale: 0.9, y: 20 },
            { duration: 0.3, scale: 1, y: 0, ease: 'back.out(1.2)' }
        );
        
        // Focus first input
        setTimeout(() => {
            document.getElementById('taskTitle').focus();
        }, 300);
    }

    animateFilledLabels() {
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            const label = group.querySelector('label');
            
            if (input && label && input.value) {
                gsap.set(label, {
                    y: -12,
                    scale: 0.75,
                    color: '#007AFF'
                });
            }
        });
    }

    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        
        gsap.to('.modal-content', {
            duration: 0.2,
            scale: 0.9,
            y: 20,
            ease: 'power2.in'
        });
        
        gsap.to(modal, {
            duration: 0.3,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
            }
        });
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const details = document.getElementById('taskDetails').value;
        const author = document.getElementById('taskAuthor').value;
        const assignee = document.getElementById('taskAssignee').value;
        const status = document.getElementById('taskStatus').value;
        
        if (!title || !details || !author || !assignee || !status) {
            this.showError('Veuillez remplir tous les champs');
            return;
        }
        
        const taskData = {
            title,
            details,
            author,
            assignee,
            status,
            createdAt: new Date().toISOString()
        };
        
        if (this.currentTaskId) {
            // Update existing task
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
            }
        } else {
            // Create new task
            taskData.id = Date.now();
            this.tasks.push(taskData);
        }
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        
        // Close modal and reload tasks
        this.closeTaskModal();
        setTimeout(() => {
            this.loadTasks();
        }, 300);
        
        // Show success message
        this.showSuccess(this.currentTaskId ? 'Tâche modifiée avec succès' : 'Tâche créée avec succès');
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.openTaskModal(task);
        }
    }

    deleteTask(taskId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                this.tasks.splice(taskIndex, 1);
                localStorage.setItem('tasks', JSON.stringify(this.tasks));
                
                // Animate row removal
                const row = document.querySelector(`button[onclick="taskManager.deleteTask(${taskId})"]`).closest('tr');
                gsap.to(row, {
                    duration: 0.3,
                    opacity: 0,
                    x: -50,
                    ease: 'power2.in',
                    onComplete: () => {
                        this.loadTasks();
                    }
                });
                
                this.showSuccess('Tâche supprimée avec succès');
            }
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            max-width: 300px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            ${type === 'error' ? 'background: #FF3B30;' : 'background: #34C759;'}
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        gsap.fromTo(notification, 
            { opacity: 0, x: 50 },
            { duration: 0.3, opacity: 1, x: 0, ease: 'power2.out' }
        );
        
        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(notification, {
                duration: 0.3,
                opacity: 0,
                x: 50,
                ease: 'power2.in',
                onComplete: () => notification.remove()
            });
        }, 3000);
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

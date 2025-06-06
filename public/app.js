
// Simple task manager app
class TaskManager {
    constructor() {
        this.tasks = [
            {
                id: 1,
                title: 'Préparer la présentation',
                details: 'Créer les slides pour la réunion client',
                author: 'Marie Dupont',
                assignee: 'Jean Martin',
                status: 'pending'
            },
            {
                id: 2,
                title: 'Réviser le code',
                details: 'Vérifier la qualité du code avant la mise en production',
                author: 'Pierre Durand',
                assignee: 'Sophie Moreau',
                status: 'in-progress'
            },
            {
                id: 3,
                title: 'Tester l\'application',
                details: 'Effectuer les tests fonctionnels complets',
                author: 'Lisa Chen',
                assignee: 'Marc Leroy',
                status: 'completed'
            }
        ];
        this.filteredTasks = [...this.tasks];
        this.currentTaskId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.animatePageLoad();
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
        .from('.search-container', {
            duration: 0.5,
            y: 20,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2')
        .from('.tasks-container', {
            duration: 0.5,
            y: 30,
            opacity: 0,
            ease: 'power2.out'
        }, '-=0.2');
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterTasks(e.target.value);
        });

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

        // Form input animations
        this.setupInputAnimations();
    }

    filterTasks(searchTerm) {
        if (!searchTerm) {
            this.filteredTasks = [...this.tasks];
        } else {
            this.filteredTasks = this.tasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                this.getStatusText(task.status).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        this.loadTasks();
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
        
        if (this.filteredTasks.length === 0) {
            emptyState.style.display = 'block';
            tasksBody.innerHTML = '';
            
            // Update empty state message based on search
            const searchInput = document.getElementById('searchInput');
            const emptyStateTitle = emptyState.querySelector('h3');
            const emptyStateDesc = emptyState.querySelector('p');
            
            if (searchInput.value) {
                emptyStateTitle.textContent = 'Aucun résultat';
                emptyStateDesc.textContent = 'Aucune tâche ne correspond à votre recherche';
            } else {
                emptyStateTitle.textContent = 'Aucune tâche';
                emptyStateDesc.textContent = 'Commencez par créer votre première tâche';
            }
            return;
        }
        
        emptyState.style.display = 'none';
        tasksBody.innerHTML = '';
        
        this.filteredTasks.forEach(task => {
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
        
        // Update filtered tasks and reload
        const searchTerm = document.getElementById('searchInput').value;
        this.filterTasks(searchTerm);
        
        // Close modal
        this.closeTaskModal();
        
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
                
                // Update filtered tasks and reload
                const searchTerm = document.getElementById('searchInput').value;
                this.filterTasks(searchTerm);
                
                this.showSuccess('Tâche supprimée avec succès');
            }
        }
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

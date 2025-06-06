
// Simple Task Manager
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentTaskId = null;
        this.init();
    }

    init() {
        this.animatePageLoad();
        this.bindEvents();
        this.loadTasks();
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
        document.getElementById('newTaskBtn').addEventListener('click', () => {
            this.openTaskModal();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeTaskModal();
        });

        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeTaskModal();
            }
        });

        document.getElementById('taskForm').addEventListener('submit', (e) => {
            this.handleTaskSubmit(e);
        });

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
            modalTitle.textContent = 'Modifier la tâche';
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDetails').value = task.details;
            document.getElementById('taskAuthor').value = task.author;
            document.getElementById('taskAssignee').value = task.assignee;
            document.getElementById('taskStatus').value = task.status;
            this.currentTaskId = task.id;
            this.animateFilledLabels();
        } else {
            modalTitle.textContent = 'Nouvelle tâche';
            form.reset();
            this.currentTaskId = null;
        }
        
        modal.classList.add('active');
        
        gsap.fromTo(modal, 
            { opacity: 0 },
            { duration: 0.3, opacity: 1, ease: 'power2.out' }
        );
        
        gsap.fromTo('.modal-content', 
            { scale: 0.9, y: 20 },
            { duration: 0.3, scale: 1, y: 0, ease: 'back.out(1.2)' }
        );
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
            status
        };
        
        if (this.currentTaskId) {
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentTaskId);
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
            }
        } else {
            taskData.id = Date.now();
            this.tasks.push(taskData);
        }
        
        this.closeTaskModal();
        setTimeout(() => {
            this.loadTasks();
        }, 300);
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.openTaskModal(task);
        }
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
            
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
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
});

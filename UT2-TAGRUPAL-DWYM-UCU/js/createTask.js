class CreateTask {
    constructor(personas, prioridades, estados) {
        this.personas = personas;
        this.prioridades = prioridades;
        this.estados = estados;
        this.editing = false;
        this.task = null;
    }

    generateOptions(options) {
        return options.map(option => `<option>${option}</option>`).join('');
    }

    toHTML() {
        return `
            <div class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title has-text-weight-semibold">Creación de tarea</p>
                        <button class="delete" aria-label="close" id="cancelButton"></button>
                    </header>
                    <section class="modal-card-body">
                        <form>
                            <div class="field">
                                <label class="label">Título</label>
                                <div class="control">
                                    <input class="input"  type="text" placeholder="Título de la tarea" id="taskTitle">
                                </div>
                                <p id="titleError" class="help is-danger" style="display: none;">Debe ingresar un título.</p>
                            </div>
                            <div class="field">
                                <label class="label">Descripción</label>
                                <div class="control">
                                    <textarea class="textarea" placeholder="Descripción de la tarea" id="taskDesc"></textarea>
                                </div>
                                <p id="descriptionError" class="help is-danger" style="display: none;">Debe ingresar una descripción. </p>
                            </div>

                            <div class="field">
                                <label class="label">Asignado</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskAssigned">
                                            ${this.generateOptions(this.personas)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Prioridad</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskPriority">
                                            ${this.generateOptions(this.prioridades)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Estado</label>
                                <div class="control">
                                    <div class="select">
                                        <select id="taskStatus">
                                            ${this.generateOptions(this.estados)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="field">
                                <label class="label">Fecha límite</label>
                                <div class="control">
                                    <input class="input" type="date" id="taskDueDate">
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer class="modal-card-foot">
                        <div class="control" id="saveButton">
                                <button class="button is-primary" disabled>Crear tarea</button>
                            </div>
                    </footer>
                </div>
            </div>
        `;
    }
    
    openModal() {
        document.querySelector('.modal-card-title').textContent = 'Creación de tarea';
        document.querySelector('#saveButton button').textContent = 'Crear tarea';
        document.querySelector('#modal-container .modal').classList.add('is-active');
    }

    validateTask() {
        const title = document.querySelector('#taskTitle').value.trim();
        const description = document.querySelector('#taskDesc').value.trim();
        
        let isValid = true;
        
        if (title === '') {
            document.getElementById('titleError').style.display = 'block';
            document.querySelector('#taskTitle').classList.add('is-danger');
            isValid = false;
        } else {
            document.getElementById('titleError').style.display = 'none';
            document.querySelector('#taskTitle').classList.remove('is-danger');
        }
        
        if (description === '') {
            document.getElementById('descriptionError').style.display = 'block';
            document.querySelector('#taskDesc').classList.add('is-danger');
            isValid = false;
        } else {
            document.getElementById('descriptionError').style.display = 'none';
            document.querySelector('#taskDesc').classList.remove('is-danger');
        }
        
        document.querySelector('#saveButton button').disabled = !isValid;
        return isValid;
    }
    loadTask(task) {
        const currentTask = JSON.parse(localStorage.getItem('tasks')).find(t => t.id === task.id);
        this.editing = true;
        this.task = task;
        document.querySelector('#taskTitle').value = currentTask.title;
        document.querySelector('#taskDesc').value = currentTask.description;
        document.querySelector('#taskAssigned').value = currentTask.assignedTo;
        document.querySelector('#taskPriority').value = currentTask.priority;
        document.querySelector('#taskStatus').value = currentTask.status;
        document.querySelector('#taskDueDate').value = currentTask.dueDate;
        document.querySelector('.modal-card-title').textContent = 'Editar tarea';
        document.querySelector('#saveButton button').textContent = 'Guardar cambios';
        document.querySelector('#saveButton button').disabled = false;
        document.querySelector('#modal-container .modal').classList.add('is-active');
    }

    saveTask() {
        if (!this.validateTask()) return;

        // Elimina la tarea actual si se está editando para que no se duplique.
        if(this.editing) {
            document.getElementById(this.task.id).remove();
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks = tasks.filter(t => t.id !== this.task.id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            this.editing = false;
            this.task = null;
        }

        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDesc').value;
        const assigned = document.querySelector('#taskAssigned').value;
        const priority = document.querySelector('#taskPriority').value;
        const status = document.querySelector('#taskStatus').value;
        let dueDate = document.querySelector('#taskDueDate').value;
        const uniqueId = `task-${Math.random().toString(36).substr(2, 9)}`
        if (!dueDate) {
            const today = new Date();
            today.setDate(today.getDate() + 7);
            dueDate = today.toISOString().slice(0, 10);
        }
        const task = new Task(title, description, assigned, priority, status, new Date().toISOString().slice(0, 10), dueDate, uniqueId);
        let backLog = document.getElementById('backlog');
        let toDo = document.getElementById('toDo');
        let inProgress = document.getElementById('inProgress');
        let blocked = document.getElementById('blocked');
        let done = document.getElementById('done');
        switch (task.status) {
            case 'backlog':
                backLog.innerHTML += task.toHTML();
                break;
            case 'toDo':
                toDo.innerHTML += task.toHTML();
                break;
            case 'inProgress':
                inProgress.innerHTML += task.toHTML();
                break;
            case 'blocked':
                blocked.innerHTML += task.toHTML();
                break;
            case 'done':
                done.innerHTML += task.toHTML();
                break;
            default:
                break;
        }
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Limpia los campos después de guardar la tarea
        this.cancelTask();
    }
    cancelTask() {
        document.querySelector('#taskTitle').value = '';
        document.querySelector('#taskDesc').value = '';
        document.querySelector('#taskAssigned').selectedIndex = 0;
        document.querySelector('#taskPriority').selectedIndex = 0;
        document.querySelector('#taskStatus').selectedIndex = 0;
        document.querySelector('#taskDueDate').value = '';
        document.getElementById('titleError').style.display = 'none';
        document.getElementById('descriptionError').style.display = 'none';
        document.querySelector('#taskTitle').classList.remove('is-danger');
        document.querySelector('#taskDesc').classList.remove('is-danger');
        document.querySelector('#saveButton button').disabled = true;
    }
}

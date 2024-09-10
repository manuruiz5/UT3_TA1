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
                                    <input class="input" type="date" id="taskEndDate">
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
    
    openModal(task = null) {
        if (task) {
            // Si se pasa una tarea, se está editando
            this.loadTask(task.id);
        } else {
            // Si no hay tarea, se está creando
            document.querySelector('.modal-card-title').textContent = 'Creación de tarea';
            document.querySelector('#saveButton button').textContent = 'Crear tarea';
            document.querySelector('#saveButton button').removeAttribute('data-task-id'); // Elimina cualquier ID previo
            this.cancelTask();
            document.querySelector('#modal-container .modal').classList.add('is-active');
        }
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

    async loadTask(taskId) {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
            if (!response.ok) {
                throw new Error('Error al cargar la tarea');
            }
    
            const task = await response.json();
    
            document.querySelector('#taskTitle').value = task.title;
            document.querySelector('#taskDesc').value = task.description;
            document.querySelector('#taskAssigned').value = task.assignedTo;
            document.querySelector('#taskPriority').value = task.priority;
            document.querySelector('#taskStatus').value = task.status;
            document.querySelector('#taskEndDate').value = task.endDate;
            document.querySelector('.modal-card-title').textContent = 'Editar tarea';
            document.querySelector('#saveButton button').textContent = 'Guardar cambios';
            document.querySelector('#saveButton button').disabled = false;
            document.querySelector('#saveButton button').setAttribute('data-task-id', task.id);
    
            document.querySelector('#modal-container .modal').classList.add('is-active');
        } catch (error) {
            console.error('Error al cargar la tarea:', error);
        }
    }
    
    

    async saveTask() {
        if (!this.validateTask()) return;
    
        const title = document.querySelector('#taskTitle').value;
        const description = document.querySelector('#taskDesc').value;
        const assigned = document.querySelector('#taskAssigned').value;
        const priority = document.querySelector('#taskPriority').value;
        const status = document.querySelector('#taskStatus').value;
        let endDate = document.querySelector('#taskEndDate').value;

        const startDate = new Date().toISOString().slice(0, 10);
    
         if (!endDate) {
            const today = new Date();
            today.setDate(today.getDate() + 7);
            endDate = today.toISOString().slice(0, 10);
        }
    
        const taskId = document.querySelector('#saveButton button').getAttribute('data-task-id');
        const task = {
            title,
            description,
            assignedTo: assigned,
            priority,
            status,
            startDate,  
            endDate
        };
    
        if (taskId) {
            // Si hay un ID de tarea, actualiza la tarea existente
            await updateTask(taskId, task);
        } else {
            // Si no hay ID, crea una nueva tarea
            await addTask(task);
        }
    
        // Limpia los campos después de guardar la tarea
        this.cancelTask();
    }
    
    cancelTask() {
        document.querySelector('#taskTitle').value = '';
        document.querySelector('#taskDesc').value = '';
        document.querySelector('#taskAssigned').selectedIndex = 0;
        document.querySelector('#taskPriority').selectedIndex = 0;
        document.querySelector('#taskStatus').selectedIndex = 0;
        document.querySelector('#taskEndDate').value = '';
        document.getElementById('titleError').style.display = 'none';
        document.getElementById('descriptionError').style.display = 'none';
        document.querySelector('#taskTitle').classList.remove('is-danger');
        document.querySelector('#taskDesc').classList.remove('is-danger');
        document.querySelector('#saveButton button').disabled = true;
    }
}

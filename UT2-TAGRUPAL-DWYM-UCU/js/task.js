/**
 * Clase que representa una tarea.
 * @param {string} title - Título de la tarea.
 * @param {string} description - Descripción de la tarea.
 * @param {string} assignedTo - Nombre de la persona asignada a la tarea.
 * @param {string} priority - Prioridad de la tarea.
 * @param {string} status - Estado de la tarea.
 * @param {string} createdAt - Fecha de creación de la tarea.
 * @param {string} endDate - Fecha límite de la tarea.
 * @param {string} id - Id unica de la tarea
 */class Task {
    constructor(title, description, assignedTo, priority, status, createdAt, endDate, id) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt;
        this.endDate = endDate; 
        this.id = id;
    }
    toHTML() {
        return `
            <div id="${this.id}"  class="card task" draggable="true" ondragstart="onDragStart(event)" onclick="taskModal.loadTask('${this.id}')">
               <div class="card-content">
                   <div class="content">
                       <div class="mb-5 is-flex is-align-items-center">
                       <div class="ml-0">
                           <p class="title is-5 has-text-weight-semibold">${this.title}</p>
                       </div>
                       <button class="delete-task-button button is-danger is-light is-small delete-task-top-right" onclick="event.stopPropagation(); deleteTask('${this.id}');">
                           Eliminar
                       </button>
                       </div>
                       <div>
                       <div class="content mb-2 is-flex is-justify-content-space-between is-align-items-center">
                           <h5 class="mb-0 has-text-weight-normal" style="font-size: 13px;">Fecha de inicio</h5>
                           <span class="tag is-light">${this.createdAt}</span>
                       </div>
                       <div class="content mb-2 is-flex is-justify-content-space-between is-align-items-center">
                           <h4 class="mb-0 has-text-weight-normal" style="font-size: 13px;">Prioridad</h4>
                           <span class="tag ${this.calculateColorbyPriority(this.priority)} is-light">${this.priority.toUpperCase()}</span>
                       </div>
                       <div class="content mb-2 is-flex is-justify-content-space-between is-align-items-center">
                           <h4 class="mb-0 has-text-weight-normal" style="font-size: 13px;">Fecha de fin</h4>
                           <span class="tag ${this.calculateColorbyDueDate(this.createdAt, this.endDate)} is-light">${this.endDate}</span>
                       </div>
                       <div class="content mb-5 is-flex is-justify-content-space-between is-align-items-center">
                           <h4 class="mb-0 has-text-weight-normal" style="font-size: 13px;">Asignado</h4>
                           <span class="tag is-light">${this.assignedTo}</span>
                       </div>
                       <div class="mb-3 pt-1 is-relative has-background-primary-light">
                           <div class="has-background-warning" style="position: absolute; top: 0; left: 0; width: ${this.calculateProgress(this.createdAt, this.endDate)}%; height: 100%"></div>
                       </div>
                       <div class="is-flex is-align-items-center">
                           <span class="tag is-link is-light mr-2" style="font-size: 12px;" data-config-id="label2">${this.status}</span>
                           <span class="has-text-weight-semibold has-text-grey-light" style="font-size: 12px;">${this.textState(this.status)}</span>
                       </div>
                       </div>
                   </div>
               </div>
           </div>
       `;
    }

  

  
    /**
     * Calculo el color de la etiqueta de prioridad.
     * @param {*} priority - Prioridad de la tarea.
     */
    calculateColorbyPriority(priority) {
        switch (priority) {
            case 'Alta':
                return 'is-danger';
            case 'Media':
                return 'is-warning';
            case 'Baja':
                return 'is-success';
            default:
                return 'is-light';
        }
    }

    /**
     * Calculo el texto que se mostrará a la derecha de la etiqueta de estado.
     * @param {*} status - Estado de la tarea.
     * @returns 
     */
    textState(status) {
        switch (status) {
            case 'backlog':
                return 'La tarea está en el Backlog';
            case 'toDo' :
                return 'La tarea está en Proceso';
            case 'inProgress':
                return 'La tarea está en Progreso';
            case 'blocked':
                return 'La tarea está Bloqueada';
            case 'done':
                return 'La tarea está Completada';
            default:
                return 'No se ha definido el estado de la tarea';
        }
    }

    /**
     * Calculo el color de la etiqueta de acuerdo a la fecha de vencimiento.
     * Si falta mas de 1 semana para la fecha límite, el color será verde.
     * Si falta menos de 1 semana para la fecha límite, el color será amarillo.
     * Si falta menos de 2 días para la fecha límite, el color será rojo.
     * @param {*} created - Fecha de creación de la tarea.
     * @param {*} due - Fecha límite de la tarea.
     * @returns 
     */
    calculateColorbyDueDate(created, due) {
        const createdDate = new Date(created);
        const dueDate = new Date(due);
        const currentDate = new Date();

        if (currentDate > dueDate) {
            return 'is-danger';
        }

        const diffTime = dueDate - currentDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return 'is-success';
        } else if (diffDays > 2) {
            return 'is-warning';
        } else {
            return 'is-danger';
        }
    }

    /**
     * Calculo el width sobre 100% para la barra de progreso
     * @param {*} created - Fecha de creación de la tarea.
     * @param {*} due - Fecha límite de la tarea.
     */
    calculateProgress(created, due) {
        if (this.status === 'backlog' || this.status === 'toDo') {
            return 0;
        } else if (this.status === 'inProgress') {
            return 50;
        } else if (this.status === 'blocked') {
            return 75;
        } else if (this.status === 'done') {
            return 100;
        }
    }

}
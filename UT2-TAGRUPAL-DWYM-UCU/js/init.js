let taskModal;
let tasks = [];
const statusToColumnKey = {
    "To Do": "toDo",
    "In Progress": "inProgress",
    "Backlog": "backlog",
    "Blocked": "blocked",
    "Done": "done",
    "toDo": "toDo",
    "inProgress": "inProgress",
    "blocked": "blocked",
    "done": "done",
    "backlog": "backlog"
};
async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length === 0) {
            console.log('No tasks found');
            return; 
        }
        tasks = data;
        console.log(tasks);
        renderTasks(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
    }
}

function renderTasks(tasks) {
    const columns = {
        backlog: document.getElementById('backlog')?.querySelector('.taskBody'),
        toDo: document.getElementById('toDo')?.querySelector('.taskBody'),
        inProgress: document.getElementById('inProgress')?.querySelector('.taskBody'),
        blocked: document.getElementById('blocked')?.querySelector('.taskBody'),
        done: document.getElementById('done')?.querySelector('.taskBody'),
    };
    Object.values(columns).forEach(column => column.innerHTML = '');
    
    tasks.forEach(task => {
        const normalizedStatus = statusToColumnKey[task.status];

        if (columns[normalizedStatus]) {
            const taskElement = createTaskElement(task);
            columns[normalizedStatus].appendChild(taskElement);
        } else {
            console.error(`Columna no encontrada para el estado: ${task.status}`);
        }
    });
}

function createTaskElement(task) {
    const taskObj = new Task(
        task.title,
        task.description,
        task.assignedTo,
        task.priority,
        task.status,
        task.startDate || task.createdAt,
        task.endDate,
        task.id
    );
    const taskHTML = taskObj.toHTML();
    const template = document.createElement('template');
    template.innerHTML = taskHTML.trim();  
    const taskElement = template.content.firstChild;

    if (taskElement) {
        taskElement.id = task.id;
    } else {
        console.error('Error al crear el elemento de tarea');
    }

    return taskElement;
}

async function addTask(task) {
    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTask = await response.json();
        const taskElement = createTaskElement(newTask);
        const column = document.getElementById(statusToColumnKey[newTask.status]);
        if (column) {
            column.querySelector('.taskBody').appendChild(taskElement);
        }
    } catch (error) {
        console.error("Failed to add task:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    const personas = ["Persona 1", "Persona 2", "Persona 3", "Persona 4", "Persona 5"];
    const prioridades = ["Alta", "Media", "Baja"];
    const estados = ["backlog", "toDo", "inProgress", "blocked", "done"];

    taskModal = new CreateTask(personas, prioridades, estados);

    document.getElementById('modal-container').innerHTML = taskModal.toHTML();

    document.getElementById("newTask").addEventListener('click', () => {
        taskModal.openModal();
    });
    document.getElementById("newTaskMini").addEventListener('click', () => {
        taskModal.openModal();
    });

    document.getElementById("saveButton").addEventListener('click', () => {
        taskModal.saveTask();
        document.querySelector('#modal-container .modal').classList.remove('is-active');
    });
    document.getElementById("cancelButton").addEventListener('click', () => {
        taskModal.cancelTask();
        document.querySelector('#modal-container .modal').classList.remove('is-active');
    });

    document.querySelector('#taskTitle').addEventListener('input', () => taskModal.validateTask());
    document.querySelector('#taskDesc').addEventListener('input', () => taskModal.validateTask());
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-task-button')) {
        const taskId = event.target.getAttribute('data-id');
        deleteTask(taskId);
    }
});

async function deleteTask(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        document.getElementById(taskId)?.remove();
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
}

async function updateTask(taskId, updatedTask) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }

        const task = await response.json();
        updateTaskInUI(task);  
    } catch (error) {
        console.error('Error de red al actualizar la tarea:', error);
    }
}




function updateTaskInUI(task) {
    const taskElement = document.getElementById(task.id);
    if (taskElement) {
        const titleElement = taskElement.querySelector('.taskTitle');
        const descriptionElement = taskElement.querySelector('.taskDescription');
        const statusElement = taskElement.querySelector('.taskStatus');
        const priorityElement = taskElement.querySelector('.taskPriority');
        const assignedElement = taskElement.querySelector('.taskAssigned');
        const endDateElement = taskElement.querySelector('.taskEndDate');

        if (titleElement) titleElement.textContent = task.title;
        if (descriptionElement) descriptionElement.textContent = task.description;
        if (statusElement) statusElement.textContent = task.status;
        if (priorityElement) priorityElement.textContent = task.priority;
        if (assignedElement) assignedElement.textContent = task.assignedTo;
        if (endDateElement) endDateElement.textContent = task.endDate;
    } else {
        console.error("Elemento de tarea no encontrado: ", task.id);
    }
}




let taskModal;
let tasks = [];

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        tasks = await response.json();
        console.log(tasks);
        renderTasks(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
    }
}
function renderTasks(tasks) {
    // Recorremos las columnas y vaciamos su contenido para agregar las tareas obtenidas
    const columns = {
        backlog: document.getElementById('backlog').querySelector('.taskBody'),
        toDo: document.getElementById('toDo').querySelector('.taskBody'),
        inProgress: document.getElementById('inProgress').querySelector('.taskBody'),
        blocked: document.getElementById('blocked').querySelector('.taskBody'),
        done: document.getElementById('done').querySelector('.taskBody'),
    };

    Object.values(columns).forEach(column => column.innerHTML = ''); // Vaciar columnas

    // Mapeo de estados a las columnas correctas
    const statusToColumnKey = {
        "To Do": "toDo",
        "In Progress": "inProgress",
        "Backlog": "backlog",
        "Blocked": "blocked",
        "Done": "done"
    };

    // Agregar las tareas a sus respectivas columnas
    tasks.forEach(task => {
        const columnKey = statusToColumnKey[task.status];
        if (columns[columnKey]) {
            const taskElement = createTaskElement(task);  // Definir el taskElement
            columns[columnKey].appendChild(taskElement);
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
        task.startDate, 
        task.endDate, 
        task.id,
    );
    const taskHTML = taskObj.toHTML();
    const template = document.createElement('template');
    template.innerHTML = taskHTML.trim();  // Convertir la cadena en elementos DOM
    return template.content.firstChild;
}
async function addTask(task) {
    const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    const newTask = await response.json();
    return newTask;
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
    await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
    });
}

async function updateTask(taskId, updatedTask) {
    const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
    });
    return await response.json();
}

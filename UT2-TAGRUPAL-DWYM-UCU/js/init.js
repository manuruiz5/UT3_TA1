let taskModal;
let tasks = [];

async function fetchTasks() {
    try {
        const response = await fetch('http://localhost:3000/api/tasks');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.length === 0) {
            console.log('No tasks found');
            return; // Salir si no hay tareas
        }
        
        tasks = data;
        console.log(tasks);
        renderTasks(tasks);
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
    }
}

function renderTasks(tasks) {
    // Recorremos las columnas y vaciamos su contenido para agregar las tareas obtenidas
    const columns = {
        backlog: document.getElementById('backlog')?.querySelector('.taskBody'),
        toDo: document.getElementById('toDo')?.querySelector('.taskBody'),
        inProgress: document.getElementById('inProgress')?.querySelector('.taskBody'),
        blocked: document.getElementById('blocked')?.querySelector('.taskBody'),
        done: document.getElementById('done')?.querySelector('.taskBody'),
    };

    Object.values(columns).forEach(column => column.innerHTML = ''); // Vaciar columnas

    // Mapeo de estados a las columnas correctas
    const statusToColumnKey = {
        "To do": "toDo",
        "In progress": "inProgress",
        "Backlog": "backlog",
        "Blocked": "blocked",
        "Done": "done"
    };

    // Agregamos las tareas a sus respectivas columnas
    tasks.forEach(task => {
        const normalizedStatus = task.status.charAt(0).toUpperCase() + task.status.slice(1).toLowerCase();
        const columnKey = statusToColumnKey[normalizedStatus];
       if (columns[columnKey]) {
            const taskElement = createTaskElement(task);
            columns[columnKey].appendChild(taskElement);
        } else {
            console.error("Columna no encontrada para el estado:{task.status}");
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
    template.innerHTML = taskHTML.trim();  // Convertir la cadena en elementos DOM
    return template.content.firstChild;
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
            throw new Error("HTTP error! status: ${response.status}");
        }
        
        const newTask = await response.json();
        return newTask;
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
        const response = await fetch("http://localhost:3000/api/tasks/${taskId}", {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error("HTTP error! status: ${response.status}");
        }
        
        // Eliminar el elemento de la interfaz de usuario también podría ser una buena idea
        document.getElementById(taskId)?.remove();
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
}

async function updateTask(taskId, updatedTask) {


    try {
        const response = await fetch("http://localhost:3000/api/tasks/${taskId}", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedTask),
        });

        if (!response.ok) {
            throw new Error("HTTP error! status: ${response.status}");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Failed to update task:", error);
    }
}

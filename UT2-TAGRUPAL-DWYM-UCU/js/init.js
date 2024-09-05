let taskModal;
let tasks = [];

document.addEventListener('DOMContentLoaded', () => {

    initilizeTasks();

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


function initilizeTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

    let backLog = document.getElementById('backlog');
    let toDo = document.getElementById('toDo');
    let inProgress = document.getElementById('inProgress');
    let blocked = document.getElementById('blocked');
    let done = document.getElementById('done');

    tasks.forEach(task => {
        const taskObj = new Task(task.title, task.description, task.assignedTo, task.priority, task.status, task.createdAt, task.dueDate, task.id);
        switch (taskObj.status) {
            case 'backlog':
                backLog.innerHTML += taskObj.toHTML();
                break;
            case 'toDo':
                toDo.innerHTML += taskObj.toHTML();
                break;
            case 'inProgress':
                inProgress.innerHTML += taskObj.toHTML();
                break;
            case 'blocked':
                blocked.innerHTML += taskObj.toHTML();
                break;
            case 'done':
                done.innerHTML += taskObj.toHTML();
                break;
            default:
                break;
        }
    }
    );
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-task-button')) {
        const taskId = event.target.getAttribute('data-id');
        deleteTask(taskId);
    }
});
function deleteTask(taskId) {
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        taskElement.remove();
    }
     // Obtener las tareas actuales del almacenamiento local
     let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

     // Filtrar la tarea que se va a eliminar
     tasks = tasks.filter(task => task.id !== taskId);
 
     // Guardar las tareas actualizadas en el almacenamiento local
     localStorage.setItem('tasks', JSON.stringify(tasks));
   }

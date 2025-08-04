// Espera a que todo el contenido de la página se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos los elementos del HTML que vamos a necesitar
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Cargar las tareas desde localStorage cuando la página se inicia
    loadTasks();

    // Añadir un "oyente" para el evento de envío del formulario (cuando se añade una tarea)
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        const taskText = taskInput.value.trim(); // Obtiene el texto y quita espacios en blanco

        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = ''; // Limpia el campo de entrada
            taskInput.focus(); // Devuelve el foco al campo de entrada
        }
    });

    // Añadir un "oyente" a la lista de tareas para manejar clics en las tareas o en el botón de eliminar
    taskList.addEventListener('click', (e) => {
        // Si se hizo clic en el botón de eliminar (que tiene la clase 'delete-btn')
        if (e.target.classList.contains('delete-btn')) {
            const taskItem = e.target.closest('li'); // Encuentra el elemento <li> padre
            deleteTask(taskItem);
        } 
        // Si se hizo clic en el elemento de la tarea (<li>)
        else if (e.target.tagName === 'LI' || e.target.classList.contains('task-text')) {
            const taskItem = e.target.closest('li');
            toggleComplete(taskItem);
        }
    });

    function addTask(text, isCompleted = false) {
        // Crear un nuevo elemento de lista (<li>)
        const taskItem = document.createElement('li');
        if (isCompleted) {
            taskItem.classList.add('completed');
        }

        // Estructura interna de la tarea
        taskItem.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="delete-btn">×</button>
        `;

        // Añadir la nueva tarea a la lista <ul>
        taskList.appendChild(taskItem);
        saveTasks(); // Guardar el estado actual de las tareas
    }

    function deleteTask(taskItem) {
        taskItem.remove(); // Elimina el elemento de la página
        saveTasks(); // Actualiza el almacenamiento
    }

    function toggleComplete(taskItem) {
        taskItem.classList.toggle('completed'); // Añade o quita la clase 'completed'
        saveTasks(); // Actualiza el almacenamiento
    }

    function saveTasks() {
        const tasks = [];
        // Recorre todos los elementos <li> de la lista
        document.querySelectorAll('#task-list li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('.task-text').innerText,
                completed: taskItem.classList.contains('completed')
            });
        });
        // Convierte el array de tareas a un string JSON y lo guarda en localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        // Obtiene las tareas de localStorage. Si no hay, usa un array vacío.
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        // Por cada tarea guardada, la vuelve a crear en la página
        tasks.forEach(task => {
            addTask(task.text, task.completed);
        });
    }
});

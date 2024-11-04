const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

// fetch tasks on page load
document.addEventListener('DOMContentLoaded', fetchTasks);

// event listener to add a new task
addTaskBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  const newTask = { title, due_date: dueDate, priority, completed: false };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });

  if (response.ok) {
    fetchTasks();
    clearForm();
  }
});

// fetch tasks from the server and display them
async function fetchTasks()
{
    const response = await fetch('/tasks');
    const tasks = await response.json();

    taskList.innerHTML = '';

    tasks.forEach((task) => 
    {
        const listItem = document.createElement('li');
        listItem.className = task.completed ? 'completed' : '';

        listItem.innerHTML = 
        `
        ${task.title} | (${task.priority}) | Due Date: ${task.due_date}
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        <button onclick="markAsIncomplete(${task.id})">Mark as Incomplete</button>
        <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
        `;

        taskList.appendChild(listItem);
    });
}

// function to delete a task
async function deleteTask(id) 
{
    const response = await fetch(`/tasks/${id}`, 
    {
        method: 'DELETE'
    });

    if (response.ok) 
    {
        fetchTasks();
    }
}

// function to mark a task as complete
async function markAsComplete(id) 
{
    const response = await fetch(`/tasks/${id}`, 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
    });

    if (response.ok)
    {
        fetchTasks();
    }
}

// function to mark a task as incomplete
async function markAsIncomplete(id) 
{
    const response = await fetch(`/tasks/${id}`, 
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: false })
    });

    if (response.ok) 
    {
        fetchTasks();
    }
}

// function to clear the form fields after adding a task
function clearForm() 
{
    document.getElementById('title').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'Low';
}
// CONSTANT FOR THE SERVER URL
// currently set to local host, which requires the user to CMD 'node server.js' while in the folder with all the code.
const SERVERURL = 'http://localhost:3000/tasks'

const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');

// Fetch existing tasks on page load
document.addEventListener('DOMContentLoaded', fetchTasks);

// Add new task
addTaskBtn.addEventListener('click', async () => {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;
  const dueDate = document.getElementById('task-due-date').value;
  const priority = document.getElementById('task-priority').value;

  const newTask = {
    title,
    description,
    due_date: dueDate,
    priority,
    completed: false
  };

  const response = await fetch(SERVERURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });

  if (response.ok) {
    fetchTasks();
    clearForm();
  }
});

// Fetch all tasks
async function fetchTasks() {
  const response = await fetch(SERVERURL);
  const tasks = await response.json();

  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
      ${task.title} (${task.priority})
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      <button onclick="markAsIncomplete(${task.id})">Mark as Incomplete</button>
      <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;

    taskList.appendChild(li);
  });
}

// Delete a task
async function deleteTask(id) {
  const response = await fetch(SERVERURL+`/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Mark task as completed
async function markAsComplete(id) {
  const response = await fetch(SERVERURL+`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });

  if (response.ok) {
    fetchTasks();
  }
}

async function markAsIncomplete(id) {
  const response = await fetch(SERVERURL+`/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: false })
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Clear form fields after adding a task
function clearForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-desc').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-priority').value = 'Low';
}

const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

// Fetch tasks from the server when the page loads
document.addEventListener('DOMContentLoaded', fetchTasks);

// Add a new task
addTaskBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  const newTask = {
    title,
    due_date: dueDate,
    priority,
    completed: false
  };

  const response = await fetch('/tasks', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newTask)
  });

  if (response.ok) {
    fetchTasks();
    clearForm();
  }
});

// Fetch tasks from the server and display them
async function fetchTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();

  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const line = document.createElement('li');
    line.className = task.completed ? 'completed' : '';

    line.innerHTML = `
      ${task.title} | (${task.priority}) | Due Date: ${task.due_date}
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      <button onclick="markAsIncomplete(${task.id})">Mark as Incomplete</button>
      <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;

    taskList.appendChild(line);
  });
}

// Delete a task
async function deleteTask(id) {
  const response = await fetch(`/tasks/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Mark a task as complete
async function markAsComplete(id) {
  const response = await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ completed: true })
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Mark a task as incomplete
async function markAsIncomplete(id) {
  const response = await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ completed: false })
  });

  if (response.ok) {
    fetchTasks();
  }
}

// Clear the form fields after adding a task
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('dueDate').value = '';
  document.getElementById('priority').value = 'Low';
}
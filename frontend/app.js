const SERVERURL = 'http://localhost:3001/tasks';
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

document.addEventListener('DOMContentLoaded', fetchTasks);

addTaskBtn.addEventListener('click', async () =>
{
  const title = document.getElementById('title').value;
  const dueDate = document.getElementById('dueDate').value;
  const priority = document.getElementById('priority').value;

  const newTask = { title, due_date: dueDate, priority, completed: false };

  const response = await fetch(SERVERURL,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });

  if (response.ok)
  {
    fetchTasks();
    clearForm();
  }
});

async function fetchTasks()
{
  const response = await fetch(SERVERURL);
  const tasks = await response.json();

  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const line = document.createElement('li');
    line.className = task.completed ? 'completed' : '';

    line.innerHTML = `
      ${task.title} | (${task.priority}) | Due Date: ${task.due_date}
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      &nbsp
      <button onclick="markAsIncomplete(${task.id})">Mark as Incomplete</button>
      &nbsp
      <button onclick="markAsComplete(${task.id})">Mark as Complete</button>
    `;

    taskList.appendChild(line);
  });
}

async function deleteTask(id)
{
  const response = await fetch(`${SERVERURL}/${id}`, { method: 'DELETE' });
  if (response.ok)
  {
    fetchTasks();
  }
}

async function markAsComplete(id)
{
  const response = await fetch(`${SERVERURL}/${id}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  });
  if (response.ok) 
  {
    fetchTasks();
  }
}

async function markAsIncomplete(id)
{
  const response = await fetch(`${SERVERURL}/${id}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: false }),
  });
  if (response.ok)
  {
    fetchTasks();
  }
}

function clearForm()
{
  document.getElementById('title').value = '';
  document.getElementById('dueDate').value = '';
  document.getElementById('priority').value = 'Low';
}
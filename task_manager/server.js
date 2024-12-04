const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./tasks.db', (error) => 
{
  if (error) 
  {
    console.error('Could not connect to database', error);
  } 
  else 
  {
    console.log('Connected to SQLite database');
  }
});

// Create tasks table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS tasks 
  (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, due_date TEXT, priority TEXT, completed BOOLEAN DEFAULT 0)
`);

// Get all tasks
app.get('/tasks', (req, res) => 
{
  db.all('SELECT * FROM tasks', [], (error, rows) => 
  {
    if (error) 
	{
      res.status(400).json({ error: error.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new task
app.post('/tasks', (req, res) => 
{
  const { title, due_date, priority } = req.body;
  const query = `INSERT INTO tasks (title, due_date, priority, completed) VALUES (?, ?, ?, 0)`;
  db.run(query, [title, due_date, priority], function (error) 
  {
    if (error) 
	{
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update task completion
app.put('/tasks/:id', (req, res) => 
{
  const id = req.params.id;
  const { completed } = req.body;
  const query = `UPDATE tasks SET completed = ? WHERE id = ?`;
  db.run(query, [completed, id], function (error) 
  {
    if (error) 
	{
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ updatedID: id });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => 
{
  const id = req.params.id;
  const query = `DELETE FROM tasks WHERE id = ?`;
  db.run(query, id, function (error) 
  {
    if (error) 
	{
      res.status(400).json({ error: error.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Start server
app.listen(PORT, () => 
{
  console.log(`API Server is running on port ${PORT}`);
});
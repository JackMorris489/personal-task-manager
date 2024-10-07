const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create tasks table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT,
  completed BOOLEAN DEFAULT 0
)`);

// Get all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title, description, due_date, priority } = req.body;
  const query = `INSERT INTO tasks (title, description, due_date, priority, completed) VALUES (?, ?, ?, ?, 0)`;
  db.run(query, [title, description, due_date, priority], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a task (mark as complete)
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { completed } = req.body;
  const query = `UPDATE tasks SET completed = ? WHERE id = ?`;

  db.run(query, [completed, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ updatedID: id });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM tasks WHERE id = ?`;

  db.run(query, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

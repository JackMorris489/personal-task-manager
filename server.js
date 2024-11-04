const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.json());

// serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// database setup
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

// create tasks table if it doesn't exist
db.run(
`
    CREATE TABLE IF NOT EXISTS tasks 
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT,
    priority TEXT,
    completed BOOLEAN DEFAULT 0)
`
);

// get all tasks
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

// add a new task to the database
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

// update the info on a task (complte/incomplete)
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

// delete a task from the database
app.delete('/tasks/:id', (req, res) => 
{
    const id = req.params.id;
    const query = `DELETE FROM tasks WHERE id = ?`;

    db.run(query, id, function (error) {
    if (error) 
    {
        res.status(400).json({ error: error.message });
        return;
    }
    res.json({ deletedID: id });
    });
});

// serve the HTML file for the frontend
app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
app.listen(PORT, () => 
{
    console.log(`Server is running on port ${PORT}`);
});
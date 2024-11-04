// TaskModel.js
const sqlite3 = require('sqlite3').verbose();

// connect to the database
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

// create the task model functions
const TaskModel = 
{
    // get all the tasks
    getAllTasks: (callback) => 
    {
        db.all('SELECT * FROM tasks', [], callback);
    },

    // add a task
    addTask: ({ title, due_date, priority }, callback) => 
    {
        const query = `INSERT INTO tasks (title, due_date, priority, completed) VALUES (?, ?, ?, 0)`;
        db.run(query, [title, due_date, priority], function (error) 
        {
            callback(error, { id: this.lastID });
        });
    },

    // update the task status (complete/incomplete)
    updateTaskStatus: (id, completed, callback) =>
    {
        const query = `UPDATE tasks SET completed = ? WHERE id = ?`;
        db.run(query, [completed, id], callback);
    },

    // delete a task
    deleteTask: (id, callback) => 
    {
        const query = `DELETE FROM tasks WHERE id = ?`;
        db.run(query, id, callback);
    },
};

module.exports = TaskModel;
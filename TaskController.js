// TaskController.js
const TaskModel = require('./TaskModel');

// create the task controller
const TaskController = 
{
    // get the tasks from the database
    getTasks: (req, res) => 
    {
        TaskModel.getAllTasks((error, rows) => 
        {
            if (error) 
            {
                res.status(400).json({ error: error.message });
            } 
            else 
            {
                res.json(rows);
            }
        });
    },

    // create a new task
    createTask: (req, res) => 
    {
        const { title, due_date, priority } = req.body;
        TaskModel.addTask({ title, due_date, priority }, (error, result) => 
        {
            if (error) 
            {
                res.status(400).json({ error: error.message });
            } 
            else 
            {
                res.json(result);
            }
        });
    },

    // update the task's status (complete/incomplete)
    updateTask: (req, res) => 
    {
        const { id } = req.params;
        const { completed } = req.body;
        TaskModel.updateTaskStatus(id, completed, (error) => 
        {
            if (error) 
            {
                res.status(400).json({ error: error.message });
            } 
            else 
            {
                res.json({ updatedID: id });
            }
        });
    },

    // delete a task
    deleteTask: (req, res) => 
    {
        const { id } = req.params;
        TaskModel.deleteTask(id, (error) => 
        {
            if (error) 
            {
                res.status(400).json({ error: error.message });
            } 
            else 
            {
                res.json({ deletedID: id });
            }
        });
    },
};
module.exports = TaskController;
// app.js
const express = require('express');
const bodyParser = require('body-parser');
const TaskController = require('./TaskController');
const path = require('path');

const app = express();
const PORT = 3000;

// middleware
app.use(bodyParser.json());

// serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

// routes
app.get('/tasks', TaskController.getTasks);
app.post('/tasks', TaskController.createTask);
app.put('/tasks/:id', TaskController.updateTask);
app.delete('/tasks/:id', TaskController.deleteTask);

// start server
app.listen(PORT, () => 
{
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3003; // API Gateway port

// routes for the task management API
app.use('/tasks', async (req, res) => 
{
  try {
    const response = await axios({
      method: req.method,
      url: `http://api-service:3001${req.url}`,  // Forward to API Service
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } 
  catch (error) 
  {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});
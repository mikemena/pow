require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for GET request
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Example of a GET endpoint
app.get('/api/equipment', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM equipment_catalog');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example of a POST endpoint
app.post('/api/equipment', async (req, res) => {
  try {
    const { name, muscle_group } = req.body;
    const { rows } = await db.query(
      'INSERT INTO equipment_catalog (name, muscle_group) VALUES ($1, $2) RETURNING *',
      [name, muscle_group]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Example of a PUT endpoint
app.put('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, muscle_group } = req.body;
    const { rows } = await db.query(
      'UPDATE equipment SET name = $1, muscle_group = $2 WHERE id = $3 RETURNING *',
      [name, muscle_group, id]
    );
    if (rows.length === 0) {
      return res.status(404).send('Equipment not found.');
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

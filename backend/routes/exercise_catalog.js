const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint to get all exercises in the catalog

router.get('/exercise-catalog', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM exercise_catalog');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to get a specific exercise from the catalog by ID

router.get('/exercise-catalog/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Query to fetch the exercise with the specified ID

    const { rows } = await db.query(
      'SELECT * FROM exercise_catalog WHERE exercise_id = $1',
      [parseInt(id)]
    );

    if (rows.length === 0) {
      // If no exercise is found with the given ID, return a 404 Not Found response

      return res.status(404).json({ message: 'Exercise not found' });
    }

    // If a exercise is found, return it in the response
    res.json(rows[0]);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error fetching exercise:', error);
    res.status(500).json({ message: 'Error fetching exercise' });
  }
});

// Endpoint to create an exercise

router.post('/exercise-catalog', async (req, res) => {
  try {
    const { exercise } = req.body;
    const { muscle_id } = req.body;
    const { equipment_id } = req.body;
    const { image_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO exercise_catalog (exercise_name, muscle_group_id, equipment_id, exercise_image_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [exercise, muscle_id, equipment_id, image_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to update an exercise

router.put('/exercise-catalog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise_name, muscle_id, equipment_id, exercise_image_id } =
      req.body;

    // Construct the update part of the query based on provided fields

    const updateParts = [];
    const queryValues = [];
    let queryIndex = 1;

    if (exercise_name !== undefined) {
      updateParts.push(`exercise_name = $${queryIndex++}`);
      queryValues.push(exercise_name);
    }

    if (muscle_id !== undefined) {
      updateParts.push(`muscle_id = $${queryIndex++}`);
      queryValues.push(muscle_id);
    }

    if (equipment_id !== undefined) {
      updateParts.push(`equipment_id = $${queryIndex++}`);
      queryValues.push(equipment_id);
    }
    if (exercise_image_id !== undefined) {
      updateParts.push(`exercise_image_id = $${queryIndex++}`);
      queryValues.push(exercise_image_id);
    }

    queryValues.push(id); // For the WHERE condition

    if (updateParts.length === 0) {
      return res.status(400).send('No update fields provided.');
    }

    const queryString = `UPDATE exercise_catalog SET ${updateParts.join(
      ', '
    )} WHERE exercise_id = $${queryIndex} RETURNING *`;

    const { rows } = await db.query(queryString, queryValues);

    if (rows.length === 0) {
      return res.status(404).send('Exercise not found.');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

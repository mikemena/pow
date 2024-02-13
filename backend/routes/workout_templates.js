const express = require('express');
const router = express.Router();
const db = require('../config/db');
// const { authenticateToken } = require('../utils/authUtils');

// Endpoint to get all workouts
router.get('/workout-templates', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM user_workouts');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET a workout templates by user
router.get('/workout-templates/:user_id', async (req, res) => {
  const { user_id } = req.params; // Extract the user_id from the route parameters

  console.log('user_id', user_id);

  // Ensure the user_id from the params matches the authenticated user's ID
  // This is a basic security measure to prevent users from accessing other users' data

  try {
    // Query to fetch the workouts that belong to the authenticated user
    const { rows } = await db.query(
      'SELECT * FROM user_workouts WHERE user_id = $1',
      [parseInt(user_id)]
    );

    if (rows.length === 0) {
      // If no workout templates are found for the user, return a 404 Not Found response
      return res
        .status(404)
        .json({ message: 'You do not have workout templates' });
    }

    // If workout templates are found, return it in the response
    res.json(rows);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error fetching workout:', error);
    res.status(500).json({ message: 'Error fetching workout' });
  }
});

// Endpoint to create a workout
router.post('/workout-templates', async (req, res) => {
  try {
    const {
      user_id,
      workout_name,
      workout_day_type,
      plan_type,
      difficulty_level
    } = req.body;
    const { rows } = await db.query(
      'INSERT INTO user_workouts (user_id, workout_name, workout_day_type, plan_type, difficulty_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, workout_name, workout_day_type, plan_type, difficulty_level]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to modify a workout
router.put('/workout-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      workout_name,
      workout_day_type,
      plan_type,
      difficulty_level
    } = req.body;

    // Construct the update part of the query based on provided fields
    const updateParts = [];
    const queryValues = [];
    let queryIndex = 1;

    if (user_id !== undefined) {
      updateParts.push(`user_id = $${queryIndex++}`);
      queryValues.push(user_id);
    }

    if (workout_name !== undefined) {
      updateParts.push(`workout_name = $${queryIndex++}`);
      queryValues.push(workout_name);
    }

    if (workout_day_type !== undefined) {
      updateParts.push(`workout_day_type = $${queryIndex++}`);
      queryValues.push(workout_day_type);
    }

    if (plan_type !== undefined) {
      updateParts.push(`plan_type = $${queryIndex++}`);
      queryValues.push(plan_type);
    }

    if (difficulty_level !== undefined) {
      updateParts.push(`difficulty_level = $${queryIndex++}`);
      queryValues.push(difficulty_level);
    }

    queryValues.push(id); // For the WHERE condition
    console.log('updateParts', updateParts);
    console.log('length updateParts', updateParts.length);
    if (updateParts.length === 0) {
      return res.status(400).send('No update fields provided.');
    }

    const queryString = `UPDATE user_workouts SET ${updateParts.join(
      ', '
    )} WHERE workout_id = $${queryIndex} RETURNING *`;

    const { rows } = await db.query(queryString, queryValues);

    if (rows.length === 0) {
      return res.status(404).send('Workout not found.');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to delete a workout

router.delete('/workout-templates/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const { rowCount } = await db.query(
      'DELETE FROM user_workouts WHERE workout_id = $1',
      [id]
    );

    if (rowCount > 0) {
      res.status(200).json({ message: 'Workout deleted successfully' });
    } else {
      // If no workout was found and deleted, return a 404 Not Found response
      res.status(404).json({ message: 'Workout not found' });
    }
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Error deleting workout' });
  }
});

module.exports = router;

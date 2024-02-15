const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint to get all workouts for given user
router.get('/workout-templates/:user_id', async (req, res) => {
  const { user_id } = req.params; // Correctly extract user_id

  try {
    const workoutResult = await db.query(
      'SELECT * FROM user_workouts WHERE user_id = $1',
      [parseInt(user_id)]
    );

    if (workoutResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No workout templates found for the user' });
    }

    // Fetch all exercises for the user's workouts in one go
    const exercisesResult = await db.query(
      'SELECT workout_id, exercise_id FROM user_exercises WHERE workout_id = ANY($1)',
      [workoutResult.rows.map(workout => workout.id)]
    );

    // Map exercises back to their workouts
    for (let workout of workoutResult.rows) {
      workout.exercises = exercisesResult.rows
        .filter(exercise => exercise.workout_id === workout.id)
        .map(exercise => exercise.exercise_id);
    }

    res.json(workoutResult.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST endpoint to create a workout with selected exercises
router.post('/workout-templates', async (req, res) => {
  const {
    user_id,
    workout_name,
    workout_day_type,
    plan_type,
    difficulty_level,
    exercises
  } = req.body; // Include exercises in the request body

  const client = await db.connect(); // Get a client from the connection pool

  try {
    await client.query('BEGIN'); // Start a transaction

    // Insert the new workout into the user_workouts table
    const workoutResult = await client.query(
      'INSERT INTO user_workouts (user_id, workout_name, workout_day_type, plan_type, difficulty_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, workout_name, workout_day_type, plan_type, difficulty_level]
    );

    const workoutId = workoutResult.rows[0].id; // Get the id of the newly inserted workout

    // Insert each selected exercise for the workout into the user_exercises table
    for (const exerciseId of exercises) {
      await client.query(
        'INSERT INTO user_exercises (workout_id, exercise_id) VALUES ($1, $2)',
        [workoutId, exerciseId]
      );
    }

    await client.query('COMMIT'); // Commit the transaction
    res.status(201).json(workoutResult.rows[0]); // Send the created workout as the response
  } catch (err) {
    await client.query('ROLLBACK'); // Roll back the transaction in case of an error
    res.status(500).send(err.message);
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;

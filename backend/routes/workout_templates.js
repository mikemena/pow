const express = require('express');
const router = express.Router();
// const db = require('../config/db');
const { pool } = require('../config/db');

// Endpoint to get all workouts for given user
router.get('/workout-templates/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const workouts = await pool.query(
      'SELECT * FROM user_workouts WHERE user_id = $1',
      [parseInt(user_id)]
    );
    if (workouts.rows.length === 0)
      return [res.status(404).json({ message: 'No workout templates found' })];

    for (const workout of workouts.rows) {
      const exercises = await pool.query(
        'SELECT exercise_id FROM user_exercises WHERE workout_id = $1',
        [workout.id]
      );
      workout.exercises = exercises.rows.map(e => e.exercise_id);
    }

    res.json(workouts.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
  } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const workout = await client.query(
      'INSERT INTO user_workouts (user_id, workout_name, workout_day_type, plan_type, difficulty_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, workout_name, workout_day_type, plan_type, difficulty_level]
    );

    for (const exerciseId of exercises) {
      await client.query(
        'INSERT INTO user_exercises (workout_id, exercise_id) VALUES ($1, $2)',
        [workout.rows[0].id, exerciseId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(workout.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

// DELETE endpoint to remove a workout template
router.delete('/workout-templates/:template_id', async (req, res) => {
  const { template_id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Remove associated exercises
    await client.query('DELETE FROM user_exercises WHERE workout_id = $1', [
      template_id
    ]);

    // Remove the workout template
    await client.query('DELETE FROM user_workouts WHERE workout_id = $1', [
      template_id
    ]);

    await client.query('COMMIT');
    res.status(204).send('Workout template removed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

module.exports = router;

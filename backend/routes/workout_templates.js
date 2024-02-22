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
    //Log after retrieving workouts
    console.log('Workouts fetched:', workouts.rows);

    if (workouts.rows.length === 0)
      return res.status(404).json({ message: 'No workout templates found' });

    for (const workout of workouts.rows) {
      const exercises = await pool.query(
        'select ue.exercise_id, ue.catalog_exercise_id, ec.name as exercise_name,ue.workout_id from user_exercises ue LEFT JOIN exercise_catalog ec on ue.catalog_exercise_id = ec.exercise_id WHERE workout_id = $1',
        [workout.workout_id]
      );

      // Log after fetching exercises for a workout
      console.log(
        `Exercises for workout ${workout.workout_id}:`,
        exercises.rows
      );

      workout.exercises = exercises.rows.map(e => ({
        exercise_id: e.exercise_id,
        exercise_name: e.exercise_name,
        catalog_exercise_id: e.catalog_exercise_id
      }));
      // Log after modifying the workout object
      console.log(`Workout with exercises ${workout.workout_id}:`, workout);
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

    const workoutId = workout.rows[0].workout_id;

    for (const { exercise_id } of exercises) {
      await client.query(
        'INSERT INTO user_exercises (workout_id, catalog_exercise_id) VALUES ($1, $2)',
        [workoutId, exercise_id]
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

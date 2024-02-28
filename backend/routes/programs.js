const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Endpoint to get all programs for a given user with workouts, exercises, and sets

router.get('/programs/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const programs = await pool.query(
      'SELECT * FROM programs WHERE user_id = $1',
      [parseInt(user_id)]
    );

    if (programs.rows.length === 0) {
      return res.status(404).json({ message: 'No programs found' });
    }

    // Get workouts for each program
    for (const program of programs.rows) {
      const workouts = await pool.query(
        'SELECT * FROM workouts WHERE program_id = $1',
        [program.id]
      );

      program.workouts = workouts.rows;

      // Get exercises and sets for each workout
      for (const workout of program.workouts) {
        const exercises = await pool.query(
          'SELECT e.*, ec.name as exercise_name ' +
            'FROM exercises e ' +
            'JOIN exercise_catalog ec ON e.catalog_exercise_id = ec.id ' +
            'WHERE e.workout_id = $1',
          [workout.id]
        );

        workout.exercises = [];

        for (const exercise of exercises.rows) {
          const sets = await pool.query(
            'SELECT * FROM sets WHERE exercise_id = $1',
            [exercise.id]
          );

          // Construct the full exercise object with sets
          workout.exercises.push({
            exercise_id: exercise.id,
            order: exercise.order,
            catalog_exercise_id: exercise.catalog_exercise_id,
            sets: sets.rows // Add sets directly to the exercise object
          });
        }

        // Log after adding sets to the exercise object
        console.log(`Workout with exercises and sets ${workout.id}:`, workout);
      }
    }

    res.json(programs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to create a new program with workouts, exercises, and sets for a given user

router.post('/programs', async (req, res) => {
  const {
    user_id,
    name,
    program_duration,
    days_per_week,
    day_type,
    main_goal,
    workouts
  } = req.body;

  // Begin database transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert the new program
    const program = await client.query(
      'INSERT INTO programs (user_id, name, program_duration, days_per_week, day_type, main_goal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, name, program_duration, days_per_week, day_type, main_goal]
    );
    const program_id = program.rows[0].program_id;

    // add workouts for each program

    for (const workout of workouts) {
      const newWorkoutQuery =
        'INSERT INTO workouts (program_id, name, "order") VALUES ($1, $2, $3) RETURNING *';
      console.log('Executing query:', newWorkoutQuery, [
        program_id,
        workout.name,
        workout.order
      ]);
      const newWorkoutResult = await client.query(newWorkoutQuery, [
        program_id,
        workout.name,
        workout.order
      ]);
      const workout_id = newWorkoutResult.rows[0].workout_id;

      //add exercises for each workout

      for (const exercise of workout.exercises) {
        const newExerciseQuery =
          'INSERT INTO exercises (workout_id, catalog_exercise_id, "order") VALUES ($1, $2, $3) RETURNING *';
        console.log('Executing query:', newExerciseQuery, [
          workout_id,
          exercise.catalog_exercise_id,
          exercise.order
        ]);
        const newExerciseResult = await client.query(newExerciseQuery, [
          workout_id,
          exercise.catalog_exercise_id,
          exercise.order
        ]);
        const exercise_id = newExerciseResult.rows[0].exercise_id;

        // add sets for each exercise

        for (const set of exercise.sets) {
          const newSetQuery =
            'INSERT INTO sets (exercise_id, reps, weight, "order") VALUES ($1, $2, $3, $4)';
          await client.query(newSetQuery, [
            exercise_id,
            set.reps,
            set.weight,
            set.order
          ]);
        }
      }
    }

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Program with workouts, exercises, and sets created successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

// Endpoint to update a program with its workouts, exercises, and sets for a given user

router.put('/programs/:program_id', async (req, res) => {
  const { program_id } = req.params;
  const { workouts } = req.body; // assuming workouts is an array of workout objects

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Update the program if necessary
    // Assuming you have program details in req.body.program
    const programUpdateResult = await pool.query(
      'UPDATE programs SET ... WHERE id = $1',
      [program_id]
    );

    // Loop through each workout to update
    for (const workout of workouts) {
      const workoutUpdateResult = await pool.query(
        'UPDATE workouts SET ... WHERE id = $1 AND program_id = $2 RETURNING id',
        [workout.id, program_id] // Make sure to include the parameters for the workout update
      );

      // Update exercises for each workout
      for (const exercise of workout.exercises) {
        const exerciseUpdateResult = await pool.query(
          'UPDATE exercises SET ... WHERE id = $1 AND workout_id = $2 RETURNING id',
          [exercise.id, workout.id] // Include the parameters for the exercise update
        );

        // Update sets for each exercise
        for (const set of exercise.sets) {
          const setUpdateResult = await pool.query(
            'UPDATE sets SET ... WHERE id = $1 AND exercise_id = $2',
            [set.id, exercise.id] // Include the parameters for the set update
          );
        }
      }
    }

    // If everything is fine, commit the transaction
    await pool.query('COMMIT');

    res.json({ message: 'Program updated successfully' });
  } catch (err) {
    // If there is any error, rollback the transaction
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to delete a program and its associated workouts, exercises, and sets

router.delete('/programs/:program_id', async (req, res) => {
  const { program_id } = req.params;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Delete sets associated with the exercises in the workouts of the program
    await pool.query(
      'DELETE FROM sets WHERE exercise_id IN (SELECT id FROM exercises WHERE workout_id IN (SELECT id FROM workouts WHERE program_id = $1))',
      [program_id]
    );

    // Delete exercises associated with the workouts of the program
    await pool.query(
      'DELETE FROM exercises WHERE workout_id IN (SELECT id FROM workouts WHERE program_id = $1)',
      [program_id]
    );

    // Delete workouts associated with the program
    await pool.query('DELETE FROM workouts WHERE program_id = $1', [
      program_id
    ]);

    // Finally, delete the program itself
    await pool.query('DELETE FROM programs WHERE id = $1', [program_id]);

    // If everything is fine, commit the transaction
    await pool.query('COMMIT');

    res.json({
      message: 'Program and all associated data deleted successfully'
    });
  } catch (err) {
    // If there is an error, rollback the transaction
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

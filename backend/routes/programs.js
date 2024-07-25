const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Endpoint to get all programs for a given user with workouts, exercises, and sets
router.get('/users/:user_id/programs', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Fetch programs for the user
    const programsResult = await pool.query(
      'SELECT * FROM programs WHERE user_id = $1',
      [parseInt(user_id)]
    );

    if (programsResult.rows.length === 0) {
      return res.json([]);
    }

    const programs = programsResult.rows;

    // Get workouts for each program
    for (const program of programs) {
      const workoutsResult = await pool.query(
        'SELECT * FROM workouts WHERE program_id = $1',
        [program.id] // Use the correct column name for program ID
      );

      program.workouts = workoutsResult.rows;

      for (const workout of program.workouts) {
        const exercisesResult = await pool.query(
          'SELECT e.*, ec.name as exercise_name ' +
            'FROM exercises e ' +
            'JOIN exercise_catalog ec ON e.catalog_exercise_id = ec.id ' +
            'WHERE e.workout_id = $1',
          [workout.id] // Use the correct column name for workout ID
        );

        workout.exercises = [];

        for (const exercise of exercisesResult.rows) {
          const setsResult = await pool.query(
            'SELECT * FROM sets WHERE exercise_id = $1',
            [exercise.id] // Use the correct column name for exercise ID
          );

          workout.exercises.push({
            ...exercise,
            sets: setsResult.rows
          });
        }
      }
    }

    res.json(programs); // Return an array of programs
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Endpoint to get program details (workouts, exercises, sets, equipment, muscles) for a given program id
router.get('/programs/:program_id', async (req, res) => {
  const { program_id } = req.params;

  try {
    const programsResult = await pool.query(
      'SELECT * FROM programs WHERE id = $1',
      [parseInt(program_id)]
    );

    if (programsResult.rows.length === 0) {
      return res.status(404).json({ message: 'No programs found' });
    }

    const program = programsResult.rows[0];

    const workoutsResult = await pool.query(
      'SELECT * FROM workouts WHERE program_id = $1',
      [program.id] // Use the correct column name for program ID
    );

    program.workouts = workoutsResult.rows;

    for (const workout of program.workouts) {
      const exercisesResult = await pool.query(
        'SELECT e.*, ex.name as exercise_name, mg.name as muscle, eq.name as equipment ' +
          'FROM exercises e ' +
          'JOIN exercise_catalog ex ON e.catalog_exercise_id = ex.id ' +
          'JOIN muscle_groups mg ON ex.muscle_group_id = mg.id ' +
          'JOIN equipment_catalog eq ON ex.equipment_id = eq.id ' +
          'WHERE e.workout_id = $1',
        [workout.id] // Use the correct column name for workout ID
      );

      workout.exercises = [];

      for (const exercise of exercisesResult.rows) {
        const setsResult = await pool.query(
          'SELECT * FROM sets WHERE exercise_id = $1',
          [exercise.id] // Use the correct column name for exercise ID
        );

        workout.exercises.push({
          ...exercise,
          sets: setsResult.rows
        });
      }
    }

    res.json(program);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// TODO: For POST calls, update the Backend to Handle Invalid Data: On the backend, before inserting the data into the database, validate that all the fields match the expected types. If any field does not match, you can return a more specific error message to the frontend, which can help in diagnosing which part of the data is problematic.

// Endpoint to create a new program with workouts, exercises, and sets for a given user

router.post('/programs', async (req, res) => {
  const {
    user_id,
    name,
    program_duration,
    days_per_week,
    duration_unit,
    main_goal,
    workouts = [] // Default to empty array if workouts is undefined
  } = req.body;

  // console.log('Received program data:', JSON.stringify(req.body, null, 2));

  // Begin database transaction
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert the new program
    const programQuery = `
      INSERT INTO programs (user_id, name, program_duration, days_per_week, duration_unit, main_goal)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const programResult = await client.query(programQuery, [
      user_id,
      name,
      program_duration,
      days_per_week,
      duration_unit,
      main_goal
    ]);
    const program_id = programResult.rows[0].id;

    // console.log('Inserted program:', programResult.rows[0]);

    // Add workouts for each program
    if (Array.isArray(workouts)) {
      for (const workout of workouts) {
        const workoutQuery = `
          INSERT INTO workouts (program_id, name, "order")
          VALUES ($1, $2, $3) RETURNING id`;
        const workoutResult = await client.query(workoutQuery, [
          program_id,
          workout.name,
          workout.order
        ]);
        const workout_id = workoutResult.rows[0].id;

        // console.log('Inserted workout:', workoutResult.rows[0]);

        // Add exercises for each workout
        for (const exercise of workout.exercises || []) {
          const exerciseQuery = `
            INSERT INTO exercises (workout_id, catalog_exercise_id, "order")
            VALUES ($1, $2, $3) RETURNING id`;
          const exerciseResult = await client.query(exerciseQuery, [
            workout_id,
            exercise.catalog_exercise_id,
            exercise.order
          ]);
          const exercise_id = exerciseResult.rows[0].id;
          // console.log('exerciseResult ', exerciseResult);

          // console.log('Inserted exercise:', exerciseResult.rows[0]);

          // Add sets for each exercise
          for (const set of exercise.sets || []) {
            // console.log(
            //   'Adding set with exercise_id:',
            //   exercise_id,
            //   'and set:',
            //   set
            // );
            const setQuery = `
              INSERT INTO sets (exercise_id, reps, weight, "order")
              VALUES ($1, $2, $3, $4)`;
            await client.query(setQuery, [
              exercise_id,
              set.reps,
              set.weight,
              set.order
            ]);
          }
        }
      }
    } else {
      console.warn('Workouts is not an array:', workouts);
    }

    await client.query('COMMIT');
    // console.log('Transaction committed successfully');
    res.status(201).json({
      message: 'Program with workouts, exercises, and sets created successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during transaction:', err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

// Endpoint to update a program with its workouts, exercises, and sets for a given user

router.put('/programs/:program_id', async (req, res) => {
  const { program_id } = req.params;
  const {
    name,
    program_duration,
    days_per_week,
    duration_unit,
    main_goal,
    workouts
  } = req.body;

  try {
    // Begin transaction
    await pool.query('BEGIN');

    // Update the program details
    await pool.query(
      `UPDATE programs
       SET name = $1, program_duration = $2, duration_unit = $3, days_per_week = $4, main_goal = $5
       WHERE id = $6`,
      [
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal,
        program_id
      ]
    );

    // Loop through each workout to update or insert
    for (const workout of workouts) {
      let workoutId;

      if (workout.id) {
        // Update existing workout
        await pool.query(
          `UPDATE workouts SET name = $1, "order" = $2 WHERE id = $3 AND program_id = $4`,
          [workout.name, workout.order, workout.id, program_id]
        );
        workoutId = workout.id;
      } else {
        // Insert new workout
        const workoutResult = await pool.query(
          `INSERT INTO workouts (name, program_id, "order") VALUES ($1, $2, $3) RETURNING id`,
          [workout.name, program_id, workout.order]
        );
        workoutId = workoutResult.rows[0].id;
      }

      // Loop through each exercise to update or insert
      for (const exercise of workout.exercises) {
        let exerciseId;

        if (exercise.id) {
          // Update existing exercise
          await pool.query(
            `UPDATE exercises SET catalog_exercise_id = $1, "order" = $2 WHERE id = $3 AND workout_id = $4`,
            [
              exercise.catalog_exercise_id,
              exercise.order,
              exercise.id,
              workoutId
            ]
          );
          exerciseId = exercise.id;
        } else {
          // Insert new exercise
          const exerciseResult = await pool.query(
            `INSERT INTO exercises (catalog_exercise_id, workout_id, "order") VALUES ($1, $2, $3) RETURNING id`,
            [exercise.catalog_exercise_id, workoutId, exercise.order]
          );
          exerciseId = exerciseResult.rows[0].id;
        }

        // Loop through each set to update or insert
        for (const set of exercise.sets) {
          if (set.id) {
            // Update existing set
            await pool.query(
              `UPDATE sets SET weight = $1, reps = $2, "order" = $3 WHERE id = $4 AND exercise_id = $5`,
              [set.weight, set.reps, set.order, set.id, exerciseId]
            );
          } else {
            // Insert new set
            await pool.query(
              `INSERT INTO sets (weight, reps, "order", exercise_id) VALUES ($1, $2, $3, $4)`,
              [set.weight, set.reps, set.order, exerciseId]
            );
          }
        }
      }
    }

    // If everything is fine, commit the transaction
    await pool.query('COMMIT');

    res.json({ message: 'Program updated successfully' });
  } catch (err) {
    // If there is any error, rollback the transaction
    await pool.query('ROLLBACK');
    console.error('Error during transaction:', err);
    res.status(500).send('Server error');
  }
});

// Endpoint to delete a program and its associated workouts, exercises, and sets

router.delete('/programs/:program_id', async (req, res) => {
  const { program_id } = req.params;

  // console.log(`Attempting to delete program with ID: ${program_id}`);

  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Delete sets associated with the exercises in the workouts of the program
    // console.log('Deleting sets...');
    await client.query(
      'DELETE FROM sets WHERE exercise_id IN (SELECT id FROM exercises WHERE workout_id IN (SELECT id FROM workouts WHERE program_id = $1))',
      [program_id]
    );

    // Delete exercises associated with the workouts of the program
    // console.log('Deleting exercises...');
    await client.query(
      'DELETE FROM exercises WHERE workout_id IN (SELECT id FROM workouts WHERE program_id = $1)',
      [program_id]
    );

    // Delete workouts associated with the program
    console.log('Deleting workouts...');
    await client.query('DELETE FROM workouts WHERE program_id = $1', [
      program_id
    ]);

    // Finally, delete the program itself
    // console.log('Deleting program...');
    await client.query('DELETE FROM programs WHERE id = $1', [program_id]);

    // If everything is fine, commit the transaction
    await client.query('COMMIT');

    res.json({
      message: 'Program and all associated data deleted successfully'
    });
  } catch (err) {
    // If there is an error, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Error during transaction:', err);
    res.status(500).send('Server error');
  } finally {
    client.release();
  }
});

module.exports = router;

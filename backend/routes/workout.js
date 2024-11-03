const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Logging utility
const logQuery = (query, params) => {
  console.log('\nExecuting Query:');
  console.log('SQL:', query.replace(/\s+/g, ' ').trim());
  console.log('Parameters:', params);
};

// Endpoint to get a workout by ID
router.get('/workout/:workout_id', async (req, res) => {
  const startTime = Date.now();
  const { workout_id } = req.params;

  console.log(`\n[${new Date().toISOString()}] Fetching workout ${workout_id}`);

  try {
    // Validate workout_id
    const parsedId = parseInt(workout_id);
    if (!workout_id || isNaN(parsedId)) {
      console.log('Invalid workout ID:', workout_id);
      return res.status(400).json({ message: 'Invalid workout ID' });
    }

    const query = `
      SELECT
        w.id as workout_id,
        w.name as workout_name,
        e.id as exercise_id,
        e.order as exercise_order,
        ex.name as exercise_name,
        mg.muscle,
        mg.muscle_group,
        eq.name as equipment,
        im.file_path as image_url,
        s.id as set_id,
        s.order as set_order,
        s.reps,
        s.weight
      FROM workouts w
      JOIN exercises e ON e.workout_id = w.id
      JOIN exercise_catalog ex ON e.catalog_exercise_id = ex.id
      JOIN muscle_groups mg ON ex.muscle_group_id = mg.id
      JOIN equipment_catalog eq ON ex.equipment_id = eq.id
      LEFT JOIN sets s ON s.exercise_id = e.id
      LEFT JOIN image_metadata im ON ex.image_id = im.id
      WHERE w.id = $1
      ORDER BY e.order, s.order`;

    logQuery(query, [parsedId]);

    const workoutResult = await pool.query(query, [parsedId]);
    console.log(`Query returned ${workoutResult.rows.length} rows`);

    if (workoutResult.rows.length === 0) {
      console.log(`No workout found with ID ${workout_id}`);
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Transform the flat query results into a nested structure
    const workout = {
      id: workoutResult.rows[0].workout_id,
      name: workoutResult.rows[0].workout_name,
      exercises: []
    };

    // Use a Map to group exercises and their sets
    const exercisesMap = new Map();

    workoutResult.rows.forEach((row, index) => {
      if (!exercisesMap.has(row.exercise_id)) {
        // Create new exercise entry
        exercisesMap.set(row.exercise_id, {
          id: row.exercise_id,
          name: row.exercise_name,
          order: row.exercise_order,
          muscle: row.muscle,
          muscleGroup: row.muscle_group,
          equipment: row.equipment,
          imageUrl: row.image_url,
          sets: []
        });
        console.log(
          `Added exercise: ${row.exercise_name} (ID: ${row.exercise_id})`
        );
      }

      // Add set to exercise if it exists
      if (row.set_id) {
        const exercise = exercisesMap.get(row.exercise_id);
        exercise.sets.push({
          id: row.set_id,
          order: row.set_order,
          weight: row.weight,
          reps: row.reps
        });
      }
    });

    // Convert Map to array and sort exercises by order
    workout.exercises = Array.from(exercisesMap.values())
      .sort((a, b) => a.order - b.order)
      .map(exercise => ({
        ...exercise,
        sets: exercise.sets.sort((a, b) => a.order - b.order)
      }));

    const duration = Date.now() - startTime;
    console.log(`Request completed in ${duration}ms`);
    console.log('Response data:', {
      workoutId: workout.id,
      workoutName: workout.name,
      exerciseCount: workout.exercises.length,
      exercises: workout.exercises.map(e => ({
        name: e.name,
        setCount: e.sets.length
      }))
    });

    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout details:', {
      error: error.message,
      stack: error.stack,
      workoutId: workout_id,
      timestamp: new Date().toISOString()
    });

    // Check for specific database errors
    if (error.code === '23505') {
      // Unique violation
      return res.status(409).json({
        message: 'Conflict with existing data',
        error: error.message
      });
    }

    if (error.code === '23503') {
      // Foreign key violation
      return res.status(400).json({
        message: 'Referenced data does not exist',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Server error while fetching workout details',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Add a test endpoint to verify the route is mounted correctly
router.get('/workout/test', (req, res) => {
  res.json({ message: 'Workout route is working' });
});

module.exports = router;

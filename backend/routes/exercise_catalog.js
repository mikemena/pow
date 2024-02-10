const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint to get an exercise by name containing a string

router.get('/exercise-catalog/search', async (req, res) => {
  // Get the search query from the URL query string
  const searchQuery = req.query.q || ''; // Use an empty string as a default if no query is provided

  try {
    const query = `
      SELECT ec.exercise_id, ec.name, mg.name as muscle, eq.name as equipment, im.file_path
      FROM exercise_catalog ec
      JOIN muscle_groups mg ON ec.muscle_group_id = mg.muscle_group_id
      JOIN equipment_catalog eq ON ec.equipment_id = eq.equipment_id
      JOIN image_metadata im ON ec.image_id = im.image_id
      WHERE LOWER(ec.name) LIKE LOWER($1);
    `;
    // The '%' symbols are wildcards for any number of characters
    const { rows } = await db.query(query, [`%${searchQuery}%`]);
    res.json(rows);
  } catch (error) {
    console.error('Error searching exercises:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get all exercises in the catalog

router.get('/exercise-catalog', async (req, res) => {
  try {
    const { rows } = await db.query(`
    SELECT ec.exercise_id, ec.name, mg.name as muscle, eq.name as equipment, im.file_path
    FROM exercise_catalog ec
    JOIN muscle_groups mg ON ec.muscle_group_id = mg.muscle_group_id
    JOIN equipment_catalog eq ON ec.equipment_id = eq.equipment_id
    JOIN image_metadata im ON ec.image_id = im.image_id;
  `);
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
    const exerciseQuery = `SELECT ec.exercise_id, ec.name, mg.name as muscle, eq.name as equipment, im.file_path
    FROM exercise_catalog ec
    JOIN muscle_groups mg ON ec.muscle_group_id = mg.muscle_group_id
    JOIN equipment_catalog eq ON ec.equipment_id = eq.equipment_id
    JOIN image_metadata im ON ec.image_id = im.image_id
    WHERE exercise_id = $1`;

    const { rows } = await db.query(exerciseQuery, [parseInt(id)]);

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

// Endpoint to get exercises by specific muscle id

router.get('/exercise-catalog/muscles/:muscleId', async (req, res) => {
  try {
    const { muscleId } = req.params;
    const query = `
    SELECT ec.exercise_id, ec.name, ec.muscle_group_id, mg.name as muscle, ec.equipment_id, eq.name as equipment, im.file_path
    FROM exercise_catalog ec
    JOIN muscle_groups mg ON ec.muscle_group_id = mg.muscle_group_id
    JOIN equipment_catalog eq ON ec.equipment_id = eq.equipment_id
    JOIN image_metadata im ON ec.image_id = im.image_id
    WHERE ec.muscle_group_id = $1;
    `;
    const { rows } = await db.query(query, [muscleId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching exercises by muscle:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to get exercises by specific equipment id

router.get('/exercise-catalog/equipments/:equipmentId', async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const query = `
    SELECT ec.exercise_id, ec.name, ec.muscle_group_id, mg.name as muscle, ec.equipment_id, eq.name as equipment, im.file_path
    FROM exercise_catalog ec
    JOIN muscle_groups mg ON ec.muscle_group_id = mg.muscle_group_id
    JOIN equipment_catalog eq ON ec.equipment_id = eq.equipment_id
    JOIN image_metadata im ON ec.image_id = im.image_id
    WHERE ec.equipment_id = $1;
    `;
    const { rows } = await db.query(query, [equipmentId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching equipment by muscle:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to create an exercise

router.post('/exercise-catalog', async (req, res) => {
  try {
    const { name } = req.body;
    const { muscle_id } = req.body;
    const { equipment_id } = req.body;
    const { image_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO exercise_catalog (name, muscle_group_id, equipment_id, image_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, muscle_id, equipment_id, image_id]
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
    const { name, muscle_group_id, equipment_id, image_id } = req.body;

    // Construct the update part of the query based on provided fields

    const updateParts = [];
    const queryValues = [];
    let queryIndex = 1;

    if (name !== undefined) {
      updateParts.push(`name = $${queryIndex++}`);
      queryValues.push(name);
    }

    if (muscle_group_id !== undefined) {
      updateParts.push(`muscle_group_id = $${queryIndex++}`);
      queryValues.push(muscle_group_id);
    }

    if (equipment_id !== undefined) {
      updateParts.push(`equipment_id = $${queryIndex++}`);
      queryValues.push(equipment_id);
    }
    if (image_id !== undefined) {
      updateParts.push(`image_id = $${queryIndex++}`);
      queryValues.push(image_id);
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

// Delete exercise

router.delete('/exercise-catalog/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const { rowCount } = await db.query(
      'DELETE FROM exercise_catalog WHERE exercise_id = $1',
      [id]
    );

    if (rowCount > 0) {
      res.status(200).json({ message: 'Exercise deleted successfully' });
    } else {
      // If no muscle was found and deleted, return a 404 Not Found response
      res.status(404).json({ message: 'Exercise not found' });
    }
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error deleting exercise:', error);
    res.status(500).json({ message: 'Error deleting exercise' });
  }
});

module.exports = router;

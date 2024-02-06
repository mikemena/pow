const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all muscles
router.get('/muscles', async (req, res) => {
  try {
    const { rows } =
      await db.query(`SELECT m.muscle_group_id, m.name, i.file_path
    FROM muscle_groups m
    LEFT JOIN image_metadata i ON m.image_id = i.image_id;`);
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET a specific muscle by ID
router.get('/muscles/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Query to fetch the muscle with the specified ID
    const { rows } = await db.query(
      `SELECT m.muscle_group_id, m.name, i.file_path
      FROM muscle_groups m
      LEFT JOIN image_metadata i ON m.image_id = i.image_id
      WHERE muscle_group_id = $1`,
      [parseInt(id)]
    );

    if (rows.length === 0) {
      // If no muscle is found with the given ID, return a 404 Not Found response
      return res.status(404).json({ message: 'Muscle not found' });
    }

    // If a muscle is found, return it in the response
    res.json(rows[0]);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error fetching muscle:', error);
    res.status(500).json({ message: 'Error fetching muscle' });
  }
});

// POST a muscle
router.post('/muscles', async (req, res) => {
  try {
    const { muscle_group, image_id } = req.body;
    const { rows } = await db.query(
      'INSERT INTO muscle_groups (name, image_id) VALUES ($1, $2) RETURNING *',
      [muscle_group, image_id]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT a muscle
router.put('/muscles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image_id } = req.body;

    // Construct the update part of the query based on provided fields
    const updateParts = [];
    const queryValues = [];
    let queryIndex = 1;

    if (name !== undefined) {
      updateParts.push(`name = $${queryIndex++}`);
      queryValues.push(name);
    }

    if (image_id !== undefined) {
      updateParts.push(`image_id = $${queryIndex++}`);
      queryValues.push(image_id);
    }

    queryValues.push(id); // For the WHERE condition

    if (updateParts.length === 0) {
      return res.status(400).send('No update fields provided.');
    }

    const queryString = `UPDATE muscle_groups SET ${updateParts.join(
      ', '
    )} WHERE muscle_group_id = $${queryIndex} RETURNING *`;

    const { rows } = await db.query(queryString, queryValues);

    if (rows.length === 0) {
      return res.status(404).send('Muscle not found.');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete muscle

router.delete('/muscles/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const { rowCount } = await db.query(
      'DELETE FROM muscle_groups WHERE muscle_group_id = $1',
      [id]
    );

    if (rowCount > 0) {
      res.status(200).json({ message: 'Muscle deleted successfully' });
    } else {
      // If no muscle was found and deleted, return a 404 Not Found response
      res.status(404).json({ message: 'Muscle not found' });
    }
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error deleting muscle:', error);
    res.status(500).json({ message: 'Error deleting muscle' });
  }
});

module.exports = router;

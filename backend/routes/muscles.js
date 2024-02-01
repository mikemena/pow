const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get muscles
router.get('/muscles', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM muscle_groups');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a muscle
router.post('/muscles', async (req, res) => {
  try {
    const { muscle_group } = req.body;
    const { rows } = await db.query(
      'INSERT INTO muscle_groups (muscle_group_name) VALUES ($1) RETURNING *',
      [muscle_group]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a muscle
router.put('/muscles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { muscle_group } = req.body;
    const { rows } = await db.query(
      'UPDATE muscle_groups SET name = $1, muscle_group = $2 WHERE id = $3 RETURNING *',
      [muscle_group, id]
    );
    if (rows.length === 0) {
      return res.status(404).send('Equipment not found.');
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

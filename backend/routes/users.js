const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../config/db');

// Endpoint to get all users

router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to get a specific user by ID

router.get('/users/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Query to fetch the user with the specified ID
    const { rows } = await db.query('SELECT * FROM users WHERE user_id = $1', [
      parseInt(id)
    ]);

    if (rows.length === 0) {
      // If no user is found with the given ID, return a 404 Not Found response
      return res.status(404).json({ message: 'User not found' });
    }

    // If a user is found, return it in the response
    res.json(rows[0]);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Endpoint to create a user

router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { rows } = await db.query(
      'INSERT INTO users (username, email, password_hash, signup_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, passwordHash, new Date()]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to modify a user

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    // Construct the update part of the query based on provided fields
    const updateParts = [];
    const queryValues = [];
    let queryIndex = 1;

    if (username !== undefined) {
      updateParts.push(`username = $${queryIndex++}`);
      queryValues.push(username);
    }

    if (email !== undefined) {
      updateParts.push(`email = $${queryIndex++}`);
      queryValues.push(email);
    }

    queryValues.push(id); // For the WHERE condition

    if (updateParts.length === 0) {
      return res.status(400).send('No update fields provided.');
    }

    const queryString = `UPDATE users SET ${updateParts.join(
      ', '
    )} WHERE user_id = $${queryIndex} RETURNING *`;

    const { rows } = await db.query(queryString, queryValues);

    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint to delete a user

router.delete('/users/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    const { rowCount } = await db.query(
      'DELETE FROM users WHERE user_id = $1',
      [id]
    );

    if (rowCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      // If no user was found and deleted, return a 404 Not Found response
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response if an error occurs
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;

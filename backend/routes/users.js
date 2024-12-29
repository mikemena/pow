const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Endpoint to get all users

// router.get('/users', async (req, res) => {
//   try {
//     const { rows } = await db.query('SELECT * FROM users');
//     res.json(rows);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// Endpoint to get a specific user by ID

// router.get('/users/:id', async (req, res) => {
//   const { id } = req.params; // Extract the ID from the route parameters

//   try {
//     // Query to fetch the user with the specified ID
//     const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [
//       parseInt(id)
//     ]);

//     if (rows.length === 0) {
//       // If no user is found with the given ID, return a 404 Not Found response
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // If a user is found, return it in the response
//     res.json(rows[0]);
//   } catch (error) {
//     // Log the error and return a 500 Internal Server Error response if an error occurs
//     console.error('Error fetching user:', error);
//     res.status(500).json({ message: 'Error fetching user' });
//   }
// });

// Endpoint to sign up a user

router.post('/auth/signup', async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    const { auth_provider, email, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (auth_provider, email, password_hash, signup_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, auth_provider,email, signup_date',
      [auth_provider, email, passwordHash]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Endpoint to sign up with social authentication

router.post('/auth/social', async (req, res) => {
  try {
    const { email, authProvider, authProviderId, name } = req.body;

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR (auth_provider = $2 AND auth_provider_id = $3)',
      [email, authProvider, authProviderId]
    );

    let userId;

    if (existingUser.rows.length > 0) {
      // User exists - just return token
      userId = existingUser.rows[0].id;
    } else {
      // Create new user
      const result = await pool.query(
        `INSERT INTO users (
          email,
          auth_provider,
          auth_provider_id,
          username,
          signup_date
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        RETURNING id`,
        [email, authProvider, authProviderId, name]
      );
      userId = result.rows[0].id;
    }

    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { id: userId, email } });
  } catch (error) {
    console.error('Social auth error:', error);
    res.status(500).json({ message: 'Server error during social auth' });
  }
});

// Endpoint to sign in

router.post('/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Convert bytea to string before comparison
    const passwordHashString = user.password_hash.toString('utf8');

    // Verify password
    const isValidPassword = await bcrypt.compare(password, passwordHashString);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin' });
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
    )} WHERE id = $${queryIndex} RETURNING *`;

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
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [
      id
    ]);

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

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get active program for a user
router.get('/active-program/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT ap.*, p.name, p.main_goal, p.program_duration, p.duration_unit, p.days_per_week
       FROM active_programs ap
       JOIN programs p ON ap.program_id = p.id
       WHERE ap.user_id = $1 AND ap.is_active = TRUE
       ORDER BY ap.start_date DESC
       LIMIT 1`,
      [userId]
    );

    if (!result?.rows || result.rows.length === 0) {
      return res.status(200).json({ activeProgram: null });
    }

    res.json({ activeProgram: result.rows[0] });
  } catch (error) {
    console.error(
      'Backend active_programs.js Error fetching active program:',
      error
    );
    res.status(500).json({
      error: 'Failed to fetch active program',
      details: error.message
    });
  }
});

// Backend: active_program.js
router.post('/active-program', async (req, res) => {
  const { user_id, program_id } = req.body;

  // Validate required fields
  if (!user_id || !program_id) {
    return res.status(400).json({
      error: 'Missing required fields',
      details: 'Both userId and programId are required'
    });
  }

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // First check if program exists
    const programExists = await pool.query(
      'SELECT id, program_duration, duration_unit FROM programs WHERE id = $1',
      [program_id]
    );

    if (programExists.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({
        error: 'Program not found',
        details: `Program with id ${program_id} not found`
      });
    }

    const { program_duration, duration_unit } = programExists.rows[0];

    const startDate = new Date();
    let endDate = new Date(startDate);

    switch (duration_unit) {
      case 'weeks':
        endDate.setDate(endDate.getDate() + program_duration * 7);
        break;
      case 'months':
        endDate.setMonth(endDate.getMonth() + program_duration);
        break;
      default: // days
        endDate.setDate(endDate.getDate() + program_duration);
    }

    // Deactivate current active program if exists
    await pool.query(
      'UPDATE active_programs SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE',
      [user_id]
    );

    // Insert new active program
    const result = await pool.query(
      `INSERT INTO active_programs
       (user_id, program_id, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING *`,
      [user_id, program_id, startDate, endDate]
    );

    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Program activated successfully',
      activeProgram: result.rows[0]
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error activating program:', error);
    res.status(500).json({
      error: 'Failed to save active program',
      details: error.message
    });
  }
});

// delete active program for a user
router.delete('/active-program/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Received DELETE request for user:', userId);

  try {
    console.log('Starting transaction');
    await pool.query('BEGIN');

    console.log('Executing deactivation query');
    const result = await pool.query(
      'DELETE FROM active_programs WHERE user_id = $1 AND is_active = TRUE RETURNING *',
      [userId]
    );
    console.log('Deactivation query result:', result.rows);

    console.log('Committing transaction');
    await pool.query('COMMIT');

    if (result.rows.length === 0) {
      console.log('No active program found to delete');
      return res.status(200).json({
        message: 'No active program to delete',
        deactivatedProgram: null
      });
    }

    console.log('Successfully deleted active program');
    res.json({
      message: 'Active program deleted successfully',
      deactivatedProgram: result.rows[0]
    });
  } catch (error) {
    console.error('Detailed deletion error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      userId: userId
    });

    await pool.query('ROLLBACK');
    res.status(500).json({
      error: 'Failed to deactivate program',
      details: error.message
    });
  }
});

module.exports = router;

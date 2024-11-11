const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get active program for a user
router.get('/active-programs/user/:userId', async (req, res) => {
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
      console.log('No active program found for user:', userId);
      return res.status(200).json({ activeProgram: null });
    }

    // Log the response being sent
    // console.log('Sending active program response:', {
    //   activeProgram: result.rows[0]
    // });
    res.json({ activeProgram: result.rows[0] });
  } catch (error) {
    console.error('Error fetching active program:', error);
    res.status(500).json({
      error: 'Failed to fetch active program',
      details: error.message
    });
  }
});

router.post('/active-programs', async (req, res) => {
  const { userId, programId } = req.body;

  try {
    // Start a transaction
    await pool.query('BEGIN');

    // Deactivate any currently active programs for the user
    const deactivateResult = await pool.query(
      'UPDATE active_programs SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE',
      [userId]
    );
    console.log('Deactivation result:', deactivateResult);

    // Fetch program details
    const programResult = await pool.query(
      'SELECT program_duration, duration_unit FROM programs WHERE id = $1',
      [programId]
    );

    if (programResult.rows.length === 0) {
      throw new Error(`Program with id ${programId} not found`);
    }

    const { program_duration, duration_unit } = programResult.rows[0];
    console.log('Program details:', { program_duration, duration_unit });

    let endDate;
    const startDate = new Date();
    if (duration_unit === 'weeks') {
      endDate = new Date(
        startDate.getTime() + program_duration * 7 * 24 * 60 * 60 * 1000
      );
    } else if (duration_unit === 'months') {
      endDate = new Date(
        startDate.setMonth(startDate.getMonth() + program_duration)
      );
    } else {
      endDate = new Date(
        startDate.getTime() + program_duration * 24 * 60 * 60 * 1000
      );
    }

    console.log('Calculated dates:', { startDate, endDate });

    // Insert the new active program
    const result = await pool.query(
      `INSERT INTO active_programs
       (user_id, program_id, start_date, end_date, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (user_id, program_id, start_date)
       DO UPDATE SET
         is_active = TRUE,
         end_date = EXCLUDED.end_date
       RETURNING *`,
      [userId, programId, startDate, endDate]
    );

    console.log('Insertion result:', result.rows[0]);

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json({
      message: 'Program activated successfully',
      activeProgram: result.rows[0]
    });
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error activating program:', error);
    res.status(500).json({
      error: 'Failed to save active program',
      details: error.message
    });
  }
});

// delete active program for a user
router.delete('/active-programs/user/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Received DELETE request for user:', userId);

  try {
    console.log('Starting transaction');
    await pool.query('BEGIN');

    console.log('Executing deactivation query');
    const result = await pool.query(
      'UPDATE active_programs SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE RETURNING *',
      [userId]
    );
    console.log('Deactivation query result:', result.rows);

    console.log('Committing transaction');
    await pool.query('COMMIT');

    if (result.rows.length === 0) {
      console.log('No active program found to deactivate');
      return res.status(200).json({
        message: 'No active program to deactivate',
        deactivatedProgram: null
      });
    }

    console.log('Successfully deactivated program');
    res.json({
      message: 'Program deactivated successfully',
      deactivatedProgram: result.rows[0]
    });
  } catch (error) {
    console.error('Detailed deactivation error:', {
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

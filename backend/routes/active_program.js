const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

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
         RETURNING *`,
      [userId, programId, startDate, endDate]
    );

    console.log('Insertion result:', result.rows[0]);

    // Commit the transaction
    await pool.query('COMMIT');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Detailed error:', error);
    res
      .status(500)
      .json({ error: 'Failed to save active program', details: error.message });
  }
});

module.exports = router;

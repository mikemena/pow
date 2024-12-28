const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Get workouts this month
router.get('/monthlyWorkouts/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const monthlyResult = await pool.query(
      `SELECT COUNT(id) as count
       FROM public.completed_workouts
       WHERE date >= date_trunc('month', CURRENT_DATE)
       AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
       AND user_id = $1`,
      [user_id]
    );

    if (monthlyResult.rows.length === 0) {
      return res.status(404).json({ message: 'No workouts this month' });
    }

    const monthlyWorkouts = monthlyResult.rows[0];
    res.json(monthlyWorkouts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

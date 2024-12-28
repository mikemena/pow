const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/progress/summary/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const userId = parseInt(user_id, 10);

  try {
    // Get both monthly count and weekly data in parallel
    const [monthlyResult, weeklyResult] = await Promise.all([
      // Monthly workouts query
      pool.query(
        `SELECT COUNT(id) as count
         FROM public.completed_workouts
         WHERE date >= date_trunc('month', CURRENT_DATE)
         AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
         AND user_id = $1`,
        [userId]
      ),

      // Weekly workouts query
      pool.query(
        `WITH RECURSIVE dates AS (
          SELECT date_trunc('week', CURRENT_DATE) as date
          UNION ALL
          SELECT date + interval '1 day'
          FROM dates
          WHERE date < date_trunc('week', CURRENT_DATE) + interval '6 days'
        ),
        daily_minutes AS (
          SELECT
            date_trunc('day', date) as workout_date,
            COALESCE(SUM(duration), 0) as total_minutes
          FROM completed_workouts
          WHERE
            user_id = $1
            AND is_completed = true
            AND date >= date_trunc('week', CURRENT_DATE)
            AND date < date_trunc('week', CURRENT_DATE) + interval '7 days'
          GROUP BY date_trunc('day', date)
        )
        SELECT
          dates.date as day,
          to_char(dates.date, 'Dy') as day_name,
          COALESCE(daily_minutes.total_minutes, 0) as minutes
        FROM dates
        LEFT JOIN daily_minutes ON date_trunc('day', dates.date) = daily_minutes.workout_date
        ORDER BY dates.date`,
        [userId]
      )
    ]);

    // Combine the results
    const response = {
      monthlyCount: monthlyResult.rows[0].count,
      weeklyWorkouts: weeklyResult.rows
    };

    res.json(response);
  } catch (err) {
    console.error('Progress fetch error:', err);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

module.exports = router;

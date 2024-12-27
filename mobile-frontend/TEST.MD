-- Workouts this month --

SELECT COUNT(id) as count
FROM public.completed_workouts
WHERE date >= date_trunc('month', CURRENT_DATE)
AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
AND user_id = 2;

-- Workouts this week --

WITH RECURSIVE dates AS (
SELECT date_trunc('week', CURRENT_DATE) as date -- Start of current week (Sunday)
UNION ALL
SELECT date + interval '1 day'
FROM dates
WHERE date < date_trunc('week', CURRENT_DATE) + interval '6 days' -- Until Saturday
),
daily_minutes AS (
SELECT
date_trunc('day', date) as workout_date,
COALESCE(SUM(duration), 0) as total_minutes
FROM completed_workouts
WHERE
user_id = :user_id
AND is_completed = true
AND date >= date_trunc('week', CURRENT_DATE)
AND date < date_trunc('week', CURRENT_DATE) + interval '7 days'
GROUP BY date_trunc('day', date)
)
SELECT
dates.date as day,
to_char(dates.date, 'Dy') as day_name, -- Gets day abbreviation (Sun, Mon, etc)
COALESCE(daily_minutes.total_minutes, 0) as minutes
FROM dates
LEFT JOIN daily_minutes ON date_trunc('day', dates.date) = daily_minutes.workout_date
ORDER BY dates.date;

-- Pre-calculated stats (updated via trigger or background job)
user_monthly_stats (
user_id,
month_date, -- e.g., '2024-04-01'
total_workouts,
total_minutes,
updated_at
)

personal_records (
user_id,
exercise_id,
weight,
reps,
workout_id,
achieved_at,
is_current_record
)

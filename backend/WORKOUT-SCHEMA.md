# The active_programs table allows users to set a program as active and track their progress within that program.

# When a user sets a new program as active:

## Set is_active = FALSE and populate end_date for the previously active program (if any).

-- Deactivate the current active program
UPDATE active_programs
SET is_active = FALSE, end_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
WHERE user_id = :user_id AND is_active = TRUE;

## Insert a new row for the newly activated program with is_active = TRUE and start_date set to the current date.

-- Activate a new program
INSERT INTO active_programs (user_id, program_id, start_date, is_active)
VALUES (:user_id, :new_program_id, CURRENT_DATE, TRUE);

# To get a user's currently active program:

## Query the active_programs table where user_id matches and is_active = TRUE.

-- Query for the currently active program
SELECT \* FROM active_programs
WHERE user_id = :user_id AND is_active = TRUE;

-- Active Programs table
CREATE TABLE active_programs (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
program_id INTEGER REFERENCES programs(id),
current_workout_index INTEGER DEFAULT 0,
start_date DATE NOT NULL,
end_date DATE,
last_workout_date DATE,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE (user_id, program_id, start_date)
);

# The workouts table can be used for both program workouts and flex workouts. The program_id can be null for flex workouts.

-- Workouts table
CREATE TABLE completed_exercises (
id SERIAL PRIMARY KEY,
workout_id INTEGER REFERENCES completed_workouts(id),
exercise_id INTEGER REFERENCES exercises(id),
order_index INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE (workout_id, exercise_id)
);

# The workout_exercises table links exercises to workouts and maintains their order.

-- Workout Exercises table
CREATE TABLE completed_exercises (
id SERIAL PRIMARY KEY,
workout_id INTEGER REFERENCES completed_workouts(id),
catalog_exercise_id INTEGER REFERENCES exercises(id),
order_index INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
UNIQUE (workout_id, exercise_id)
);

# The sets table stores the actual performance data (weight, reps, duration) for each exercise in a workout.

-- Sets table
CREATE TABLE completed_sets (
id SERIAL PRIMARY KEY,
exercise_id INTEGER REFERENCES completed_exercises(id),
weight DECIMAL(5,2),
reps INTEGER,
order_index INTEGER,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

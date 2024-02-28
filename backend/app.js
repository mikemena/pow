const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors({ origin: 'http://localhost:3000' })); // Only allow requests only from frontend

// Import routes
const imageRoutes = require('./routes/images');
const musclesRoutes = require('./routes/muscles');
const equipmentsRoutes = require('./routes/equipment_catalog');
const exerciseCatalogRoutes = require('./routes/exercise_catalog');
const usersRoutes = require('./routes/users');
const programRoutes = require('./routes/programs');
const workoutTemplatesRoutes = require('./routes/workout_templates');
const userSetsRoutes = require('./routes/user_sets');
const userExercisesRoutes = require('./routes/user_exercises');
const workoutHistoryRoutes = require('./routes/workout_history');

// Use your routes with a base path
app.use('/api', imageRoutes);
app.use('/api', musclesRoutes);
app.use('/api', equipmentsRoutes);
app.use('/api', exerciseCatalogRoutes);
app.use('/api', usersRoutes);
app.use('/api', workoutTemplatesRoutes);
app.use('/api', userSetsRoutes);
app.use('/api', userExercisesRoutes);
app.use('/api', workoutHistoryRoutes);
app.use('/api', programRoutes);

// Your existing setup and routes...

const PORT = process.env.PORT || 9025;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

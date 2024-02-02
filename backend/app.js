const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const imageRoutes = require('./routes/images');
const musclesRoutes = require('./routes/muscles');
const equipmentsRoutes = require('./routes/equipment_catalog');
const exerciseCatalogRoutes = require('./routes/exercise_catalog');
const usersRoutes = require('./routes/users');
const userWorkoutsRoutes = require('./routes/user_workouts');

// Use your routes with a base path
app.use('/api', imageRoutes);
app.use('/api', musclesRoutes);
app.use('/api', equipmentsRoutes);
app.use('/api', exerciseCatalogRoutes);
app.use('/api', usersRoutes);
app.use('/api', userWorkoutsRoutes);

// Your existing setup and routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

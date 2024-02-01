const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const imageRoutes = require('./routes/images');
const musclesRoutes = require('./routes/muscles');
const equipmentsRoutes = require('./routes/equipment_catalog');

// Use your routes with a base path
app.use('/api', imageRoutes);
app.use('/api', musclesRoutes);
app.use('/api', equipmentsRoutes);

// Your existing setup and routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const imageMetadataRoutes = require('./routes/image_metadata');
const musclesRoutes = require('./routes/muscles');

// Use your routes with a base path
app.use('/api', imageMetadataRoutes);
app.use('/api', musclesRoutes);

// Your existing setup and routes...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

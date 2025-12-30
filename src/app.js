const express = require('express');
const logger = require('./middlewares/logger');

const app = express();

app.use(logger);
app.use(express.json());

// routes
const userRoutes = require('./routes/userRoutes');
const statusRoutes = require('./routes/statusRoutes');

app.use('/api', userRoutes);
app.use('/api', statusRoutes);

//error handler MUST be last
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
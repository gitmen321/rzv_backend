const express = require('express');
const logger = require('./middlewares/logger');

const app = express();

app.use(logger);
app.use(express.json());
app.set('trust proxy', true);

// routes
const userRoutes = require('./users/user.routes');
const authRoutes = require('./auth/auth.routes');
const adminRoutes = require('./admin/admin.routes');

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

app.get('health', (req, res) => {
    res.status(200).json({
        message: "'Server is running",
        Timestamp: new Date().toISOString()
    });
})

//error handler MUST be last
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


module.exports = app;
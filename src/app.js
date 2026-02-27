const express = require('express');
const logger = require('./middlewares/logger');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(logger);
app.use(express.json());
app.set('trust proxy', true);
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(
    path.join(__dirname, '../swagger.yaml')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
const userRoutes = require('./users/user.routes');
const authRoutes = require('./auth/auth.routes');
const adminRoutes = require('./admin/admin.routes');
const auditRoutes = require('./audit/audit.routes');
const rewardRoutes = require('./reward/reward.routes');

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', auditRoutes);
app.use('/api', rewardRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: "'Server is running",
        timestamp: new Date().toISOString(),
    });
});

//error handler MUST be last
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


module.exports = app;
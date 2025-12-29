require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const express = require('express');
const app = express();
const logger = require('./middlewares/logger');

app.use(logger);
app.use(express.json());
const userroutes = require('./routes/userRoutes');
app.use('/api', userroutes);

// Import routes(status)
const statusRoutes = require('./routes/statusRoutes');

// Import routes(status)
app.use('/api', statusRoutes);

const erroHandler = require('./middlewares/errorHandler');

app.use(erroHandler);




app.listen(3000, () =>
    console.log('Server started in port 3000')
);



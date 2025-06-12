require('dotenv').config();

const express = require('express');
const { connectDB } = require('./src/config/db');
const mainRouter = require('./src/backend/routes/main');
const cors = require('cors');
const { configCloudinary } = require('./src/config/cloudinary');

const app = express();
app.use(cors());

app.use(express.json());

connectDB();
configCloudinary();

app.use('/api/v1', mainRouter);

app.use((req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

module.exports = app;

require('dotenv').config();

const express = require('express');
const { connectDB } = require('./src/config/db');
const mainRouter = require('./src/backend/routes/main');
const cors = require('cors');
const { configCloudinary } = require('./src/config/cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de rutas
app.use('/api/v1', mainRouter);

// Manejo de errores 404
app.use((req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

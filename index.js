require('dotenv').config();

const express = require('express');

const { connectDB } = require('./src/config/db');

const mainRouter = require('./src/api/routes/main');

const cors = require('cors');

const { configCloudinary } = require('./src/config/cloudinary');

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

configCloudinary();

app.use('/api/v1', mainRouter);

app.use((req, res, next) => {
  const error = new Error('Route not found');

  error.status = 404;

  next(error);
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(
      `Servidor levantado para desarrollo en: http://localhost:${PORT} ✅`
    );
  });
}

module.exports = app;

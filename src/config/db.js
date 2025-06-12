const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error('DB_URL no está definida');
    }
    
    const conn = await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('Conectado con éxito a la BBDD ✅');
    return conn;
  } catch (error) {
    console.error('Error conectando con la BBDD:', error.message);
    throw error;
  }
};

module.exports = { connectDB };

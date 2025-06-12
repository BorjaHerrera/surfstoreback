require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../api/models/categories');
const categoriesData = require('./categoriesData');

const DB_URL = process.env.DB_URL;

const categoriesSeed = async () => {
  try {
    await mongoose.connect(DB_URL);

    const existingCategories = await Category.find();

    if (existingCategories.length) {
      await Category.collection.drop();
      console.log('Se ha eliminado la colección Categories');
    }

    await Category.insertMany(categoriesData);
    console.log('Se ha insertado la colección Categories desde el array');
  } catch (error) {
    console.error('Error durante la operación:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de la base de datos.');
  }
};

categoriesSeed();

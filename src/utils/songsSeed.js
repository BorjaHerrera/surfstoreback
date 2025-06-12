require('dotenv').config();

const mongoose = require('mongoose');
const path = require('path');
const Song = require('../api/models/songs');
const { musicCloudinary } = require('./cloudinaryMusic');
const { configCloudinary } = require('../config/cloudinary');
const songsData = require('./songsData');

const DB_URL = process.env.DB_URL;

configCloudinary();
const songsSeed = async () => {
  try {
    await mongoose.connect(DB_URL);

    const existingSong = await Song.find();

    if (existingSong.length) {
      await Song.collection.drop();
      console.log('Se ha eliminado la colección Songs');
    }

    for (const song of songsData) {
      const absoluteSongPath = path.resolve(song.audioUrl);

      const cloudinaryUrl = await musicCloudinary(absoluteSongPath);
      song.audioUrl = cloudinaryUrl;

      console.log(`Subido: ${song.name} - ${cloudinaryUrl}`);
    }

    await Song.insertMany(songsData);
    console.log('Canciones insertadas en MongoDB');
  } catch (error) {
    console.error('Error en songsSeed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de la base de datos.');
  }
};

songsSeed();

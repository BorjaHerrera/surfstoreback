const Song = require('../models/songs');
const cloudinary = require('cloudinary').v2;

const getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();
    return res.status(200).json(songs);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Songs');
  }
};

const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);
    return res.status(200).json(song);
  } catch (error) {
    return res.status(400).json('Error en la solicitud Get Song by Id');
  }
};

const postSong = async (req, res, next) => {
  try {
    const { name, band } = req.body;

    const existingSong = await Song.findOne({ name, band });

    if (existingSong) {
      return res.status(400).json({
        errorType: 'EXISTING_CATEGORY_ERROR',
        message: 'Esta canción ya está en la lista'
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Falta el archivo de audio' });
    }

    const newSongData = {
      name,
      band,
      audioUrl: req.file.path
    };

    const newSong = new Song(newSongData);

    const savedSong = await newSong.save();

    return res.status(201).json({
      message: 'La canción se ha creado correctamente',
      song: savedSong
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: 'Error en la solicitud Post Song',
      error: error.message
    });
  }
};

const putSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSong = req.body;

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: 'Canción no encontrado' });
    }

    if (req.file) {
      const songUrl = song.audioUrl.split('/');
      const filename = songUrl[songUrl.length - 1];
      const publicId = filename.split('.')[0];

      //prettier-ignore
      await cloudinary.uploader.destroy(`SurfStoreMusic/${publicId}`, {resource_type: 'video'});

      updateSong.audioUrl = req.file.path;
    }

    const updatedSong = await Song.findByIdAndUpdate(id, updateSong, {
      new: true
    });

    return res.status(200).json({
      message: 'Canción actualizada correctamente',
      cancion: updatedSong
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error en la solicitud Put Song',
      error: error.message
    });
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const songDeleted = await Song.findByIdAndDelete(id);

    if (!songDeleted) {
      return res.status(404).json({ message: 'Canción no encontrada' });
    }

    const songUrl = songDeleted.audioUrl.split('/');
    const filename = songUrl[songUrl.length - 1];
    const publicId = filename.split('.')[0];

    await cloudinary.uploader.destroy(`SurfStoreMusic/${publicId}`, {
      resource_type: 'video'
    });

    return res.status(200).json({
      message: 'Canción eliminada correctamente',
      cancion: songDeleted
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error en la solicitud Deleted Song',
      error: error.message
    });
  }
};

module.exports = { getSongs, getSongById, postSong, putSong, deleteSong };

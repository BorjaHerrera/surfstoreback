const musicUpload = require('../../middlewares/audioUpload');
const { isAuth, isAdmin } = require('../../middlewares/auth');
const {
  getSongs,
  getSongById,
  postSong,
  putSong,
  deleteSong
} = require('../controllers/songs');

const songsRouter = require('express').Router();

const adminProtect = [isAuth, isAdmin];

songsRouter.get('/', adminProtect, getSongs);
songsRouter.get('/:id', adminProtect, getSongById);
songsRouter.post('/', adminProtect, musicUpload.single('audio'), postSong);
songsRouter.put('/:id', adminProtect, musicUpload.single('audio'), putSong);
songsRouter.delete('/:id', adminProtect, deleteSong);

module.exports = songsRouter;

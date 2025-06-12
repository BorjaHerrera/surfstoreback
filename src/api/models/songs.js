const mongoose = require('mongoose');

const songsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    band: { type: String, required: true, trim: true },
    audioUrl: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    collection: 'songs'
  }
);

const Song = mongoose.model('songs', songsSchema, 'songs');

module.exports = Song;

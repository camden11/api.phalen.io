require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const initializeDatabase = require('../db');

const Spotify = require('../api/Spotify');

initializeDatabase(async db => {
  await Spotify.getAccessToken();
  const tracks = await Spotify.getAllTracks();

  const artists = [];
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      const { name } = artist;
      if (!artists.includes(name)) {
        artists.push(name);
      }
    });
  });

  db.collection('artists').findAndModify(
    { _id: new ObjectID(process.env.DB_ARTIST_LIST) },
    { _id: 1 },
    { $set: { list: artists } },
    { new: true },
    err => {
      if (err) {
        console.log('db error');
      } else {
        console.log('artist db updated');
      }
    }
  );
}, true);

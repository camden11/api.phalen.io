require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const initializeDatabase = require('../db');

const Spotify = require('../api/Spotify');
const Songkick = require('../api/Songkick');

initializeDatabase(async db => {
  console.log('starting script');
  console.log('getting spotify access token');
  await Spotify.getAccessToken();
  console.log('access token received');
  console.log('querying spotify for tracks');
  const tracks = await Spotify.getAllTracks();

  console.log('getting artists list from spotify');
  const artists = [];
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      const { name } = artist;
      if (!artists.includes(name)) {
        artists.push(name);
      }
    });
  });

  console.log('retrieving arist ids from songkick');
  const artistIds = [];
  const failures = [];
  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const artistId = await Songkick.getArtistId(artist);
    if (artistId) {
      console.log(`retreived id for ${artist}`);
      artistIds.push(artistId);
    } else {
      failures.push(artist);
    }
  }

  console.log('adding artist ids to database');
  db.collection('artists').findAndModify(
    { _id: new ObjectID(process.env.DB_ARTIST_LIST) },
    { _id: 1 },
    { $set: { list: artistIds } },
    { new: true },
    err => {
      if (err) {
        console.log('db error');
      } else {
        console.log('artist db updated');
      }
    }
  );

  failures.forEach(artist => {
    console.log('\x1b[31m', `failed to find artist id for ${artist}`);
  });
}, true);

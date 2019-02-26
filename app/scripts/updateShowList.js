require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const initializeDatabase = require('../db');
const calculateGenre = require('../utils/calculateGenre/calculateGenre');

const Spotify = require('../api/Spotify');
const Songkick = require('../api/Songkick');
const Show = require('../models/Show');

initializeDatabase(async db => {
  console.log('starting script');
  console.log('getting spotify access token');
  await Spotify.getAccessToken();
  console.log('access token received');
  console.log('querying spotify for tracks');
  const tracks = await Spotify.getAllTracks();

  console.log('getting artists list from spotify');
  const spotifyArtists = [];
  const spotifyArtistNames = [];
  tracks.forEach(track => {
    track.artists.forEach(artist => {
      const { name, id } = artist;
      if (!spotifyArtistNames.includes(name)) {
        spotifyArtists.push({ name, id });
        spotifyArtistNames.push(name);
      }
    });
  });

  console.log('retreiving artist data and shows');
  const shows = [];
  for (let i = 0; i < spotifyArtists.length; i++) {
    const artist = spotifyArtists[i];
    console.log('\x1b[0m', `fetching data for ${artist.name}`);
    const spotifyGenres = await Spotify.getArtistGenres(artist.id);
    const genre = calculateGenre(spotifyGenres);
    const songkickId = await Songkick.getArtistId(artist.name);
    if (songkickId) {
      const songkickShows = await Songkick.getShowsForArtist(songkickId);
      songkickShows.forEach(show => {
        shows.push(Show.fromApiData(show, artist.name, genre));
      });
      console.log('\x1b[32m', 'success');
    } else {
      console.log('\x1b[31m', 'failed');
    }
  }

  console.log('adding shows to database');
  shows.forEach(show => show.save(db));
}, true);

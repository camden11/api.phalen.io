const Spotify = require('../api/Spotify');

(async () => {
  await Spotify.getAccessToken();
  const tracks = await Spotify.getAllTracks();
  console.log(tracks.length);
})();

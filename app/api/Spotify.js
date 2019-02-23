const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

class Spotify {
  constructor() {
    this.accessToken = null;
  }

  async getAccessToken() {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    });
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      body: body,
    });
    const data = await response.json();
    this.accessToken = data.access_token;
  }

  async getAllTracks() {
    if (!this.accessToken) {
      throw 'Must get access token first';
    }
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    let uri = `https://api.spotify.com/v1/me/tracks?limit=50`;
    let tracks = [];
    while (uri) {
      const response = await fetch(uri, {
        method: 'get',
        headers,
      });
      const data = await response.json();
      data.items.forEach(item => {
        tracks.push(item.track);
      });
      uri = data.next;
    }
    return tracks;
  }

  async getArtistGenres(artistId) {
    if (!this.accessToken) {
      throw 'Must get access token first';
    }
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    const uri = `https://api.spotify.com/v1/artists/${artistId}`;
    const response = await fetch(uri, { method: 'get', headers });
    const data = await response.json();
    return data.genres;
  }
}

module.exports = new Spotify();

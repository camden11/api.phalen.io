const fetch = require('node-fetch');

const ARTIST_SEARCH_URI =
  'https://api.songkick.com/api/3.0/search/artists.json';
const LOCATION_SEARCH_URI =
  'https://api.songkick.com/api/3.0/search/locations.json';

class Songkick {
  formatSearchQueryUri(base, artistName) {
    const apiKey = process.env.SONGKICK_API_KEY;
    return encodeURI(`${base}?apikey=${apiKey}&query="${artistName}"`);
  }

  formatArtistCalendarUri(artistId) {
    const apiKey = process.env.SONGKICK_API_KEY;
    return `https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=${apiKey}`;
  }

  async getArtistId(artistName) {
    const response = await fetch(
      this.formatSearchQueryUri(ARTIST_SEARCH_URI, artistName),
      {
        method: 'get',
      }
    );
    const data = await response.json();
    if (data.resultsPage.results && data.resultsPage.results.artist) {
      return data.resultsPage.results.artist[0].id;
    }
    return null;
  }

  async getLocationData(locationName) {
    const response = await fetch(
      this.formatSearchQueryUri(LOCATION_SEARCH_URI, locationName)
    );
    const data = await response.json();
    if (data.resultsPage.results && data.resultsPage.results.location) {
      return data.resultsPage.results.location[0].metroArea;
    }
    return null;
  }

  async getShowsForArtist(artistId) {
    const response = await fetch(this.formatArtistCalendarUri(artistId));
    const data = await response.json();
    if (data.resultsPage.results && data.resultsPage.results.event) {
      return data.resultsPage.results.event;
    }
    return [];
  }
}

module.exports = new Songkick();

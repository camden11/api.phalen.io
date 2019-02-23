const fetch = require('node-fetch');

class Songkick {
  formatRequestUri(artistName) {
    const baseUrl = 'https://api.songkick.com/api/3.0/search/artists.json';
    const apiKey = process.env.SONGKICK_API_KEY;
    return encodeURI(`${baseUrl}?apikey=${apiKey}&query="${artistName}"`);
  }
  async getArtistId(artistName) {
    const response = await fetch(this.formatRequestUri(artistName), {
      method: 'get',
    });
    const data = await response.json();
    if (data.resultsPage.results && data.resultsPage.results.artist) {
      return data.resultsPage.results.artist[0].id;
    }
    return null;
  }
}

module.exports = new Songkick();

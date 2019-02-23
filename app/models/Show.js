class Show {
  constructor(data) {
    this.data = data;
  }

  static fromApiData(songkickData, artist, genre) {
    return new Show({
      artist,
      time: songkickData.start.time,
      venue: songkickData.venue.displayName,
      venueSize: 'placeholder',
      genre,
      eventId: songkickData.id,
      locationId: songkickData.venue.metroArea.id,
    });
  }

  save(db) {
    const { data } = this;
    db.collection('shows').updateOne(
      { eventId: data.eventId },
      data,
      {
        upsert: true,
      },
      err => {
        if (err) {
          console.log('db error');
          console.log(err);
        } else {
          console.log('artist db updated');
        }
      }
    );
  }
}

module.exports = Show;

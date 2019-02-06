require('dotenv').config();
const express = require('express');
let cors = require('cors');
const connectDatabase = require('./app/db');
const bodyParser = require('body-parser');

const routes = require('./app/routes');

const Spotify = require('./app/api/Spotify');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

connectDatabase(db => {
  routes(app, db);
  app.listen(port, () => {
    console.log('Up and running on localhost:' + port);
  });
});

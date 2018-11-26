const express = require('express');
let cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const routes = require('./app/routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

MongoClient.connect(
  process.env.DB_URL,
  (err, database) => {
    if (err) {
      return console.log(err);
    }
    const db = database.db(process.env.DB_NAME);
    routes(app, db);
    app.listen(port, () => {
      console.log('Up and running on localhost:' + port);
    });
  }
);

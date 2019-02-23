const MongoClient = require('mongodb').MongoClient;

const connectDatabase = (callback, script = false) => {
  MongoClient.connect(
    process.env.DB_URL,
    async (err, database) => {
      if (err) {
        return console.log(err);
      }
      const db = database.db(process.env.DB_NAME);
      if (script) {
        await callback(db);
        return db.close();
      }
      callback(db);
    }
  );
};

module.exports = connectDatabase;

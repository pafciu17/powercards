const url = 'mongodb://localhost:27017/powercards';
const MongoClient = require('mongodb').MongoClient;

const init = () => new Promise((resolve, reject) => {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      reject(err);
    } else {
      const powerdecks = db.collection('powerdecks');
      const powercards = db.collection('powercards');
      resolve({
        db,
        powerdecks,
        powercards
      });
    }
  });
});

module.exports = init
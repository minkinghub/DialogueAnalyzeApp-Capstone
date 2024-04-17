const mongoose = require('mongoose');

const connectToMongoDB = () => {
  mongoose.connect(process.env.DB_ROUTE);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB 연결 오류:'));

  return db;
};

module.exports = {
  connectToMongoDB
}
const mongoose = require("mongoose");

exports.mongoDB = () => {
  mongoose
  .connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch(() => console.log("mongodb connection failed"));  
}
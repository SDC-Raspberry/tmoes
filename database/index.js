// Databse initialization
const mongoose = require("mongoose");
const dbName = "atelier";

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const { Questions, Answers, AnswersPhotos } = require('./mongoSchema.js');

// ------------- CONNECT TO DB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Initialized MongoDB: " + dbName+ '\n');

});

db.disconnect = () => {
  mongoose.disconnect();
};

module.exports.db = db;
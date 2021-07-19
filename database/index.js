// Databse initialization
const mongoose = require("mongoose");
const dbName = "atelier";

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ------------- SCHEMAS/MODELS
const Schema = mongoose.Schema;

// ------------- QUESTIONS schema/model
const QuestionsSchema = new Schema({
  id: Number,
  product_id: Number,
  body: String,
  date_written: Date,
  asker_name: String,
  asker_email: String,
  reported: Number,
  helpful: Number
});

const QuestionsModel = mongoose.model('questions', QuestionsSchema);

// ------------- ANSWERS schema/model
const AnswersSchema = new Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Date,
  answerer_name: String,
  answerer_email: String,
  reported: Number,
  helpful: Number,
});

const AnswersModel = mongoose.model('answers', AnswersSchema);

// ------------- PHOTOS schema/model
const AnswersPhotosSchema = new Schema({
  id: Number,
  answer_id: Number,
  url: String
});

const AnswersPhotosModel = mongoose.model('answers_photos', AnswersPhotosSchema);

// HELPER FUNCTIONS
/*
  View questions
    2 q's for default
    2 answers for default
    Get more questions button
    questions should appear in order of helpfulness
  Search for a questions
  Ask a question
  Answer a question
*/

// QUERY FUNCTIONS

// CONNECT TO DB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Initialized MongoDB: " + dbName);



});


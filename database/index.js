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

// ------------- HELPER FUNCTIONS
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

// ------------- QUERY FUNCTIONS
const getQuestions = (product_id, callback) => {
  db.find({product_id: `${product_id}`}).sort({id: 1}).exec((err, questions) => {
    if (err) {
      console.error.bind(console, "Error retrieving questions");
      callback(null);
    } else {
      let questionsData = [];
      questions.forEach(question => {
        let formatDate = (d) => {
          var m = d.match(/\/Date\((\d+)\)\//);
          return m ? (new Date(+m[1])).toLocalDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : d;
        };
        let transformedDate = formatDate("/Date("+question.date_written+")/");
        questionsData.push(
          question_id: question.id,
          product_id: question.product_id,
          body: question.body,
          date_written: transformedDate,
          asker_name: question.asker_name,
          asker_email: question.asker_email,
          reported: question.reported,
          helpful: question.helpful
        )
      });
      callback(questionsData);
    }
  });
};



// ------------- CONNECT TO DB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Initialized MongoDB: " + dbName);



});


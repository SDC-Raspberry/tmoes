var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// ------------- QUESTIONS
var QuestionsSchema = new Schema({
  question_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  reported: Number
});

var QuestionsModel = mongoose.model('QuestionsModel', QuestionsSchema);

// ------------- ANSWERS
var AnswersSchema = new Schema({
  answer_id: Number,
  question_id: Number,
  answer_body: String,
  answer_date: Date,
  answer_name: String,
  helpfulness: Number,
  photos:
  [
    {
      photo_id: Number,
      photo_url: String
    }
  ]
});

var AnswersModel = mongoose.model('AnswersModel', AnswersSchema);

// ------------- PHOTOS
var PhotoSchema = new Schema({
  answer_id: Number,
  photo_id: Number,
  photo_url: String
});

var PhotoModel = mongoose.model('PhotoModel', PhotoSchema);
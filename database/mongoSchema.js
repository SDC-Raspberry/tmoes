var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// ------------- QUESTIONS
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

  const Questions = mongoose.model('questions', QuestionsSchema);

  // ------------- ANSWERS
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

  const Answers = mongoose.model('answers', AnswersSchema);

  // ------------- PHOTOS
  const AnswersPhotosSchema = new Schema({
    id: Number,
    answer_id: Number,
    url: String
  });

  const AnswersPhotos = mongoose.model('answers_photos', AnswersPhotosSchema);

// ------------- MONGO INDEXING
  // Create an index for questions attached to each product id
  // Create an index for answers attached to each question
  // Create an index for photos attached to each answer

module.exports.Questions = Questions;
module.exports.Answers = Answers;
module.exports.AnswersPhotos = AnswersPhotos;

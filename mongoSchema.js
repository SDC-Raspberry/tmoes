var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/atelier', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

var Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'Error connecting to database'));

db.once('open', function() {
// ------------- QUESTIONS
  var QuestionsSchema = new Schema({
    id: Number,
    product_id: Number,
    body: String,
    date_written: Date,
    asker_name: String,
    asker_email: String,
    reported: Number,
    helpful: Number
  });

  var QuestionsModel = mongoose.model('QuestionsModel', QuestionsSchema);

  // ------------- ANSWERS
  var AnswersSchema = new Schema({
    id: Number,
    question_id: Number,
    body: String,
    date_written: Date,
    answerer_name: String,
    answerer_email: String,
    reported: Number,
    helpful: Number,
  });

  var AnswersModel = mongoose.model('AnswersModel', AnswersSchema);

  // ------------- PHOTOS
  var AnswersPhotosSchema = new Schema({
    id: Number,
    answer_id: Number,
    url: String
  });

  var AnswersPhotosModel = mongoose.model('AnswersPhotosModel', AnswersPhotosSchema);
});


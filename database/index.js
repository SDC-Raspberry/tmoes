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

const formatDate = (d) => {
  var m = d.match(/\/Date\((\d+)\)\//);
  return m ? (new Date(+m[1])).toLocalDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : d;
};


// ------------- QUERY FUNCTIONS
const getQuestions = async (product_id, callback) => {
  db.questions.find({product_id: `${product_id}`}).exec((err, questions) => {
    if (err) {
      console.error.bind(console, "Error retrieving questions: " + err);
      callback(err);
    } else {
      let questionsData = [];
      questions.forEach(question => {
        let transformedDate = formatDate("/Date("+question.date_written+")/");
        questionsData.push({
          question_id: question.id,
          product_id: question.product_id,
          body: question.body,
          date_written: transformedDate,
          asker_name: question.asker_name,
          asker_email: question.asker_email,
          reported: question.reported,
          helpful: question.helpful
        })
      });
      callback(questionsData);
    }
  });
};

const saveQuestion = async (data, callback) => {
  return new Promise ((resolve, reject) => {
    // Get highest question id for specific product and increment by 1
    let newQuestionId = db.questions.find({product_id: data.data.product_id}).sort({id: -1}).limit(1)
      .then(() => {
        let document = {
          id: newQuestionId + 1,
          product_id: data.data.product_id,
          body: data.data.body,
          date_written: Date.now(),
          asker_name: data.data.anme,
          asker_email: data.data.email,
          reported: 0,
          helpful: 0
        };
        db.questions.insertOne(document)
          .then(() => {
            resolve('Successfully saved question');
          });
      })
      .catch((err) => {
        console.error.bind(console, "Error saving question: " + err);
        reject(err);
      })
  });
  callback();
}

const getAnswers = async (question_id, callback) => {
  db.answers.find({question_id: `${question_id}`}).exec((err, questions) => {
    if (err) {
      console.error.bind(console, "Error retrieving answers: " + err);
      callback(err);
    } else {
      let answerData = [];
      questions.forEach(answer => {
        let transformedDate = formatDate("/Date("+answer.date_written+")/");
        answerData.push({
          answer_id: answer.id,
          question_id: answer.question_id,
          body: answer.body,
          date_written: transformedDate,
          answerer_name: answer.answerer_name,
          answerer_email: answer.answerer_email,
          reported: answer.reported,
          helpful: answer.helpful,
          photos: []
        })
      });
    }
  })
    .then(() => {
      let photos = [];
      answerData.forEach(answer => {
        db.answer_photos.find({answer_id: answer.answer_id}).exec( (err, pics) => {
          if (err) {
            console.error.bind(console, "Error retrieving answer photos: " + err);
            callback(err);
          } else {
            pics.forEach((pic) => {
              photos.push({
                id: pic.id,
                answer_id: pic.answer_id,
                url: pic.url
              })
            })
          }
        })
      });
      return photos;
    })
    .then((pics) => {
      for (let i = 0; i < answerData.length; i++) {
        for (let j = 0; j < pics.length; j++) {
          if (answerData[i].answer_id === pics[j].answer_id) {
            answerData[i].photos.push(pics[j]);
          }
        }
      }
    });
  callback(answerData);
};


// ------------- CONNECT TO DB
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to database"));
db.once("open", () => {
  console.log("Initialized MongoDB: " + dbName);



});

module.exports.getQuestions = getQuestions;
module.exports.saveQuestion = saveQuestion;
module.exports.getAnswers = getAnswers;
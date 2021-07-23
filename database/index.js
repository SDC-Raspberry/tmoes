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
  return new Date(d).toISOString();
};

// ------------- MONGO INDEXING
  // Create an index for questions attached to each product id
  // Create an index for answers attached to each question
  // Create an index for photos attached to each answer


// ------------- QUERY FUNCTIONS
// I NEED TO RETHINK ALL OF THIS, MAYBE DO THE WORK ON THE SERVER SIDE
const getQuestions = async (product_id, callback) => {
  // NEED TO FORMAT PROPERLY STILL
  let finalData = {
    product_id: product_id
  };
  let results = [];
  db.questions.find({product_id: product_id}).exec((err, questions) => {
    if (err) {
      throw new Error(err);
      callback(err);
    } else {
      let questionsData = [];
      questions.forEach(question => {
        if (question.reported < 1) {
          let transformedDate = formatDate(question.date_written);
          questionsData.push({
            question_id: question.id,
            question_body: question.body,
            question_date: transformedDate,
            asker_name: question.asker_name,
            question_helpfulness: question.helpful,
            reported: false,
            answers: {}
          })
        }
      });
    }
    return questionsData;
  })
    .then((questions) => {
      // iterate through array of questions
        // retrieve answers for each question and add to asnwers obj by answer_id
      questions.forEach(question => {
        getAnswers(question.question_id, (overallData) => {
          // Answer data comes back with the properties question_id, results which is array of answers for each specific question
          // Extract answer data and add to answers
          overallData.results.forEach(answer => {
            let answer_id = answer.answer_id;
            questionsData.answers.answer_id = answer;
          });
        });
      });
      callback(questionsData);
    })
    .catch((err) => {
      console.log(err);
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
        callback(err);
      })
  });
  callback();
}

const getAnswers = async (question_id, callback = () => {}) => {
  // Need to figure out pagination and count still, hardcoded for now
  let overallData = {
    question: question_id,
    page: 0,
    count: 5,
  }
  db.answers.find({question_id: `${question_id}`}).exec((err, answers) => {
    if (err) {
      throw new Error(err);
      callback(err);
    } else {
      let answerData = [];
      answers.forEach(answer => {
        let transformedDate = formatDate(answer.date_written);
        if (answer.reported < 1) {
          answerData.push({
            answer_id: answer.id,
            body: answer.body,
            date: transformedDate,
            answerer_name: answer.answerer_name,
            helpfulness: answer.helpful,
            photos: []
          });
        }
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
      overallData.results = answerData;
      callback(overallData);
    })
    .catch((err) => {
      console.log(err);
    });
};

const saveAnswer = (data, question_id, callback) => {
  // Save answer to answer db
  data.data.body   name  email  photos
  db.answers.insert
  // Save photos to answers_photos db
  return new Promise ((resolve, reject) => {
    // Get highest answer id for specific product and increment by 1
    let newAnswerId = db.answers.find({product_id: data.data.product_id}).sort({id: -1}).limit(1)
      .then(() => {
        let document = {
          id: newAnswerId + 1,
          question_id: question_id,
          body: data.data.body,
          date_written: Date.now(),
          answerer_name: data.data.anme,
          answerer_email: data.data.email,
          reported: 0,
          helpful: 0
        };
        db.answers.insertOne(document)
          .then(() => {
            resolve('Successfully saved question');
          });
      })
      .catch((err) => {
        console.error.bind(console, "Error saving question: " + err);
        reject(err);
        callback(err);
      })
  });
  callback();
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
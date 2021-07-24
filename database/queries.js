const { Questions, Answers, AnswersPhotos } = require('./mongoSchema.js');

// ------------- HELPER FUNCTIONS
const formatDate = (d) => {
  return new Date(d).toISOString();
};

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
      callback(null, questionsData);
    })
    .catch((err) => {
      callback(err, null);
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
            callback(null, 'Successfully saved question!');
          });
      })
      .catch((err) => {
        reject(err);
        callback(err, null);
      })
  });
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
            throw new Error(err);
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
      callback(null, overallData);
    })
    .catch((err) => {
      callback(err, null);
    });
};

const saveAnswer = async (data, question_id, callback) => {
  // Save answer to answer db
  // Save photos to answers_photos db
  return new Promise ((resolve, reject) => {
    // Get highest answer id for specific product and increment by 1
    let newAnswerId = db.answers.find({question_id: question_id}).sort({id: -1}).limit(1)
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
        db.answers.insertOne(document);
        let newPhotoId = db.answers_photos.find({}).sort({id: -1}).limit(1)
          .then(() => {
            let photoDocument =  {
              id: newPhotoId + 1,
              answer_id: newAnswerId + 1,
              url: data.data.photos
            }
            db.answers_photos.insert(photoDocument);
          });
        resolve('Successfully saved answer');
        callback(null, 'Successfully saved answer!');
      })
      .catch((err) => {
        reject(err);
        callback(err, null);
      })
  });
};

const markQuestionHelpful = (question_id, callback) => {
  db.questions.update({ id: question_id }, {$inc: { helpful: 1 }})
    .then((returnedData) => {
      if (returnedData !== 1) {
        throw new Error('Error updating question helpfulness');
      } else {
        callback(null, data);
      }
    })
    .catch((err) => {
      callback(err, null);
    });
};

const markAnswerHelpful = (answer_id, callback) => {
  db.answers.update({ id: answer_id }, {$inc: { helpful: 1 }})
    .then((returnedData) => {
      if (returnedData !== 1) {
        throw new Error('Error updating question helpfulness');
      } else {
        callback(null, data);
      }
    })
    .catch((err) => {
      callback(err, null);
    });
};

const reportQuestion = (question_id, callback) => {
  db.questions.update({ id: question_id }, {$inc: { reported: 1 }})
    .then((returnedData) => {
      if (returnedData !== 1) {
        throw new Error('Error updating question helpfulness');
      } else {
        callback(null, data);
      }
    })
    .catch((err) => {
      callback(err, null);
    });
};

const reportAnswer = (answer_id, callback) => {
  db.answers.update({ id: answer_id }, {$inc: { reported: 1 }})
    .then((returnedData) => {
      if (returnedData !== 1) {
        throw new Error('Error updating question helpfulness');
      } else {
        callback(null, data);
      }
    })
    .catch((err) => {
      callback(err, null);
    });
};

module.exports.getQuestions = getQuestions;
module.exports.saveQuestion = saveQuestion;
module.exports.getAnswers = getAnswers;
module.exports.saveAnswer = saveAnswer;
module.exports.markQuestionHelpful = markQuestionHelpful;
module.exports.markAnswerHelpful = markAnswerHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.reportAnswer = reportAnswer;
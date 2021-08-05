const { Questions, Answers, AnswersPhotos } = require('./mongoSchema.js');

// ------------- HELPER FUNCTIONS
const formatDate = (d) => {
  return new Date(d).toISOString();
};

// ------------- QUERY FUNCTIONS
const getQuestions = async (product_id, callback, page = 1, count = 100) => {
  // NEED TO FORMAT PROPERLY STILL
  // NEED TO HANDLE PAGE, COUNT STILL
  let finalData = {
    product_id: product_id
  };
  let results = [];
  const questionQuery = Questions.find()
    .where({ product_id: product_id})
    .limit(count);

  const questionResults = await questionQuery.lean().exec();
  let questionsData = [];
  questionResults.forEach(question => {
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
      });
    }
  });

  // iterate through array of questions
    // retrieve answers for each question and add to asnwers obj by answer_id
  // for (var i = 0; i < questionsData.length; i++) {
  //   getAnswers(questionsData[i].question_id, (overallData) => {
  //     // Answer data comes back with the properties question_id, results which is array of answers for each specific question
  //     // Extract answer data and add to answers
  //     overallData.results.forEach(answer => {
  //       let answer_id = answer.answer_id;
  //       questionsData.answers[answer_id] = answer;
  //     });
  //   });
  // }


  callback(null, questionsData);
};

const saveQuestion = (data, callback) => {
  return new Promise (async (resolve, reject) => {
    // Get highest question id for specific product and increment by 1
    let questionIdQuery = Questions.find()
      .where({product_id: data.data.product_id})
      .sort({id: -1})
      .limit(1);
    let newQuestionId = await questionIdQuery.lean().exec();

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
    let questionInsertQuery = Questions.insertOne(document);
    let successfulPut = await questionInsertQuery.exec();
    successfulPut ? callback(null, 'Successfully added question') : callback(err, null);
  });
}

const getAnswers = async (question_id, callback = () => {}, page = 1, count = 100) => {
  // Need to figure out pagination and count still, hardcoded for now
  let overallData = {
    question: question_id,
    page: 0,
    count: 5,
    results: []
  }
  const answersQuery = Answers.find()
    .where({ question_id: question_id})
    .limit(count)

  let answers = await answersQuery.lean().exec();

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

  let photos = [];
  for (let i = 0; i < answerData.length; i++) {
    let answerPhotos = AnswersPhotos.find()
      .where({answer_id: answerData[i].answer_id});
    let pics = await answerPhotos.lean().exec();
    pics.forEach((pic) => {
      photos.push({
        id: pic.id,
        answer_id: pic.answer_id,
        url: pic.url
      });
    });
  }
  console.log('photos', photos);

  for (let i = 0; i < answerData.length; i++) {
    for (let j = 0; j < photos.length; j++) {
      if (answerData[i].answer_id === photos[j].answer_id) {
        answerData[i].photos.push({id: photos[j].id, url: photos[j].url});
      }
    }
  }

  console.log('overallData.results', overallData.results);

  overallData.results = answerData;
  callback(null, overallData);
};

const saveAnswer = (data, question_id, callback) => {
  // Save answer to answer db
  // Save photos to answers_photos db
  return new Promise (async (resolve, reject) => {
    // Get highest answer id for specific product and increment by 1
    let newAnswerIdQuery = Answers.find({question_id: question_id}).sort({id: -1}).limit(1);
    let newAnswerId = await newAnswerQuery();
      let document = {
        id: newAnswerId + 1,
        question_id: question_id,
        body: data.data.body,
        date_written: Date.now(),
        answerer_name: data.data.name,
        answerer_email: data.data.email,
        reported: 0,
        helpful: 0
      };
      let answersQuery = Answers.insertOne(document);
      let successfulPut = await answersQuery();
      successfulPut ? callback(null, 'Successfully added answer') : callback(err, null);
  });
};

const markQuestionHelpful = async (question_id, callback) => {
  let updateQuery = Questions.update({id: question_id}, {$inc: { helpful: 1 }});
  let successfulPut = await updateQuery();
  successfulPut === 1 ? callback(null, 'Successfully updated question') : callback(err, null);
};

const markAnswerHelpful = async (answer_id, callback) => {
  let updateQuery = Questions.update({id: answer_id}, {$inc: { helpful: 1 }});
  let successfulPut = await updateQuery();
  successfulPut === 1 ? callback(null, 'Successfully updated answer') : callback(err, null);
};

const reportQuestion = async (question_id, callback) => {
  let updateQuery = Questions.update({id: question_id}, {$inc: { reported: 1 }});
  let successfulPut = await updateQuery();
  successfulPut > 0 ? callback(null, 'Successfully updated question') : callback(err, null);
};

const reportAnswer = async (answer_id, callback) => {
  let updateQuery = Questions.update({id: answer_id}, {$inc: { reported: 1 }});
  let successfulPut = await updateQuery();
  successfulPut > 0 ? callback(null, 'Successfully updated answer') : callback(err, null);
};

module.exports.getQuestions = getQuestions;
module.exports.saveQuestion = saveQuestion;
module.exports.getAnswers = getAnswers;
module.exports.saveAnswer = saveAnswer;
module.exports.markQuestionHelpful = markQuestionHelpful;
module.exports.markAnswerHelpful = markAnswerHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.reportAnswer = reportAnswer;
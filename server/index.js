const express = require('express');
const app = express();
const parser = require('body-parser');
const port = 3000;
const db = require('../database/index.js');

// const baseURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';

// app.get('/', (req, res) => res.send('Message from Express route handler: Test!'));

// Mounting Middleware
app.use(express.static(__dirname + '/../client/dist'));
app.use(parser.json());
app.use(express.urlencoded({extended: true}));

app.get('/qa/questions', (req, res) => {
  // Get all questions from db with that product id, return to app
  db.getQuestions((req.query.product_id, (data) => {
    res.send(data);
  }));
});

app.post('/qa/questions', (req, res) => {
  // Add question to db that includes question id, body, etc
  db.saveQuestion(req.body, () => {
    res.send();
  })
});

app.get('/qa/answers', (req, res) => {
  // Get all answers with coreesponding question id, return to app
  db.getAnswers(req.query.question_id, (data) => {
    res.send(data);
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  //Add answer to db that includes question id, body, etc
  let question_id = req.params.question_id;
  db.saveAnswer(req.body, question_id, () => {
    res.send();
  });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  // Increment helpful document for question
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  // Increment helpful document of answer
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  // If question hasn't been reported, report it

});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  // If answer is not reported already, report it
});

app.post('/qa/photos', (req, res) => {
  // Add photo document to db including answer id and url
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
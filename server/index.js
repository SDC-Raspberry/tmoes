const express = require('express');
const app = express();
const port = 3000;
const db = require('../database/index.js');

// const baseURL = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp';

// app.get('/', (req, res) => res.send('Message from Express route handler: Test!'));

app.get('/qa/questions?product_id', (req, res) => {
  // Get all questions from db with that product id, return to app
});

app.post('/qa/questions', (req, res) => {
  // Add question to db that includes question id, body, etc
});

app.get('/qa/answers?question_id', (req, res) => {
  // Get all answers with coreesponding question id, return to app
});

app.post('/qa/questions/question_id/answers', (req, res) => { // question_id is not correct
  //Add answer to db that includes question id, body, etc
});

app.put('/qa/questions/question_id/helpful', (req, res) => { //question_id is not correct
  // Increment helpful document for question
});

app.put('/qa/answers/answer_id/helpful', (req, res) => { //answer_id is not correct
  // Increment helpful document of answer
});

app.put('/qa/questions/question_id/report', (req, res) => { // question_id is not correct
  // If question hasn't been reported, report it

});

app.put('/qa/answers/answer.id/report', (req, res) => { //answer.id is not correct
  // If answer is not reported already, report it
});

app.post('/qa/photos', (req, res) => {
  // Add photo document to db including answer id and url
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
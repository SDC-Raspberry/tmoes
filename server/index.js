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
  db.getQuestions(req.query.product_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.post('/qa/questions', (req, res) => {
  db.saveQuestion(req.body, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  })
});

app.get('/qa/answers', (req, res) => {
  db.getAnswers(req.query.question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  //Add answer to db that includes question id, body, etc
  let question_id = req.params.question_id;
  db.saveAnswer(req.body, question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  // Increment helpful document for question
  let question_id = req.params.question_id;
  db.markQuestionHelpful(question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
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

app.listen(port, () => console.log(`App listening on port ${port}!`));
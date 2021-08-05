const express = require('express');
const parser = require('body-parser');

const app = express();
const port = 3000;
const db = require('../database/index.js');
const query = require('../database/queries.js');

// Mounting Middleware
app.use(express.static(__dirname + '/../client/dist'));
app.use(parser.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/qa/questions', (req, res) => {
  query.getQuestions(req.query.product_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.post('/qa/questions', (req, res) => {
  query.saveQuestion(req.body, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  })
});

app.get('/qa/answers', (req, res) => {
  query.getAnswers(req.query.question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  let question_id = req.params.question_id;
  query.saveAnswer(req.body, question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let question_id = req.params.question_id;
  query.markQuestionHelpful(question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let answer_id = req.params.answer_id;
  query.markAnswerHelpful(answer_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  let question_id = req.params.question_id;
  query.reportQuestion(question_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  let answer_id = req.params.answer_id;
  query.reportAnswer(answer_id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

const server = app.listen(port, () => console.log(`App listening on port ${port}!\n`));

module.exports.db = db;
module.exports.server = server;
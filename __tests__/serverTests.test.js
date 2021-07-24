const axios = require('axios');
const { assert, expect } = require('chai');
const mongoose = require('mongoose');
const { sampleQuestionsAPIData, sampleAnswersAPIData, sampleQuestionsDBData, sampleAnswersDBData, sampleAnswersPhotosDBData } = require('../sampleData.js');
const { Questions, Answers, AnswersPhotos } = require('../database/mongoSchema.js');

let server, db;

describe('Server Tests', () => {
  beforeEach((done) => {
    const app = require('../server/index.js');
    server = app.server;
    const database = require('../database/index.js');
    db = database.db;
    done();
  });

  describe('GET /qa/questions', (done) => {
    it('should get the expected shape of data from the query', () => {
      return axios.get('http://localhost:3000/qa/questions?product_id=1')
        .then(response => {
          expect(response.data).to.be.a('object');
          assert.property(response.data, 'question', 'has property "question"');
          assert.property(response.data,'page', 'has property "page"');
          assert.property(response.data, 'count', 'has property "count"');
          assert.property(response.data, 'results', 'has property "results"');

          const results = response.data.results;
          assert.isArray(results);
          assert.property(results[0], 'answer_id', 'results[0] has property "answer_id"');
          assert.property(results[0], 'body', 'results[0] has property "body"');
          assert.property(results[0], 'date', 'results[0] has property "date"');
          assert.property(results[0], 'answerer_name', 'results[0] has property "answerer_name"');
          assert.property(results[0], 'helpfulness', 'results[0] has property "helpfulness"');
          assert.property(results[0], 'photos', 'results[0] has property "photos"');

          assert.isArray(results[0].photos);
          done();
        })
        .catch(() => done);
    });

  });

  // describe('POST /qa/questions', () => {

  // });

  // describe('GET /qa/answers', () => {
  //   it('should get the expected shape of data from the query', () => {

  //   });
  // });

  // describe('POST /qa/questions/:question_id/answers', () => {

  // });

  // describe('PUT /qa/questions/:question_id/helpful', () => {

  // });

  // describe('PUT /qa/answers/:answer_id/helpful', () => {

  // });

  // describe('PUT /qa/questions/:question_id/report', () => {

  // });

  // describe('PUT /qa/answers/:answer_id/report', () => {

  // });

  afterEach((done) => {
    db.disconnect();
    server.close();
    done();
  });

});
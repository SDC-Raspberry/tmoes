const axios = require('axios');
const assert = require('chai').assert;
const mongoose = require('mongoose');
const { sampleQuestionsAPIData, sampleAnswersAPIData, sampleQuestionsDBData, sampleAnswersDBData, sampleAnswersPhotosDBData } = require('./sampleData.js');
const { Questions, Answers, AnswersPhotos } = require('../database/mongoSchema.js');

let server, db;

describe('Server Tests', () => {
  before((done) => {
    const app = require('../server/index.js');
    server = app.server;
    db = app.db
    done();
  }
})
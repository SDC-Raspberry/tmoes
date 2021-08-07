const { assert, expect } = require('chai');
const mongoose = require('mongoose');
const dbName = 'testAtelier';
const { Questions, Answers, AnswersPhotos } = require('../database/mongoSchema.js');
const query = require('../database/queries');
const { sampleQuestionsAPIData, sampleAnswersAPIData, sampleQuestionsDBData, sampleAnswersDBData } = require('../sampleData.js');

describe("Queries Tests", () => {
  beforeEach((done) => {
    mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    // db.on('error', throw new Error(error));
    db.once('open', done);
  });

  // Describe statements here...

  afterEach((done) => {
    mongoose.disconnect();
    done();
  });
});
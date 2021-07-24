const sampleQuestionsAPIData = {

};

const sampleAnswersAPIData = {

};

const sampleQuestionsDBData = {
	"_id" : ObjectId("60f24207e10103d8fd40ff94"),
	"id" : 1,
	"product_id" : 1,
	"body" : "What fabric is the top made of?",
	"date_written" : NumberLong("1595884714409"),
	"asker_name" : "yankeelover",
	"asker_email" : "first.last@gmail.com",
	"reported" : 0,
	"helpful" : 1
};

const sampleAnswersDBData = {
	"_id" : ObjectId("60f243c827effd4c48703b4f"),
	"id" : 1,
	"question_id" : 36,
	"body" : "Supposedly suede, but I think its synthetic",
	"date_written" : NumberLong("1599958385988"),
	"answerer_name" : "sillyguy",
	"answerer_email" : "first.last@gmail.com",
	"reported" : 0,
	"helpful" : 1
};

const sampleAnswersPhotosDBData = {
  "_id" : ObjectId("60f244bd6fa4860d434ec17c"),
  "id" : 2,
  "answer_id" : 5,
  "url" : "https://images.unsplash.com/photo-1511127088257-53ccfcc769fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
};

module.exports.sampleQuestionsAPIData = sampleQuestionsAPIData;
module.exports.sampleAnswersAPIData = sampleAnswersAPIData;
module.exports.sampleQuestionsDBData = sampleQuestionsDBData;
module.exports.sampleAnswersDBData = sampleAnswersDBData;
module.exports.sampleAnswersPhotosDBData = sampleAnswersPhotosDBData;
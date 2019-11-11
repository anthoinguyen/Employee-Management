var mongoose = require("mongoose");
var moment = require("moment");

var documents = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  createdDate: {
    type: Date,
    default: new Date(moment().utc(7))
  },
  documentName: { type: String },
  documentLink: { type: String },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "typeOfDocuments"
  },
  documentLocalLink: { type: String },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = documents;

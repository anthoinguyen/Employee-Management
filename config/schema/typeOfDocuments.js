var mongoose = require("mongoose");

var typeOfDocuments = new mongoose.Schema({
  name: { type: String }
});

module.exports = typeOfDocuments;

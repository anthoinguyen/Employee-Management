var mongoose = require("mongoose");

var courseYear = new mongoose.Schema({
  courseYear: { type: String }
});

module.exports = courseYear;

var mongoose = require("mongoose");
var moment = require("moment");

var news = new mongoose.Schema({
  title: {
    type: String
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  attached: {
    type: String
  },
  createdDate: {
    type: Date,
    default: new Date()
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = news;

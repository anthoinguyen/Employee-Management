var mongoose = require("mongoose");

var settings = new mongoose.Schema({
  luongCoBan: {
    type: Number
  }
});

module.exports = settings;

var mongoose = require("mongoose");

var solution = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  ten: {
    type: String
  },
  nam: {
    type: Number
  },
  loai: {
    type: String
  },
  xepLoai: {
    type: String
  },
  cap: {
    type: String
  },
  ghiChu: {
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = solution;

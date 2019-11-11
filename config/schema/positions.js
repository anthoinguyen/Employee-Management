var mongoose = require("mongoose");

var positions = new mongoose.Schema({
  positionId: {
    type: String
  },
  name: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  description: {
    type: String
  },
  ngayBoNhiem: {
    type: Date
  },
  ngayHetHan: {
    type: Date
  }
});

module.exports = positions;

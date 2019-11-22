var mongoose = require("mongoose");

var discipline = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  quyetDinh: {
    number: {
      type: String
    },
    startedDate: {
      type: String
    },
    endedDate: {
      type: String
    },
    org: {
      type: String
    }
  },
  format: {
    type: String
  },
  description: {
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = discipline;

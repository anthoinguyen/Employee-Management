var mongoose = require("mongoose");

var awards = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  quyetDinh: {
    number: {
      type: String
    },
    date: {
      type: String
    },
    org: {
      type: String
    }
  },
  title: {
    type: String
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

module.exports = awards;

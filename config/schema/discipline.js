var mongoose = require("mongoose");

var discipline = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  quyetDinh: {
    number: {
      // Số QĐ
      type: String
    },
    startedDate: {
      // Ngày hiệu lực
      type: String
    },
    endedDate: {
      // Ngày hết hiệu lực
      type: String
    },
    org: {
      // Cấp ra QĐ
      type: String
    }
  },
  format: {
    // Hình thức
    type: String
  },
  description: {
    // Lý do
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = discipline;

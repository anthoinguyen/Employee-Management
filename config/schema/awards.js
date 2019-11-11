var mongoose = require("mongoose");

var awards = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  quyetDinh: {
    number: {
      // Số QĐ
      type: String
    },
    date: {
      // Ngày ra QĐ
      type: String
    },
    org: {
      // Cấp ra QĐ
      type: String
    }
  },
  title: {
    // Danh hiệu
    type: String
  },
  format: {
    // Hình thức
    type: String
  },
  description: {
    // Thành tích đạt được
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = awards;

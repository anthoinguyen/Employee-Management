var mongoose = require("mongoose");

var solution = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  ten: {
    // Tên đề tài
    type: String
  },
  nam: {
    // Năm
    type: Number
  },
  loai: {
    // Loại đề tài
    type: String
  },
  xepLoai: {
    // Xếp loại
    type: String
  },
  cap: {
    // Cấp
    type: String
  },
  ghiChu: {
    // Ghi chú
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = solution;

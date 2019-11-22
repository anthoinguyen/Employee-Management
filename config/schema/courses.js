var mongoose = require("mongoose");

var courses = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  ten: {
    type: String
  },
  loai: {
    type: String
  },
  noiDung: {
    type: String
  },
  trinhDo: {
    type: String
  },
  diaDiem: {
    type: String
  },
  hinhThuc: {
    type: String
  },
  ngayBatDau: {
    type: String
  },
  ngayKetThuc: {
    type: String
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = courses;

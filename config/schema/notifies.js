var mongoose = require("mongoose");
var moment = require("moment");

var notifies = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  fromName: { type: String, default: "Hệ thống" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: { type: String },
  content: { type: String },
  hasBeenRead: { type: Boolean, default: false },
  createdDate: { type: Date, default: new Date(moment().utc(7)) }
});

module.exports = notifies;

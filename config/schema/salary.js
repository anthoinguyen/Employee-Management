var mongoose = require("mongoose");

var salary = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    autopopulate: true
  },
  ngach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "systemSalary",
    autopopulate: true
  },
  bacHeso: {
    type: Number
  },
  phuCap: [
    {
      soTien: { type: Number },
      moTa: { type: String }
    }
  ],
  ngayBatDau: {
    type: Date
  },
  ngayKetThuc: {
    type: Date
  }
});
salary.plugin(require("mongoose-autopopulate"));
module.exports = salary;

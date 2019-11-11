var mongoose = require("mongoose");

var systemSalary = new mongoose.Schema({
  tenNgach: {
    type: String
  },
  maNgach: {
    type: String
  },
  bangLuong: {
    type: String
  },
  loai: {
    // Loại
    type: String
  },
  nam: {
    // Năm giữ bậc
    type: Number
  },
  bacHeso: [
    {
      bac: { type: Number },
      heso: { type: String }
    }
  ]
});

module.exports = systemSalary;

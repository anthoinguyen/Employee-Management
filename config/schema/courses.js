var mongoose = require("mongoose");

var courses = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  ten: {
    // Tên khóa đào tạo
    type: String
  },
  loai: {
    // Loại đào tạo
    type: String
  },
  noiDung: {
    // Nội dung đào tạo
    type: String
  },
  trinhDo: {
    // Trình độ đào tạo
    type: String
  },
  diaDiem: {
    // Nơi đào tạo
    type: String
  },
  hinhThuc: {
    // Hình thức đào tạo
    type: String
  },
  ngayBatDau: {
    type: String
  },
  ngayKetThuc: {
    type: String
  },
  quyetDinh: {
    so: { type: String }, // Số QĐ
    coQuan: { type: String }, // Cơ quan ra QĐ
    nguoiKy: { type: String }, // Người ký QĐ
    chucDanhNguoiKy: { type: String } // Chức danh người ký
  },
  soLuong: {
    // Số lượng nhân sự dự kiến
    type: Number
  },
  kinhPhi: {
    nguon: { type: String }, // Nguồn kinh phí
    soTien: { type: String } // Số tiền
  },
  confirmed: {
    type: Boolean
  }
});

module.exports = courses;

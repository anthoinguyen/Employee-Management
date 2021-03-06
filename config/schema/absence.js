var mongoose = require("mongoose");

var absence = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    index: {
      unique: true
    }
  },
  name: { type: String },
  usersCardNumber: {
    type: String
  },
  
  typeOfUsers: {
    type: String
  },

  departmentName: {
    type: String
  },
  detail: [
    {
      year: { type: Number },
      totalDateAllow: { type: String },
      absenceDetail: [
        {
          date: { type: Date, default: new Date() },
          isApprove: { type: Boolean },
          reason: { type: String }
        }
      ]
    }
  ]
});

module.exports = absence;

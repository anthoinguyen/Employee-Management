var mongoose = require("mongoose");

var departments = new mongoose.Schema({
  name: {
    type: String
  },
  shortName: {
    type: String
  },
  memberList: [
    {
      name: { type: String },
      usersCardNumber: { type: String },
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      birthday: { type: Date },
      userImage: { type: String },
      isManager: { type: Boolean },
      positionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "positions"
      }
    }
  ]
});

module.exports = departments;

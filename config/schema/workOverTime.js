var mongoose = require("mongoose");

var workOverTime = new mongoose.Schema({
  year: { type: Number },
  month: { type: Number },

  userWorkOverTime: [
    {
      name: { type: String },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      userImage: { type: String },
      usersCardNumber: { type: String },
      dateWorkOverTime: { type: Date },
      timeIn: { type: Date },
      timeOut: { type: Date },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = workOverTime;

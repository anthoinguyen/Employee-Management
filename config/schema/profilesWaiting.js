var mongoose = require("mongoose");

var profilesWaiting = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  newProfiles: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = profilesWaiting;

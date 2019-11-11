var mongoose = require("mongoose");

var newsCategory = new mongoose.Schema({
  year: { type: String },
  category: [
    {
      title: { type: String },
      news: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "news"
          },
          title: { type: String }
        }
      ]
    }
  ]
});

module.exports = newsCategory;

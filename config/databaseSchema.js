var mongoose = require("mongoose");
var schema = require("./schema/index");

module.exports = {
  users: mongoose.model("users", schema.users),
  profilesWaiting: mongoose.model("profilesWaiting", schema.profilesWaiting),
  solution: mongoose.model("solution", schema.solution),
  courses: mongoose.model("courses", schema.courses),
  awards: mongoose.model("awards", schema.awards),
  discipline: mongoose.model("discipline", schema.discipline),
  salary: mongoose.model("salary", schema.salary),
  settings: mongoose.model("settings", schema.settings),
  systemSalary: mongoose.model("systemSalary", schema.systemSalary),
  news: mongoose.model("news", schema.news),
  departments: mongoose.model("departments", schema.departments),
  workOverTime: mongoose.model("workOverTime", schema.workOverTime),
  documents: mongoose.model("documents", schema.documents),
  typeOfDocuments: mongoose.model("typeOfDocuments", schema.typeOfDocuments),
  contract: mongoose.model("contract", schema.contract),
  positions: mongoose.model("positions", schema.positions),
  absence: mongoose.model("absence", schema.absence),
  courseYear: mongoose.model("courseYear", schema.courseYear),
  notifies: mongoose.model("notifies", schema.notifies),
  newsCategory: mongoose.model("newsCategory", schema.newsCategory)
};

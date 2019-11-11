var mongoose = require('mongoose');

module.exports = {
  create: (id, courseYearId, totalDate = 12) => {
    return new Promise((resolve, reject) => {
      mongoose.model('courseYear').findOne({ _id: courseYearId }, (err, result) => {
        if (err) reject(err);
        if (result) {
          let update = {
            $push: {
              year: {
                coursYearId: result._id,
                coursYear: result.coursYear,
                totalDateAllow: totalDate
              }
            }
          }
          let option = { new: true }
          mongoose.model('absence').findOneAndUpdate({ _id: id }, update, option, (err, result) => {
            if (err) reject (err);
            if (result) resolve(result)
          })
        }
      })
    })
  }
}
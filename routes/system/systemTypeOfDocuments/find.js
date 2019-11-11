var mongoose = require('mongoose');
var { success, errorProcess, successWithNoData } = require('../../../services/returnToUsers');

module.exports = router => {
  router.get('/loai-giay-to', async (req, res, next) => {
    mongoose.model('typeOfDocuments').find().exec((err, result) => {
      if (result) {
        return success(res, "Done", result)
      } else {
        return successWithNoData(res, "Done")
      }
    })
  })
}
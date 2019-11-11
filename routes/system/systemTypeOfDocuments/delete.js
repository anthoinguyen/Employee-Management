var mongoose = require('mongoose');
var { success, errorProcess, successWithNoData } = require('../../../services/returnToUsers');
const { check, validationResult } = require("express-validator/check");

module.exports = router => {
  router.delete('/loai-giay-to/:id', async (req, res, next) => {
    try {
      let typeOfDocuments = await mongoose.model('typeOfDocuments').findOneAndDelete({ _id: req.params.id })
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
var mongoose = require('mongoose');
var { success, errorProcess, successWithNoData } = require('../../../services/returnToUsers');
const { check, validationResult } = require("express-validator/check");

module.exports = router => {
  router.put('/loai-giay-to/:id', async (req, res, next) => {
    try {
      let update = {
        name: req.body.name
      }
      let option = { new: true }
      let typeOfDocuments = await mongoose.model('typeOfDocuments').findOneAndUpdate({ _id: req.params.id }, update, option)
      return success(res, "Done", typeOfDocuments)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
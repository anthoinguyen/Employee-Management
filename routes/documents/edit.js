var mongoose = require('mongoose');
var { success, successWithNoData, errorWithMess, errorProcess } = require('../../services/returnToUsers');
const { check, validationResult } = require("express-validator/check");
var uploadFile = require("../../services/uploadFile");
var config = require('../../config');
var _ = require('lodash');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  let checkInput = [
    check('name').not().isEmpty(),
    check('description').not().isEmpty(),
    check('type').not().isEmpty()
  ]
  router.put('/:id', [checkPermission(constants.IS_ADMIN), uploadFile.uploadDocsFile().any(), checkInput], (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let update = {
      ...req.body,
      postedBy: req.user._id,
    }
    let files = {};
    if (!_.isEmpty(req.files)) {
      req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
      files = {
        documentName: req.files[0].filename,
        documentLink: `${config.domain}${req.files[0].link}`,
        documentLocalLink: req.files[0].link,
      }
    }
    mongoose.model('documents').findOneAndUpdate({_id: req.params.id}, Object.assign({}, update, files), { new: true }, (err, result) => {
      if (err) return errorProcess(res, err);
      if (result) {
        console.log(result)
        return success(res, "Done", true)
      } else {
        return success(res, "Done", false)
      }
    })
  })
  
  router.get('/:id', checkPermission(constants.IS_USER), (req, res, next) => {
    mongoose.model('documents').findOne({ _id: req.params.id}, (err, result) => {
      if (err) return errorProcess(res, err);
      if (result) {
        return success(res, "Done", result)
      } else {
        return errorWithMess(res, "Done");
      }
    })
  })
}
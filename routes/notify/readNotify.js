var { success, errorProcess } = require('../../services/returnToUsers');
var mongoose = require('mongoose');
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../services/checkPermission');
var constants = require('../constants');
var _ = require('lodash');

module.exports = router => {
  router.get('/thong-bao/read-all', [checkPermission(constants.IS_USER)], async (req, res, next) => {
    try {
      let query = {
        to: req.user._id,
      }
      let update = {
        hasBeenRead: true
      }
      let option = { new: true }
      let notifies = await mongoose.model('notifies').findOneAndUpdate(query, update, option);
      return success(res, "Done", notifies)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
  router.get('/thong-bao/read/:id', [checkPermission(constants.IS_USER)], async (req, res, next) => {
    try {
      let query = {
        to: req.user._id,
        _id: req.params.id,
      }
      let update = {
        hasBeenRead: true
      }
      let option = { new: true }
      let notifies = await mongoose.model('notifies').findOneAndUpdate(query, update, option);
      return success(res, "Done", notifies)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
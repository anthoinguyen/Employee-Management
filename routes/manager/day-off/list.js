var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');
module.exports = router => {
  router.get('/ngay-nghi', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    let absence = await mongoose.model('absence').find();
    return res.render('manager/day-off', {
      absence: absence,
      roles: req.user.roles
    })
  })

  router.get('/ngay-nghi/:userId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let absence = await mongoose.model('absence').findOne({ userId: req.params.userId });
      return success(res, "Done", absence)
    } catch (err) {
      return errorProcess(res, err)
    }
  })
}
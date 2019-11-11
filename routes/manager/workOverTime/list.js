var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var moment = require('moment');
var constants = require('../../constants');
var { checkPermission } = require('../../../services/checkPermission');

module.exports = router => {
  router.get('/lam-them-gio', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let workOverTime = await mongoose.model('workOverTime').find();
      return res.render('manager/workOverTime', {
        workOverTime: workOverTime,
        roles: req.user.roles
      })
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
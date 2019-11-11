var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  router.get('/khoa-phong/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let departments = await mongoose.model('departments').findOne({ _id: req.params.id });
      return success(res, "Done", departments)
    } catch (err) {
      return errorProcess(res, err);
    }
  });

  router.post('/khoa-phong/tim-thong-tin', async (req, res, next) => {
    try {
      let query = {
        $or: [
          {
            name: new RegExp(req.body.query ? req.body.query : "", "i"),
          }, 
          {
            usersCardNumber: new RegExp(req.body.query ? req.body.query : "", "i"),
          }
        ],
        belongToDepartment: { $exists: false }
      }
      let userInfo = await mongoose.model('users').find(query);
      return success(res, "Done", userInfo)
    } catch (err) {
      return errorProcess(res, err)
    }
  })
}
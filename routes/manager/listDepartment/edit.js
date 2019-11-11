var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  let checkInput = [
    check('name').not().isEmpty(),
    check('shortName').not().isEmpty()
  ]
  router.put('/khoa-phong/:id', [checkInput, checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let { name, shortName } = req.body
      let update = {
        name,
        shortName
      }
      let option = { new: true }
      let departments = await mongoose.model('departments').findOneAndUpdate({ _id: req.params.id }, update, option)
      if (departments) {
        return success(res, "Done", departments)
      } else {
        return successWithNoData(res, "Not done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
  })


  checkInput = [
    check('isManager').not().isEmpty(),
    check('position').not().isEmpty()
  ]
  router.put('/khoa-phong/:departmentId/:userId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let update = {
        $set: {
          'memberList.$[departmentId].isManager': req.body.isManager,
          'memberList.$[departmentId].position': req.body.position,
        }
      }
      let option = {
        arrayFilters: [{
          "departmentId.userID": mongoose.Types.ObjectId(`${req.params.userId}`)
        }], multi: false, new: true
      }
      let department = await mongoose.model('departments').findOneAndUpdate({ _id: req.params.departmentId }, update, option)
      if (department) {
        return success(res, "Done", department)
      } else {
        return successWithNoData(res, "Not Done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
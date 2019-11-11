var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  router.delete('/khoa-phong/:departmentId/:userId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let update = {
        $pull: {
          memberList: {
            userID: req.params.userId
          }
        }
      }
      let option = { new: true };
      let department = await mongoose.model('departments').findOneAndUpdate({ _id: req.params.departmentId }, update, option)
      let updateUser = {
        $unset: {
          belongToDepartment: 1
        }
      }
      let user = await mongoose.model('users').findOneAndUpdate({ _id: req.params.userId }, updateUser, option)
      if (department) {
        return success(res, "Done", Object.assign({}, department, user))
      } else {
        return successWithNoData(res, "Not done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.delete('/khoa-phong/:departmentId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let departmentInfo = await mongoose.model('departments').findOne({ _id: req.params.departmentId });
      await departmentInfo.memberList.map(async item => {
        let updateUser = {
          $unset: {
            belongToDepartment: 1
          }
        }
        let option = { new: true };
        await mongoose.model('users').findOneAndUpdate({ _id: item.userID }, updateUser, option)
      })
      let department = await mongoose.model('departments').findOneAndDelete({ _id: req.params.departmentId })
      if (department) {
        return success(res, "Done", department)
      } else {
        return successWithNoData(res, "Not done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
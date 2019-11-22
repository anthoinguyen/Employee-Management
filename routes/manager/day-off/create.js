var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var moment = require('moment');
var _ = require('lodash');

let totalDateAllow = 12;
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');

module.exports = router => {
  router.post('/ngay-nghi', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let array = JSON.parse(req.body.usersList);
      // let array = req.body.usersList;
      let absence;
      await array.map(async item => {
        let absence = await mongoose.model('absence').findOne({ userId: item })
        if (absence) {
          let temp = _.find(absence.detail, function (o) { 
            return _.isEqual(o.year, req.body.date ? new Date(req.body.date).getFullYear() : new Date().getFullYear())
          });
          if (temp) {
            let update = {
              $push: {
                'detail.$[coursYear].absenceDetail': {
                  date: moment(req.body.date ? req.body.date : new Date()),
                  isApprove: req.body.isApprove,
                  reason: req.body.reason
                }
              }
            };
            let option = {arrayFilters: [{
              "coursYear._id": mongoose.Types.ObjectId(`${temp._id}`)
            }], multi: false, new: true }
            absence = await mongoose.model('absence').findOneAndUpdate({ userId: item }, update, option)
          } else {
            let update = {
              $push: {
                detail: {
                  year: req.body.date ? new Date(req.body.date).getFullYear() : new Date().getFullYear(),
                  totalDateAllow: totalDateAllow,
                  absenceDetail: [{
                    date: moment(req.body.date ? req.body.date : new Date()),
                    isApprove: req.body.isApprove,
                    reason: req.body.reason
                  }]
                }
              }
            }
            let option = { new: true }
            absence = await mongoose.model('absence').findOneAndUpdate({ userId: item }, update, option)
          }
        } else {
          let userInfo = await mongoose.model('users').findOne({ _id: item });
          let insert = {
            userId: userInfo._id,
            name: userInfo.name,
            usersCardNumber: userInfo.usersCardNumber,
            typeOfUsers: userInfo.typeOfUsers,
            departmentName:  _.get(userInfo, 'belongToDepartment.name', null),
            detail: [{
              year: req.body.date ? new Date(req.body.date).getFullYear() : new Date().getFullYear(),
              totalDateAllow: totalDateAllow,
              absenceDetail: [{
                date: moment(req.body.date ? req.body.date : new Date()),
                isApprove: req.body.isApprove,
                reason: req.body.reason
              }]
            }]
          }
          absence = await mongoose.model('absence').create(insert);
        }
      })
      if (absence) {
        return success(res, "Done", absence)
      } else {
        return successWithNoData(res, "Not done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
    
  })
}
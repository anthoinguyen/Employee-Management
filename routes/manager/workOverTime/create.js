var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var moment = require('moment');
var _ = require('lodash');
var constants = require('../../constants');
var { checkPermission } = require('../../../services/checkPermission');

module.exports = router => {
  let checkInput = [
    check('usersList').not().isEmpty()
  ]
  router.post('/lam-them-gio/:id', [checkInput, checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
      let array = _.get(req.body, 'usersList', []); 
      await array.map(async item => {
        let userInfo = await mongoose.model('users').findOne({ _id: item })
        let update = {
          $push: {
            userWorkOverTime: {
              userId: userInfo._id,
              name: userInfo.name,
              userImage: userInfo.userImage,
              usersCardNumber: userInfo.usersCardNumber,
              createdBy: req.user._id,
              dateWorkOverTime: moment(req.body.dateWorkOverTime),
              timeIn: moment(req.body.timeIn),
              timeOut: moment(req.body.timeOut),
            }
          }
        }
        let option = { new: true }
        await mongoose.model('workOverTime').findOneAndUpdate({ _id: req.body.id }, update, option)
      })
      return success(res, "Done", null)
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.post('/lam-them-gio/:id/:userId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let userInfo = await mongoose.model('users').findOne({ _id: req.body.userId })
      let update = {
        $push: {
          userWorkOverTime: {
            userId: userInfo._id,
            name: userInfo.name,
            userImage: userInfo.userImage,
            usersCardNumber: userInfo.usersCardNumber,
            createdBy: req.user._id,
            dateWorkOverTime: moment(req.body.dateWorkOverTime),
            timeIn: moment(req.body.timeIn),
            timeOut: moment(req.body.timeOut),
          }
        }
      }
      let option = { new: true }
      let workOverTime = await mongoose.model('workOverTime').findOneAndUpdate({ _id: req.body.id }, update, option)
      return success(res, "Done", workOverTime)
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  checkInput = [
    check('usersList').not().isEmpty(),
    check('timeIn').not().isEmpty(),
    check('timeOut').not().isEmpty(),
  ]
  router.post('/lam-them-gio/', [checkInput, checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
      let query = {
        year: moment(req.body.dateWorkOverTime).get('year'),
        month: moment(req.body.dateWorkOverTime).get('month') + 1,
      }
      let workOverTime = await mongoose.model('workOverTime').find(query);
      if (!workOverTime.length > 0) {
        workOverTime = await mongoose.model('workOverTime').create(query);
      }
      let array = JSON.parse(req.body.usersList);
      await array.map(async item => {
        let userInfo = await mongoose.model('users').findOne({ _id: item.trim() })
        let update = {
          $push: {
            userWorkOverTime: {
              userId: userInfo._id,
              name: userInfo.name,
              usersCardNumber: userInfo.usersCardNumber,
              userImage: userInfo.userImage,
              createdBy: req.user._id,
              dateWorkOverTime: moment(req.body.dateWorkOverTime),
              timeIn: moment(req.body.timeIn),
              timeOut: moment(req.body.timeOut),
            }
          }
        }
        let option = { new: true }
        await mongoose.model('workOverTime').findOneAndUpdate({ _id: _.isArray(workOverTime) ? workOverTime[0]._id : workOverTime._id }, update, option)
      })
      return success(res, "Done", null)
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.post('/them-moi-khung-gio', async (req, res, next) => {
    try {
      let insert = {
        year: req.body.year ? req.body.year : new Date().getFullYear(),
        month: req.body.month ? req.body.month : new Date().getMonth() + 1
      }
      let workOverTime = await mongoose.model('workOverTime').create(insert)
      return success(res, "Done", workOverTime)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
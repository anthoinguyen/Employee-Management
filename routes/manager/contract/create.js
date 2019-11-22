var mongoose = require('mongoose');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');
var config = require('../../../config');
var { success, errorProcess } = require('../../../services/returnToUsers');
var _ = require('lodash');
var uploadFile = require('../../../services/uploadFile')
var moment = require('moment');

module.exports = router => {
  router.post('/hop-dong-lao-dong/:id', [uploadFile.uploadDocsFile().any(), checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
      
      let positionObject = {};
      
      if (!_.isEmpty(req.body.boNhiemCheckBox)) {
        let insertPosition = {
          name: req.body.nameFull,
          description: req.body.descriptionFull,
          ngayBoNhiem: req.body.ngayBoNhiemFull ? moment(req.body.ngayBoNhiemFull) : moment(),
          ngayHetHan: req.body.ngayHetHanFull ? moment(req.body.ngayHetHanFull) : moment(),
        }
        let positionInfo = await mongoose.model('positions').create(insertPosition);
        positionObject = {
          positionId: positionInfo._id,
        }
      }
      
      let dateExpired;
      switch (req.body.contractTerm) {
        case constants.CONTRACT_TERM[0]:
          dateExpired = null
          break;
        case constants.CONTRACT_TERM[1]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 1)
          break;
        case constants.CONTRACT_TERM[2]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 2)
          break;
        case constants.CONTRACT_TERM[3]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 3)
          break;
        case constants.CONTRACT_TERM[4]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 6)
          break;
        case constants.CONTRACT_TERM[5]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 1)
          break;
        case constants.CONTRACT_TERM[6]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 2)
          break;
        case constants.CONTRACT_TERM[7]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 3)
          break;
        case constants.CONTRACT_TERM[8]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 4)
          break;
        case constants.CONTRACT_TERM[9]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 5)
          break;
        default:
          dateExpired = req.body.dateExpired;
          break;
      }
      let update = {
        $push: {
          'detail': {
            ...req.body,
            scanImage: _.get(req.body, 'scanImage', []),
            dateExpired: dateExpired,
            daySigned: req.body.daySigned ? moment(req.body.daySigned) : moment().utc(7),
            fileLink: `${config.domain}${req.files[0].link}`,
            ...positionObject,
          }
        }
      }
      let option = { new: true };
      let newContract = await mongoose.model('contract').findOneAndUpdate({ usersId: req.params.id }, update, option);
      return success(res, "done", newContract);
    } catch (err) {
      return errorProcess(res, err);
    }
  })

  router.post('/hop-dong-lao-dong', [uploadFile.uploadDocsFile().any(), checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
      
      let positionObject = {};
      let usersInfo = await mongoose.model('users').findOne({ usersCardNumber: req.body.userCardFull })
      if (req.body.boNhiemCheckBox) {
        let insertPosition = {
          name: req.body.nameFull,
          userId: usersInfo._id,
          description: req.body.descriptionFull,
          ngayBoNhiem: req.body.ngayBoNhiemFull ? moment(req.body.ngayBoNhiemFull) : moment(),
          ngayHetHan: req.body.ngayHetHanFull ? moment(req.body.ngayHetHanFull) : moment(),
        }
        let positionInfo = await mongoose.model('positions').create(insertPosition);
        let updateUsers = {
          $push: {
            positionId: positionInfo._id
          }
        }
        await mongoose.model('users').findOneAndUpdate({ _id: usersInfo._id }, updateUsers, { new: true })
        positionObject = {
          positionId: positionInfo._id,
        }
      }
      
      let dateExpired;
      switch (req.body.contractTerm) {
        case constants.CONTRACT_TERM[0]:
          dateExpired = null
          break;
        case constants.CONTRACT_TERM[1]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 1)
          break;
        case constants.CONTRACT_TERM[2]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 2)
          break;
        case constants.CONTRACT_TERM[3]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 3)
          break;
        case constants.CONTRACT_TERM[4]:
          dateExpired = moment(req.body.daySigned).set('month', moment(req.body.daySigned).get('month') + 6)
          break;
        case constants.CONTRACT_TERM[5]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 1)
          break;
        case constants.CONTRACT_TERM[6]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 2)
          break;
        case constants.CONTRACT_TERM[7]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 3)
          break;
        case constants.CONTRACT_TERM[8]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 4)
          break;
        case constants.CONTRACT_TERM[9]:
          dateExpired = moment(req.body.daySigned).set('year', moment(req.body.daySigned).get('year') + 5)
          break;
        default:
          dateExpired = req.body.dateExpired;
          break;
      }
      let update = {
        $push: {
          'detail': {
            ...req.body,
            scanImage: _.get(req.body, 'scanImage', []),
            dateExpired: dateExpired,
            daySigned: req.body.daySigned ? moment(req.body.daySigned) : moment().utc(7),
            fileLink: `${config.domain}${req.files[0].link}`,
            ...positionObject,
          }
        }
      }
      let option = { new: true };
      let temp = await mongoose.model('contract').findOne({ usersId: usersInfo._id });
      if (_.isEmpty(temp)) {
        let insert = {
          usersId: usersInfo._id,
          name: usersInfo.name,
          usersCardNumber: usersInfo.usersCardNumber,
          departmentName: _.get(usersInfo, 'belongToDepartment.name', null),
        }
        await mongoose.model('contract').create(insert)
      }
      let newContract = await mongoose.model('contract').findOneAndUpdate({ usersId: usersInfo._id  }, update, option);
      // return success(res, "done", newContract);
      return res.redirect('/quan-ly/hop-dong-lao-dong')
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
var mongoose = require('mongoose');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');
var config = require('../../../config');
var { success, errorProcess } = require('../../../services/returnToUsers');
var _ = require('lodash');
var uploadFile = require('../../../services/uploadFile')
var moment = require('moment');
var mime = require("mime-types");

module.exports = router => {
  router.post('/hop-dong-lao-dong/renew', [uploadFile.uploadDocsFile().any(), checkPermission(constants.IS_ADMIN)], async (req, res, next) => {
    try {
      req.files[0].link = req.files[0].destination.substring(6, req.files[0].destination.length) + req.files[0].filename;
      let dateExpired;
      let currentContract = await mongoose.model('contract').findOne({ usersId: req.body.id });

      let positionObject = {};

      if (!_.isEmpty(req.body.boNhiemCheckBoxPart)) {
        let insertPosition = {
          name: req.body.namePart,
          userId: req.user._id,
          description: req.body.descriptionPart,
          ngayBoNhiem: req.body.ngayBoNhiemPart ? moment(req.body.ngayBoNhiemPart) : moment(),
          ngayHetHan: req.body.ngayHetHanPart ? moment(req.body.ngayHetHanPart) : moment(),
        }
        let positionInfo = await mongoose.model('positions').create(insertPosition);
        let updateUsers = {
          $push: {
            positionId: positionInfo._id
          }
        }
        await mongoose.model('users').findOneAndUpdate({ _id: req.body.id }, updateUsers, { new: true })
        positionObject = {
          positionId: positionInfo._id,
        }
      }

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
        $set: {
          'detail.$[contractId].dateExpired': dateExpired
        },
      }
      let option = { new: true, arrayFilters: [{
        "contractId._id": mongoose.Types.ObjectId(`${currentContract.detail[currentContract.detail.length - 1]._id}`)
      }], multi: false };
      let newContract = await mongoose.model('contract').findOneAndUpdate({ usersId: req.body.id }, update, option);
      
      let update1 = {
        $push: {
          'detail': {
            ...req.body,
            scanImage: _.get(req.body, 'scanImage', []),
            dateExpired: dateExpired,
            daySigned: req.body.daySigned ? moment(req.body.daySigned) : moment(),
            fileLink: `${config.domain}${req.files[0].link}`,
            ...positionObject
          }
        },
      }
      let option1 = { new: true }
      newContract = await mongoose.model('contract').findOneAndUpdate({ usersId: req.body.id }, update1, option1);
      return res.redirect('/quan-ly/hop-dong-lao-dong');
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
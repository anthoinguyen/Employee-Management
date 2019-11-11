var mongoose = require('mongoose');
var { errorProcess, success, successWithNoData } = require('../../../services/returnToUsers')
const { check, validationResult } = require("express-validator/check");
var moment = require('moment');
var { checkPermission } = require('../../../services/checkPermission')
var constants = require('../../constants');
module.exports = router => {
  router.delete('/ngay-nghi/:userId/:detailId/:absenceDetailId', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let query = {
        userId: req.params.userId,
        'detail._id': req.params.detailId
      }
      let update = {
        $pull: {
          'detail.$.absenceDetail': {
            _id: req.params.absenceDetailId
          }
        }
      }
      let option = { new: true }
      absence = await mongoose.model('absence').findOneAndUpdate(query, update, option)
      if (absence) {
        return success(res, "Done", absence)
      } else {
        return successWithNoData(res, "Not Done")
      }
    } catch (err) {
      return errorProcess(res, err);
    }
    
  })
}
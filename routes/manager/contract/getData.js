var { CONTRACT_TERM, CONTRACT_TYPE_OF } = require('../../constants');
var { success, errorProcess } = require('../../../services/returnToUsers');
var mongoose = require('mongoose');
var { checkPermission } = require('../../../services/checkPermission');
var constants = require('../../constants');

module.exports = router => {
  router.get('/hop-dong-lao-dong/fetch-data', checkPermission(constants.IS_ADMIN), (req, res, next) => {
    return success(res, "Done", {
      term: CONTRACT_TERM,
      type: CONTRACT_TYPE_OF
    })
  });

  router.get('/hop-dong-lao-dong/users/:usersCardNumber', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let usersInfo = await mongoose.model('users').findOne({ usersCardNumber: req.params.usersCardNumber });
      return success(res, "Done", usersInfo)
    } catch(err) {
      return errorProcess(res, err);
    }
  });
  
  router.get('/hop-dong-lao-dong/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let usersInfo = await mongoose.model('contract').findOne({ usersId: req.params.id });
      return success(res, "Done", usersInfo)
    } catch(err) {
      return errorProcess(res, err);
    }
  });

}
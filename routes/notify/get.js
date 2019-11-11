var { success, errorProcess } = require('../../services/returnToUsers');
var mongoose = require('mongoose');
var { checkPermission } = require('../../services/checkPermission');
var constants = require('../constants');

module.exports = router => {
  router.get('/thong-bao/:id', async (req, res, next) => {
    try {
      let notifies = await mongoose.model('notifies').findOne({ _id: req.params.id });
      return success(res, "Done", notifies)
    } catch (err) {
      return errorProcess(res, err);
    }
  });

  router.get('/thong-bao', checkPermission(constants.IS_USER) ,async (req, res, next) => {
    try {
      let query = {
        hasBeenRead: false,
        to: req.user._id
      }
      let notifies = await mongoose.model('notifies').find(query);
      return (res, "Done", notifies);
    } catch (err) {
      return errorProcess(res, err)
    }
  })
}
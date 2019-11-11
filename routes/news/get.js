var mongoose = require('mongoose');
var { success, successWithNoData, errorProcess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');

module.exports = router => {
  router.get('/:id', checkPermission(constants.IS_USER), async (req, res, next) => {
    try {
      let news = await mongoose.model('news').findOne({ _id: req.params.id })
      return success(res, "Done", news)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
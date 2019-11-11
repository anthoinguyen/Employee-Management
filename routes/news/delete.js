var mongoose = require('mongoose');
var { success, successWithNoData, errorProcess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../constants');

module.exports = router => {
  router.delete('/:id', checkPermission(constants.IS_ADMIN), async (req, res, next) => {
    try {
      let news = await mongoose.model('news').findOneAndDelete({ _id: req.params.id })
      return success(res, "Done", news)
    } catch (err) {
      return errorProcess(res, err);
    }
  })
}
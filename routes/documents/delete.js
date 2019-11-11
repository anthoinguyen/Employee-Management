var mongoose = require('mongoose');
var { success, errorProcess } = require('../../services/returnToUsers');
var { checkPermission } = require('../../services/checkPermission')
var constants = require('../../routes/constants');

module.exports = router => {
  router.delete('/:id', checkPermission(constants.IS_ADMIN), (req, res, next) => {
    mongoose.model('documents').findOneAndRemove({_id: req.params.id}, (err, result) => {
      if (err) return errorProcess(res, err);
      if (result) {
        return success(res, "Done", true)
      } else {
        return success(res, "Done", false)
      }
    })
  })
}